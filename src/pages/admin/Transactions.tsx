
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import BookingFilters from '@/components/admin/transactions/BookingFilters';
import BookingsTable from '@/components/admin/transactions/BookingsTable';
import BookingDetailDialog from '@/components/admin/transactions/BookingDetailDialog';
import { Booking } from '@/components/admin/transactions/types';

const Transactions = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState('all');
  const [bookingDetail, setBookingDetail] = useState<Booking | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();
  
  useEffect(() => {
    fetchBookings();
  }, []);
  
  const fetchBookings = async () => {
    setLoading(true);
    try {
      // First get bookings
      const { data: bookingsData, error: bookingsError } = await supabase
        .from('bookings')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (bookingsError) {
        throw bookingsError;
      }
      
      // Fetch destination names for each booking
      let enrichedBookings = [];
      for (const booking of bookingsData || []) {
        // Get destination name
        const { data: destinationData } = await supabase
          .from('destinations')
          .select('name')
          .eq('id', booking.destination_id)
          .single();
          
        // Get ticket type name
        const { data: ticketTypeData } = await supabase
          .from('ticket_types')
          .select('name')
          .eq('id', booking.ticket_type_id)
          .single();
          
        enrichedBookings.push({
          ...booking,
          destination_name: destinationData?.name || 'Unknown Destination',
          ticket_type_name: ticketTypeData?.name || 'Unknown Ticket Type'
        });
      }
      
      setBookings(enrichedBookings);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      toast({
        title: "Error",
        description: "Gagal mengambil data pemesanan",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  const viewBookingDetails = (booking: Booking) => {
    setBookingDetail(booking);
    setIsDialogOpen(true);
  };

  const handleBookingUpdated = (bookingId: string, newStatus: string, newPaymentStatus: string) => {
    // Update the local state
    setBookings(prevBookings => 
      prevBookings.map(booking => 
        booking.id === bookingId 
          ? { ...booking, status: newStatus, payment_status: newPaymentStatus } 
          : booking
      )
    );
    
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
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <h1 className="text-2xl font-bold">Manajemen Transaksi</h1>
        <Button onClick={fetchBookings} disabled={loading}>
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
      
      <div className="bg-white rounded-lg shadow p-6">
        <BookingFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          selectedStatus={selectedStatus}
          onStatusChange={setSelectedStatus}
          selectedPaymentStatus={selectedPaymentStatus}
          onPaymentStatusChange={setSelectedPaymentStatus}
        />
        
        <BookingsTable
          bookings={filteredBookings}
          loading={loading}
          onViewDetails={viewBookingDetails}
        />
      </div>
      
      <BookingDetailDialog
        bookingDetail={bookingDetail}
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onBookingUpdated={handleBookingUpdated}
      />
    </div>
  );
};

export default Transactions;
