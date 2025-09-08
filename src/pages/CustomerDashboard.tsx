import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Calendar, CreditCard, Heart, Settings, LogOut } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

interface Booking {
  id: string;
  booking_number: string;
  destination_id: string;
  visit_date: string;
  quantity: number;
  total_price: number;
  status: string;
  payment_status: string;
  destinations: {
    name: string;
    location: string;
    image_url: string;
  };
}

interface SavedDestination {
  id: string;
  destination_id: string;
  saved_at: string;
  destinations: {
    name: string;
    location: string;
    image_url: string;
    price: number;
  };
}

const CustomerDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [savedDestinations, setSavedDestinations] = useState<SavedDestination[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchData();
  }, [user, navigate]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch bookings
      const { data: bookingsData, error: bookingsError } = await supabase
        .from('bookings')
        .select(`
          *,
          destinations (
            name,
            location,
            image_url
          )
        `)
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })
        .limit(5);

      if (bookingsError) throw bookingsError;
      setBookings(bookingsData || []);

      // Fetch saved destinations
      const { data: savedData, error: savedError } = await supabase
        .from('saved_destinations')
        .select(`
          *,
          destinations (
            name,
            location,
            image_url,
            price
          )
        `)
        .eq('user_id', user?.id)
        .order('saved_at', { ascending: false })
        .limit(5);

      if (savedError) throw savedError;
      setSavedDestinations(savedData || []);

    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Gagal memuat data');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      navigate('/');
      toast.success('Logout berhasil');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Gagal logout');
    }
  };

  const getStatusBadge = (status: string) => {
    const statusColors = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return statusColors[status as keyof typeof statusColors] || 'bg-gray-100 text-gray-800';
  };

  const getPaymentStatusBadge = (status: string) => {
    const statusColors = {
      unpaid: 'bg-red-100 text-red-800',
      paid: 'bg-green-100 text-green-800',
      refunded: 'bg-blue-100 text-blue-800'
    };
    return statusColors[status as keyof typeof statusColors] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Memuat dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600 mt-2">Selamat datang, {user?.email}</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => navigate('/profile')}>
                <Settings className="h-4 w-4 mr-2" />
                Profil
              </Button>
              <Button variant="outline" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Booking</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{bookings.length}</div>
              <p className="text-xs text-muted-foreground">Semua booking Anda</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Destinasi Tersimpan</CardTitle>
              <Heart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{savedDestinations.length}</div>
              <p className="text-xs text-muted-foreground">Destinasi favorit</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Pengeluaran</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                Rp {bookings.reduce((total, booking) => total + Number(booking.total_price), 0).toLocaleString('id-ID')}
              </div>
              <p className="text-xs text-muted-foreground">Total dari semua booking</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Bookings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Booking Terbaru</span>
                <Button variant="ghost" size="sm" onClick={() => navigate('/bookings')}>
                  Lihat Semua
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {bookings.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Belum ada booking</p>
                  <Button className="mt-4" onClick={() => navigate('/destinasi')}>
                    Jelajahi Destinasi
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {bookings.map((booking) => (
                    <div key={booking.id} className="flex items-center gap-4 p-4 border rounded-lg">
                      <img
                        src={booking.destinations.image_url || '/placeholder.svg'}
                        alt={booking.destinations.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium">{booking.destinations.name}</h4>
                        <p className="text-sm text-gray-600 flex items-center mt-1">
                          <MapPin className="h-3 w-3 mr-1" />
                          {booking.destinations.location}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge className={getStatusBadge(booking.status)}>
                            {booking.status}
                          </Badge>
                          <Badge className={getPaymentStatusBadge(booking.payment_status)}>
                            {booking.payment_status}
                          </Badge>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">Rp {Number(booking.total_price).toLocaleString('id-ID')}</p>
                        <p className="text-sm text-gray-600">{new Date(booking.visit_date).toLocaleDateString('id-ID')}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Saved Destinations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Destinasi Tersimpan</span>
                <Button variant="ghost" size="sm" onClick={() => navigate('/saved-destinations')}>
                  Lihat Semua
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {savedDestinations.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Heart className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Belum ada destinasi tersimpan</p>
                  <Button className="mt-4" onClick={() => navigate('/destinasi')}>
                    Cari Destinasi
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {savedDestinations.map((saved) => (
                    <div key={saved.id} className="flex items-center gap-4 p-4 border rounded-lg">
                      <img
                        src={saved.destinations.image_url || '/placeholder.svg'}
                        alt={saved.destinations.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium">{saved.destinations.name}</h4>
                        <p className="text-sm text-gray-600 flex items-center mt-1">
                          <MapPin className="h-3 w-3 mr-1" />
                          {saved.destinations.location}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          Disimpan: {new Date(saved.saved_at).toLocaleDateString('id-ID')}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">Rp {Number(saved.destinations.price).toLocaleString('id-ID')}</p>
                        <Button size="sm" onClick={() => navigate(`/destinasi/${saved.destination_id}`)}>
                          Lihat
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default CustomerDashboard;