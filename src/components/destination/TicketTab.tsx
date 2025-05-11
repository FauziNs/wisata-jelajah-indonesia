
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Users, Calendar } from 'lucide-react';
import { toast } from 'sonner';
import { TicketType } from '@/types/destination';

interface TicketTabProps {
  tickets: TicketType[];
  destinationId: string;
  isAuthenticated: boolean;
}

const TicketTab: React.FC<TicketTabProps> = ({
  tickets,
  destinationId,
  isAuthenticated
}) => {
  const navigate = useNavigate();
  const [selectedTicket, setSelectedTicket] = useState<string | null>(null);

  const handleBuyTicket = (ticketId: string) => {
    if (!isAuthenticated) {
      toast({
        title: "Login Diperlukan",
        description: "Silakan login terlebih dahulu untuk membeli tiket",
        variant: "default",
      });
      navigate('/login', { state: { from: `/destinasi/${destinationId}` } });
      return;
    }
    
    setSelectedTicket(ticketId);
    
    // Scroll to booking form
    const bookingFormElement = document.getElementById('booking-form');
    if (bookingFormElement) {
      bookingFormElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold mb-4">Tiket Tersedia</h3>
        {tickets && tickets.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {tickets.map((ticket) => (
              <Card key={ticket.id} className={`overflow-hidden transition-all ${
                selectedTicket === ticket.id ? 'border-primary ring-1 ring-primary' : ''
              }`}>
                <CardHeader className="bg-muted/30">
                  <CardTitle>{ticket.name}</CardTitle>
                  <CardDescription>{ticket.description}</CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <div className="flex items-center gap-2 text-gray-600">
                        <DollarSign className="h-4 w-4" />
                        <span>Harga</span>
                      </div>
                      <span className="font-medium text-primary">
                        Rp {ticket.price.toLocaleString('id-ID')}
                      </span>
                    </div>
                    
                    {ticket.capacity && (
                      <div className="flex justify-between">
                        <div className="flex items-center gap-2 text-gray-600">
                          <Users className="h-4 w-4" />
                          <span>Kapasitas</span>
                        </div>
                        <span>{ticket.capacity}</span>
                      </div>
                    )}
                    
                    {ticket.validity_duration && (
                      <div className="flex justify-between">
                        <div className="flex items-center gap-2 text-gray-600">
                          <Calendar className="h-4 w-4" />
                          <span>Masa Berlaku</span>
                        </div>
                        <span>{ticket.validity_duration} hari</span>
                      </div>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="px-6 py-4 bg-muted/20 flex justify-end">
                  <Button 
                    onClick={() => handleBuyTicket(ticket.id)}
                    size="sm"
                  >
                    Pilih Tiket
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="bg-muted/20 rounded-lg p-8 text-center">
            <p className="text-gray-500">Tidak ada tiket yang tersedia saat ini</p>
          </div>
        )}
      </div>
      
      <Card className="border-dashed">
        <CardHeader>
          <CardTitle className="text-lg">Informasi Pembelian Tiket</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p className="text-sm text-gray-600">
            • Tiket berlaku sesuai dengan tanggal kunjungan yang dipilih
          </p>
          <p className="text-sm text-gray-600">
            • Pembayaran dapat dilakukan melalui transfer bank atau e-wallet
          </p>
          <p className="text-sm text-gray-600">
            • Tiket akan dikirimkan melalui email setelah pembayaran berhasil
          </p>
          <p className="text-sm text-gray-600">
            • Untuk informasi lebih lanjut, silakan hubungi customer service kami
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default TicketTab;
