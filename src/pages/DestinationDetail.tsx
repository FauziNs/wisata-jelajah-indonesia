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

      // First, try to fetch from Supabase if connected
      let destinationData = null;
      if (supabase) {
        try {
          const { data, error } = await supabase
            .from('destinations')
            .select('*')
            .eq('id', id)
            .single();

          if (data && !error) {
            destinationData = data;
            console.log("Destination data from Supabase:", destinationData);
          } else if (error) {
            console.error("Error fetching from Supabase:", error);
          }
        } catch (error) {
          console.error("Supabase fetch error:", error);
        }
      }

      // If we don't have data from Supabase, use dummy data
      if (!destinationData) {
        console.log("Using dummy data for destination");
        
        // Find destination in dummy data
        const dummyDestinations = [
          {
            id: 1,
            name: 'Pantai Kuta',
            location: 'Bali',
            image_url: 'https://images.unsplash.com/photo-1539367628448-4bc5c9d171c8',
            rating: 4.7,
            price: 'Rp 50.000',
            description: 'Pantai Kuta adalah salah satu pantai terkenal di Bali dengan ombak yang cocok untuk berselancar, pemandangan sunset yang menakjubkan, dan berbagai aktivitas menarik.',
            category: 'Pantai',
            slug: 'pantai-kuta',
            operational_hours: '08:00 - 18:00 (Setiap Hari)',
            amenities: 'Toilet, Tempat Parkir, Food Court, Penyewaan Papan Selancar',
            address: 'Jalan Pantai Kuta, Kuta, Badung, Bali'
          },
          {
            id: 2,
            name: 'Candi Borobudur',
            location: 'Jawa Tengah',
            image_url: 'https://images.unsplash.com/photo-1596402184320-417e7178b2cd',
            rating: 4.8,
            price: 'Rp 85.000',
            description: 'Candi Borobudur adalah candi Buddha terbesar di dunia yang dibangun pada abad ke-8. Merupakan salah satu warisan budaya Indonesia yang tercatat sebagai Warisan Dunia UNESCO.',
            category: 'Wisata Sejarah',
            slug: 'candi-borobudur',
            operational_hours: '06:00 - 17:00 (Setiap Hari)',
            amenities: 'Toilet, Tempat Parkir, Pemandu Wisata, Museum',
            address: 'Jalan Badrawati, Kec. Borobudur, Magelang, Jawa Tengah'
          }
        ];
        
        destinationData = dummyDestinations.find(dest => dest.id.toString() === id || dest.slug === id) ||
          dummyDestinations[0]; // Default to first destination if not found
      }
      
      setDestination(destinationData);

      // Attempt to fetch ticket data
      if (supabase) {
        try {
          const { data: ticketData, error: ticketError } = await supabase
            .from('ticket_types')
            .select('*')
            .eq('destination_id', id);

          if (!ticketError && ticketData) {
            setTicketTypes(ticketData);
          } else {
            console.log("Using dummy ticket data");
            setTicketTypes([
              {
                id: 1,
                name: 'Tiket Dewasa',
                price: 50000,
                description: 'Untuk pengunjung berusia 12 tahun ke atas',
                capacity: 'Tidak terbatas',
                validity_duration: '1'
              },
              {
                id: 2,
                name: 'Tiket Anak-anak',
                price: 25000,
                description: 'Untuk pengunjung berusia 5-11 tahun',
                capacity: 'Tidak terbatas',
                validity_duration: '1'
              }
            ]);
          }
        } catch (error) {
          console.error("Error fetching tickets:", error);
          // Fallback to dummy ticket data
          setTicketTypes([
            {
              id: 1,
              name: 'Tiket Dewasa',
              price: 50000,
              description: 'Untuk pengunjung berusia 12 tahun ke atas',
              capacity: 'Tidak terbatas',
              validity_duration: '1'
            },
            {
              id: 2,
              name: 'Tiket Anak-anak',
              price: 25000,
              description: 'Untuk pengunjung berusia 5-11 tahun',
              capacity: 'Tidak terbatas',
              validity_duration: '1'
            }
          ]);
        }
      } else {
        // Use dummy ticket data if no Supabase
        setTicketTypes([
          {
            id: 1,
            name: 'Tiket Dewasa',
            price: 50000,
            description: 'Untuk pengunjung berusia 12 tahun ke atas',
            capacity: 'Tidak terbatas',
            validity_duration: '1'
          },
          {
            id: 2,
            name: 'Tiket Anak-anak',
            price: 25000,
            description: 'Untuk pengunjung berusia 5-11 tahun',
            capacity: 'Tidak terbatas',
            validity_duration: '1'
          }
        ]);
      }
    } catch (error) {
      console.error('Error fetching destination details:', error);
      toast({
        title: "Error",
        description: "Gagal memuat detail destinasi",
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

  const handleBookTicket = (ticketId) => {
    if (!isAuthenticated) {
      toast({
        title: "Login Diperlukan",
        description: "Silakan login terlebih dahulu untuk memesan tiket",
        variant: "default"
      });
      navigate('/login', { state: { from: `/destinasi/${id}` } });
      return;
    }
    
    navigate(`/booking/${destination.id}?ticket_type=${ticketId}`);
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
                {ticketTypes && ticketTypes.length > 0 ? (
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
