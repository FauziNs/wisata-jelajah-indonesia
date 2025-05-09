
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useBookingStatusUpdate = () => {
  const { toast } = useToast();

  const updateBookingStatus = async (
    bookingId: string, 
    newStatus: string, 
    newPaymentStatus: string,
    onSuccess?: (bookingId: string, newStatus: string, newPaymentStatus: string) => void
  ) => {
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
      
      if (onSuccess) {
        onSuccess(bookingId, newStatus, newPaymentStatus);
      }
      
      return true;
    } catch (error) {
      console.error('Error updating booking status:', error);
      toast({
        title: "Error",
        description: "Gagal memperbarui status pemesanan",
        variant: "destructive"
      });
      return false;
    }
  };

  return { updateBookingStatus };
};
