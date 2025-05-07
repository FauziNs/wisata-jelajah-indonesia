
import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface TransactionHeaderProps {
  loading: boolean;
  onRefresh: () => void;
}

const TransactionHeader: React.FC<TransactionHeaderProps> = ({ loading, onRefresh }) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
      <h1 className="text-2xl font-bold">Manajemen Transaksi</h1>
      <Button onClick={onRefresh} disabled={loading}>
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Loading...
          </>
        ) : (
          'Refresh Data'
        )}
      </Button>
    </div>
  );
};

export default TransactionHeader;
