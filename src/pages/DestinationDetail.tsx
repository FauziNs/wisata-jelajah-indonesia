import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Star, 
  User, 
  Info, 
  DollarSign, 
  Heart, 
  ExternalLink,
  Ticket,
  CheckCircle 
} from 'lucide-react';

const DestinationDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const { toast } = useToast();

  const [destination, setDestination] = useState(null);
  const [ticketTypes, setTicketTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (!id) {
      navigate('/destinasi');
      return;
    }

    fetchData();
    if (isAuthenticated && user) {
      checkIfSaved();
    }
  }, [id, isAuthenticated, user, navigate]);

  const fetchData = async () => {
    try {
      setLoading(true);
      console.log("Fetching destination with ID:", id);

      const { data: destinationData, error: destinationError } = await supabase
        .from('destinations')
        .select('*')
        .eq('id', id)
        .single();

      if (destinationError) {
        console.error("Error fetching destination:", destinationError);
        throw destinationError;
      }
      
      console.log("Destination data:", destinationData);
      setDestination(destinationData);

      const { data: ticketData, error: ticketError } = await supabase
        .from('ticket_types')
        .select('*')
        .eq('destination_id', id);

      if (ticketError) {
        console.error("Error fetching tickets:", ticketError);
        throw ticketError;
      }
      
      console.log("Ticket data:", ticketData);
      setTicketTypes(ticketData);
    } catch (error) {
      console.error('Error fetching destination details:', error);
      toast({
        title: "Error",
        description: "Failed to load destination details",
        variant: "destructive"
      });
      navigate('/destinasi');
    } finally {
      setLoading(false);
    }
  };

  // Check if destination is saved
  const checkIfSaved = async () => {
    if (!isAuthenticated || !user) {
      setIsSaved(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('saved_destinations')
        .select('id')
        .eq('user_id', user.id)
        .eq('destination_id', id);

      if (error) {
        console.error("Error checking saved status:", error);
        return;
      }

      setIsSaved(data && data.length > 0);
    } catch (error) {
      console.error("Error checking saved status:", error);
    }
  };

  // Toggle saved status
  const toggleSaveDestination = async () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/destinasi/${id}` } });
      return;
    }

    try {
      if (isSaved) {
        // Find the saved record to delete
        const { data: savedData, error: findError } = await supabase
          .from('saved_destinations')
          .select('id')
          .eq('user_id', user.id)
          .eq('destination_id', id);

        if (findError) throw findError;
        
        if (savedData && savedData.length > 0) {
          // Delete using the found ID
          const { error: deleteError } = await supabase
            .from('saved_destinations')
            .delete()
            .eq('id', savedData[0].id);

          if (deleteError) throw deleteError;
          
          setIsSaved(false);
          toast({
            title: "Berhasil",
            description: "Destinasi dihapus dari daftar tersimpan",
            variant: "default"
          });
        }
      } else {
        // Insert new saved destination
        const { error: insertError } = await supabase
          .from('saved_destinations')
          .insert({
            user_id: user.id,
            destination_id: id
          });

        if (insertError) throw insertError;
        
        setIsSaved(true);
        toast({
          title: "Berhasil",
          description: "Destinasi ditambahkan ke daftar tersimpan",
          variant: "default"
        });
      }
    } catch (error) {
      console.error("Error toggling saved status:", error);
      toast({
        title: "Error",
        description: "Gagal mengubah status simpan",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!destination) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="container-custom py-8 flex-grow">
          <div className="text-center py-12">
            <h3 className="text-xl font-medium text-gray-700 mb-2">Destinasi tidak ditemukan</h3>
            <p className="text-gray-500 mb-6">Destinasi yang Anda cari tidak ditemukan</p>
            <Button onClick={() => navigate('/destinasi')}>
              Jelajahi Destinasi Lain
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="container-custom py-8 flex-grow">
        {destination && (
          <>
            <div className="relative">
              <img
                src={destination.image_url}
                alt={destination.name}
                className="w-full rounded-lg aspect-video object-cover mb-4"
              />
              <Button
                variant="secondary"
                className="absolute top-2 right-2"
                onClick={toggleSaveDestination}
              >
                {isSaved ? (
                  <>
                    <Heart className="mr-2 h-4 w-4 fill-red-500 text-red-500" />
                    Disimpan
                  </>
                ) : (
                  <>
                    <Heart className="mr-2 h-4 w-4" />
                    Simpan
                  </>
                )}
              </Button>
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
              <TabsContent value="informasi" className="space-y-4">
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
              </TabsContent>

              <TabsContent value="tiket" className="space-y-4">
                {ticketTypes.length > 0 ? (
                  <Accordion type="single" collapsible>
                    {ticketTypes.map((ticket) => (
                      <AccordionItem key={ticket.id} value={ticket.id.toString()}>
                        <AccordionTrigger>
                          <div className="flex justify-between w-full">
                            <div className="flex items-center">
                              <Ticket className="mr-2 h-4 w-4" />
                              {ticket.name}
                            </div>
                            <div className="font-medium">
                              <DollarSign className="mr-2 h-4 w-4 inline-block" />
                              Rp {ticket.price.toLocaleString('id-ID')}
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
                              onClick={() => navigate(`/booking/${destination.id}?ticket_type=${ticket.id}`)}
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
              </TabsContent>

              <TabsContent value="ulasan">
                <Card>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-4">Ulasan</h3>
                    <p className="text-gray-700">Belum ada ulasan untuk destinasi ini.</p>
                  </div>
                </Card>
              </TabsContent>
            </Tabs>
          </>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default DestinationDetail;
