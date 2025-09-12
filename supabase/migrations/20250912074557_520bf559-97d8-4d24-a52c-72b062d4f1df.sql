-- First, let's create proper ticket types for existing destinations that don't have any
INSERT INTO ticket_types (name, price, description, destination_id)
SELECT 
  'Tiket Masuk' as name,
  COALESCE(d.price, 50000) as price,
  'Tiket masuk umum untuk ' || d.name as description,
  d.id as destination_id
FROM destinations d
WHERE NOT EXISTS (
  SELECT 1 FROM ticket_types tt WHERE tt.destination_id = d.id
);

-- Add foreign key constraint for bookings table to ensure data integrity
ALTER TABLE bookings 
ADD CONSTRAINT bookings_ticket_type_id_fkey 
FOREIGN KEY (ticket_type_id) REFERENCES ticket_types(id);

-- Add foreign key constraint for destination_id as well
ALTER TABLE bookings 
ADD CONSTRAINT bookings_destination_id_fkey 
FOREIGN KEY (destination_id) REFERENCES destinations(id);