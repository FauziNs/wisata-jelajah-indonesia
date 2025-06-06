
import { useState } from 'react';
import { Star, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface DestinationCardProps {
  id: string | number;  // Allow both string and number IDs
  name: string;
  location: string;
  image: string;
  rating: number;
  price: string;
  category: string;
  slug?: string;
  onClick?: () => void;
}

const DestinationCard = ({
  id,
  name,
  location,
  image,
  rating,
  price,
  category,
  slug,
  onClick
}: DestinationCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      // Allow basic card click for all users
      const destinationPath = slug ? `/destinasi/${slug}` : `/destinasi/${id}`;
      navigate(destinationPath);
    }
  };

  const handleDetailClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent the card's onClick from firing
    
    if (!isAuthenticated) {
      toast({
        title: "Login Diperlukan",
        description: "Silakan login terlebih dahulu untuk melihat detail destinasi",
        variant: "default"
      });
      navigate('/login', { state: { from: slug ? `/destinasi/${slug}` : `/destinasi/${id}` } });
      return;
    }

    // User is authenticated, navigate to destination detail
    const destinationPath = slug ? `/destinasi/${slug}` : `/destinasi/${id}`;
    navigate(destinationPath);
  };

  return (
    <div
      className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
    >
      {/* Image Container */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={image}
          alt={name}
          className={`w-full h-full object-cover transition-transform duration-700 ${
            isHovered ? 'scale-110' : 'scale-100'
          }`}
        />
        <div className="absolute top-3 left-3 bg-accent/90 text-white text-xs font-medium py-1 px-2 rounded">
          {category}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-semibold text-lg leading-tight mb-1">{name}</h3>
            <div className="flex items-center text-sm text-gray-600 mb-2">
              <MapPin className="h-3.5 w-3.5 mr-1" />
              <span>{location}</span>
            </div>
          </div>
        </div>

        {/* Rating */}
        <div className="flex items-center mb-3">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`h-4 w-4 ${
                i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
              }`}
            />
          ))}
          <span className="ml-1 text-sm text-gray-600">{rating.toFixed(1)}</span>
        </div>

        {/* Price and CTA */}
        <div className="flex items-center justify-between mt-3">
          <div>
            <p className="text-xs text-gray-500">Mulai dari</p>
            <p className="font-semibold text-primary">{price}</p>
          </div>
          <button 
            className="bg-secondary hover:bg-secondary/90 text-white text-sm py-1.5 px-3 rounded transition-colors"
            onClick={handleDetailClick}
          >
            Lihat Detail
          </button>
        </div>
      </div>
    </div>
  );
};

export default DestinationCard;
