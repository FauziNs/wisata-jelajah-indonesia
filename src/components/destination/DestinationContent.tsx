
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
}

const DestinationContent = ({
  destination,
  ticketTypes,
  isSaved,
  setIsSaved,
  userId,
  isAuthenticated
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
          <TicketTab 
            tickets={ticketTypes} 
            destinationId={destination.id}
            isAuthenticated={isAuthenticated}
          />
        </TabsContent>

        <TabsContent value="ulasan">
          <ReviewsTab />
        </TabsContent>
      </Tabs>
    </>
  );
};

export default DestinationContent;
