
import React from 'react';
import { Label } from '@/components/ui/label';
import { Booking } from '../types';

interface VisitorInfoProps {
  bookingDetail: Booking | null;
}

const VisitorInfo: React.FC<VisitorInfoProps> = ({ bookingDetail }) => {
  if (!bookingDetail) return null;
  
  return (
    <div className="space-y-3">
      <div>
        <Label className="text-gray-500">Pengunjung</Label>
        <p className="text-lg font-medium">{bookingDetail.visitor_name}</p>
      </div>
      <div>
        <Label className="text-gray-500">Email</Label>
        <p>{bookingDetail.visitor_email}</p>
      </div>
      <div>
        <Label className="text-gray-500">No. Telepon</Label>
        <p>{bookingDetail.visitor_phone || '-'}</p>
      </div>
    </div>
  );
};

export default VisitorInfo;
