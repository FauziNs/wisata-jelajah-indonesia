
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SearchBar from '@/components/SearchBar';
import DestinationCard from '@/components/DestinationCard';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Map, Grid, SlidersHorizontal, Mountain, Palmtree, Building, Utensils, Ticket } from 'lucide-react';

const dummyDestinations = [
  {
    id: 1,
    name: 'Pantai Kuta',
    location: 'Bali',
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    rating: 4.7,
    price: 'Rp 50.000',
    category: 'Pantai'
  },
  {
    id: 2,
    name: 'Gunung Bromo',
    location: 'Jawa Timur',
    image: 'https://images.unsplash.com/photo-1589308078059-be1415eab4c3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    rating: 4.9,
    price: 'Rp 120.000',
    category: 'Gunung'
  },
  {
    id: 3,
    name: 'Candi Borobudur',
    location: 'Jawa Tengah',
    image: 'https://images.unsplash.com/photo-1584810359583-96fc3448beaa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    rating: 4.8,
    price: 'Rp 75.000',
    category: 'Sejarah'
  },
  {
    id: 4,
    name: 'Raja Ampat',
    location: 'Papua Barat',
    image: 'https://images.unsplash.com/photo-1573790387438-4da905039392?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    rating: 5.0,
    price: 'Rp 500.000',
    category: 'Pantai'
  },
  {
    id: 5,
    name: 'Kawah Ijen',
    location: 'Jawa Timur',
    image: 'https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    rating: 4.6,
    price: 'Rp 150.000',
    category: 'Gunung'
  },
  {
    id: 6,
    name: 'Malioboro',
    location: 'Yogyakarta',
    image: 'https://images.unsplash.com/photo-1584810359583-96fc3448beaa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    rating: 4.5,
    price: 'Gratis',
    category: 'Budaya'
  }
];

const categories = [
  { name: 'Semua', icon: Grid, value: 'all' },
  { name: 'Pantai', icon: Palmtree, value: 'pantai' },
  { name: 'Gunung', icon: Mountain, value: 'gunung' },
  { name: 'Budaya', icon: Building, value: 'budaya' },
  { name: 'Kuliner', icon: Utensils, value: 'kuliner' },
  { name: 'Hiburan', icon: Ticket, value: 'hiburan' }
];

const Destinations = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [viewType, setViewType] = useState('grid');

  const filteredDestinations = activeCategory === 'all' 
    ? dummyDestinations 
    : dummyDestinations.filter(dest => 
        dest.category.toLowerCase() === activeCategory.toLowerCase()
      );

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="bg-primary/10 py-12">
        <div className="container-custom">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Jelajahi Destinasi Wisata</h1>
          <p className="text-lg text-gray-600 mb-8">
            Temukan beragam destinasi wisata menarik di seluruh Indonesia
          </p>
          
          <div className="mb-8">
            <SearchBar />
          </div>
        </div>
      </div>
      
      <div className="container-custom py-8">
        {/* Categories */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category.value}
                variant={activeCategory === category.value ? "default" : "outline"}
                className="flex items-center gap-2"
                onClick={() => setActiveCategory(category.value)}
              >
                <category.icon className="h-4 w-4" />
                {category.name}
              </Button>
            ))}
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setViewType('grid')}
              className={viewType === 'grid' ? 'bg-primary/10' : ''}
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setViewType('map')}
              className={viewType === 'map' ? 'bg-primary/10' : ''}
            >
              <Map className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon">
              <SlidersHorizontal className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {/* Destination Results */}
        {viewType === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDestinations.map((destination) => (
              <DestinationCard
                key={destination.id}
                {...destination}
              />
            ))}
          </div>
        ) : (
          <div className="bg-gray-100 rounded-lg p-8 text-center min-h-[500px] flex items-center justify-center">
            <div>
              <Map className="h-16 w-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-medium text-gray-700 mb-2">Tampilan Peta</h3>
              <p className="text-gray-500">Fitur tampilan peta akan segera hadir</p>
            </div>
          </div>
        )}
        
        {/* No results state */}
        {filteredDestinations.length === 0 && (
          <div className="text-center py-12">
            <p className="text-lg text-gray-500">Tidak ada hasil yang ditemukan</p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => setActiveCategory('all')}
            >
              Lihat Semua Destinasi
            </Button>
          </div>
        )}
        
        {/* Pagination - Simple version */}
        <div className="flex justify-center mt-12">
          <div className="flex gap-2">
            <Button variant="outline" disabled>Sebelumnya</Button>
            <Button variant="outline" className="bg-primary/10">1</Button>
            <Button variant="outline">2</Button>
            <Button variant="outline">3</Button>
            <Button variant="outline">Selanjutnya</Button>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Destinations;
