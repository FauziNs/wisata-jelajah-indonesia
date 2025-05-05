
-- Create table for storing bookings
CREATE TABLE IF NOT EXISTS public.bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_number VARCHAR NOT NULL,
  user_id UUID REFERENCES auth.users(id),
  destination_id UUID REFERENCES public.destinations(id),
  ticket_type_id UUID REFERENCES public.ticket_types(id),
  quantity INTEGER NOT NULL,
  total_price NUMERIC NOT NULL,
  visit_date DATE NOT NULL,
  visitor_name VARCHAR NOT NULL,
  visitor_email VARCHAR NOT NULL,
  visitor_phone VARCHAR,
  payment_method VARCHAR,
  payment_status VARCHAR DEFAULT 'unpaid',
  payment_proof TEXT,
  status VARCHAR DEFAULT 'pending',
  special_requests TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create storage bucket for booking files
INSERT INTO storage.buckets (id, name, public)
VALUES ('booking_files', 'booking_files', true)
ON CONFLICT (id) DO NOTHING;

-- Set up RLS for bookings
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Policies for bookings
CREATE POLICY "Users can view their own bookings"
  ON public.bookings
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own bookings"
  ON public.bookings
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own bookings"
  ON public.bookings
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Policy for booking files storage
CREATE POLICY "Public access to booking files"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'booking_files');

CREATE POLICY "Users can upload booking files"
  ON storage.objects
  FOR INSERT
  WITH CHECK (bucket_id = 'booking_files');

-- Create saved_destinations table for favorites
CREATE TABLE IF NOT EXISTS public.saved_destinations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  destination_id UUID REFERENCES public.destinations(id) NOT NULL,
  saved_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  UNIQUE(user_id, destination_id)
);

-- RLS for saved_destinations
ALTER TABLE public.saved_destinations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own saved destinations" 
  ON public.saved_destinations 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can save destinations" 
  ON public.saved_destinations 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove their saved destinations" 
  ON public.saved_destinations 
  FOR DELETE 
  USING (auth.uid() = user_id);
