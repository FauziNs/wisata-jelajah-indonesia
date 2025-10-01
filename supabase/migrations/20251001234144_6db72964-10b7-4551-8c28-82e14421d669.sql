-- Fix foreign key constraint on bookings table
-- The bookings.user_id should reference profiles table, not the users table

-- First, drop the existing foreign key constraint
ALTER TABLE public.bookings 
DROP CONSTRAINT IF EXISTS bookings_user_id_fkey;

-- Add the correct foreign key constraint referencing profiles table
ALTER TABLE public.bookings 
ADD CONSTRAINT bookings_user_id_fkey 
FOREIGN KEY (user_id) 
REFERENCES public.profiles(id) 
ON DELETE CASCADE;