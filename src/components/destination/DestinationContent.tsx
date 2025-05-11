
import { 
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Info, Ticket, Star } from 'lucide-react';

import DestinationHeader from './DestinationHeader';
import InformationTab from './InformationTab';
import TicketTab from './TicketTab';
import ReviewsTab from './ReviewsTab';
import { DestinationType, TicketType } from '@/types/destination';

interface DestinationContentProps {
  destination: DestinationType;
  ticketTypes: TicketType[];
  isSaved: boolean;
  setIsSaved: (saved: boolean) => void;
  userId?: string;
  isAuthenticated: boolean;
  isAdmin?: boolean;
}

const DestinationContent = ({
  destination,
  ticketTypes,
  isSaved,
  setIsSaved,
  userId,
  isAuthenticated,
  isAdmin = false
}: DestinationContentProps) => {
  return (
    <>
      <DestinationHeader 
        destination={destination}
        isSaved={isSaved}
        setIsSaved={setIsSaved}
        userId={userId}
        isAuthenticated={isAuthenticated}
      />

      <Tabs defaultValue="informasi" className="w-full mb-6">
        <TabsList>
          <TabsTrigger value="informasi">
            <Info className="mr-2 h-4 w-4" />
            Informasi
          </TabsTrigger>
          <TabsTrigger value="tiket">
            <Ticket className="mr-2 h-4 w-4" />
            Tiket
          </TabsTrigger>
          <TabsTrigger value="ulasan">
            <Star className="mr-2 h-4 w-4" />
            Ulasan
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="informasi">
          <InformationTab destination={destination} />
        </TabsContent>

        <TabsContent value="tiket">
          {!isAdmin ? (
            <TicketTab 
              tickets={ticketTypes} 
              destinationId={destination.id}
              isAuthenticated={isAuthenticated}
            />
          ) : (
            <div className="p-6 bg-gray-50 rounded-md">
              <p className="text-gray-600">Admin tidak dapat membeli tiket.</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="ulasan">
          <ReviewsTab />
        </TabsContent>
      </Tabs>
    </>
  );
};

export default DestinationContent;
