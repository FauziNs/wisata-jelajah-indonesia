
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import DestinationCard from './DestinationCard';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';

const destinations = [
  {
    id: 1,
    name: 'Pantai Kuta',
    location: 'Bali',
    image: 'https://images.unsplash.com/photo-1539367628448-4bc5c9d171c8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    rating: 4.5,
    price: 'Rp 50.000',
    category: 'Wisata Alam',
    slug: 'pantai-kuta'
  },
  {
    id: 2,
    name: 'Candi Borobudur',
    location: 'Magelang, Jawa Tengah',
    image: 'https://images.unsplash.com/photo-1596402184320-417e7178b2cd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    rating: 4.8,
    price: 'Rp 85.000',
    category: 'Wisata Sejarah',
    slug: 'candi-borobudur'
  },
  {
    id: 3,
    name: 'Raja Ampat',
    location: 'Papua Barat',
    image: 'https://images.unsplash.com/photo-1516690561799-46d8f74f9abf?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    rating: 4.9,
    price: 'Rp 250.000',
    category: 'Wisata Alam',
    slug: 'raja-ampat'
  },
  {
    id: 4,
    name: 'Gunung Bromo',
    location: 'Jawa Timur',
    image: 'https://images.unsplash.com/photo-1589311836499-19570037e9ed?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    rating: 4.7,
    price: 'Rp 120.000',
    category: 'Wisata Alam',
    slug: 'gunung-bromo'
  },
  {
    id: 5,
    name: 'Taman Mini Indonesia Indah',
    location: 'Jakarta',
    image: 'https://images.unsplash.com/photo-1584810359583-96fc3448beaa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    rating: 4.3,
    price: 'Rp 25.000',
    category: 'Wisata Budaya',
    slug: 'taman-mini-indonesia-indah'
  },
  {
    id: 6,
    name: 'Kawah Putih',
    location: 'Bandung, Jawa Barat',
    image: 'https://images.unsplash.com/photo-1587135941948-670b381f08ce?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    rating: 4.6,
    price: 'Rp 75.000',
    category: 'Wisata Alam',
    slug: 'kawah-putih'
  },
  {
    id: 7,
    name: 'Malioboro',
    location: 'Yogyakarta',
    image: 'https://images.unsplash.com/photo-1584810359583-96fc3448beaa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    rating: 4.4,
    price: 'Gratis',
    category: 'Wisata Budaya',
    slug: 'malioboro'
  },
  {
    id: 8,
    name: 'Taman Nasional Komodo',
    location: 'Nusa Tenggara Timur',
    image: 'https://images.unsplash.com/photo-1518709766631-a6a7f45921c3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    rating: 4.8,
    price: 'Rp 150.000',
    category: 'Wisata Alam',
    slug: 'taman-nasional-komodo'
  }
];

const categories = ["Semua", "Wisata Alam", "Wisata Budaya", "Wisata Sejarah", "Wisata Hiburan"];

const FeaturedDestinations = () => {
  const [activeCategory, setActiveCategory] = useState("Semua");
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();

  const filteredDestinations = activeCategory === "Semua" 
    ? destinations 
    : destinations.filter(dest => dest.category === activeCategory);
    
  const handleViewAllClick = () => {
    navigate('/destinasi');
  };

  const handleDestinationClick = (slug: string | number) => {
    if (!isAuthenticated) {
      toast({
        title: "Login Diperlukan",
        description: "Silakan login terlebih dahulu untuk melihat detail destinasi",
        variant: "default"
      });
      navigate('/login', { state: { from: `/destinasi/${slug}` } });
      return;
    }
    
    navigate(`/destinasi/${slug}`);
  };

  return (
    <section id="featured-destinations" className="py-12 bg-gray-50">
      <div className="container-custom">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">Destinasi Unggulan</h2>
            <p className="text-gray-600">Temukan tempat wisata populer di seluruh Indonesia</p>
          </div>
          <div className="flex mt-4 md:mt-0 space-x-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
            {categories.map((category) => (
              <button
                key={category}
                className={`px-4 py-2 text-sm rounded-full whitespace-nowrap transition-colors ${
                  activeCategory === category
                    ? "bg-primary text-white"
                    : "bg-white text-gray-700 hover:bg-gray-100"
                }`}
                onClick={() => setActiveCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredDestinations.map((destination) => (
            <DestinationCard 
              key={destination.id} 
              {...destination} 
            />
          ))}
        </div>

        <div className="mt-10 text-center">
          <Button 
            variant="outline" 
            className="text-primary border-primary hover:bg-primary/5"
            onClick={handleViewAllClick}
          >
            Lihat Semua Destinasi
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedDestinations;
