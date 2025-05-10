
import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { XCircle, HomeIcon, RefreshCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card } from '@/components/ui/card';

const PaymentCancel = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const bookingId = searchParams.get('booking_id');

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (!bookingId) {
      navigate('/');
      return;
    }

    const fetchBooking = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('bookings')
          .select(`
            *,
            destinations:destination_id (*),
            ticket_types:ticket_type_id (*)
          `)
          .eq('id', bookingId)
          .single();

        if (error) {
          throw error;
        }

        setBooking(data);
        
        // Update booking status to cancelled
        await supabase
          .from('bookings')
          .update({ 
            status: 'cancelled', 
            updated_at: new Date().toISOString()
          })
          .eq('id', bookingId);

      } catch (error) {
        console.error('Error fetching booking:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [bookingId, isAuthenticated, navigate]);

  const handleRetryPayment = () => {
    if (!booking) return;
    navigate(`/booking/${booking.destination_id}?ticket_type=${booking.ticket_type_id}&quantity=${booking.quantity}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="container-custom py-8 flex-grow">
          <div className="text-center py-12">
            <h3 className="text-xl font-medium text-gray-700 mb-2">Booking tidak ditemukan</h3>
            <p className="text-gray-500 mb-6">Booking yang Anda cari tidak ditemukan</p>
            <Button onClick={() => navigate('/')}>
              Kembali ke Beranda
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="container-custom py-12 flex-grow">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4">
              <XCircle className="h-8 w-8 text-red-500" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold mb-2">Pembayaran Dibatalkan</h1>
            <p className="text-gray-600">
              Pembayaran Anda telah dibatalkan. Anda dapat mencoba membayar kembali atau memilih destinasi lain.
            </p>
          </div>

          <Card className="p-6 mb-6">
            <h2 className="text-xl font-semibold border-b pb-4 mb-4">Detail Pemesanan</h2>
            
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Booking Number:</span>
                <span className="font-medium">{booking.booking_number}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Destinasi:</span>
                <span className="font-medium">{booking.destinations?.name}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Tiket:</span>
                <span className="font-medium">{booking.ticket_types?.name}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Jumlah:</span>
                <span className="font-medium">{booking.quantity} tiket</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Status:</span>
                <span className="bg-red-100 text-red-700 px-2 py-1 text-xs rounded-full font-medium">
                  Dibatalkan
                </span>
              </div>
              
              <div className="flex justify-between border-t pt-4 mt-4">
                <span className="text-lg font-medium">Total:</span>
                <span className="text-lg font-bold">
                  Rp {parseFloat(booking.total_price).toLocaleString('id-ID')}
                </span>
              </div>
            </div>
          </Card>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button onClick={handleRetryPayment} className="flex items-center gap-2 bg-primary hover:bg-primary/90">
              <RefreshCcw className="h-4 w-4" />
              Coba Bayar Lagi
            </Button>
            
            <Button variant="outline" onClick={() => navigate('/')} className="flex items-center gap-2">
              <HomeIcon className="h-4 w-4" />
              Kembali ke Beranda
            </Button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default PaymentCancel;
