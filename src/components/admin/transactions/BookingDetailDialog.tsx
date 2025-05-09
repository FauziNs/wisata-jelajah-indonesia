
import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { BookingDetailContent } from './BookingDetailViewer';
import { Booking } from './types';

interface BookingDetailDialogProps {
  bookingDetail: Booking | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onBookingUpdated: (bookingId: string, status: string, paymentStatus: string) => void;
}

const BookingDetailDialog: React.FC<BookingDetailDialogProps> = ({
  bookingDetail,
  isOpen,
  onOpenChange,
  onBookingUpdated
}) => {
  const [isUpdating, setIsUpdating] = useState(false);

  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-3xl">
        <AlertDialogHeader>
          <AlertDialogTitle>Detail Pemesanan #{bookingDetail?.booking_number}</AlertDialogTitle>
          <BookingDetailContent
            bookingDetail={bookingDetail}
            onStatusUpdated={onBookingUpdated}
            isUpdating={isUpdating}
            setIsUpdating={setIsUpdating}
          />
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isUpdating}>Tutup</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              onOpenChange(false);
            }}
            disabled={isUpdating}
          >
            {isUpdating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Memperbarui...
              </>
            ) : (
              'Selesai'
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default BookingDetailDialog;
