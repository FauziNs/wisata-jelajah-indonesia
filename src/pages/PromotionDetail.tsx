
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, Clock, Copy, Check, ArrowRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const PromotionDetail = () => {
  const { slug } = useParams();
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  // Mock data for the promotion (in a real app, this would be fetched based on slug)
  const promotion = {
    id: 1,
    title: 'Diskon 25% untuk Destinasi Pantai',
    slug: 'diskon-25-untuk-destinasi-pantai',
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
    imageGallery: [
      'https://images.unsplash.com/photo-1520454974749-611b7248ffdb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    ],
    category: 'Seasonal',
    expiryDate: '2025-06-30',
    discount: '25%',
    promoCode: 'BEACH25',
    description: 'Dapatkan diskon 25% untuk tiket masuk destinasi pantai pilihan di seluruh Indonesia. Promo ini berlaku untuk pembelian tiket secara online melalui website atau aplikasi WisataJelajah. Gunakan kode promo BEACH25 saat checkout.',
    longDescription: 'Nikmati liburan pantai Anda dengan harga spesial! Dapatkan diskon 25% untuk tiket masuk ke destinasi pantai terbaik di seluruh Indonesia. Promo ini hadir sebagai bagian dari kampanye "Discover Indonesian Beaches" yang bertujuan mempromosikan keindahan pantai-pantai Indonesia.\n\nDengan menggunakan kode promo BEACH25, Anda akan mendapatkan potongan harga sebesar 25% untuk tiket masuk dewasa maupun anak-anak. Promo ini berlaku untuk pembelian tiket online melalui website atau aplikasi WisataJelajah hingga 30 Juni 2025.',
    terms: [
      'Diskon 25% berlaku untuk semua jenis tiket destinasi pantai yang terdaftar dalam promo',
      'Kode promo harus dimasukkan saat proses checkout',
      'Promo tidak dapat digabungkan dengan promo lainnya',
      'Berlaku untuk pembelian tiket dari tanggal 1 Januari 2025 hingga 30 Juni 2025',
      'Tiket yang sudah dibeli menggunakan promo ini tidak dapat direfund',
      'Tiket dapat digunakan sesuai dengan periode kunjungan yang dipilih',
      'WisataJelajah berhak membatalkan transaksi jika terdapat indikasi kecurangan'
    ],
    destinations: [
      {
        id: 1,
        name: 'Pantai Kuta',
        location: 'Bali',
        image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      },
      {
        id: 2,
        name: 'Pantai Pink',
        location: 'Lombok',
        image: 'https://images.unsplash.com/photo-1584810359583-96fc3448beaa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      },
      {
        id: 3,
        name: 'Raja Ampat',
        location: 'Papua Barat',
        image: 'https://images.unsplash.com/photo-1573790387438-4da905039392?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      },
    ]
  };

  if (!promotion) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container-custom py-20 text-center">
          <h1 className="text-3xl font-bold mb-4">Promosi Tidak Ditemukan</h1>
          <p className="mb-8">Maaf, promosi yang Anda cari tidak ditemukan.</p>
          <Button href="/promo">Kembali ke Daftar Promosi</Button>
        </div>
        <Footer />
      </div>
    );
  }

  const handleCopyCode = () => {
    navigator.clipboard.writeText(promotion.promoCode);
    setCopied(true);
    toast({
      title: "Kode promo disalin!",
      description: `${promotion.promoCode} telah disalin ke clipboard.`
    });
    
    setTimeout(() => {
      setCopied(false);
    }, 3000);
  };

  const calculateDaysLeft = (expiryDate: string) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysLeft = calculateDaysLeft(promotion.expiryDate);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Banner */}
      <div className="relative h-[40vh] md:h-[50vh] bg-gray-900">
        <img 
          src={promotion.image} 
          alt={promotion.title} 
          className="w-full h-full object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
        
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
          <div className="container-custom">
            <Badge className="mb-3 bg-accent text-white">{promotion.category}</Badge>
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">{promotion.title}</h1>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-white/90">
              <div className="flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                <span>Berlaku hingga {new Date(promotion.expiryDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
              </div>
              <div className="flex items-center">
                <Clock className="h-5 w-5 mr-2" />
                <span>{daysLeft > 0 ? `${daysLeft} hari tersisa` : 'Promo telah berakhir'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="container-custom py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Main Content */}
          <div className="flex-1">
            {/* Promo Description */}
            <div className="bg-white rounded-lg p-6 shadow-sm mb-8">
              <h2 className="text-2xl font-semibold mb-4">Detail Promosi</h2>
              <p className="text-gray-600 mb-4">{promotion.description}</p>
              <div className="whitespace-pre-line text-gray-600">
                {promotion.longDescription}
              </div>
            </div>
            
            {/* Terms and Conditions */}
            <div className="bg-white rounded-lg p-6 shadow-sm mb-8">
              <h2 className="text-2xl font-semibold mb-4">Syarat dan Ketentuan</h2>
              <ul className="list-disc list-inside space-y-2 text-gray-600">
                {promotion.terms.map((term, index) => (
                  <li key={index}>{term}</li>
                ))}
              </ul>
            </div>
            
            {/* Featured Destinations */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h2 className="text-2xl font-semibold mb-4">Destinasi yang Berlaku</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {promotion.destinations.map((destination) => (
                  <Link 
                    to={`/destinasi/${destination.name.toLowerCase().replace(/\s+/g, '-')}`} 
                    key={destination.id}
                    className="group"
                  >
                    <div className="rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                      <div className="h-40 relative overflow-hidden">
                        <img 
                          src={destination.image} 
                          alt={destination.name} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold group-hover:text-primary transition-colors">{destination.name}</h3>
                        <p className="text-gray-500 text-sm">{destination.location}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
          
          {/* Sidebar */}
          <div className="md:w-[320px]">
            <div className="sticky top-24">
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-xl mb-4">Kode Promo</h3>
                  
                  <div className="relative">
                    <div className="border border-dashed border-primary rounded-md p-4 bg-primary/5 text-center mb-4">
                      <div className="text-xs text-gray-500 mb-1">Kode Promo</div>
                      <div className="text-2xl font-bold text-primary">{promotion.promoCode}</div>
                    </div>
                    
                    <Button 
                      onClick={handleCopyCode} 
                      className="w-full flex items-center justify-center gap-2"
                    >
                      {copied ? (
                        <>
                          <Check className="h-5 w-5" />
                          Kode Disalin
                        </>
                      ) : (
                        <>
                          <Copy className="h-5 w-5" />
                          Salin Kode
                        </>
                      )}
                    </Button>
                  </div>
                  
                  <div className="mt-6 space-y-4">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-500">Nilai Diskon:</span>
                      <span className="font-semibold">{promotion.discount}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-500">Periode:</span>
                      <span className="font-semibold">Hingga {new Date(promotion.expiryDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                    </div>
                  </div>
                  
                  <div className="mt-6 pt-6 border-t">
                    <Link to="/destinasi">
                      <Button className="w-full">
                        Cari Destinasi
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
              
              {/* Share Promo */}
              <Card className="mt-4">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-4">Bagikan Promo</h3>
                  <div className="flex justify-around">
                    <Button variant="outline" size="icon" className="rounded-full">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951z"/>
                      </svg>
                    </Button>
                    <Button variant="outline" size="icon" className="rounded-full">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M5.026 15c6.038 0 9.341-5.003 9.341-9.334 0-.14 0-.282-.006-.422A6.685 6.685 0 0 0 16 3.542a6.658 6.658 0 0 1-1.889.518 3.301 3.301 0 0 0 1.447-1.817 6.533 6.533 0 0 1-2.087.793A3.286 3.286 0 0 0 7.875 6.03a9.325 9.325 0 0 1-6.767-3.429 3.289 3.289 0 0 0 1.018 4.382A3.323 3.323 0 0 1 .64 6.575v.045a3.288 3.288 0 0 0 2.632 3.218 3.203 3.203 0 0 1-.865.115 3.23 3.23 0 0 1-.614-.057 3.283 3.283 0 0 0 3.067 2.277A6.588 6.588 0 0 1 .78 13.58a6.32 6.32 0 0 1-.78-.045A9.344 9.344 0 0 0 5.026 15z"/>
                      </svg>
                    </Button>
                    <Button variant="outline" size="icon" className="rounded-full">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z"/>
                      </svg>
                    </Button>
                    <Button variant="outline" size="icon" className="rounded-full">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854V1.146zm4.943 12.248V6.169H2.542v7.225h2.401zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248-.822 0-1.359.54-1.359 1.248 0 .694.521 1.248 1.327 1.248h.016zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016a5.54 5.54 0 0 1 .016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225h2.4z"/>
                      </svg>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default PromotionDetail;
