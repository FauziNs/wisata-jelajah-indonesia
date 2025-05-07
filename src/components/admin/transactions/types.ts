
export type Booking = {
  id: string;
  booking_number: string;
  user_id: string;
  visitor_name: string;
  visitor_email: string;
  visitor_phone: string | null;
  destination_id: string;
  destination_name?: string;
  ticket_type_id: string;
  ticket_type_name?: string;
  quantity: number;
  total_price: number;
  visit_date: string;
  payment_status: string;
  status: string;
  created_at: string;
};

export type PaginationProps = {
  currentPage: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
};
