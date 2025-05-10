
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
import { DollarSign, Ticket, User, CheckCircle, ShoppingCart } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export interface TicketType {
  id: string;
  name: string;
  price: number;
  description?: string;
  capacity?: string;
  validity_duration?: string;
}

interface TicketTabProps {
  tickets: TicketType[];
  destinationId: string;
  isAuthenticated: boolean;
}

const TicketTab = ({ tickets, destinationId, isAuthenticated }: TicketTabProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedTicket, setSelectedTicket] = useState<TicketType | null>(null);
  const [quantity, setQuantity] = useState(1);

  const handleBookTicket = (ticketId: string) => {
    if (!isAuthenticated) {
      toast({
        title: "Login Diperlukan",
        description: "Silakan login terlebih dahulu untuk memesan tiket",
        variant: "default"
      });
      navigate('/login', { state: { from: `/destinasi/${destinationId}` } });
      return;
    }
    
    navigate(`/booking/${destinationId}?ticket_type=${ticketId}&quantity=${quantity}`);
  };

  const handleTicketSelect = (ticket: TicketType) => {
    setSelectedTicket(ticket === selectedTicket ? null : ticket);
  };

  const incrementQuantity = () => {
    setQuantity(prevQuantity => prevQuantity + 1);
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(prevQuantity => prevQuantity - 1);
    }
  };

  return (
    <div className="space-y-4">
      {tickets && tickets.length > 0 ? (
        <>
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
                    <p className="text-gray-700 mb-4">{ticket.description}</p>
                    <div className="flex items-center text-gray-700 mb-2">
                      <User className="mr-2 h-4 w-4" />
                      <span>Kapasitas: {ticket.capacity || 'Tidak terbatas'} orang</span>
                    </div>
                    <div className="flex items-center text-gray-700 mb-4">
                      <CheckCircle className="mr-2 h-4 w-4" />
                      <span>Validitas: {ticket.validity_duration || '1'} hari</span>
                    </div>
                    
                    <div className="flex items-center space-x-4 my-4">
                      <label htmlFor={`quantity-${ticket.id}`} className="font-medium text-gray-700">Jumlah:</label>
                      <div className="flex items-center">
                        <button 
                          type="button" 
                          onClick={decrementQuantity}
                          className="bg-gray-200 px-3 py-1 rounded-l"
                          disabled={quantity <= 1}
                        >
                          -
                        </button>
                        <input 
                          id={`quantity-${ticket.id}`}
                          type="number" 
                          min="1" 
                          value={quantity} 
                          onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                          className="w-12 text-center border-y py-1"
                        />
                        <button 
                          type="button" 
                          onClick={incrementQuantity}
                          className="bg-gray-200 px-3 py-1 rounded-r"
                        >
                          +
                        </button>
                      </div>
                    </div>
                    
                    <Button 
                      onClick={() => handleBookTicket(ticket.id)}
                      className="bg-primary hover:bg-primary/90 flex items-center gap-2"
                    >
                      <ShoppingCart className="h-4 w-4" />
                      Pesan Sekarang
                    </Button>

                    <div className="mt-4 text-sm text-gray-500">
                      <p>* Harga sudah termasuk pajak dan biaya layanan</p>
                      <p>* Pembayaran dapat dilakukan melalui kartu kredit, transfer bank, atau e-wallet</p>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          {/* Payment Info */}
          <div className="bg-gray-50 p-4 rounded-lg mt-6">
            <h4 className="font-medium mb-2">Informasi Pembayaran:</h4>
            <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
              <li>Pembayaran menggunakan Stripe (kartu kredit/debit)</li>
              <li>Tiket akan dikirim ke email setelah pembayaran berhasil</li>
              <li>Kebijakan pembatalan berlaku sesuai ketentuan</li>
            </ul>
          </div>
        </>
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
