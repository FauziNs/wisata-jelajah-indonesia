
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Clock, 
  Info, 
  MapPin, 
  Calendar, 
  Star, 
  Ticket, 
  User,
  Heart,
  Phone,
  Wifi,
  Utensils,
  Car,
  Image,
  ParkingSquare,
  ShoppingBag,
  Landmark
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';

const DestinationDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, isAuthenticated } = useAuth();
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [destination, setDestination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [ticketTypes, setTicketTypes] = useState([]);
  const [facilities, setFacilities] = useState([]);
  const [faqs, setFaqs] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTicketType, setSelectedTicketType] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [isCheckingPromo, setIsCheckingPromo] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isBooked, setIsBooked] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const fetchDestinationDetails = async () => {
      if (!slug) return;
      
      try {
        setLoading(true);
        
        // Fetch destination details
        const { data: destinationData, error: destinationError } = await supabase
          .from('destinations')
          .select('*')
          .eq('id', slug)
          .single();
        
        if (destinationError) throw destinationError;
        if (!destinationData) throw new Error('Destination not found');
        
        setDestination(destinationData);
        
        // Fetch image gallery
        const { data: imagesData, error: imagesError } = await supabase
          .from('destination_images')
          .select('*')
          .eq('destination_id', destinationData.id)
          .order('is_primary', { ascending: false });
        
        if (!imagesError && imagesData && imagesData.length > 0) {
          const images = imagesData.map(img => img.image_url);
          setDestination(prev => ({...prev, images}));
        }
        
        // Fetch ticket types
        const { data: ticketsData, error: ticketsError } = await supabase
          .from('ticket_types')
          .select('*')
          .eq('destination_id', destinationData.id);
        
        if (!ticketsError && ticketsData) {
          setTicketTypes(ticketsData);
          if (ticketsData.length > 0) {
            setSelectedTicketType(ticketsData[0].id);
          }
        }
        
        // Fetch facilities
        const { data: facilitiesData, error: facilitiesError } = await supabase
          .from('destination_facilities')
          .select('*')
          .eq('destination_id', destinationData.id);
        
        if (!facilitiesError && facilitiesData) {
          setFacilities(facilitiesData);
        }
        
        // Fetch FAQs
        const { data: faqsData, error: faqsError } = await supabase
          .from('faqs')
          .select('*')
          .eq('destination_id', destinationData.id);
        
        if (!faqsError && faqsData) {
          setFaqs(faqsData);
        }
        
        // Check if destination is in favorites
        if (isAuthenticated && user) {
          const { data: favData } = await supabase
            .from('saved_destinations')
            .select('*')
            .eq('user_id', user.id)
            .eq('destination_id', destinationData.id)
            .maybeSingle();
          
          setIsFavorite(!!favData);
        }
        
      } catch (error) {
        console.error('Error fetching destination details:', error);
        toast({
          title: "Error",
          description: "Failed to load destination details",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchDestinationDetails();
  }, [slug, toast, isAuthenticated, user]);

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (value > 0) {
      setQuantity(value);
    }
  };

  const checkPromoCode = async () => {
    if (!promoCode.trim()) return;
    
    try {
      setIsCheckingPromo(true);
      
      const { data, error } = await supabase
        .from('promotions')
        .select('*')
        .eq('promo_code', promoCode.trim())
        .eq('is_active', true)
        .single();
      
      if (error) throw error;
      
      if (data) {
        // Check if promo is still valid based on dates
        const now = new Date();
        const startDate = new Date(data.start_date);
        const endDate = new Date(data.end_date);
        
        if (now < startDate || now > endDate) {
          toast({
            title: "Promo tidak valid",
            description: "Kode promo sudah tidak berlaku",
            variant: "destructive"
          });
          setDiscount(0);
          return;
        }
        
        if (data.discount_percentage) {
          setDiscount(data.discount_percentage);
          toast({
            title: "Promo berhasil",
            description: `Diskon ${data.discount_percentage}% berhasil diterapkan`,
            variant: "default"
          });
        } else if (data.discount_amount) {
          setDiscount(data.discount_amount);
          toast({
            title: "Promo berhasil",
            description: `Diskon Rp ${data.discount_amount.toLocaleString('id-ID')} berhasil diterapkan`,
            variant: "default"
          });
        }
      } else {
        toast({
          title: "Kode promo tidak ditemukan",
          description: "Kode promo yang Anda masukkan tidak valid",
          variant: "destructive"
        });
        setDiscount(0);
      }
    } catch (error) {
      console.error('Error checking promo code:', error);
      toast({
        title: "Error",
        description: "Terjadi kesalahan saat memeriksa kode promo",
        variant: "destructive"
      });
      setDiscount(0);
    } finally {
      setIsCheckingPromo(false);
    }
  };

  const getTotalPrice = () => {
    if (!selectedTicketType || !ticketTypes.length) return 0;
    
    const ticket = ticketTypes.find(t => t.id === selectedTicketType);
    if (!ticket) return 0;
    
    let totalPrice = ticket.price * quantity;
    
    if (discount) {
      // Check if discount is percentage or fixed amount
      if (discount < 100) {
        // Percentage discount
        totalPrice = totalPrice * (1 - (discount / 100));
      } else {
        // Fixed amount discount
        totalPrice = Math.max(0, totalPrice - discount);
      }
    }
    
    return totalPrice;
  };

  const handleBookTicket = async () => {
    if (!isAuthenticated) {
      toast({
        title: "Login diperlukan",
        description: "Silakan login terlebih dahulu untuk memesan tiket",
        variant: "default"
      });
      navigate('/login', { state: { from: `/destinasi/${slug}` } });
      return;
    }
    
    if (!selectedDate) {
      toast({
        title: "Pilih tanggal",
        description: "Silakan pilih tanggal kunjungan",
        variant: "destructive"
      });
      return;
    }
    
    if (!selectedTicketType) {
      toast({
        title: "Pilih tiket",
        description: "Silakan pilih jenis tiket",
        variant: "destructive"
      });
      return;
    }
    
    if (!paymentMethod) {
      toast({
        title: "Pilih metode pembayaran",
        description: "Silakan pilih metode pembayaran",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setIsBooked(true);
      
      const ticketData = {
        user_id: user.id,
        destination_id: destination.id,
        ticket_type_id: selectedTicketType,
        visit_date: selectedDate,
        quantity: quantity,
        total_price: getTotalPrice(),
        payment_method: paymentMethod,
        payment_status: 'unpaid',
        status: 'pending',
        booking_number: `TIX-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`,
        visitor_name: user.user_metadata?.full_name || '',
        visitor_email: user.email,
        visitor_phone: user.user_metadata?.phone_number || '',
      };
      
      const { data, error } = await supabase
        .from('bookings')
        .insert(ticketData)
        .select();
      
      if (error) throw error;
      
      toast({
        title: "Pemesanan berhasil",
        description: "Tiket Anda telah berhasil dipesan. Silakan lakukan pembayaran untuk melanjutkan.",
        variant: "default"
      });
      
      // Redirect to payment page
      navigate('/payment', { state: { bookingId: data[0].id } });
      
    } catch (error) {
      console.error('Error booking ticket:', error);
      toast({
        title: "Error",
        description: "Terjadi kesalahan saat memesan tiket",
        variant: "destructive"
      });
      setIsBooked(false);
    }
  };

  const toggleFavorite = async () => {
    if (!isAuthenticated) {
      toast({
        title: "Login diperlukan",
        description: "Silakan login terlebih dahulu untuk menyimpan destinasi",
        variant: "default"
      });
      navigate('/login', { state: { from: `/destinasi/${slug}` } });
      return;
    }
    
    try {
      setIsSaving(true);
      
      if (isFavorite) {
        // Remove from favorites
        const { error } = await supabase
          .from('saved_destinations')
          .delete()
          .eq('user_id', user.id)
          .eq('destination_id', destination.id);
        
        if (error) throw error;
        
        setIsFavorite(false);
        toast({
          title: "Berhasil dihapus",
          description: "Destinasi berhasil dihapus dari favorit",
          variant: "default"
        });
      } else {
        // Add to favorites
        const { error } = await supabase
          .from('saved_destinations')
          .insert({
            user_id: user.id,
            destination_id: destination.id,
            saved_at: new Date().toISOString()
          });
        
        if (error) throw error;
        
        setIsFavorite(true);
        toast({
          title: "Berhasil disimpan",
          description: "Destinasi berhasil disimpan ke favorit",
          variant: "default"
        });
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      toast({
        title: "Error",
        description: "Terjadi kesalahan saat menyimpan destinasi",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container-custom py-20 flex justify-center items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!destination) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container-custom py-20 text-center">
          <h1 className="text-3xl font-bold mb-4">Destinasi Tidak Ditemukan</h1>
          <p className="mb-8">Maaf, destinasi yang Anda cari tidak ditemukan.</p>
          <Link to="/destinasi">
            <Button>Kembali ke Daftar Destinasi</Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const selectedTicket = ticketTypes.find(t => t.id === selectedTicketType) || {};

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Image Gallery */}
      <div className="relative">
        <div className="h-[50vh] md:h-[60vh] bg-gray-900 relative overflow-hidden">
          {destination.images && destination.images.length > 0 ? (
            <img 
              src={destination.images[activeImageIndex]} 
              alt={destination.name} 
              className="w-full h-full object-cover opacity-90"
            />
          ) : (
            <img 
              src={destination.image_url} 
              alt={destination.name} 
              className="w-full h-full object-cover opacity-90"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
          
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
            <div className="container-custom">
              <Badge className="mb-3">{destination.category}</Badge>
              <h1 className="text-3xl md:text-5xl font-bold text-white mb-2">{destination.name}</h1>
              <div className="flex items-center text-white/90 mb-4">
                <MapPin className="h-4 w-4 mr-1" />
                <span>{destination.location}</span>
              </div>
              <div className="flex items-center gap-6">
                <div className="flex items-center">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`h-5 w-5 ${i < Math.floor(destination.rating || 0) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} 
                      />
                    ))}
                  </div>
                  <span className="text-white ml-2">{destination.rating || 0} ({destination.reviews_count || 0} ulasan)</span>
                </div>
                <div className="flex items-center text-white">
                  <Clock className="h-5 w-5 mr-1" />
                  <span>Buka: {destination.operational_hours}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Thumbnails */}
        {destination.images && destination.images.length > 1 && (
          <div className="container-custom">
            <div className="flex gap-3 mt-4 overflow-x-auto pb-2">
              {destination.images.map((image, index) => (
                <div 
                  key={index}
                  className={`cursor-pointer rounded-md overflow-hidden h-20 w-32 flex-shrink-0 transition 
                    ${activeImageIndex === index ? 'ring-2 ring-primary' : 'opacity-70'}`}
                  onClick={() => setActiveImageIndex(index)}
                >
                  <img src={image} alt="" className="h-full w-full object-cover" />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      
      <div className="container-custom py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main content */}
          <div className="flex-1">
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="mb-6">
                <TabsTrigger value="overview">Deskripsi</TabsTrigger>
                <TabsTrigger value="tickets">Tiket</TabsTrigger>
                <TabsTrigger value="facilities">Fasilitas</TabsTrigger>
                <TabsTrigger value="faq">FAQ</TabsTrigger>
                <TabsTrigger value="reviews">Ulasan</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="space-y-6">
                <div className="prose max-w-none">
                  <h2 className="text-2xl font-semibold">Tentang {destination.name}</h2>
                  <p className="text-gray-600 leading-relaxed">{destination.description}</p>
                  {destination.long_description && (
                    <p className="text-gray-600 leading-relaxed">{destination.long_description}</p>
                  )}
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold mb-4">Lokasi</h3>
                  <div className="bg-gray-100 rounded-lg h-[300px] flex items-center justify-center">
                    <div className="text-center">
                      <MapPin className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                      <p className="text-gray-500">{destination.full_location || destination.location}</p>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="tickets">
                <h2 className="text-2xl font-semibold mb-6">Tiket Masuk</h2>
                {ticketTypes.length > 0 ? (
                  <div className="grid md:grid-cols-2 gap-4">
                    {ticketTypes.map((ticket) => (
                      <Card key={ticket.id} className={`overflow-hidden ${selectedTicketType === ticket.id ? 'ring-2 ring-primary' : ''}`}>
                        <CardContent className="p-0">
                          <div className="p-6">
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="font-semibold text-lg">{ticket.name}</h3>
                                <p className="text-sm text-gray-500">{ticket.description}</p>
                              </div>
                              <span className="font-bold text-primary">Rp {ticket.price.toLocaleString('id-ID')}</span>
                            </div>
                            <Button 
                              className="w-full mt-4"
                              onClick={() => setSelectedTicketType(ticket.id)}
                              variant={selectedTicketType === ticket.id ? "default" : "outline"}
                            >
                              {selectedTicketType === ticket.id ? "Dipilih" : "Pilih Tiket"}
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500">Informasi tiket belum tersedia</p>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="facilities">
                <h2 className="text-2xl font-semibold mb-6">Fasilitas</h2>
                {facilities.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {facilities.map((facility) => {
                      // Map facility name to icon
                      let FacilityIcon = ParkingSquare;
                      if (facility.name.toLowerCase().includes('toilet')) FacilityIcon = User;
                      if (facility.name.toLowerCase().includes('parkir')) FacilityIcon = ParkingSquare;
                      if (facility.name.toLowerCase().includes('makan')) FacilityIcon = Utensils;
                      if (facility.name.toLowerCase().includes('wifi')) FacilityIcon = Wifi;
                      if (facility.name.toLowerCase().includes('foto')) FacilityIcon = Image;
                      if (facility.name.toLowerCase().includes('souvenir')) FacilityIcon = ShoppingBag;
                      if (facility.name.toLowerCase().includes('landmark')) FacilityIcon = Landmark;
                      
                      return (
                        <div key={facility.id} className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-lg">
                          {facility.icon ? (
                            <img src={facility.icon} alt={facility.name} className="h-8 w-8 text-primary mb-2" />
                          ) : (
                            <FacilityIcon className="h-8 w-8 text-primary mb-2" />
                          )}
                          <span>{facility.name}</span>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500">Informasi fasilitas belum tersedia</p>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="faq">
                <h2 className="text-2xl font-semibold mb-6">Pertanyaan Umum</h2>
                {faqs.length > 0 ? (
                  <div className="space-y-4">
                    {faqs.map((faq) => (
                      <div key={faq.id} className="border rounded-lg p-4">
                        <h3 className="font-semibold text-lg mb-2">{faq.question}</h3>
                        <p className="text-gray-600">{faq.answer}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500">Pertanyaan umum belum tersedia</p>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="reviews">
                <h2 className="text-2xl font-semibold mb-6">Ulasan Pengunjung</h2>
                <div className="bg-gray-100 rounded-lg p-8 text-center">
                  <h3 className="text-xl font-medium text-gray-700 mb-2">Ulasan akan segera hadir</h3>
                  <p className="text-gray-500">Kami sedang mengumpulkan ulasan dari pengunjung</p>
                </div>
              </TabsContent>
            </Tabs>
          </div>
          
          {/* Sidebar for booking */}
          <div className="lg:w-[320px]">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-xl mb-4">Beli Tiket</h3>
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Mulai dari</span>
                    <span className="font-bold text-primary">
                      {ticketTypes.length > 0 
                        ? `Rp ${Math.min(...ticketTypes.map(t => t.price)).toLocaleString('id-ID')}` 
                        : 'Tidak tersedia'}
                    </span>
                  </div>
                  
                  <div className="space-y-3">
                    <Label>Pilih Tanggal Kunjungan</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={"w-full justify-start text-left font-normal"}
                        >
                          <Calendar className="mr-2 h-4 w-4" />
                          {selectedDate ? (
                            format(selectedDate, 'PPP', { locale: id })
                          ) : (
                            <span>Pilih Tanggal</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <CalendarComponent
                          mode="single"
                          selected={selectedDate}
                          onSelect={setSelectedDate}
                          disabled={(date) => date < new Date()}
                          initialFocus
                          className="p-3 pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                    
                    {ticketTypes.length > 0 && (
                      <div className="space-y-3">
                        <Label>Jenis Tiket</Label>
                        <Select 
                          value={selectedTicketType || ''} 
                          onValueChange={setSelectedTicketType}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Pilih jenis tiket" />
                          </SelectTrigger>
                          <SelectContent>
                            {ticketTypes.map((ticket) => (
                              <SelectItem key={ticket.id} value={ticket.id}>
                                {ticket.name} - Rp {ticket.price.toLocaleString('id-ID')}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        
                        <div className="flex flex-col space-y-3">
                          <Label>Jumlah Tiket</Label>
                          <Input 
                            type="number" 
                            min="1" 
                            value={quantity} 
                            onChange={handleQuantityChange}
                          />
                        </div>
                      </div>
                    )}
                    
                    <div className="space-y-3">
                      <Label>Metode Pembayaran</Label>
                      <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                        <div className="flex items-center space-x-2 rounded-md border p-2">
                          <RadioGroupItem value="bank_transfer" id="bank_transfer" />
                          <Label htmlFor="bank_transfer" className="flex-1">Transfer Bank</Label>
                        </div>
                        <div className="flex items-center space-x-2 rounded-md border p-2">
                          <RadioGroupItem value="e_wallet" id="e_wallet" />
                          <Label htmlFor="e_wallet" className="flex-1">E-Wallet</Label>
                        </div>
                        <div className="flex items-center space-x-2 rounded-md border p-2">
                          <RadioGroupItem value="on_site" id="on_site" />
                          <Label htmlFor="on_site" className="flex-1">Bayar di Tempat</Label>
                        </div>
                      </RadioGroup>
                    </div>
                    
                    <div className="space-y-3">
                      <Label>Kode Promo</Label>
                      <div className="flex gap-2">
                        <Input 
                          placeholder="Masukkan kode promo" 
                          value={promoCode} 
                          onChange={(e) => setPromoCode(e.target.value)}
                          disabled={isCheckingPromo}
                        />
                        <Button 
                          variant="outline" 
                          onClick={checkPromoCode}
                          disabled={isCheckingPromo || !promoCode.trim()}
                        >
                          Cek
                        </Button>
                      </div>
                    </div>
                    
                    {discount > 0 && (
                      <div className="p-2 bg-green-50 text-green-700 rounded-md text-sm">
                        {discount < 100 
                          ? `Diskon ${discount}% berhasil diterapkan!`
                          : `Diskon Rp ${discount.toLocaleString('id-ID')} berhasil diterapkan!`
                        }
                      </div>
                    )}
                  </div>
                  
                  <div className="pt-3 border-t border-gray-200">
                    <div className="flex justify-between font-semibold">
                      <span>Total</span>
                      <span className="text-primary text-lg">
                        Rp {getTotalPrice().toLocaleString('id-ID')}
                      </span>
                    </div>
                  </div>
                </div>
                
                <Button 
                  className="w-full"
                  onClick={handleBookTicket}
                  disabled={isBooked || !selectedTicketType || !selectedDate || !paymentMethod}
                >
                  {isBooked ? "Memproses..." : "Beli Tiket Sekarang"}
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full mt-3 flex gap-2 justify-center"
                  onClick={toggleFavorite}
                  disabled={isSaving}
                >
                  <Heart className={`h-5 w-5 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
                  {isFavorite ? "Tersimpan di Favorit" : "Simpan ke Favorit"}
                </Button>
                
                <div className="mt-6 pt-6 border-t">
                  <h4 className="font-semibold mb-3">Butuh Bantuan?</h4>
                  <div className="flex items-center text-primary">
                    <Phone className="h-4 w-4 mr-2" />
                    <span>+62 812-3456-7890</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default DestinationDetail;
