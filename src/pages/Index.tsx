
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import FeaturedDestinations from "@/components/FeaturedDestinations";
import Footer from "@/components/Footer";
import { Calendar, Ticket, MapPin, CreditCard } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <HeroSection />
      
      {/* Benefits Section */}
      <section className="py-12 bg-white">
        <div className="container-custom">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-800 mb-12">
            Mengapa Memilih WisataJelajah?
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="flex flex-col items-center text-center p-6 rounded-lg hover:shadow-md transition-shadow">
              <div className="bg-blue-50 p-3 rounded-full mb-4">
                <Calendar className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Fleksibel</h3>
              <p className="text-gray-600">Pilih tanggal kunjungan sesuai jadwalmu dengan mudah</p>
            </div>
            
            <div className="flex flex-col items-center text-center p-6 rounded-lg hover:shadow-md transition-shadow">
              <div className="bg-green-50 p-3 rounded-full mb-4">
                <Ticket className="h-8 w-8 text-secondary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Tiket Digital</h3>
              <p className="text-gray-600">Dapatkan dan cetak tiket langsung dari perangkatmu</p>
            </div>
            
            <div className="flex flex-col items-center text-center p-6 rounded-lg hover:shadow-md transition-shadow">
              <div className="bg-amber-50 p-3 rounded-full mb-4">
                <MapPin className="h-8 w-8 text-accent" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Beragam Destinasi</h3>
              <p className="text-gray-600">Lebih dari 1000 destinasi wisata di seluruh Indonesia</p>
            </div>
            
            <div className="flex flex-col items-center text-center p-6 rounded-lg hover:shadow-md transition-shadow">
              <div className="bg-red-50 p-3 rounded-full mb-4">
                <CreditCard className="h-8 w-8 text-red-500" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Pembayaran Mudah</h3>
              <p className="text-gray-600">Berbagai metode pembayaran yang aman dan terpercaya</p>
            </div>
          </div>
        </div>
      </section>

      <FeaturedDestinations />

      {/* Promo Section */}
      <section className="py-12 bg-gradient-to-r from-primary to-blue-700 text-white">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-6 md:mb-0 md:max-w-xl">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">Hemat 15% untuk Pemesanan Pertama!</h2>
              <p className="mb-4 text-blue-100">
                Daftar sekarang dan dapatkan diskon spesial 15% untuk pembelian tiket pertama Anda di WisataJelajah. 
                Gunakan kode promo <strong className="bg-white text-primary px-2 py-0.5 rounded">JELAJAH15</strong>
              </p>
              <button 
                className="bg-accent hover:bg-accent/90 text-white py-2 px-6 rounded-md font-medium"
                onClick={() => window.location.href = '/promo'}
              >
                Dapatkan Promo
              </button>
            </div>
            
            <div className="w-full md:w-auto">
              <img 
                src="https://images.unsplash.com/photo-1539367628448-4bc5c9d171c8?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" 
                alt="Promo Wisata" 
                className="rounded-lg shadow-lg max-w-xs mx-auto"
              />
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Index;
