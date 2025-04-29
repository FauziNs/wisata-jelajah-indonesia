
import { useState } from 'react';
import { Search, Calendar, Sliders } from 'lucide-react';
import { Button } from '@/components/ui/button';

const SearchBar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Searching for:', searchQuery);
    // Implement search functionality
  };

  return (
    <form onSubmit={handleSubmit} className="w-full bg-white rounded-lg shadow-lg p-1">
      <div className="flex flex-col md:flex-row">
        <div className="relative flex-grow">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Cari destinasi wisata..."
            className="w-full py-3 pl-10 pr-3 text-gray-700 bg-transparent border-0 focus:outline-none focus:ring-0"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="hidden md:flex items-center px-3 border-l border-gray-200">
          <Calendar className="h-5 w-5 text-gray-400 mr-2" />
          <select 
            className="bg-transparent border-0 text-gray-700 focus:outline-none focus:ring-0 pr-8 appearance-none cursor-pointer"
            defaultValue=""
          >
            <option value="" disabled>Pilih Tanggal</option>
            <option value="today">Hari Ini</option>
            <option value="tomorrow">Besok</option>
            <option value="weekend">Akhir Pekan</option>
            <option value="custom">Tanggal Lain</option>
          </select>
        </div>

        <div className="hidden md:flex items-center px-3 border-l border-gray-200">
          <Sliders className="h-5 w-5 text-gray-400 mr-2" />
          <select 
            className="bg-transparent border-0 text-gray-700 focus:outline-none focus:ring-0 pr-8 appearance-none cursor-pointer"
            defaultValue=""
          >
            <option value="" disabled>Filter</option>
            <option value="alam">Wisata Alam</option>
            <option value="budaya">Wisata Budaya</option>
            <option value="sejarah">Wisata Sejarah</option>
            <option value="hiburan">Wisata Hiburan</option>
          </select>
        </div>

        <Button 
          type="submit" 
          className="mt-2 md:mt-0 md:ml-2 bg-primary hover:bg-primary/90 text-white"
        >
          Cari
        </Button>
      </div>
    </form>
  );
};

export default SearchBar;
