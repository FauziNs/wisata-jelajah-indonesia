
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Clock, 
  Info, 
  MapPin, 
  Calendar, 
  Star, 
  Ticket, 
  User, 
  Heart,
  Phone,
  Wifi,
  Utensils,
  Car,
  Image,
  ParkingSquare,
  ShoppingBag,
  Landmark
} from 'lucide-react';

const DestinationDetail = () => {
  const { slug } = useParams();
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Mock data for the destination (in a real app, this would be fetched based on slug)
  const destination = {
    id: 1,
    name: 'Pantai Kuta',
    slug: 'pantai-kuta',
    location: 'Kuta, Badung, Bali',
    description: 'Pantai Kuta adalah salah satu pantai terkenal di Bali yang menawarkan pemandangan matahari terbenam yang indah. Pantai ini terkenal dengan ombaknya yang cocok untuk berselancar dan pasir putihnya yang lembut. Anda dapat menikmati berbagai aktivitas seperti berjemur, berenang, berselancar, atau sekadar bersantai menikmati suasana pantai.',
    rating: 4.7,
    reviewCount: 1243,
    price: 'Rp 50.000 - Rp 100.000',
    category: 'Pantai',
    images: [
      'https://images.unsplash.com/photo-1537996194471-e657df975ab4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
      'https://images.unsplash.com/photo-1588717212952-187fcc3a0fcb?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
      'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
      'https://images.unsplash.com/photo-1577717903315-1691ae25ab3f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
    ],
    openingHours: {
      weekday: '08:00 - 18:00',
      weekend: '08:00 - 19:00',
    },
    facilities: [
      { name: 'Toilet', icon: User },
      { name: 'Parkir', icon: ParkingSquare },
      { name: 'Tempat Makan', icon: Utensils },
      { name: 'WiFi', icon: Wifi },
      { name: 'Spot Foto', icon: Image },
      { name: 'Toko Souvenir', icon: ShoppingBag },
    ],
    tickets: [
      { 
        name: 'Tiket Dewasa', 
        price: 'Rp 50.000', 
        description: 'Usia 13+ tahun',
        available: true
      },
      { 
        name: 'Tiket Anak', 
        price: 'Rp 25.000', 
        description: 'Usia 5-12 tahun',
        available: true
      },
      { 
        name: 'Tiket Domestik', 
        price: 'Rp 50.000', 
        description: 'WNI dengan KTP',
        available: true
      },
      { 
        name: 'Tiket Internasional', 
        price: 'Rp 100.000', 
        description: 'Wisatawan asing',
        available: true
      },
    ],
    faqs: [
      {
        question: 'Apakah pantai ini aman untuk berenang?',
        answer: 'Pantai Kuta umumnya aman untuk berenang, tetapi selalu perhatikan bendera peringatan yang dipasang untuk mengetahui kondisi ombak dan arus pada hari tersebut.'
      },
      {
        question: 'Adakah penyewaan alat selancar?',
        answer: 'Ya, ada beberapa tempat penyewaan alat selancar di sepanjang pantai dengan harga sekitar Rp 50.000 - Rp 100.000 per jam.'
      },
      {
        question: 'Bagaimana cara menuju ke pantai ini?',
        answer: 'Pantai Kuta terletak sekitar 10 menit dari Bandara Internasional Ngurah Rai. Anda bisa menggunakan taksi, sewa mobil, atau transportasi online.'
      }
    ]
  };

  if (!destination) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container-custom py-20 text-center">
          <h1 className="text-3xl font-bold mb-4">Destinasi Tidak Ditemukan</h1>
          <p className="mb-8">Maaf, destinasi yang Anda cari tidak ditemukan.</p>
          <Link to="/destinasi">
            <Button>Kembali ke Daftar Destinasi</Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Image Gallery */}
      <div className="relative">
        <div className="h-[50vh] md:h-[60vh] bg-gray-900 relative overflow-hidden">
          <img 
            src={destination.images[activeImageIndex]} 
            alt={destination.name} 
            className="w-full h-full object-cover opacity-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
          
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
            <div className="container-custom">
              <Badge className="mb-3">{destination.category}</Badge>
              <h1 className="text-3xl md:text-5xl font-bold text-white mb-2">{destination.name}</h1>
              <div className="flex items-center text-white/90 mb-4">
                <MapPin className="h-4 w-4 mr-1" />
                <span>{destination.location}</span>
              </div>
              <div className="flex items-center gap-6">
                <div className="flex items-center">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`h-5 w-5 ${i < Math.floor(destination.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} 
                      />
                    ))}
                  </div>
                  <span className="text-white ml-2">{destination.rating} ({destination.reviewCount} ulasan)</span>
                </div>
                <div className="flex items-center text-white">
                  <Clock className="h-5 w-5 mr-1" />
                  <span>Buka: {destination.openingHours.weekday}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Thumbnails */}
        <div className="container-custom">
          <div className="flex gap-3 mt-4 overflow-x-auto pb-2">
            {destination.images.map((image, index) => (
              <div 
                key={index}
                className={`cursor-pointer rounded-md overflow-hidden h-20 w-32 flex-shrink-0 transition 
                  ${activeImageIndex === index ? 'ring-2 ring-primary' : 'opacity-70'}`}
                onClick={() => setActiveImageIndex(index)}
              >
                <img src={image} alt="" className="h-full w-full object-cover" />
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="container-custom py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main content */}
          <div className="flex-1">
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="mb-6">
                <TabsTrigger value="overview">Deskripsi</TabsTrigger>
                <TabsTrigger value="tickets">Tiket</TabsTrigger>
                <TabsTrigger value="facilities">Fasilitas</TabsTrigger>
                <TabsTrigger value="faq">FAQ</TabsTrigger>
                <TabsTrigger value="reviews">Ulasan</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="space-y-6">
                <div className="prose max-w-none">
                  <h2 className="text-2xl font-semibold">Tentang {destination.name}</h2>
                  <p className="text-gray-600 leading-relaxed">{destination.description}</p>
                  <p className="text-gray-600 leading-relaxed">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam in dui mauris. Vivamus hendrerit arcu sed erat molestie vehicula. Sed auctor neque eu tellus rhoncus ut eleifend nibh porttitor. Ut in nulla enim. Phasellus molestie magna non est bibendum non venenatis nisl tempor.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold mb-4">Lokasi</h3>
                  <div className="bg-gray-100 rounded-lg h-[300px] flex items-center justify-center">
                    <div className="text-center">
                      <MapPin className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                      <p className="text-gray-500">Peta akan ditampilkan di sini</p>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="tickets">
                <h2 className="text-2xl font-semibold mb-6">Tiket Masuk</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {destination.tickets.map((ticket, index) => (
                    <Card key={index} className="overflow-hidden">
                      <CardContent className="p-0">
                        <div className="p-6">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-semibold text-lg">{ticket.name}</h3>
                              <p className="text-sm text-gray-500">{ticket.description}</p>
                            </div>
                            <span className="font-bold text-primary">{ticket.price}</span>
                          </div>
                          <Button className="w-full mt-4">Beli Tiket</Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="facilities">
                <h2 className="text-2xl font-semibold mb-6">Fasilitas</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {destination.facilities.map((facility, index) => (
                    <div key={index} className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-lg">
                      <facility.icon className="h-8 w-8 text-primary mb-2" />
                      <span>{facility.name}</span>
                    </div>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="faq">
                <h2 className="text-2xl font-semibold mb-6">Pertanyaan Umum</h2>
                <div className="space-y-4">
                  {destination.faqs.map((faq, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <h3 className="font-semibold text-lg mb-2">{faq.question}</h3>
                      <p className="text-gray-600">{faq.answer}</p>
                    </div>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="reviews">
                <h2 className="text-2xl font-semibold mb-6">Ulasan Pengunjung</h2>
                <div className="bg-gray-100 rounded-lg p-8 text-center">
                  <h3 className="text-xl font-medium text-gray-700 mb-2">Ulasan akan segera hadir</h3>
                  <p className="text-gray-500">Kami sedang mengumpulkan ulasan dari pengunjung</p>
                </div>
              </TabsContent>
            </Tabs>
          </div>
          
          {/* Sidebar */}
          <div className="lg:w-[320px]">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-xl mb-4">Beli Tiket</h3>
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Mulai dari</span>
                    <span className="font-bold text-primary">{destination.tickets[0].price}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>Pilih Tanggal Kunjungan</span>
                  </div>
                </div>
                <Button className="w-full">Beli Tiket Sekarang</Button>
                <Button variant="outline" className="w-full mt-3 flex gap-2 justify-center">
                  <Heart className="h-5 w-5" />
                  Simpan ke Favorit
                </Button>
                
                <div className="mt-6 pt-6 border-t">
                  <h4 className="font-semibold mb-3">Butuh Bantuan?</h4>
                  <div className="flex items-center text-primary">
                    <Phone className="h-4 w-4 mr-2" />
                    <span>+62 812-3456-7890</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default DestinationDetail;
