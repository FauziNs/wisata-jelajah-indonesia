
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Calendar, Clock, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const promotions = [
  {
    id: 1,
    title: 'Diskon 25% untuk Destinasi Pantai',
    slug: 'diskon-25-untuk-destinasi-pantai',
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    category: 'Seasonal',
    expiryDate: '2025-06-30',
    discount: '25%',
    promoCode: 'BEACH25',
    description: 'Dapatkan diskon 25% untuk tiket masuk destinasi pantai pilihan di seluruh Indonesia.'
  },
  {
    id: 2,
    title: 'Paket Keluarga: Beli 3 Dapat 1 Gratis',
    slug: 'paket-keluarga-beli-3-dapat-1-gratis',
    image: 'https://images.unsplash.com/photo-1581417478175-a9ef18f210c2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    category: 'Family',
    expiryDate: '2025-05-31',
    discount: 'Beli 3 Dapat 1',
    promoCode: 'FAMILY4',
    description: 'Beli 3 tiket dewasa dan dapatkan 1 tiket anak gratis untuk destinasi pilihan.'
  },
  {
    id: 3,
    title: 'Flash Sale: Diskon 50% untuk 100 Pembeli Pertama',
    slug: 'flash-sale-diskon-50-untuk-100-pembeli-pertama',
    image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    category: 'Flash Sale',
    expiryDate: '2025-04-15',
    discount: '50%',
    promoCode: 'FLASH50',
    description: 'Diskon 50% untuk 100 pembeli pertama di destinasi wisata Taman Nasional.'
  },
  {
    id: 4,
    title: 'Paket Hemat Long Weekend',
    slug: 'paket-hemat-long-weekend',
    image: 'https://images.unsplash.com/photo-1519677100203-a0e668c92439?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    category: 'Weekend',
    expiryDate: '2025-07-31',
    discount: '30%',
    promoCode: 'WEEKEND30',
    description: 'Hemat 30% untuk kunjungan di akhir pekan panjang. Berlaku di semua destinasi pilihan.'
  },
  {
    id: 5,
    title: 'Promo Spesial Ulang Tahun',
    slug: 'promo-spesial-ulang-tahun',
    image: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    category: 'Special',
    expiryDate: '2025-12-31',
    discount: 'Gratis',
    promoCode: 'BIRTHDAY',
    description: 'Gratis tiket masuk pada hari ulang tahun Anda dengan menunjukkan KTP.'
  }
];

