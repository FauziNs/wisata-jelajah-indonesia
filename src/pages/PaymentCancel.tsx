
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, ArrowLeft, HomeIcon } from 'lucide-react';

const PaymentCancel = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get booking ID from URL params
  const params = new URLSearchParams(location.search);
  const bookingId = params.get('booking_id');
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="container-custom py-12 flex-grow">
        <Card className="max-w-2xl mx-auto">
          <CardContent className="p-6">
            <div className="text-center mb-6">
              <div className="flex justify-center mb-4">
                <div className="bg-amber-100 p-3 rounded-full">
                  <AlertCircle className="h-10 w-10 text-amber-600" />
                </div>
              </div>
              
              <h1 className="text-2xl font-bold mb-2">Pembayaran Dibatalkan</h1>
              <p className="text-gray-600">
                Proses pembayaran Anda telah dibatalkan. Tidak ada biaya yang dibebankan.
              </p>
            </div>
            
            <div className="space-y-3 mt-6">
              {bookingId && (
                <Button 
                  onClick={() => navigate(`/payment?id=${bookingId}`)}
                  className="w-full flex items-center justify-center gap-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Coba Bayar Lagi
                </Button>
              )}
              
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
                  <HomeIcon className="h-4 w-4" />
                  Kembali ke Beranda
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Footer />
    </div>
  );
};

export default PaymentCancel;
