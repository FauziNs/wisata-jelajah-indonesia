
import { Card } from '@/components/ui/card';
import { Clock, Calendar, MapPin, ExternalLink } from 'lucide-react';
import { DestinationType } from '@/types/destination';

interface InformationTabProps {
  destination: DestinationType;
}

const InformationTab = ({ destination }: InformationTabProps) => {
  return (
    <div className="space-y-4">
      <Card>
        <div className="p-6">
          <h3 className="text-xl font-semibold mb-4">Deskripsi</h3>
          <p className="text-gray-700">{destination.description}</p>
        </div>
      </Card>

      <Card>
        <div className="p-6">
          <h3 className="text-xl font-semibold mb-4">Fasilitas</h3>
          <p className="text-gray-700">{destination.amenities || 'Tidak ada informasi fasilitas'}</p>
        </div>
      </Card>

      <Card>
        <div className="p-6">
          <h3 className="text-xl font-semibold mb-4">Jam Buka</h3>
          <div className="flex items-center text-gray-700 mb-2">
            <Clock className="mr-2 h-4 w-4" />
            {destination.operational_hours || 'Tidak ada informasi jam buka'}
          </div>
          <div className="flex items-center text-gray-700">
            <Calendar className="mr-2 h-4 w-4" />
            {destination.best_time_to_visit || 'Tidak ada informasi waktu terbaik untuk mengunjungi'}
          </div>
        </div>
      </Card>

      <Card>
        <div className="p-6">
          <h3 className="text-xl font-semibold mb-4">Lokasi</h3>
          <div className="flex items-center text-gray-700">
            <MapPin className="mr-2 h-4 w-4" />
            {destination.address || 'Tidak ada informasi alamat'}
          </div>
          {destination.google_maps_url && (
            <a
              href={destination.google_maps_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline flex items-center mt-2"
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              Lihat di Google Maps
            </a>
          )}
        </div>
      </Card>
    </div>
  );
};

export default InformationTab;
