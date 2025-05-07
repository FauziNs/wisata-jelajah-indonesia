
import React from 'react';
import { Badge } from '@/components/ui/badge';

type PaymentStatusProps = {
  status: string;
};

const PaymentStatusBadge: React.FC<PaymentStatusProps> = ({ status }) => {
  switch (status.toLowerCase()) {
    case 'paid':
      return <Badge className="bg-green-500 hover:bg-green-600">Lunas</Badge>;
    case 'unpaid':
      return <Badge className="bg-red-500 hover:bg-red-600">Belum Bayar</Badge>;
    case 'partial':
      return <Badge className="bg-yellow-500 hover:bg-yellow-600">Sebagian</Badge>;
    default:
      return <Badge className="bg-gray-500">{status}</Badge>;
  }
};

export default PaymentStatusBadge;
