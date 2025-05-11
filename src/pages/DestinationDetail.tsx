
import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import {
  MapPin,
  Calendar,
  Clock,
  Star,
  Phone,
  Mail,
  DollarSign,
  ChevronRight,
  Ticket,
  Loader2,
  Users,
  CalendarCheck,
  Info,
  CheckCircle
} from 'lucide-react';

import { 
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';

import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardFooter 
} from '@/components/ui/card';

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DestinationType, TicketType } from '@/types/destination';
import TicketTab from '@/components/destination/TicketTab';
import DestinationContent from '@/components/destination/DestinationContent';

const DestinationDetail = () => {
  const { id, slug } = useParams<{ id?: string; slug?: string }>();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const { toast } = useToast();
  
  const [destination, setDestination] = useState<DestinationType | null>(null);
  const [ticketTypes, setTicketTypes] = useState<TicketType[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<TicketType | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [visitDate, setVisitDate] = useState(getTomorrowDate());
  const [visitorName, setVisitorName] = useState('');
  const [visitorEmail, setVisitorEmail] = useState('');
  const [visitorPhone, setVisitorPhone] = useState('');
  const [specialRequests, setSpecialRequests] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  // Get tomorrow's date in YYYY-MM-DD format for default visit date
  function getTomorrowDate() {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  }

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!isAuthenticated) {
      toast({
        title: "Login Diperlukan",
        description: "Silakan login terlebih dahulu untuk melihat detail destinasi",
        variant: "default"
      });
      navigate('/login', { state: { from: `/destinasi/${id || slug}` } });
      return;
    }

    const identifier = id || slug;
    if (!identifier) {
      navigate('/destinasi');
      return;
    }

    // Set visitor info from user data if available
    if (user) {
      if (user.email) setVisitorEmail(user.email);
      if (user.user_metadata?.full_name) setVisitorName(user.user_metadata.full_name);
      if (user.user_metadata?.phone) setVisitorPhone(user.user_metadata.phone);
      
      // Check if user is admin
      checkUserRole();
    }

    fetchDestinationData(identifier);
  }, [id, slug, isAuthenticated, user, navigate, toast]);

  // Check if the user is an admin
  const checkUserRole = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user?.id)
        .single();
        
      if (!error && data && data.role === 'admin') {
        setIsAdmin(true);
      }
    } catch (error) {
      console.error("Error checking user role:", error);
    }
  };

  const fetchDestinationData = async (identifier: string) => {
    try {
      setLoading(true);
      console.log("Fetching destination with identifier:", identifier);

      // Try to fetch by id first
      let { data, error } = await supabase
        .from('destinations')
        .select('*')
        .eq('id', identifier)
        .maybeSingle();
      
      // If not found by ID, try to find by slug if the identifier could be a slug
      if (!data && !error) {
        const { data: slugData, error: slugError } = await supabase
          .from('destinations')
          .select('*')
          .eq('slug', identifier)
          .maybeSingle();
          
        if (slugData && !slugError) {
          data = slugData;
        }
      }

      if (data) {
        console.log("Found destination:", data);
        // Create a properly typed destination object
        const typedDestination: DestinationType = {
          id: data.id,
          name: data.name,
          location: data.location,
          description: data.description,
          amenities: data.amenities || undefined,
          address: data.address || undefined,
          operational_hours: data.operational_hours || undefined,
          best_time_to_visit: data.best_time_to_visit || undefined,
          google_maps_url: data.google_maps_url || undefined,
          image_url: data.image_url || undefined,
          price: data.price || 0,
          category: data.category || undefined,
          rating: data.rating || undefined,
          long_description: data.long_description || undefined,
          full_location: data.full_location || undefined,
          reviews_count: data.reviews_count || undefined,
          slug: data.slug || undefined,
          created_at: data.created_at || undefined,
          updated_at: data.updated_at || undefined
        };
        
        setDestination(typedDestination);
        
        // Fetch ticket types
        const { data: ticketData, error: ticketError } = await supabase
          .from('ticket_types')
          .select('*')
          .eq('destination_id', data.id);

        if (!ticketError && ticketData && ticketData.length > 0) {
          console.log("Found tickets:", ticketData);
          // Create properly typed ticket objects
          const typedTickets: TicketType[] = ticketData.map(ticket => ({
            id: ticket.id,
            name: ticket.name,
            price: typeof ticket.price === 'number' ? ticket.price : 0,
            description: ticket.description || undefined,
            capacity: ticket.capacity || undefined,
            validity_duration: ticket.validity_duration || undefined,
            destination_id: ticket.destination_id || data.id,
            created_at: ticket.created_at || undefined,
            updated_at: ticket.updated_at || undefined
          }));
          
          setTicketTypes(typedTickets);
          setSelectedTicket(typedTickets[0]); // Select first ticket by default
        } else {
          // If no tickets found, create a default one based on destination price
          const defaultTicket: TicketType = {
            id: 'default',
            name: 'Tiket Masuk',
            price: typeof typedDestination.price === 'number' ? typedDestination.price : 50000,
            description: 'Tiket masuk untuk mengunjungi destinasi',
            destination_id: data.id,
            capacity: 'Tidak terbatas',
            validity_duration: '1'
          };
          
          setTicketTypes([defaultTicket]);
          setSelectedTicket(defaultTicket);
        }

        // Check if destination is saved
        if (isAuthenticated && user) {
          const { data: savedData } = await supabase
            .from('saved_destinations')
            .select('id')
            .eq('user_id', user.id)
            .eq('destination_id', data.id)
            .maybeSingle();
            
          setIsSaved(!!savedData);
        }
      } else {
        console.log("Destination not found, using dummy data");
        // If no destination found, use dummy data
        const dummyData: DestinationType = {
          id: identifier,
          name: 'Pantai Kuta',
          location: 'Bali',
          image_url: 'https://images.unsplash.com/photo-1539367628448-4bc5c9d171c8',
          price: 50000,
          description: 'Pantai Kuta adalah salah satu pantai terkenal di Bali dengan ombak yang cocok untuk berselancar, pemandangan sunset yang menakjubkan, dan berbagai aktivitas menarik.',
          category: 'Pantai',
          rating: 4.7,
          operational_hours: '08:00 - 18:00 (Setiap Hari)',
          amenities: 'Toilet, Tempat Parkir, Food Court, Penyewaan Papan Selancar',
          address: 'Jalan Pantai Kuta, Kuta, Badung, Bali'
        };
        
        setDestination(dummyData);
        
        // Set dummy ticket types
        const dummyTickets: TicketType[] = [
          {
            id: '1',
            name: 'Tiket Dewasa',
            price: dummyData.price || 50000,
            description: 'Untuk pengunjung berusia 12 tahun ke atas',
            capacity: 'Tidak terbatas',
            validity_duration: '1'
          },
          {
            id: '2',
            name: 'Tiket Anak-anak',
            price: (dummyData.price || 50000) / 2,
            description: 'Untuk pengunjung berusia 5-11 tahun',
            capacity: 'Tidak terbatas',
            validity_duration: '1'
          }
        ];
        
        setTicketTypes(dummyTickets);
        setSelectedTicket(dummyTickets[0]);
      }
    } catch (error) {
      console.error("Error fetching destination details:", error);
      toast({
        title: "Error",
        description: "Gagal memuat detail destinasi",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveDestination = async () => {
    if (!isAuthenticated) {
      toast({
        title: "Login Diperlukan",
        description: "Silakan login terlebih dahulu untuk menyimpan destinasi",
        variant: "default"
      });
      navigate('/login', { state: { from: `/destinasi/${id || slug}` } });
      return;
    }

    try {
      if (isSaved) {
        // Delete from saved destinations
        await supabase
          .from('saved_destinations')
          .delete()
          .eq('user_id', user.id)
          .eq('destination_id', destination?.id);
          
        setIsSaved(false);
        toast({
          title: "Berhasil dihapus",
          description: `${destination?.name} telah dihapus dari destinasi tersimpan`,
        });
      } else {
        // Add to saved destinations
        await supabase
          .from('saved_destinations')
          .insert({
            user_id: user.id,
            destination_id: destination?.id
          });
          
        setIsSaved(true);
        toast({
          title: "Berhasil disimpan",
          description: `${destination?.name} telah ditambahkan ke destinasi tersimpan`,
        });
      }
    } catch (error) {
      console.error("Error toggling saved destination:", error);
      toast({
        title: "Error",
        description: "Gagal menyimpan/menghapus destinasi",
        variant: "destructive"
      });
    }
  };

  const handleTicketSelect = (ticket: TicketType) => {
    setSelectedTicket(ticket);
  };

  const incrementQuantity = () => {
    setQuantity(prevQuantity => prevQuantity + 1);
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(prevQuantity => prevQuantity - 1);
    }
  };

  const handleBookTicket = async () => {
    if (!isAuthenticated) {
      toast({
        title: "Login Diperlukan",
        description: "Silakan login terlebih dahulu untuk memesan tiket",
        variant: "default"
      });
      navigate('/login', { state: { from: `/destinasi/${id || slug}` } });
      return;
    }

    if (isAdmin) {
      toast({
        title: "Tidak Diizinkan",
        description: "Admin tidak dapat membeli tiket",
        variant: "destructive"
      });
      return;
    }

    if (!selectedTicket) {
      toast({
        title: "Tiket tidak dipilih",
        description: "Silakan pilih jenis tiket terlebih dahulu",
        variant: "destructive"
      });
      return;
    }

    if (!visitDate) {
      toast({
        title: "Tanggal kunjungan tidak dipilih",
        description: "Silakan pilih tanggal kunjungan",
        variant: "destructive"
      });
      return;
    }

    if (!visitorName || !visitorEmail) {
      toast({
        title: "Data tidak lengkap",
        description: "Nama dan email pengunjung wajib diisi",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      if (!destination || !destination.id) {
        throw new Error("Data destinasi tidak valid");
      }
      
      // Create booking number
      const bookingNumber = `BK-${Date.now().toString().slice(-8)}`;
      
      // Create booking record in database
      const { data: booking, error: bookingError } = await supabase
        .from('bookings')
        .insert({
          booking_number: bookingNumber,
          user_id: user?.id,
          destination_id: destination.id,
          ticket_type_id: selectedTicket.id,
          visitor_name: visitorName,
          visitor_email: visitorEmail,
          visitor_phone: visitorPhone,
          visit_date: visitDate,
          quantity: quantity,
          total_price: selectedTicket.price * quantity,
          special_requests: specialRequests,
          status: 'pending',
          payment_status: 'unpaid'
        })
        .select()
        .single();
        
      if (bookingError) {
        throw bookingError;
      }
      
      console.log("Booking created:", booking);
      
      // Call Stripe checkout function
      const { data: sessionData, error: sessionError } = await supabase.functions.invoke('create-checkout', {
        body: {
          bookingId: booking.id,
          amount: selectedTicket.price * quantity,
          destinationName: destination.name,
          ticketName: selectedTicket.name,
          quantity: quantity,
          visitDate: visitDate,
          visitorName: visitorName,
          bookingNumber: bookingNumber
        }
      });

      if (sessionError) {
        console.error("Session error:", sessionError);
        throw new Error(sessionError.message || "Unknown error occurred");
      }

      console.log("Stripe session created:", sessionData);
      
      if (sessionData && sessionData.sessionUrl) {
        // Redirect to Stripe checkout
        window.location.href = sessionData.sessionUrl;
      } else {
        throw new Error("Tidak dapat membuat sesi pembayaran");
      }
    } catch (error) {
      console.error("Error creating checkout session:", error);
      toast({
        title: "Error",
        description: `Gagal membuat sesi pembayaran: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow flex flex-col items-center justify-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
          <p className="text-gray-600">Memuat detail destinasi...</p>
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

  // Calculate total price
  const totalPrice = selectedTicket ? selectedTicket.price * quantity : 0;
  const formattedTotalPrice = totalPrice.toLocaleString('id-ID');

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="container-custom py-8 flex-grow">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Destination Details */}
          <div className="lg:col-span-2">
            <DestinationContent 
              destination={destination}
              ticketTypes={ticketTypes}
              isSaved={isSaved}
              setIsSaved={setIsSaved}
              userId={user?.id}
              isAuthenticated={isAuthenticated}
              isAdmin={isAdmin}
            />
          </div>

          {/* Right Column - Booking Form */}
          <div className="lg:col-span-1">
            {!isAdmin ? (
              <Card className="sticky top-24" id="booking-form">
                <CardHeader className="pb-3">
                  <CardTitle className="text-xl">Pesan Tiket</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="ticket-type">Pilih Jenis Tiket</Label>
                      <Select 
                        value={selectedTicket?.id}
                        onValueChange={(value) => {
                          const ticket = ticketTypes.find(t => t.id === value);
                          if (ticket) setSelectedTicket(ticket);
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih Tiket" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Jenis Tiket</SelectLabel>
                            {ticketTypes.map((ticket) => (
                              <SelectItem key={ticket.id} value={ticket.id}>
                                {ticket.name} - Rp {ticket.price.toLocaleString('id-ID')}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="quantity">Jumlah Tiket</Label>
                      <div className="flex items-center mt-1">
                        <button 
                          type="button" 
                          onClick={() => decrementQuantity()}
                          className="bg-gray-200 px-3 py-2 rounded-l"
                          disabled={quantity <= 1}
                        >
                          -
                        </button>
                        <input 
                          id="quantity"
                          type="number" 
                          min="1" 
                          value={quantity} 
                          onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                          className="w-20 text-center border-y py-2"
                          readOnly
                        />
                        <button 
                          type="button" 
                          onClick={() => incrementQuantity()}
                          className="bg-gray-200 px-3 py-2 rounded-r"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="visit-date">Tanggal Kunjungan</Label>
                      <Input 
                        id="visit-date"
                        type="date" 
                        className="mt-1"
                        value={visitDate}
                        onChange={(e) => setVisitDate(e.target.value)}
                        min={getTomorrowDate()}
                      />
                    </div>

                    <Separator className="my-4" />

                    <div>
                      <h3 className="font-medium mb-3">Data Pengunjung</h3>
                      
                      <div className="space-y-3">
                        <div>
                          <Label htmlFor="visitor-name">Nama Lengkap</Label>
                          <Input
                            id="visitor-name"
                            placeholder="Masukkan nama lengkap"
                            value={visitorName}
                            onChange={(e) => setVisitorName(e.target.value)}
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="visitor-email">Email</Label>
                          <Input
                            id="visitor-email"
                            type="email"
                            placeholder="Masukkan email"
                            value={visitorEmail}
                            onChange={(e) => setVisitorEmail(e.target.value)}
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="visitor-phone">No. Telepon</Label>
                          <Input
                            id="visitor-phone"
                            placeholder="Masukkan nomor telepon"
                            value={visitorPhone}
                            onChange={(e) => setVisitorPhone(e.target.value)}
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="special-requests">Permintaan Khusus (Opsional)</Label>
                          <Input
                            id="special-requests"
                            placeholder="Masukkan permintaan khusus jika ada"
                            value={specialRequests}
                            onChange={(e) => setSpecialRequests(e.target.value)}
                          />
                        </div>
                      </div>
                    </div>

                    <Separator className="my-4" />

                    <div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Harga tiket</span>
                        <span>Rp {selectedTicket ? selectedTicket.price.toLocaleString('id-ID') : '0'}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Jumlah</span>
                        <span>{quantity} tiket</span>
                      </div>
                      <Separator className="my-2" />
                      <div className="flex justify-between items-center font-medium text-lg">
                        <span>Total</span>
                        <span className="text-primary">Rp {formattedTotalPrice}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    className="w-full flex items-center gap-2" 
                    onClick={handleBookTicket}
                    disabled={!selectedTicket || isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Memproses...</span>
                      </>
                    ) : (
                      <>
                        <DollarSign className="h-4 w-4" />
                        <span>Pesan & Bayar Sekarang</span>
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            ) : (
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle>Akun Admin</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">Anda masuk sebagai admin. Akses panel admin untuk mengelola destinasi dan sistem.</p>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" onClick={() => navigate('/admin')}>
                    Ke Dashboard Admin
                  </Button>
                </CardFooter>
              </Card>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default DestinationDetail;
