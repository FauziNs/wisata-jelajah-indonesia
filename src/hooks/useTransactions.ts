
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Booking } from '@/components/admin/transactions/types';

export const useTransactions = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const { toast } = useToast();
  const itemsPerPage = 10;
  
  const fetchBookings = async () => {
    setLoading(true);
    try {
      // First count total bookings for pagination
      const { count: totalCount, error: countError } = await supabase
        .from('bookings')
        .select('*', { count: 'exact', head: true });
        
      if (countError) {
        throw countError;
      }
      
      if (totalCount !== null) {
        setTotalItems(totalCount);
      }
      
      // Then get paginated bookings
      const from = (currentPage - 1) * itemsPerPage;
      const to = from + itemsPerPage - 1;
      
      const { data: bookingsData, error: bookingsError } = await supabase
        .from('bookings')
        .select('*')
        .order('created_at', { ascending: false })
        .range(from, to);
        
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

  const handleBookingUpdated = (bookingId: string, newStatus: string, newPaymentStatus: string) => {
    setBookings(prevBookings => 
      prevBookings.map(booking => 
        booking.id === bookingId 
          ? { ...booking, status: newStatus, payment_status: newPaymentStatus } 
          : booking
      )
    );
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    fetchBookings();
  }, [currentPage]);

  return {
    bookings,
    loading,
    currentPage,
    totalItems,
    itemsPerPage,
    fetchBookings,
    handleBookingUpdated,
    handlePageChange
  };
};
