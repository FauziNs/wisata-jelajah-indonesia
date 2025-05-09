
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DollarSign, Ticket, User, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface TicketTabProps {
  tickets: any[];
  destinationId: string | number;
  isAuthenticated: boolean;
}

const TicketTab = ({ tickets, destinationId, isAuthenticated }: TicketTabProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleBookTicket = (ticketId: string | number) => {
    if (!isAuthenticated) {
      toast({
        title: "Login Diperlukan",
        description: "Silakan login terlebih dahulu untuk memesan tiket",
        variant: "default"
      });
      navigate('/login', { state: { from: `/destinasi/${destinationId}` } });
      return;
    }
    
    navigate(`/booking/${destinationId}?ticket_type=${ticketId}`);
  };

  return (
    <div className="space-y-4">
      {tickets && tickets.length > 0 ? (
        <Accordion type="single" collapsible>
          {tickets.map((ticket) => (
            <AccordionItem key={ticket.id} value={ticket.id.toString()}>
              <AccordionTrigger>
                <div className="flex justify-between w-full">
                  <div className="flex items-center">
                    <Ticket className="mr-2 h-4 w-4" />
                    {ticket.name}
                  </div>
                  <div className="font-medium">
                    <DollarSign className="mr-2 h-4 w-4 inline-block" />
                    Rp {typeof ticket.price === 'number' ? 
                          ticket.price.toLocaleString('id-ID') : 
                          ticket.price}
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="py-4">
                  <p className="text-gray-700 mb-2">{ticket.description}</p>
                  <div className="flex items-center text-gray-700 mb-2">
                    <User className="mr-2 h-4 w-4" />
                    Kapasitas: {ticket.capacity || 'Tidak terbatas'} orang
                  </div>
                  <div className="flex items-center text-gray-700 mb-2">
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Validitas: {ticket.validity_duration || '1'} hari
                  </div>
                  <Button 
                    onClick={() => handleBookTicket(ticket.id)}
                    className="bg-primary hover:bg-primary/90"
                  >
                    Pesan Sekarang
                  </Button>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      ) : (
        <Card>
          <div className="p-6">
            <h3 className="text-xl font-semibold mb-4">Tiket</h3>
            <p className="text-gray-700">Tidak ada tiket tersedia untuk destinasi ini.</p>
          </div>
        </Card>
      )}
    </div>
  );
};

export default TicketTab;
