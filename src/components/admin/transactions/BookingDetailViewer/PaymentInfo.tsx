
import React from 'react';
import { Label } from '@/components/ui/label';
import { Booking } from '../types';

interface PaymentInfoProps {
  bookingDetail: Booking | null;
}

const PaymentInfo: React.FC<PaymentInfoProps> = ({ bookingDetail }) => {
  if (!bookingDetail) return null;
  
  return (
    <div className="mt-6 border-t pt-4 space-y-3">
      <div className="flex justify-between">
        <Label className="text-gray-500">Jumlah Tiket</Label>
        <p className="font-medium">{bookingDetail.quantity}</p>
      </div>
      <div className="flex justify-between">
        <Label className="text-gray-500">Total Pembayaran</Label>
        <p className="font-medium text-lg">
          Rp {bookingDetail.total_price?.toLocaleString('id-ID')}
        </p>
      </div>
    </div>
  );
};

export default PaymentInfo;
