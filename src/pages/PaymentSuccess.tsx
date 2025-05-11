
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, ChevronRight, Download, Printer } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const PaymentSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [bookingDetails, setBookingDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        setLoading(true);
        
        // Get booking ID from URL params
        const params = new URLSearchParams(location.search);
        const bookingId = params.get('booking_id');
        
        if (!bookingId) {
          toast({
            title: "Error",
            description: "Tidak dapat menemukan informasi pemesanan",
            variant: "destructive"
          });
          navigate('/');
          return;
        }
        
        // Get booking details from Supabase
        const { data, error } = await supabase
          .from('bookings')
          .select(`
            *,
            destinations:destination_id(name, location, image_url),
            ticket_types:ticket_type_id(name, price)
          `)
          .eq('id', bookingId)
          .single();
        
        if (error || !data) {
          toast({
            title: "Error",
            description: "Gagal memuat detail pemesanan",
            variant: "destructive"
          });
          navigate('/');
          return;
        }
        
        // Update booking status to paid and confirmed if coming from successful Stripe payment
        await supabase
          .from('bookings')
          .update({
            payment_status: 'paid',
            status: 'confirmed'
          })
          .eq('id', bookingId);
        
        setBookingDetails(data);
      } catch (error) {
        console.error("Error fetching booking details:", error);
        toast({
          title: "Error",
          description: "Terjadi kesalahan saat memuat data",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchBookingDetails();
  }, [location.search, navigate, toast]);
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="container-custom py-12 flex-grow">
        <Card className="max-w-2xl mx-auto">
          <CardContent className="p-6">
            <div className="text-center mb-6">
              <div className="flex justify-center mb-4">
                <div className="bg-green-100 p-3 rounded-full">
                  <CheckCircle className="h-10 w-10 text-green-600" />
                </div>
              </div>
              
              <h1 className="text-2xl font-bold mb-2">Pembayaran Berhasil!</h1>
              <p className="text-gray-600">
                Terima kasih telah melakukan pemesanan. Tiket perjalanan Anda telah dikonfirmasi.
              </p>
            </div>
            
            {loading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : bookingDetails ? (
              <>
                <div className="border-t border-gray-200 pt-6 mb-6">
                  <h2 className="font-semibold text-lg mb-4">Informasi Pemesanan</h2>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Nomor Booking</span>
                      <span className="font-medium">{bookingDetails.booking_number}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-gray-600">Destinasi</span>
                      <span className="font-medium">{bookingDetails.destinations?.name}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-gray-600">Jenis Tiket</span>
                      <span className="font-medium">{bookingDetails.ticket_types?.name}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-gray-600">Jumlah Tiket</span>
                      <span className="font-medium">{bookingDetails.quantity}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tanggal Kunjungan</span>
                      <span className="font-medium">{new Date(bookingDetails.visit_date).toLocaleDateString('id-ID', { 
                        weekday: 'long', 
                        day: 'numeric', 
                        month: 'long', 
                        year: 'numeric' 
                      })}</span>
                    </div>
                    
                    <div className="flex justify-between text-lg font-semibold">
                      <span>Total Pembayaran</span>
                      <span className="text-primary">Rp {bookingDetails.total_price?.toLocaleString('id-ID')}</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <Button 
                    onClick={() => navigate(`/payment?id=${bookingDetails.id}`)}
                    className="w-full flex items-center justify-center gap-2"
                  >
                    Lihat E-Tiket
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                  
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      className="flex-1 flex items-center justify-center gap-2"
                      onClick={() => navigate('/bookings')}
                    >
                      Lihat Pesanan Saya
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      className="flex-1 flex items-center justify-center gap-2"
                      onClick={() => navigate('/')}
                    >
                      Kembali ke Beranda
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-6">
                <p>Data pemesanan tidak ditemukan</p>
                <Button 
                  onClick={() => navigate('/')} 
                  className="mt-4"
                >
                  Kembali ke Beranda
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      <Footer />
    </div>
  );
};

export default PaymentSuccess;
