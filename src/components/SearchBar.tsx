
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Calendar, Sliders } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

const popularDestinations = [
  'Bali', 'Bandung', 'Jakarta', 'Yogyakarta', 'Surabaya',
  'Malang', 'Raja Ampat', 'Lombok', 'Semarang', 'Medan'
];

const categoryOptions = [
  { value: '', label: 'Semua Kategori' },
  { value: 'alam', label: 'Wisata Alam' },
  { value: 'budaya', label: 'Wisata Budaya' },
  { value: 'sejarah', label: 'Wisata Sejarah' },
  { value: 'hiburan', label: 'Wisata Hiburan' }
];

const SearchBar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const navigate = useNavigate();
  
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setSuggestions([]);
      return;
    }
    
    const filteredSuggestions = popularDestinations.filter(dest => 
      dest.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setSuggestions(filteredSuggestions);
  }, [searchQuery]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const params = new URLSearchParams();
    if (searchQuery) params.set('q', searchQuery);
    if (selectedCategory) params.set('category', selectedCategory);
    if (selectedDate) params.set('date', format(selectedDate, 'yyyy-MM-dd'));
    
    navigate(`/destinasi?${params.toString()}`);
    
    console.log('Search parameters:', {
      query: searchQuery,
      date: selectedDate ? format(selectedDate, 'PPP', { locale: id }) : 'Not selected',
      category: selectedCategory || 'All categories'
    });
  };
  
  const handleSuggestionClick = (suggestion: string) => {
    setSearchQuery(suggestion);
    setShowSuggestions(false);
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
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          />
          
          {/* Search suggestions */}
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg">
              <ul>
                {suggestions.map((suggestion, index) => (
                  <li 
                    key={index}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-gray-700"
                    onClick={() => handleSuggestionClick(suggestion)}
                  >
                    {suggestion}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="hidden md:flex items-center px-3 border-l border-gray-200">
          <Popover>
            <PopoverTrigger asChild>
              <button 
                type="button"
                className="flex items-center gap-2 bg-transparent border-0 text-gray-700 focus:outline-none focus:ring-0 cursor-pointer"
              >
                <Calendar className="h-5 w-5 text-gray-400" />
                {selectedDate ? (
                  <span className="text-gray-700">
                    {format(selectedDate, 'dd MMM yyyy', { locale: id })}
                  </span>
                ) : (
                  <span className="text-gray-500">Pilih Tanggal</span>
                )}
              </button>
            </PopoverTrigger>
            <PopoverContent className="p-0 w-auto">
              <CalendarComponent
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                disabled={(date) => date < new Date()}
                initialFocus
                className="p-3 pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="hidden md:flex items-center px-3 border-l border-gray-200">
          <Sliders className="h-5 w-5 text-gray-400 mr-2" />
          <select 
            className="bg-transparent border-0 text-gray-700 focus:outline-none focus:ring-0 pr-8 appearance-none cursor-pointer"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {categoryOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
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
