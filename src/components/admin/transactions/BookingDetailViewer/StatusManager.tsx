
import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import BookingStatusBadge from '../BookingStatusBadge';
import PaymentStatusBadge from '../PaymentStatusBadge';
import { Booking } from '../types';
import { useBookingStatusUpdate } from '../utils/bookingStatusUtils';

interface StatusManagerProps {
  bookingDetail: Booking | null;
  onStatusUpdated: (bookingId: string, status: string, paymentStatus: string) => void;
  isUpdating: boolean;
  setIsUpdating: (updating: boolean) => void;
}

const StatusManager: React.FC<StatusManagerProps> = ({
  bookingDetail,
  onStatusUpdated,
  isUpdating,
  setIsUpdating
}) => {
  const { updateBookingStatus } = useBookingStatusUpdate();
  
  if (!bookingDetail) return null;
  
  const handleStatusUpdate = async (
    bookingId: string,
    newStatus: string,
    newPaymentStatus: string
  ) => {
    setIsUpdating(true);
    await updateBookingStatus(bookingId, newStatus, newPaymentStatus, onStatusUpdated);
    setIsUpdating(false);
  };
  
  return (
    <div className="mt-6 border-t pt-4 space-y-4">
      <div className="flex justify-between items-center">
        <Label className="text-gray-500">Status Pemesanan</Label>
        <BookingStatusBadge status={bookingDetail.status} />
      </div>
      
      <div className="flex justify-between items-center">
        <Label className="text-gray-500">Status Pembayaran</Label>
        <PaymentStatusBadge status={bookingDetail.payment_status} />
      </div>
      
      {/* Status Update Options */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
        <div>
          <Label className="block mb-2">Update Status Pemesanan</Label>
          <Select
            onValueChange={(value) => {
              handleStatusUpdate(bookingDetail.id, value, bookingDetail.payment_status);
            }}
            value={bookingDetail.status}
            disabled={isUpdating}
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
              handleStatusUpdate(bookingDetail.id, bookingDetail.status, value);
            }}
            value={bookingDetail.payment_status}
            disabled={isUpdating}
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
  );
};

export default StatusManager;
