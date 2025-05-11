
export interface DestinationType {
  id: string;
  name: string;
  location: string;
  description: string;
  amenities?: string;
  address?: string;
  operational_hours?: string;
  best_time_to_visit?: string;
  google_maps_url?: string;
  image_url?: string;
  price: number;
  category?: string;
  rating?: number;
  long_description?: string;
  full_location?: string;
  reviews_count?: number;
  slug?: string;
  created_at?: string;
  updated_at?: string;
}

export interface TicketType {
  id: string;
  name: string;
  price: number;
  description?: string;
  capacity?: string;
  validity_duration?: string;
  destination_id: string;
  created_at?: string;
  updated_at?: string;
}
