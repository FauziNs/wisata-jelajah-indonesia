
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Helper logging function to debug Stripe integration
const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CREATE-CHECKOUT] ${step}${detailsStr}`);
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Starting checkout process");
    
    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY") ?? "";
    const supabaseServiceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
    
    // Create a Supabase client with the anon key for authentication
    const supabaseClient = createClient(supabaseUrl, supabaseAnonKey);

    // Get the authorization header from the request
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("Missing Authorization header");
    }
    
    logStep("Got authorization header");
    
    // Get the token from the authorization header
    const token = authHeader.replace("Bearer ", "");
    
    // Verify the user
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError) throw new Error(`Authentication error: ${userError.message}`);
    
    const user = userData.user;
    if (!user) throw new Error("User not found");
    
    logStep("Authenticated user", { userId: user.id, email: user.email });

    // Parse the request body
    const { destinationId, ticketTypeId, quantity, visitDate, visitorInfo } = await req.json();
    
    if (!destinationId || !ticketTypeId || !quantity) {
      throw new Error("Missing required fields");
    }
    
    logStep("Parsed request body", { destinationId, ticketTypeId, quantity, visitDate });

    // Create a Supabase client with the service role key for database access
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey);
    
    // Get destination and ticket information
    const { data: destination, error: destError } = await supabaseAdmin
      .from("destinations")
      .select("name, location")
      .eq("id", destinationId)
      .single();
    
    if (destError) throw new Error(`Error fetching destination: ${destError.message}`);
    logStep("Got destination details", destination);
    
    const { data: ticketType, error: ticketError } = await supabaseAdmin
      .from("ticket_types")
      .select("name, price")
      .eq("id", ticketTypeId)
      .single();
    
    if (ticketError) throw new Error(`Error fetching ticket type: ${ticketError.message}`);
    logStep("Got ticket details", ticketType);
    
    // Calculate total price
    const unitPrice = ticketType.price;
    const totalPrice = unitPrice * quantity;
    
    // Create a unique booking number
    const bookingNumber = `BK-${Math.floor(Math.random() * 900000) + 100000}`;
    
    // Create a booking record in the database
    const { data: booking, error: bookingError } = await supabaseAdmin
      .from("bookings")
      .insert({
        booking_number: bookingNumber,
        user_id: user.id,
        destination_id: destinationId,
        ticket_type_id: ticketTypeId,
        quantity: quantity,
        total_price: totalPrice,
        visit_date: visitDate,
        visitor_name: visitorInfo?.name || user.user_metadata?.full_name || "Guest",
        visitor_email: visitorInfo?.email || user.email,
        visitor_phone: visitorInfo?.phone || user.user_metadata?.phone || "",
        payment_status: "pending",
        status: "pending",
        special_requests: visitorInfo?.specialRequests || "",
      })
      .select()
      .single();
    
    if (bookingError) {
      logStep("Error creating booking", bookingError);
      throw new Error(`Error creating booking: ${bookingError.message}`);
    }
    
    logStep("Created booking", { bookingId: booking.id, bookingNumber });

    // Initialize Stripe with the secret key
    const stripeSecretKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeSecretKey) {
      throw new Error("STRIPE_SECRET_KEY environment variable not set");
    }
    
    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: "2023-10-16",
    });

    const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");
    logStep("Webhook secret", { webhookSecretExists: !!webhookSecret });

    // Create a Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "idr",
            product_data: {
              name: `${ticketType.name} - ${destination.name}`,
              description: `${quantity} tiket untuk ${destination.name}, ${destination.location}`,
            },
            unit_amount: Math.round(unitPrice * 100), // Stripe uses cents
          },
          quantity: 1, // We already multiplied by quantity for the total
        },
      ],
      mode: "payment",
      success_url: `${req.headers.get("origin")}/payment-success?booking_id=${booking.id}`,
      cancel_url: `${req.headers.get("origin")}/payment-cancel?booking_id=${booking.id}`,
      client_reference_id: booking.id,
      customer_email: user.email,
      metadata: {
        booking_id: booking.id,
        booking_number: bookingNumber,
        user_id: user.id,
      },
    });

    logStep("Created Stripe checkout session", { 
      sessionId: session.id, 
      url: session.url ? "Session URL exists" : "No session URL"
    });

    // Update the booking with the Stripe session ID
    await supabaseAdmin
      .from("bookings")
      .update({ 
        payment_method: "stripe",
      })
      .eq("id", booking.id);

    logStep("Updated booking with payment method");

    // Return the Stripe session URL to redirect the user to the payment page
    return new Response(
      JSON.stringify({ 
        sessionUrl: session.url,
        bookingId: booking.id,
        bookingNumber: bookingNumber
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    logStep("Checkout error", error);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      }
    );
  }
});
