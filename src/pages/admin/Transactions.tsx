
import React, { useState } from 'react';
import { Booking } from '@/components/admin/transactions/types';
import TransactionHeader from '@/components/admin/transactions/TransactionHeader';
import TransactionContainer from '@/components/admin/transactions/TransactionContainer';
import BookingDetailDialog from '@/components/admin/transactions/BookingDetailDialog';
import { useTransactions } from '@/hooks/useTransactions';

const Transactions = () => {
  const {
    bookings,
    loading,
    currentPage,
    totalItems,
    itemsPerPage,
    fetchBookings,
    handleBookingUpdated,
    handlePageChange
  } = useTransactions();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState('all');
  const [bookingDetail, setBookingDetail] = useState<Booking | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const viewBookingDetails = (booking: Booking) => {
    setBookingDetail(booking);
    setIsDialogOpen(true);
  };

  const handleDetailBookingUpdated = (bookingId: string, newStatus: string, newPaymentStatus: string) => {
    handleBookingUpdated(bookingId, newStatus, newPaymentStatus);
    
    if (bookingDetail && bookingDetail.id === bookingId) {
      setBookingDetail({
        ...bookingDetail,
        status: newStatus,
        payment_status: newPaymentStatus
      });
    }
  };
  
  const filteredBookings = bookings.filter(booking => 
    (booking.booking_number.toLowerCase().includes(searchTerm.toLowerCase()) || 
     booking.visitor_name.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (selectedStatus === 'all' || booking.status.toLowerCase() === selectedStatus.toLowerCase()) &&
    (selectedPaymentStatus === 'all' || booking.payment_status.toLowerCase() === selectedPaymentStatus.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <TransactionHeader loading={loading} onRefresh={fetchBookings} />
      
      <TransactionContainer
        bookings={bookings}
        loading={loading}
        searchTerm={searchTerm}
        selectedStatus={selectedStatus}
        selectedPaymentStatus={selectedPaymentStatus}
        onSearchChange={setSearchTerm}
        onStatusChange={setSelectedStatus}
        onPaymentStatusChange={setSelectedPaymentStatus}
        onViewDetails={viewBookingDetails}
        currentPage={currentPage}
        totalItems={totalItems}
        itemsPerPage={itemsPerPage}
        onPageChange={handlePageChange}
        filteredBookings={filteredBookings}
      />
      
      <BookingDetailDialog
        bookingDetail={bookingDetail}
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onBookingUpdated={handleDetailBookingUpdated}
      />
    </div>
  );
};

export default Transactions;
