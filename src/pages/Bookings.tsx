
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { Badge } from '@/components/ui/badge';
import {
  Calendar,
  Clock,
  MapPin,
  Ticket,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  XCircle,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Bookings = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isAuthenticated, user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [expandedBookingId, setExpandedBookingId] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/bookings' } });
      return;
    }

    const fetchBookings = async () => {
      try {
        setLoading(true);
        
        const { data, error } = await supabase
          .from('bookings')
          .select(`
            *,
            destinations:destination_id (*),
            ticket_types:ticket_type_id (*)
          `)
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        setBookings(data || []);
      } catch (error) {
        console.error('Error fetching bookings:', error);
        toast({
          title: "Error",
          description: "Failed to load booking data",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [isAuthenticated, navigate, toast, user]);

  const toggleExpandBooking = (id) => {
    if (expandedBookingId === id) {
      setExpandedBookingId(null);
    } else {
      setExpandedBookingId(id);
    }
  };

  const getStatusBadge = (status, paymentStatus) => {
    // First check payment status
    if (paymentStatus === 'unpaid') {
      return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Belum Dibayar</Badge>;
    } else if (paymentStatus === 'waiting_confirmation') {
      return <Badge variant="outline" className="bg-blue-100 text-blue-800 hover:bg-blue-100">Menunggu Konfirmasi</Badge>;
    } else if (paymentStatus === 'paid') {
      // Then check booking status
      if (status === 'confirmed') {
        return <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">Tiket Aktif</Badge>;
      } else if (status === 'completed') {
        return <Badge variant="outline" className="bg-purple-100 text-purple-800 hover:bg-purple-100">Selesai</Badge>;
      } else if (status === 'cancelled') {
        return <Badge variant="outline" className="bg-red-100 text-red-800 hover:bg-red-100">Dibatalkan</Badge>;
      }
    }
    
    return <Badge variant="outline">{status || 'pending'}</Badge>;
  };

  const getFilteredBookings = () => {
    if (filter === 'all') return bookings;
    
    if (filter === 'active') {
      return bookings.filter(booking => 
        booking.payment_status === 'paid' && 
        booking.status === 'confirmed' && 
        new Date(booking.visit_date) >= new Date()
      );
    } else if (filter === 'unpaid') {
      return bookings.filter(booking => booking.payment_status === 'unpaid');
    } else if (filter === 'completed') {
      return bookings.filter(booking => 
        booking.status === 'completed' || 
        (booking.payment_status === 'paid' && booking.status === 'confirmed' && new Date(booking.visit_date) < new Date())
      );
    } else if (filter === 'cancelled') {
      return bookings.filter(booking => booking.status === 'cancelled');
    }
    
    return bookings;
  };

  const getStatusIcon = (status, paymentStatus) => {
    if (paymentStatus === 'unpaid') {
      return <Clock className="h-5 w-5 text-yellow-500" />;
    } else if (paymentStatus === 'waiting_confirmation') {
      return <AlertCircle className="h-5 w-5 text-blue-500" />;
    } else if (paymentStatus === 'paid') {
      if (status === 'confirmed') {
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      } else if (status === 'completed') {
        return <CheckCircle2 className="h-5 w-5 text-purple-500" />;
      } else if (status === 'cancelled') {
        return <XCircle className="h-5 w-5 text-red-500" />;
      }
    }
    
    return <Clock className="h-5 w-5 text-gray-500" />;
  };

  const filteredBookings = getFilteredBookings();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="container-custom py-8 flex-grow">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">Pesanan Saya</h1>
            <p className="text-gray-600">Daftar tiket yang telah Anda pesan</p>
          </div>
          
          <div className="mt-4 md:mt-0 w-full md:w-48">
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="all">Semua Pesanan</SelectItem>
                  <SelectItem value="active">Tiket Aktif</SelectItem>
                  <SelectItem value="unpaid">Belum Dibayar</SelectItem>
                  <SelectItem value="completed">Selesai</SelectItem>
                  <SelectItem value="cancelled">Dibatalkan</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : filteredBookings.length > 0 ? (
          <div className="space-y-6">
            {filteredBookings.map((booking) => (
              <Card key={booking.id} className="overflow-hidden">
                <CardContent className="p-0">
                  {/* Booking Summary (Always Visible) */}
                  <div className="p-4 md:p-6 flex flex-col md:flex-row gap-4 md:items-center justify-between">
                    <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
                      {/* Destination Image */}
                      <div className="h-16 w-24 rounded overflow-hidden">
                        <img 
                          src={booking.destinations?.image_url} 
                          alt={booking.destinations?.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      
                      {/* Booking Details */}
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold">{booking.destinations?.name}</h3>
                          {getStatusBadge(booking.status, booking.payment_status)}
                        </div>
                        
                        <div className="text-sm text-gray-600">
                          <div className="flex items-center gap-1 mb-1">
                            <Calendar className="h-3.5 w-3.5" />
                            <span>
                              {format(new Date(booking.visit_date), 'EEEE, dd MMMM yyyy', { locale: id })}
                            </span>
                          </div>
                          
                          <div className="flex items-center gap-1">
                            <Ticket className="h-3.5 w-3.5" />
                            <span>{booking.quantity} tiket {booking.ticket_types?.name}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-sm text-gray-500">Total Bayar</p>
                        <p className="font-semibold text-primary">
                          Rp {booking.total_price.toLocaleString('id-ID')}
                        </p>
                      </div>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        className="p-0 h-8 w-8"
                        onClick={() => toggleExpandBooking(booking.id)}
                      >
                        {expandedBookingId === booking.id ? (
                          <ChevronUp className="h-5 w-5" />
                        ) : (
                          <ChevronDown className="h-5 w-5" />
                        )}
                      </Button>
                    </div>
                  </div>
                  
                  {/* Expanded Booking Details */}
                  {expandedBookingId === booking.id && (
                    <div className="p-4 md:p-6 pt-0 border-t">
                      <div className="pt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <p className="text-sm text-gray-500 mb-1">Booking ID</p>
                          <p className="font-medium">{booking.booking_number}</p>
                        </div>
                        
                        <div>
                          <p className="text-sm text-gray-500 mb-1">Tanggal Pemesanan</p>
                          <p className="font-medium">
                            {format(new Date(booking.created_at), 'dd MMMM yyyy, HH:mm', { locale: id })}
                          </p>
                        </div>
                        
                        <div>
                          <p className="text-sm text-gray-500 mb-1">Status</p>
                          <div className="flex items-center gap-1.5">
                            {getStatusIcon(booking.status, booking.payment_status)}
                            <p className="font-medium">
                              {booking.payment_status === 'unpaid' ? 'Menunggu Pembayaran' :
                               booking.payment_status === 'waiting_confirmation' ? 'Menunggu Konfirmasi' :
                               booking.status === 'confirmed' ? 'Tiket Aktif' :
                               booking.status === 'completed' ? 'Kunjungan Selesai' :
                               booking.status === 'cancelled' ? 'Dibatalkan' : 'Pending'}
                            </p>
                          </div>
                        </div>
                        
                        <div>
                          <p className="text-sm text-gray-500 mb-1">Nama Pengunjung</p>
                          <p className="font-medium">{booking.visitor_name}</p>
                        </div>
                        
                        <div>
                          <p className="text-sm text-gray-500 mb-1">Email</p>
                          <p className="font-medium">{booking.visitor_email}</p>
                        </div>
                        
                        <div>
                          <p className="text-sm text-gray-500 mb-1">Metode Pembayaran</p>
                          <p className="font-medium">
                            {booking.payment_method === 'bank_transfer' ? 'Transfer Bank' :
                             booking.payment_method === 'e_wallet' ? 'E-Wallet' :
                             booking.payment_method === 'on_site' ? 'Bayar di Tempat' :
                             booking.payment_method}
                          </p>
                        </div>
                      </div>
                      
                      <div className="mt-6 flex justify-end">
                        <Button
                          onClick={() => navigate(`/payment?id=${booking.id}`)}
                          variant={booking.payment_status === 'paid' ? 'default' : 'outline'}
                          className="flex items-center gap-1.5"
                        >
                          {booking.payment_status === 'paid' ? (
                            <>Lihat E-Tiket <ArrowRight className="h-4 w-4" /></>
                          ) : (
                            <>Lanjutkan Pembayaran <ArrowRight className="h-4 w-4" /></>
                          )}
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="bg-gray-100 rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-4">
              <Ticket className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-medium text-gray-700 mb-2">Belum ada pesanan</h3>
            <p className="text-gray-500 mb-6">Anda belum memiliki pesanan tiket wisata</p>
            <Button onClick={() => navigate('/destinasi')}>
              Jelajahi Destinasi
            </Button>
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  );
};

export default Bookings;
