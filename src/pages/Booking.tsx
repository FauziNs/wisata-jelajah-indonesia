
import { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import CheckoutForm from '@/components/checkout/CheckoutForm';
import { Ticket, Calendar, Info, ArrowLeft } from 'lucide-react';

const Booking = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isAuthenticated, user } = useAuth();
  
  const [destination, setDestination] = useState(null);
  const [ticketType, setTicketType] = useState(null);
  const [quantity, setQuantity] = useState(parseInt(searchParams.get('quantity') || '1'));
  const [loading, setLoading] = useState(true);
  const [visitDate, setVisitDate] = useState('');

  const ticketTypeId = searchParams.get('ticket_type');

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      toast({
        title: "Login Diperlukan",
        description: "Silakan login terlebih dahulu untuk memesan tiket",
        variant: "default"
      });
      navigate('/login', { state: { from: `/booking/${id}?ticket_type=${ticketTypeId}&quantity=${quantity}` } });
      return;
    }
    
    if (!id || !ticketTypeId) {
      navigate('/destinasi');
      return;
    }

    fetchData();
  }, [id, ticketTypeId, isAuthenticated, navigate]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch destination data
      const { data: destinationData, error: destinationError } = await supabase
        .from('destinations')
        .select('*')
        .eq('id', id)
        .single();
      
      if (destinationError) {
        throw destinationError;
      }
      
      setDestination(destinationData);
      
      // Fetch ticket type data
      const { data: ticketData, error: ticketError } = await supabase
        .from('ticket_types')
        .select('*')
        .eq('id', ticketTypeId)
        .eq('destination_id', id)
        .single();
      
      if (ticketError) {
        throw ticketError;
      }
      
      setTicketType(ticketData);
      
    } catch (error) {
      console.error('Error fetching booking data:', error);
      toast({
        title: "Error",
        description: "Gagal memuat data pemesanan",
        variant: "destructive"
      });
      navigate('/destinasi');
    } finally {
      setLoading(false);
    }
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

  if (!destination || !ticketType) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="container-custom py-8 flex-grow">
          <div className="text-center py-12">
            <h3 className="text-xl font-medium text-gray-700 mb-2">Data tidak ditemukan</h3>
            <p className="text-gray-500 mb-6">Tiket atau destinasi yang Anda cari tidak ditemukan</p>
            <Button onClick={() => navigate('/destinasi')}>
              Jelajahi Destinasi
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

      <div className="container-custom py-8 flex-grow">
        <Button 
          variant="ghost" 
          className="mb-6 flex items-center gap-1"
          onClick={() => navigate(`/destinasi/${id}`)}
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Kembali ke Detail Destinasi</span>
        </Button>
        
        <h1 className="text-2xl md:text-3xl font-bold mb-6">Pesan Tiket</h1>
        
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <CheckoutForm 
              destinationName={destination.name}
              ticketName={ticketType.name}
              ticketPrice={ticketType.price}
              quantity={quantity}
              visitDate={visitDate}
              setVisitDate={setVisitDate}
              destinationId={destination.id}
              ticketId={ticketType.id}
            />
          </div>
          
          <div>
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4">Detail Pesanan</h3>
              
              <div className="border-b border-gray-200 pb-4 mb-4">
                <h4 className="font-medium flex items-center gap-2">
                  <Info className="h-4 w-4" />
                  {destination.name}
                </h4>
                <p className="text-gray-600 text-sm mt-1">{destination.location}</p>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Ticket className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">{ticketType.name}</p>
                    <p className="text-gray-600 text-sm">{ticketType.description}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">Tanggal Kunjungan</p>
                    <p className="text-gray-600 text-sm">{visitDate || 'Belum dipilih'}</p>
                  </div>
                </div>
                
                <div className="border-t border-gray-200 pt-4 mt-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Harga per tiket:</span>
                    <span>Rp {ticketType.price.toLocaleString('id-ID')}</span>
                  </div>
                  
                  <div className="flex justify-between mt-1">
                    <span className="text-gray-600">Jumlah:</span>
                    <span>{quantity}</span>
                  </div>
                  
                  <div className="flex justify-between mt-4 font-semibold text-lg">
                    <span>Total:</span>
                    <span>Rp {(ticketType.price * quantity).toLocaleString('id-ID')}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-blue-50 rounded-lg p-4 mt-4">
              <h4 className="font-medium text-blue-700 mb-2">Informasi Penting:</h4>
              <ul className="text-sm text-blue-700 space-y-1 list-disc list-inside">
                <li>Tiket tidak dapat dibatalkan setelah dibeli</li>
                <li>Perhatikan jam operasional destinasi wisata</li>
                <li>Tiket akan dikirim ke email setelah pembayaran berhasil</li>
                <li>Tunjukkan tiket digital saat memasuki destinasi</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Booking;
