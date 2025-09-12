-- Create proper ticket types for existing destinations that don't have any
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