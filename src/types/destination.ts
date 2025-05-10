
// Define shared types for destination and ticket data
export interface DestinationType {
  id: string;
  name: string;
  location: string;
  image_url?: string;
  price?: number | string;
  description: string;
  category?: string;
  rating?: number;
  operational_hours?: string;
  amenities?: string;
  address?: string;
  slug?: string;
  best_time_to_visit?: string;
  google_maps_url?: string;
  long_description?: string;
  full_location?: string;
  reviews_count?: number;
}

export interface TicketType {
  id: string;
  name: string;
  price: number;
  description?: string;
  capacity?: string;
  validity_duration?: string;
  destination_id?: string;
}