const calculateDaysLeft = (expiryDate: string) => {
  const today = new Date();
  const expiry = new Date(expiryDate);
  const diffTime = expiry.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

const Promotions = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="bg-gradient-to-r from-primary to-blue-700 text-white py-12">
        <div className="container-custom">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Promo & Penawaran Spesial</h1>
          <p className="text-lg text-blue-100 mb-8">
            Dapatkan penawaran terbaik untuk pengalaman wisata yang tak terlupakan
          </p>
        </div>
      </div>
      
      <div className="container-custom py-8">
        {/* Featured Promo */}
        <div className="mb-12">
          <div className="relative rounded-xl overflow-hidden">
            <img 
              src="https://images.unsplash.com/photo-1576085898323-218337e3e43c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80" 
              alt="Featured Promotion" 
              className="w-full h-[400px] object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/30 flex items-center">
              <div className="p-8 md:p-12 max-w-2xl">
                <Badge className="bg-accent text-white mb-4">Limited Time</Badge>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                  Diskon 40% untuk 10 Destinasi Terbaik
                </h2>
                <p className="text-white/90 mb-6">
                  Nikmati liburan dengan harga spesial! Booking sekarang untuk perjalanan hingga akhir tahun.
                  Gunakan kode promo TOP40 untuk mendapatkan diskon.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button className="bg-accent hover:bg-accent/90">
                    Lihat Detail
                  </Button>
                  <Button variant="outline" className="text-white border-white hover:bg-white/10">
                    Lihat Semua Promo
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Promotion Categories */}
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="mb-8">
            <TabsTrigger value="all">Semua Promo</TabsTrigger>
            <TabsTrigger value="seasonal">Seasonal</TabsTrigger>
            <TabsTrigger value="weekend">Weekend</TabsTrigger>
            <TabsTrigger value="family">Keluarga</TabsTrigger>
            <TabsTrigger value="flash">Flash Sale</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {promotions.map((promo) => (
                <Link to={`/promo/${promo.slug}`} key={promo.id}>
                  <Card className="overflow-hidden h-full hover:shadow-lg transition-shadow">
                    <div className="relative h-48">
                      <img 
                        src={promo.image} 
                        alt={promo.title} 
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-3 left-3">
                        <Badge variant="secondary" className="font-medium">
                          {promo.category}
                        </Badge>
                      </div>
                      <div className="absolute top-3 right-3">
                        <Badge className="bg-accent text-white font-medium">
                          {promo.discount}
                        </Badge>
                      </div>
                    </div>
                    <CardContent className="p-5">
                      <h3 className="font-semibold text-lg mb-2 line-clamp-2">
                        {promo.title}
                      </h3>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {promo.description}
                      </p>
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center text-gray-500">
                          <Calendar className="h-4 w-4 mr-1" />
                          <span>Berakhir dalam {calculateDaysLeft(promo.expiryDate)} hari</span>
                        </div>
                        <span className="text-primary font-medium">
                          {promo.promoCode}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="seasonal">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {promotions.filter(p => p.category === 'Seasonal').map((promo) => (
                <Card key={promo.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  {/* Same card content as above */}
                  <div className="relative h-48">
                    <img 
                      src={promo.image} 
                      alt={promo.title} 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 left-3">
                      <Badge variant="secondary" className="font-medium">
                        {promo.category}
                      </Badge>
                    </div>
                    <div className="absolute top-3 right-3">
                      <Badge className="bg-accent text-white font-medium">
                        {promo.discount}
                      </Badge>
                    </div>
                  </div>
                  <CardContent className="p-5">
                    <h3 className="font-semibold text-lg mb-2 line-clamp-2">
                      {promo.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {promo.description}
                    </p>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center text-gray-500">
                        <Calendar className="h-4 w-4 mr-1" />
                        <span>Berakhir dalam {calculateDaysLeft(promo.expiryDate)} hari</span>
                      </div>
                      <span className="text-primary font-medium">
                        {promo.promoCode}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          {/* Similar content for other tabs */}
          <TabsContent value="weekend">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {promotions.filter(p => p.category === 'Weekend').map((promo) => (
                <Card key={promo.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  {/* Card content */}
                  <div className="relative h-48">
                    <img 
                      src={promo.image} 
                      alt={promo.title} 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 left-3">
                      <Badge variant="secondary" className="font-medium">
                        {promo.category}
                      </Badge>
                    </div>
                    <div className="absolute top-3 right-3">
                      <Badge className="bg-accent text-white font-medium">
                        {promo.discount}
                      </Badge>
                    </div>
                  </div>
                  <CardContent className="p-5">
                    <h3 className="font-semibold text-lg mb-2 line-clamp-2">
                      {promo.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {promo.description}
                    </p>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center text-gray-500">
                        <Calendar className="h-4 w-4 mr-1" />
                        <span>Berakhir dalam {calculateDaysLeft(promo.expiryDate)} hari</span>
                      </div>
                      <span className="text-primary font-medium">
                        {promo.promoCode}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="family">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {promotions.filter(p => p.category === 'Family').map((promo) => (
                <Card key={promo.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  {/* Card content */}
                  <div className="relative h-48">
                    <img 
                      src={promo.image} 
                      alt={promo.title} 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 left-3">
                      <Badge variant="secondary" className="font-medium">
                        {promo.category}
                      </Badge>
                    </div>
                    <div className="absolute top-3 right-3">
                      <Badge className="bg-accent text-white font-medium">
                        {promo.discount}
                      </Badge>
                    </div>
                  </div>
                  <CardContent className="p-5">
                    <h3 className="font-semibold text-lg mb-2 line-clamp-2">
                      {promo.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {promo.description}
                    </p>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center text-gray-500">
                        <Calendar className="h-4 w-4 mr-1" />
                        <span>Berakhir dalam {calculateDaysLeft(promo.expiryDate)} hari</span>
                      </div>
                      <span className="text-primary font-medium">
                        {promo.promoCode}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="flash">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {promotions.filter(p => p.category === 'Flash Sale').map((promo) => (
                <Card key={promo.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  {/* Card content */}
                  <div className="relative h-48">
                    <img 
                      src={promo.image} 
                      alt={promo.title} 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 left-3">
                      <Badge variant="secondary" className="font-medium">
                        {promo.category}
                      </Badge>
                    </div>
                    <div className="absolute top-3 right-3">
                      <Badge className="bg-accent text-white font-medium">
                        {promo.discount}
                      </Badge>
                    </div>
                  </div>
                  <CardContent className="p-5">
                    <h3 className="font-semibold text-lg mb-2 line-clamp-2">
                      {promo.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {promo.description}
                    </p>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center text-gray-500">
                        <Calendar className="h-4 w-4 mr-1" />
                        <span>Berakhir dalam {calculateDaysLeft(promo.expiryDate)} hari</span>
                      </div>
                      <span className="text-primary font-medium">
                        {promo.promoCode}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      <Footer />
    </div>
  );
};

export default Promotions;
