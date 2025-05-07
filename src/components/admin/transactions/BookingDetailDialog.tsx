
import React, { useState } from 'react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Label } from '@/components/ui/label';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import BookingStatusBadge from './BookingStatusBadge';
import PaymentStatusBadge from './PaymentStatusBadge';
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
  const { toast } = useToast();

  const updateBookingStatus = async (bookingId: string, newStatus: string, newPaymentStatus: string) => {
    setIsUpdating(true);
    try {
      const { error } = await supabase
        .from('bookings')
        .update({
          status: newStatus,
          payment_status: newPaymentStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', bookingId);
        
      if (error) throw error;
      
      toast({
        title: "Status Updated",
        description: "Status pemesanan berhasil diperbarui",
      });
      
      onBookingUpdated(bookingId, newStatus, newPaymentStatus);
    } catch (error) {
      console.error('Error updating booking status:', error);
      toast({
        title: "Error",
        description: "Gagal memperbarui status pemesanan",
        variant: "destructive"
      });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-3xl">
        <AlertDialogHeader>
          <AlertDialogTitle>Detail Pemesanan #{bookingDetail?.booking_number}</AlertDialogTitle>
          <AlertDialogDescription>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
              <div className="space-y-3">
                <div>
                  <Label className="text-gray-500">Pengunjung</Label>
                  <p className="text-lg font-medium">{bookingDetail?.visitor_name}</p>
                </div>
                <div>
                  <Label className="text-gray-500">Email</Label>
                  <p>{bookingDetail?.visitor_email}</p>
                </div>
                <div>
                  <Label className="text-gray-500">No. Telepon</Label>
                  <p>{bookingDetail?.visitor_phone || '-'}</p>
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <Label className="text-gray-500">Destinasi</Label>
                  <p className="text-lg font-medium">{bookingDetail?.destination_name}</p>
                </div>
                <div>
                  <Label className="text-gray-500">Jenis Tiket</Label>
                  <p>{bookingDetail?.ticket_type_name}</p>
                </div>
                <div>
                  <Label className="text-gray-500">Tanggal Kunjungan</Label>
                  <p>{bookingDetail?.visit_date ? format(new Date(bookingDetail.visit_date), 'dd MMMM yyyy', { locale: id }) : '-'}</p>
                </div>
                <div>
                  <Label className="text-gray-500">Tanggal Pemesanan</Label>
                  <p>{bookingDetail?.created_at ? format(new Date(bookingDetail.created_at), 'dd MMM yyyy, HH:mm', { locale: id }) : '-'}</p>
                </div>
              </div>
            </div>
            
            <div className="mt-6 border-t pt-4 space-y-3">
              <div className="flex justify-between">
                <Label className="text-gray-500">Jumlah Tiket</Label>
                <p className="font-medium">{bookingDetail?.quantity}</p>
              </div>
              <div className="flex justify-between">
                <Label className="text-gray-500">Total Pembayaran</Label>
                <p className="font-medium text-lg">
                  Rp {bookingDetail?.total_price?.toLocaleString('id-ID')}
                </p>
              </div>
            </div>
            
            <div className="mt-6 border-t pt-4 space-y-4">
              <div className="flex justify-between items-center">
                <Label className="text-gray-500">Status Pemesanan</Label>
                {bookingDetail && <BookingStatusBadge status={bookingDetail.status} />}
              </div>
              <div className="flex justify-between items-center">
                <Label className="text-gray-500">Status Pembayaran</Label>
                {bookingDetail && <PaymentStatusBadge status={bookingDetail.payment_status} />}
              </div>
              
              {/* Status Update Options */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                <div>
                  <Label className="block mb-2">Update Status Pemesanan</Label>
                  <Select
                    onValueChange={(value) => {
                      if (bookingDetail) {
                        updateBookingStatus(bookingDetail.id, value, bookingDetail.payment_status);
                      }
                    }}
                    value={bookingDetail?.status}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="block mb-2">Update Status Pembayaran</Label>
                  <Select
                    onValueChange={(value) => {
                      if (bookingDetail) {
                        updateBookingStatus(bookingDetail.id, bookingDetail.status, value);
                      }
                    }}
                    value={bookingDetail?.payment_status}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih status pembayaran" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="unpaid">Belum Dibayar</SelectItem>
                      <SelectItem value="paid">Sudah Dibayar</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </AlertDialogDescription>
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
