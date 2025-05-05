
-- Create saved_destinations table for "favorites" feature
CREATE TABLE IF NOT EXISTS public.saved_destinations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  destination_id UUID REFERENCES public.destinations(id) NOT NULL,
  saved_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  UNIQUE(user_id, destination_id)
);

-- Add RLS policies for saved_destinations
ALTER TABLE public.saved_destinations ENABLE ROW LEVEL SECURITY;

-- Create RLS policy for users to view their own saved destinations
CREATE POLICY "Users can view their own saved destinations" 
  ON public.saved_destinations 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Create RLS policy for users to create their own saved destinations
CREATE POLICY "Users can save destinations" 
  ON public.saved_destinations 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Create RLS policy for users to delete their own saved destinations
CREATE POLICY "Users can remove their saved destinations" 
  ON public.saved_destinations 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Add role field to profiles table
DO $$ 
BEGIN
  BEGIN
    ALTER TABLE public.profiles ADD COLUMN role TEXT DEFAULT 'user';
  EXCEPTION
    WHEN duplicate_column THEN RAISE NOTICE 'column role already exists in public.profiles';
  END;
END $$;
