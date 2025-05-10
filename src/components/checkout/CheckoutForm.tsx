
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, CreditCard, CalendarClock, User, Mail, Phone } from 'lucide-react';

interface CheckoutFormProps {
  destinationName: string;
  ticketName: string;
  ticketPrice: number;
  quantity: number;
  visitDate: string;
  setVisitDate: (date: string) => void;
  destinationId: string;
  ticketId: string;
}

const CheckoutForm = ({
  destinationName,
  ticketName,
  ticketPrice,
  quantity,
  visitDate,
  setVisitDate,
  destinationId,
  ticketId
}: CheckoutFormProps) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [visitorName, setVisitorName] = useState('');
  const [visitorEmail, setVisitorEmail] = useState(user?.email || '');
  const [visitorPhone, setVisitorPhone] = useState('');
  const [specialRequests, setSpecialRequests] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const totalPrice = ticketPrice * quantity;

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!visitDate) {
      toast({
        title: "Tanggal Kunjungan Diperlukan",
        description: "Silakan pilih tanggal kunjungan",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsLoading(true);
      
      // Create a temporary booking in Supabase
      const bookingNumber = `BK-${Date.now().toString().slice(-8)}`;
      
      const { data: booking, error: bookingError } = await supabase
        .from('bookings')
        .insert({
          user_id: user?.id,
          destination_id: destinationId,
          ticket_type_id: ticketId,
          visitor_name: visitorName,
          visitor_email: visitorEmail,
          visitor_phone: visitorPhone,
          visit_date: visitDate,
          quantity,
          total_price: totalPrice,
          special_requests: specialRequests,
          booking_number: bookingNumber,
          status: 'pending',
          payment_status: 'unpaid'
        })
        .select()
        .single();
      
      if (bookingError) {
        throw bookingError;
      }
      
      // Call Stripe checkout function
      const { data: stripeSession, error: stripeError } = await supabase.functions.invoke('create-checkout', {
        body: {
          bookingId: booking.id,
          amount: totalPrice,
          destinationName,
          ticketName,
          quantity,
          visitDate,
          visitorName,
          bookingNumber
        }
      });

      if (stripeError) {
        throw stripeError;
      }

      // Redirect to Stripe checkout
      window.location.href = stripeSession.url;
      
    } catch (error) {
      console.error('Payment error:', error);
      toast({
        title: "Gagal Memproses Pembayaran",
        description: "Terjadi kesalahan saat memproses pembayaran. Silakan coba lagi.",
        variant: "destructive"
      });
      setIsLoading(false);
    }
  };

  return (
    <Card className="p-6">
      <form onSubmit={handleCheckout}>
        <h3 className="text-xl font-semibold mb-6">Informasi Pengunjung</h3>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="visitor-name" className="flex items-center gap-2 mb-2">
              <User className="h-4 w-4" />
              Nama Lengkap
            </Label>
            <Input
              id="visitor-name"
              placeholder="Nama lengkap sesuai identitas"
              value={visitorName}
              onChange={(e) => setVisitorName(e.target.value)}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="visitor-email" className="flex items-center gap-2 mb-2">
              <Mail className="h-4 w-4" />
              Email
            </Label>
            <Input
              id="visitor-email"
              type="email"
              placeholder="Email aktif untuk pengiriman tiket"
              value={visitorEmail}
              onChange={(e) => setVisitorEmail(e.target.value)}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="visitor-phone" className="flex items-center gap-2 mb-2">
              <Phone className="h-4 w-4" />
              Nomor Telepon
            </Label>
            <Input
              id="visitor-phone"
              placeholder="Nomor telepon aktif"
              value={visitorPhone}
              onChange={(e) => setVisitorPhone(e.target.value)}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="visit-date" className="flex items-center gap-2 mb-2">
              <CalendarClock className="h-4 w-4" />
              Tanggal Kunjungan
            </Label>
            <Input
              id="visit-date"
              type="date"
              min={new Date().toISOString().split('T')[0]}
              value={visitDate}
              onChange={(e) => setVisitDate(e.target.value)}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="special-requests" className="mb-2">Permintaan Khusus (opsional)</Label>
            <Textarea
              id="special-requests"
              placeholder="Permintaan khusus atau catatan tambahan"
              value={specialRequests}
              onChange={(e) => setSpecialRequests(e.target.value)}
              className="resize-none"
            />
          </div>
        </div>
        
        <div className="border-t border-gray-200 mt-6 pt-6">
          <h4 className="text-lg font-medium mb-4">Detail Pembayaran</h4>
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Tiket {ticketName}</span>
              <span>Rp {ticketPrice.toLocaleString('id-ID')}</span>
            </div>
            
            <div className="flex justify-between">
              <span>Jumlah</span>
              <span>{quantity} tiket</span>
            </div>
            
            <div className="flex justify-between font-medium text-lg pt-2 border-t">
              <span>Total</span>
              <span>Rp {totalPrice.toLocaleString('id-ID')}</span>
            </div>
          </div>
        </div>
        
        <div className="mt-8">
          <Button 
            type="submit" 
            className="w-full bg-primary hover:bg-primary/90 flex items-center justify-center gap-2"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Memproses...
              </>
            ) : (
              <>
                <CreditCard className="h-4 w-4" />
                Bayar Sekarang
              </>
            )}
          </Button>
          
          <p className="text-xs text-center text-gray-500 mt-3">
            Pembayaran akan diproses melalui Stripe. Data kartu Anda aman dan terenkripsi.
          </p>
        </div>
      </form>
    </Card>
  );
};

export default CheckoutForm;
