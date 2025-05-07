
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Search, 
  Calendar, 
  Check,
  X,
  ArrowUpDown,
  Loader2,
  Eye
} from 'lucide-react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';

type Booking = {
  id: string;
  booking_number: string;
  user_id: string;
  visitor_name: string;
  visitor_email: string;
  visitor_phone: string | null;
  destination_id: string;
  destination_name?: string;
  ticket_type_id: string;
  ticket_type_name?: string;
  quantity: number;
  total_price: number;
  visit_date: string;
  payment_status: string;
  status: string;
  created_at: string;
};

const Transactions = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState('all');
  const [bookingDetail, setBookingDetail] = useState<Booking | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const { toast } = useToast();
  
  useEffect(() => {
    fetchBookings();
  }, []);
  
  const fetchBookings = async () => {
    setLoading(true);
    try {
      // First get bookings
      const { data: bookingsData, error: bookingsError } = await supabase
        .from('bookings')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (bookingsError) {
        throw bookingsError;
      }
      
      // Fetch destination names for each booking
      let enrichedBookings = [];
      for (const booking of bookingsData || []) {
        // Get destination name
        const { data: destinationData } = await supabase
          .from('destinations')
          .select('name')
          .eq('id', booking.destination_id)
          .single();
          
        // Get ticket type name
        const { data: ticketTypeData } = await supabase
          .from('ticket_types')
          .select('name')
          .eq('id', booking.ticket_type_id)
          .single();
          
        enrichedBookings.push({
          ...booking,
          destination_name: destinationData?.name || 'Unknown Destination',
          ticket_type_name: ticketTypeData?.name || 'Unknown Ticket Type'
        });
      }
      
      setBookings(enrichedBookings);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      toast({
        title: "Error",
        description: "Gagal mengambil data pemesanan",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  const updateBookingStatus = async (bookingId: string, newStatus: string, newPaymentStatus: string) => {
    setIsUpdating(true);
    try {
      const { error } = await supabase
        .from('bookings')
        .update({
          status: newStatus,
          payment_status: newPaymentStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', bookingId);
        
      if (error) throw error;
      
      toast({
        title: "Status Updated",
        description: "Status pemesanan berhasil diperbarui",
      });
      
      // Update the local state
      setBookings(prevBookings => 
        prevBookings.map(booking => 
          booking.id === bookingId 
            ? { ...booking, status: newStatus, payment_status: newPaymentStatus } 
            : booking
        )
      );
      
      if (bookingDetail && bookingDetail.id === bookingId) {
        setBookingDetail({
          ...bookingDetail,
          status: newStatus,
          payment_status: newPaymentStatus
        });
      }
    } catch (error) {
      console.error('Error updating booking status:', error);
      toast({
        title: "Error",
        description: "Gagal memperbarui status pemesanan",
        variant: "destructive"
      });
    } finally {
      setIsUpdating(false);
    }
  };
  
  const viewBookingDetails = (booking: Booking) => {
    setBookingDetail(booking);
    setIsDialogOpen(true);
  };
  
  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return <Badge className="bg-green-500 hover:bg-green-600">Selesai</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-500 hover:bg-yellow-600">Pending</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-500 hover:bg-red-600">Dibatalkan</Badge>;
      default:
        return <Badge className="bg-gray-500">{status}</Badge>;
    }
  };
  
  const getPaymentStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'paid':
        return <Badge className="bg-green-500 hover:bg-green-600">Lunas</Badge>;
      case 'unpaid':
        return <Badge className="bg-red-500 hover:bg-red-600">Belum Bayar</Badge>;
      case 'partial':
        return <Badge className="bg-yellow-500 hover:bg-yellow-600">Sebagian</Badge>;
      default:
        return <Badge className="bg-gray-500">{status}</Badge>;
    }
  };
  
  const filteredBookings = bookings.filter(booking => 
    (booking.booking_number.toLowerCase().includes(searchTerm.toLowerCase()) || 
     booking.visitor_name.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (selectedStatus === 'all' || booking.status.toLowerCase() === selectedStatus.toLowerCase()) &&
    (selectedPaymentStatus === 'all' || booking.payment_status.toLowerCase() === selectedPaymentStatus.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <h1 className="text-2xl font-bold">Manajemen Transaksi</h1>
        <Button onClick={fetchBookings} disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Loading...
            </>
          ) : (
            'Refresh Data'
          )}
        </Button>
      </div>
      
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="w-full md:w-1/2 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input 
              placeholder="Search by booking number or name..." 
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="w-full md:w-1/4">
            <Select
              value={selectedStatus}
              onValueChange={setSelectedStatus}
            >
              <SelectTrigger>
                <SelectValue placeholder="Filter by Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="w-full md:w-1/4">
            <Select
              value={selectedPaymentStatus}
              onValueChange={setSelectedPaymentStatus}
            >
              <SelectTrigger>
                <SelectValue placeholder="Filter by Payment" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Payments</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="unpaid">Unpaid</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 text-primary animate-spin" />
            </div>
          ) : (
            <Table>
              <TableCaption>Daftar semua transaksi pemesanan</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>No. Booking</TableHead>
                  <TableHead>Pengunjung</TableHead>
                  <TableHead>Destinasi</TableHead>
                  <TableHead>Tanggal Kunjungan</TableHead>
                  <TableHead>Jumlah</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Pembayaran</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBookings.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8 text-gray-500">
                      No bookings found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredBookings.map((booking) => (
                    <TableRow key={booking.id}>
                      <TableCell className="font-medium">{booking.booking_number}</TableCell>
                      <TableCell>{booking.visitor_name}</TableCell>
                      <TableCell>{booking.destination_name}</TableCell>
                      <TableCell>
                        {format(new Date(booking.visit_date), 'dd MMM yyyy', { locale: id })}
                      </TableCell>
                      <TableCell>{booking.quantity}</TableCell>
                      <TableCell>Rp {booking.total_price.toLocaleString('id-ID')}</TableCell>
                      <TableCell>{getStatusBadge(booking.status)}</TableCell>
                      <TableCell>{getPaymentStatusBadge(booking.payment_status)}</TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => viewBookingDetails(booking)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          Detail
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </div>
      </div>
      
      {/* Booking Details Dialog */}
      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AlertDialogContent className="max-w-3xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Detail Pemesanan #{bookingDetail?.booking_number}</AlertDialogTitle>
            <AlertDialogDescription>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                <div className="space-y-3">
                  <div>
                    <Label className="text-gray-500">Pengunjung</Label>
                    <p className="text-lg font-medium">{bookingDetail?.visitor_name}</p>
                  </div>
                  <div>
                    <Label className="text-gray-500">Email</Label>
                    <p>{bookingDetail?.visitor_email}</p>
                  </div>
                  <div>
                    <Label className="text-gray-500">No. Telepon</Label>
                    <p>{bookingDetail?.visitor_phone || '-'}</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <Label className="text-gray-500">Destinasi</Label>
                    <p className="text-lg font-medium">{bookingDetail?.destination_name}</p>
                  </div>
                  <div>
                    <Label className="text-gray-500">Jenis Tiket</Label>
                    <p>{bookingDetail?.ticket_type_name}</p>
                  </div>
                  <div>
                    <Label className="text-gray-500">Tanggal Kunjungan</Label>
                    <p>{bookingDetail?.visit_date ? format(new Date(bookingDetail.visit_date), 'dd MMMM yyyy', { locale: id }) : '-'}</p>
                  </div>
                  <div>
                    <Label className="text-gray-500">Tanggal Pemesanan</Label>
                    <p>{bookingDetail?.created_at ? format(new Date(bookingDetail.created_at), 'dd MMM yyyy, HH:mm', { locale: id }) : '-'}</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 border-t pt-4 space-y-3">
                <div className="flex justify-between">
                  <Label className="text-gray-500">Jumlah Tiket</Label>
                  <p className="font-medium">{bookingDetail?.quantity}</p>
                </div>
                <div className="flex justify-between">
                  <Label className="text-gray-500">Total Pembayaran</Label>
                  <p className="font-medium text-lg">
                    Rp {bookingDetail?.total_price?.toLocaleString('id-ID')}
                  </p>
                </div>
              </div>
              
              <div className="mt-6 border-t pt-4 space-y-4">
                <div className="flex justify-between items-center">
                  <Label className="text-gray-500">Status Pemesanan</Label>
                  {bookingDetail && getStatusBadge(bookingDetail.status)}
                </div>
                <div className="flex justify-between items-center">
                  <Label className="text-gray-500">Status Pembayaran</Label>
                  {bookingDetail && getPaymentStatusBadge(bookingDetail.payment_status)}
                </div>
                
                {/* Status Update Options */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                  <div>
                    <Label className="block mb-2">Update Status Pemesanan</Label>
                    <Select
                      onValueChange={(value) => {
                        if (bookingDetail) {
                          updateBookingStatus(bookingDetail.id, value, bookingDetail.payment_status);
                        }
                      }}
                      value={bookingDetail?.status}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="block mb-2">Update Status Pembayaran</Label>
                    <Select
                      onValueChange={(value) => {
                        if (bookingDetail) {
                          updateBookingStatus(bookingDetail.id, bookingDetail.status, value);
                        }
                      }}
                      value={bookingDetail?.payment_status}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih status pembayaran" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="unpaid">Belum Dibayar</SelectItem>
                        <SelectItem value="paid">Sudah Dibayar</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isUpdating}>Tutup</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                setIsDialogOpen(false);
              }}
              disabled={isUpdating}
            >
              {isUpdating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Memperbarui...
                </>
              ) : (
                'Selesai'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Transactions;
