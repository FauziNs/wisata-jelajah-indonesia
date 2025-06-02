
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

// Set up CORS headers for browser requests
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Create-checkout function started");

    // Parse the request body
    const { ticketId, destinationId, quantity, visitorName, visitorEmail, visitorPhone, visitDate, specialRequests } = await req.json();

    console.log("Request data:", { ticketId, destinationId, quantity, visitorName, visitorEmail, visitDate });

    // Validate required parameters
    if (!ticketId || !destinationId || !quantity || !visitorName || !visitorEmail || !visitDate) {
      console.error("Missing required parameters");
      return new Response(
        JSON.stringify({ error: "Missing required parameters for booking" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Get the authenticated user from the request
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      console.error("No authorization token provided");
      return new Response(
        JSON.stringify({ error: "No authorization token provided" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    // Create a Supabase client with anonymous key for the authentication
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY") || "";
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    
    // Extract the token from the header
    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabase.auth.getUser(token);
    
    if (userError) {
      console.error("Authentication error:", userError);
      return new Response(
        JSON.stringify({ error: "Authentication error", details: userError.message }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    const userId = userData.user?.id;
    console.log("Authenticated user:", userId);
    
    // Get ticket and destination information
    const { data: ticketData, error: ticketError } = await supabase
      .from('ticket_types')
      .select('*, destinations(name, location)')
      .eq('id', ticketId)
      .single();
      
    if (ticketError || !ticketData) {
      console.error("Ticket error:", ticketError);
      return new Response(
        JSON.stringify({ error: "Unable to find ticket information", details: ticketError?.message }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    console.log("Ticket data:", ticketData);
    
    // Create Stripe instance with secret key
    const stripeSecretKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeSecretKey) {
      console.error("Stripe secret key not found");
      return new Response(
        JSON.stringify({ error: "Stripe configuration error" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: "2023-10-16",
    });
    
    const totalPrice = ticketData.price * quantity;
    const destinationName = ticketData.destinations?.name || "Destinasi Wisata";
    const ticketName = ticketData.name;
    
    console.log("Pricing info:", { totalPrice, destinationName, ticketName });
    
    // Generate a unique booking number
    const bookingNumber = `WJ-${Date.now().toString().slice(-8)}-${Math.floor(Math.random() * 1000)}`;
    
    console.log("Generated booking number:", bookingNumber);
    
    // Create booking record in database
    const { data: bookingData, error: bookingError } = await supabase
      .from('bookings')
      .insert({
        booking_number: bookingNumber,
        user_id: userId,
        destination_id: destinationId,
        ticket_type_id: ticketId,
        quantity: quantity,
        total_price: totalPrice,
        visit_date: visitDate,
        visitor_name: visitorName,
        visitor_email: visitorEmail,
        visitor_phone: visitorPhone,
        special_requests: specialRequests,
        status: 'pending',
        payment_status: 'unpaid',
        payment_method: 'stripe'
      })
      .select()
      .single();
    
    if (bookingError) {
      console.error("Booking creation error:", bookingError);
      return new Response(
        JSON.stringify({ error: "Failed to create booking", details: bookingError.message }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    console.log("Booking created:", bookingData);
    
    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "idr",
            product_data: {
              name: `Tiket ${ticketName} - ${destinationName}`,
              description: `${quantity} tiket untuk kunjungan pada ${new Date(visitDate).toLocaleDateString('id-ID')}`,
            },
            unit_amount: Math.round(ticketData.price * 100), // Stripe requires amounts in smallest currency unit (cents/rupiah)
          },
          quantity: quantity,
        },
      ],
      mode: "payment",
      success_url: `${req.headers.get("origin")}/payment-success?session_id={CHECKOUT_SESSION_ID}&booking_id=${bookingData.id}`,
      cancel_url: `${req.headers.get("origin")}/payment-cancel?booking_id=${bookingData.id}`,
      client_reference_id: bookingData.id.toString(),
      customer_email: visitorEmail,
      metadata: {
        booking_id: bookingData.id.toString(),
        booking_number: bookingNumber
      }
    });

    console.log("Stripe session created:", session.id);

    // Update the booking with the Stripe session ID
    const { error: updateError } = await supabase
      .from('bookings')
      .update({ 
        payment_method: 'stripe',
        updated_at: new Date().toISOString()
      })
      .eq('id', bookingData.id);
    
    if (updateError) {
      console.error("Failed to update booking:", updateError);
    }
    
    console.log("Returning checkout URL:", session.url);
    
    // Return the checkout session URL to redirect the user
    return new Response(
      JSON.stringify({ 
        success: true,
        sessionId: session.id,
        url: session.url,
        bookingId: bookingData.id,
        bookingNumber: bookingNumber
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
    
  } catch (error) {
    console.error("Checkout error:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error", details: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }
});
