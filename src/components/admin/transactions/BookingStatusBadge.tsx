
import React from 'react';
import { Badge } from '@/components/ui/badge';

type BookingStatusProps = {
  status: string;
};

const BookingStatusBadge: React.FC<BookingStatusProps> = ({ status }) => {
  switch (status.toLowerCase()) {
    case 'completed':
      return <Badge className="bg-green-500 hover:bg-green-600">Selesai</Badge>;
    case 'pending':
      return <Badge className="bg-yellow-500 hover:bg-yellow-600">Pending</Badge>;
    case 'cancelled':
      return <Badge className="bg-red-500 hover:bg-red-600">Dibatalkan</Badge>;
    default:
      return <Badge className="bg-gray-500">{status}</Badge>;
  }
};

export default BookingStatusBadge;
