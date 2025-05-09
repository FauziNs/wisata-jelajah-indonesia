
import React from 'react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { Label } from '@/components/ui/label';
import { Booking } from '../types';

interface BookingInfoProps {
  bookingDetail: Booking | null;
}

const BookingInfo: React.FC<BookingInfoProps> = ({ bookingDetail }) => {
  if (!bookingDetail) return null;
  
  return (
    <div className="space-y-3">
      <div>
        <Label className="text-gray-500">Destinasi</Label>
        <p className="text-lg font-medium">{bookingDetail.destination_name}</p>
      </div>
      <div>
        <Label className="text-gray-500">Jenis Tiket</Label>
        <p>{bookingDetail.ticket_type_name}</p>
      </div>
      <div>
        <Label className="text-gray-500">Tanggal Kunjungan</Label>
        <p>
          {bookingDetail.visit_date
            ? format(new Date(bookingDetail.visit_date), 'dd MMMM yyyy', { locale: id })
            : '-'}
        </p>
      </div>
      <div>
        <Label className="text-gray-500">Tanggal Pemesanan</Label>
        <p>
          {bookingDetail.created_at
            ? format(new Date(bookingDetail.created_at), 'dd MMM yyyy, HH:mm', { locale: id })
            : '-'}
        </p>
      </div>
    </div>
  );
};

export default BookingInfo;
