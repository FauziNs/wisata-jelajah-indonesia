-- Enable RLS on all tables without RLS policies
ALTER TABLE promotions ENABLE ROW LEVEL SECURITY;
ALTER TABLE help_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE help_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE ticket_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE destination_facilities ENABLE ROW LEVEL SECURITY;
ALTER TABLE destination_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for promotions (public read access)
CREATE POLICY "Allow public read access to promotions" 
ON promotions FOR SELECT 
USING (true);

-- Allow admin to manage promotions
CREATE POLICY "Allow admin to manage promotions" 
ON promotions FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  )
);

-- Create RLS policies for help content (public read access)
CREATE POLICY "Allow public read access to help categories" 
ON help_categories FOR SELECT 
USING (true);

CREATE POLICY "Allow public read access to help articles" 
ON help_articles FOR SELECT 
USING (true);

-- Allow admin to manage help content
CREATE POLICY "Allow admin to manage help categories" 
ON help_categories FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  )
);

CREATE POLICY "Allow admin to manage help articles" 
ON help_articles FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  )
);

-- Bookings policies
CREATE POLICY "Users can view their own bookings" 
ON bookings FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own bookings" 
ON bookings FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admin can view all bookings" 
ON bookings FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  )
);

CREATE POLICY "Admin can update all bookings" 
ON bookings FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  )
);

-- Reviews policies
CREATE POLICY "Allow public read access to reviews" 
ON reviews FOR SELECT 
USING (true);

CREATE POLICY "Users can create their own reviews" 
ON reviews FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reviews" 
ON reviews FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own reviews" 
ON reviews FOR DELETE 
USING (auth.uid() = user_id);

-- Ticket types policies (public read)
CREATE POLICY "Allow public read access to ticket types" 
ON ticket_types FOR SELECT 
USING (true);

CREATE POLICY "Allow admin to manage ticket types" 
ON ticket_types FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  )
);

-- Destination facilities policies (public read)
CREATE POLICY "Allow public read access to destination facilities" 
ON destination_facilities FOR SELECT 
USING (true);

CREATE POLICY "Allow admin to manage destination facilities" 
ON destination_facilities FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  )
);

-- Destination images policies (public read)
CREATE POLICY "Allow public read access to destination images" 
ON destination_images FOR SELECT 
USING (true);

CREATE POLICY "Allow admin to manage destination images" 
ON destination_images FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  )
);

-- FAQs policies (public read)
CREATE POLICY "Allow public read access to faqs" 
ON faqs FOR SELECT 
USING (true);

CREATE POLICY "Allow admin to manage faqs" 
ON faqs FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  )
);

-- Users table policies (admin only)
CREATE POLICY "Allow admin to manage users" 
ON users FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  )
);