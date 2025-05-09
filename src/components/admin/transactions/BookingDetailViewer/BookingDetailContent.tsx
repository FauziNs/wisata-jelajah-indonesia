
import React from 'react';
import { AlertDialogDescription } from '@/components/ui/alert-dialog';
import { Booking } from '../types';
import VisitorInfo from './VisitorInfo';
import BookingInfo from './BookingInfo';
import PaymentInfo from './PaymentInfo';
import StatusManager from './StatusManager';

interface BookingDetailContentProps {
  bookingDetail: Booking | null;
  onStatusUpdated: (bookingId: string, status: string, paymentStatus: string) => void;
  isUpdating: boolean;
  setIsUpdating: (updating: boolean) => void;
}

const BookingDetailContent: React.FC<BookingDetailContentProps> = ({
  bookingDetail,
  onStatusUpdated,
  isUpdating,
  setIsUpdating
}) => {
  if (!bookingDetail) return null;
  
  return (
    <AlertDialogDescription>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
        <VisitorInfo bookingDetail={bookingDetail} />
        <BookingInfo bookingDetail={bookingDetail} />
      </div>
      
      <PaymentInfo bookingDetail={bookingDetail} />
      
      <StatusManager 
        bookingDetail={bookingDetail}
        onStatusUpdated={onStatusUpdated}
        isUpdating={isUpdating}
        setIsUpdating={setIsUpdating}
      />
    </AlertDialogDescription>
  );
};

export default BookingDetailContent;
