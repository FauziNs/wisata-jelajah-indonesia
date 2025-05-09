
import { Star, MapPin } from 'lucide-react';
import SaveButton from './SaveButton';

interface DestinationHeaderProps {
  destination: any;
  isSaved: boolean;
  setIsSaved: (saved: boolean) => void;
  userId?: string;
  isAuthenticated: boolean;
}

const DestinationHeader = ({ 
  destination, 
  isSaved, 
  setIsSaved, 
  userId, 
  isAuthenticated 
}: DestinationHeaderProps) => {
  return (
    <>
      <div className="relative">
        <img
          src={destination.image_url}
          alt={destination.name}
          className="w-full rounded-lg aspect-video object-cover mb-4"
        />
        <SaveButton 
          destinationId={destination.id} 
          isSaved={isSaved} 
          setIsSaved={setIsSaved}
          userId={userId}
          isAuthenticated={isAuthenticated} 
        />
      </div>

      <h1 className="text-3xl font-bold mb-2">{destination.name}</h1>
      <div className="flex items-center text-gray-600 mb-4">
        <MapPin className="mr-2 h-4 w-4" />
        {destination.location}
      </div>

      <div className="flex items-center mb-4">
        <Star className="mr-2 h-4 w-4 text-yellow-500" />
        <span className="font-medium">{destination.rating || 0}</span>
        <span className="text-gray-500 ml-1">({destination.reviews_count || 0} ulasan)</span>
      </div>
    </>
  );
};

export default DestinationHeader;
