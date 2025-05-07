
import React from 'react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { Eye, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import BookingStatusBadge from './BookingStatusBadge';
import PaymentStatusBadge from './PaymentStatusBadge';
import { Booking } from './types';

interface BookingsTableProps {
  bookings: Booking[];
  loading: boolean;
  onViewDetails: (booking: Booking) => void;
}

const BookingsTable: React.FC<BookingsTableProps> = ({
  bookings,
  loading,
  onViewDetails
}) => {
  return (
    <div className="overflow-x-auto">
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 text-primary animate-spin" />
        </div>
      ) : (
        <Table>
          <TableCaption>Daftar semua transaksi pemesanan</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>No. Booking</TableHead>
              <TableHead>Pengunjung</TableHead>
              <TableHead>Destinasi</TableHead>
              <TableHead>Tanggal Kunjungan</TableHead>
              <TableHead>Jumlah</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Pembayaran</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bookings.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-8 text-gray-500">
                  No bookings found
                </TableCell>
              </TableRow>
            ) : (
              bookings.map((booking) => (
                <TableRow key={booking.id}>
                  <TableCell className="font-medium">{booking.booking_number}</TableCell>
                  <TableCell>{booking.visitor_name}</TableCell>
                  <TableCell>{booking.destination_name}</TableCell>
                  <TableCell>
                    {format(new Date(booking.visit_date), 'dd MMM yyyy', { locale: id })}
                  </TableCell>
                  <TableCell>{booking.quantity}</TableCell>
                  <TableCell>Rp {booking.total_price.toLocaleString('id-ID')}</TableCell>
                  <TableCell><BookingStatusBadge status={booking.status} /></TableCell>
                  <TableCell><PaymentStatusBadge status={booking.payment_status} /></TableCell>
                  <TableCell className="text-right">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => onViewDetails(booking)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      Detail
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

export default BookingsTable;
