
import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import SearchBar from './SearchBar';

const destinations = [{
  id: 1,
  name: 'Pantai Kuta, Bali',
  image: 'https://images.unsplash.com/photo-1539367628448-4bc5c9d171c8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80'
}, {
  id: 2,
  name: 'Candi Borobudur, Magelang',
  image: 'https://images.unsplash.com/photo-1596402184320-417e7178b2cd?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80'
}, {
  id: 3,
  name: 'Raja Ampat, Papua',
  image: 'https://images.unsplash.com/photo-1516690561799-19570037e9ed?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80'
}, {
  id: 4,
  name: 'Gunung Bromo, Jawa Timur',
  image: 'https://images.unsplash.com/photo-1589311836499-19570037e9ed?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80'
}];

const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide(prevSlide => (prevSlide + 1) % destinations.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const scrollToFeaturedDestinations = () => {
    const featuredSection = document.getElementById('featured-destinations');
    if (featuredSection) {
      featuredSection.scrollIntoView({
        behavior: 'smooth'
      });
    }
  };

  const handleRegisterClick = () => {
    navigate('/register');
  };

  return (
    <section className="relative h-[600px] md:h-[650px] overflow-hidden">
      {/* Background Carousel */}
      {destinations.map((destination, index) => (
        <div key={destination.id} className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentSlide ? 'opacity-100' : 'opacity-0'}`}>
          <div className="absolute inset-0 bg-black/40 z-10"></div>
          <img src={destination.image} alt={destination.name} className="w-full h-full object-cover object-center" />
        </div>
      ))}

      {/* Hero Content */}
      <div className="relative z-20 h-full flex flex-col items-center justify-center text-white px-4">
        <div className="text-center max-w-3xl mx-auto animate-fade-in">
          <h1 className="text-3xl md:text-5xl font-bold mb-4 drop-shadow-lg">
            Jelajahi Pesona Wisata Indonesia dengan Mudah!
          </h1>
          <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto text-gray-100">
            Pesan tiket wisata favoritmu secara online, cetak tiket digital atau fisik, dan nikmati perjalananmu tanpa antri!
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button size="lg" onClick={scrollToFeaturedDestinations} className="text-white font-medium px-8 bg-secondary-DEFAULT">
              Jelajahi Destinasi
            </Button>
            <Button size="lg" onClick={handleRegisterClick} className="text-white font-medium px-8 bg-secondary-DEFAULT">
              Daftar Sekarang
            </Button>
          </div>

          {/* Search Toggle Button (Mobile) */}
          <div className="md:hidden">
            <Button variant="outline" className="border-white text-white hover:bg-white/20" onClick={() => setIsSearchVisible(!isSearchVisible)}>
              <Search className="h-4 w-4 mr-2" />
              Cari Destinasi
            </Button>
          </div>

          {/* Search Bar (Desktop) */}
          <div className="hidden md:block mt-8 w-full max-w-2xl mx-auto">
            <SearchBar />
          </div>

          {/* Search Bar (Mobile - Conditional) */}
          {isSearchVisible && (
            <div className="md:hidden mt-6 w-full animate-slide-in">
              <SearchBar />
            </div>
          )}
        </div>

        {/* Carousel Indicators */}
        <div className="absolute bottom-6 flex gap-2">
          {destinations.map((_, index) => (
            <button key={index} onClick={() => setCurrentSlide(index)} className={`h-2 rounded-full transition-all ${currentSlide === index ? 'w-8 bg-white' : 'w-2 bg-white/50'}`} aria-label={`Go to slide ${index + 1}`} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
