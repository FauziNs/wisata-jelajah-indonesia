
import React from 'react';
import BookingFilters from '@/components/admin/transactions/BookingFilters';
import BookingsTable from '@/components/admin/transactions/BookingsTable';
import { Booking } from '@/components/admin/transactions/types';

interface TransactionContainerProps {
  bookings: Booking[];
  loading: boolean;
  searchTerm: string;
  selectedStatus: string;
  selectedPaymentStatus: string;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onPaymentStatusChange: (value: string) => void;
  onViewDetails: (booking: Booking) => void;
  currentPage: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  filteredBookings: Booking[];
}

const TransactionContainer: React.FC<TransactionContainerProps> = ({
  searchTerm,
  onSearchChange,
  selectedStatus,
  onStatusChange,
  selectedPaymentStatus,
  onPaymentStatusChange,
  filteredBookings,
  loading,
  onViewDetails,
  currentPage,
  totalItems,
  itemsPerPage,
  onPageChange
}) => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <BookingFilters
        searchTerm={searchTerm}
        onSearchChange={onSearchChange}
        selectedStatus={selectedStatus}
        onStatusChange={onStatusChange}
        selectedPaymentStatus={selectedPaymentStatus}
        onPaymentStatusChange={onPaymentStatusChange}
      />
      
      <BookingsTable
        bookings={filteredBookings}
        loading={loading}
        onViewDetails={onViewDetails}
        currentPage={currentPage}
        totalItems={totalItems}
        itemsPerPage={itemsPerPage}
        onPageChange={onPageChange}
      />
    </div>
  );
};

export default TransactionContainer;
