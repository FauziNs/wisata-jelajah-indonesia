
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Clock, Check, AlertCircle, Download, Printer } from 'lucide-react';
import QRCode from 'qrcode.react'; // Fixed import
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();
  const [booking, setBooking] = useState(null);
  const [destination, setDestination] = useState(null);
  const [ticketType, setTicketType] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paymentProof, setPaymentProof] = useState(null);
  const [fileUploading, setFileUploading] = useState(false);
  
  // Extract bookingId from location state or from URL params
  const bookingId = location.state?.bookingId || new URLSearchParams(location.search).get('id');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/payment' } });
      return;
    }

    if (!bookingId) {
      toast({
        title: "Error",
        description: "Booking ID tidak ditemukan",
        variant: "destructive"
      });
      navigate('/bookings');
      return;
    }

    const fetchBookingDetails = async () => {
      try {
        setLoading(true);
        
        // Fetch booking details
        const { data: bookingData, error: bookingError } = await supabase
          .from('bookings')
          .select('*')
          .eq('id', bookingId)
          .single();
        
        if (bookingError) throw bookingError;
        if (!bookingData) throw new Error('Booking not found');
        
        setBooking(bookingData);
        
        // Fetch destination details
        const { data: destinationData, error: destinationError } = await supabase
          .from('destinations')
          .select('*')
          .eq('id', bookingData.destination_id)
          .single();
        
        if (destinationError) throw destinationError;
        setDestination(destinationData);
        
        // Fetch ticket type details
        const { data: ticketData, error: ticketError } = await supabase
          .from('ticket_types')
          .select('*')
          .eq('id', bookingData.ticket_type_id)
          .single();
        
        if (ticketError) throw ticketError;
        setTicketType(ticketData);
        
      } catch (error) {
        console.error('Error fetching booking details:', error);
        toast({
          title: "Error",
          description: "Gagal memuat detail booking",
          variant: "destructive"
        });
        navigate('/bookings');
      } finally {
        setLoading(false);
      }
    };

    fetchBookingDetails();
  }, [bookingId, isAuthenticated, navigate, toast]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast({
          title: "File terlalu besar",
          description: "Ukuran file maksimal 5MB",
          variant: "destructive"
        });
        return;
      }
      
      setPaymentProof(file);
    }
  };

  const uploadPaymentProof = async () => {
    if (!paymentProof) {
      toast({
        title: "Error",
        description: "Silakan pilih file bukti pembayaran",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setFileUploading(true);
      
      // Upload file to storage
      const fileName = `payment_proof/${booking.id}_${Date.now()}_${paymentProof.name}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('booking_files')
        .upload(fileName, paymentProof);
      
      if (uploadError) throw uploadError;
      
      // Get public URL
      const { data: publicUrlData } = supabase.storage
        .from('booking_files')
        .getPublicUrl(fileName);
      
      // Update booking with payment proof URL
      const { error: updateError } = await supabase
        .from('bookings')
        .update({ 
          payment_proof: publicUrlData.publicUrl,
          payment_status: 'waiting_confirmation',
          updated_at: new Date().toISOString() // Fix type error: convert Date to string
        })
        .eq('id', booking.id);
      
      if (updateError) throw updateError;
      
      // Update local state
      setBooking(prev => ({
        ...prev,
        payment_proof: publicUrlData.publicUrl,
        payment_status: 'waiting_confirmation'
      }));
      
      toast({
        title: "Berhasil",
        description: "Bukti pembayaran berhasil diunggah",
        variant: "default"
      });
      
    } catch (error) {
      console.error('Error uploading payment proof:', error);
      toast({
        title: "Error",
        description: "Gagal mengunggah bukti pembayaran",
        variant: "destructive"
      });
    } finally {
      setFileUploading(false);
    }
  };

  const simulatePaymentConfirmation = async () => {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({
          payment_status: 'paid',
          status: 'confirmed',
          updated_at: new Date().toISOString() // Fix type error: convert Date to string
        })
        .eq('id', booking.id);
      
      if (error) throw error;
      
      setBooking(prev => ({
        ...prev,
        payment_status: 'paid',
        status: 'confirmed'
      }));
      
      toast({
        title: "Pembayaran Dikonfirmasi",
        description: "Pembayaran Anda telah dikonfirmasi dan tiket sudah aktif",
        variant: "default"
      });
    } catch (error) {
      console.error('Error confirming payment:', error);
      toast({
        title: "Error",
        description: "Gagal mengkonfirmasi pembayaran",
        variant: "destructive"
      });
    }
  };

  const downloadTicketAsPDF = async () => {
    const ticketElement = document.getElementById('ticket-element');
    if (!ticketElement) return;
    
    try {
      const canvas = await html2canvas(ticketElement);
      const imgData = canvas.toDataURL('image/png');
      
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: [210, 297]
      });
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`WisataJelajah-Ticket-${booking.booking_number}.pdf`);
      
      toast({
        title: "Berhasil",
        description: "Tiket berhasil diunduh sebagai PDF",
        variant: "default"
      });
    } catch (error) {
      console.error('Error downloading ticket:', error);
      toast({
        title: "Error",
        description: "Gagal mengunduh tiket",
        variant: "destructive"
      });
    }
  };

  const printTicket = () => {
    const printContent = document.getElementById('ticket-element');
    if (!printContent) return;
    
    const originalContents = document.body.innerHTML;
    const printContents = printContent.innerHTML;
    
    document.body.innerHTML = `
      <div style="padding: 20px;">
        ${printContents}
      </div>
    `;
    
    window.print();
    document.body.innerHTML = originalContents;
    window.location.reload();
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

  if (!booking || !destination || !ticketType) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="container-custom py-8 flex-grow">
          <div className="text-center py-12">
            <h3 className="text-xl font-medium text-gray-700 mb-2">Pemesanan tidak ditemukan</h3>
            <p className="text-gray-500 mb-6">Informasi pemesanan yang Anda cari tidak ditemukan</p>
            <Button onClick={() => navigate('/bookings')}>
              Lihat Daftar Pesanan
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const isPaid = booking.payment_status === 'paid';
  const isWaitingConfirmation = booking.payment_status === 'waiting_confirmation';
  
  const generateBookingCode = () => {
    // Create a booking code with format: WJL-XXXX
    return `WJL-${booking.booking_number.split('-')[1]}`;
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="container-custom py-8 flex-grow">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            {isPaid ? 'E-Tiket Wisata' : 'Pembayaran Tiket'}
          </h1>
          <div className="flex items-center text-sm text-gray-600">
            <Link to="/bookings" className="hover:underline">Pesanan Saya</Link>
            <span className="mx-2">{'>'}</span>
            <span>Nomor Booking: {booking.booking_number}</span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left column: Ticket summary */}
          <div className="md:col-span-2">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-semibold text-lg">Detail Pesanan</h3>
                  <div className="flex items-center">
                    <div className={`px-2 py-1 rounded-md text-xs font-medium ${
                      isPaid ? 'bg-green-100 text-green-800' :
                      isWaitingConfirmation ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {isPaid ? 'Telah Dibayar' : 
                       isWaitingConfirmation ? 'Menunggu Konfirmasi' : 
                       'Belum Dibayar'}
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="md:w-1/3">
                    <div className="aspect-video w-full rounded-md overflow-hidden">
                      <img 
                        src={destination.image_url}
                        alt={destination.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                  
                  <div className="md:w-2/3">
                    <h4 className="font-semibold text-xl">{destination.name}</h4>
                    <p className="text-gray-600 mb-2">{destination.location}</p>
                    
                    <div className="space-y-3 mt-4">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Jenis Tiket:</span>
                        <span className="font-medium">{ticketType.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Tanggal Kunjungan:</span>
                        <span className="font-medium">
                          {format(new Date(booking.visit_date), 'EEEE, dd MMMM yyyy', { locale: id })}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Jumlah Tiket:</span>
                        <span className="font-medium">{booking.quantity} tiket</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Harga per Tiket:</span>
                        <span className="font-medium">Rp {ticketType.price.toLocaleString('id-ID')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Metode Pembayaran:</span>
                        <span className="font-medium">
                          {booking.payment_method === 'bank_transfer' ? 'Transfer Bank' :
                           booking.payment_method === 'e_wallet' ? 'E-Wallet' :
                           booking.payment_method === 'on_site' ? 'Bayar di Tempat' :
                           booking.payment_method}
                        </span>
                      </div>
                      
                      <Separator />
                      
                      <div className="flex justify-between font-semibold">
                        <span>Total Pembayaran:</span>
                        <span className="text-primary text-lg">Rp {booking.total_price.toLocaleString('id-ID')}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* E-Ticket section (only shown when paid) */}
                {isPaid && (
                  <div className="mt-8">
                    <h3 className="font-semibold text-lg mb-4">E-Tiket</h3>
                    
                    <div id="ticket-element" className="border-2 border-dashed border-primary p-6 rounded-lg bg-white">
                      <div className="flex justify-between items-center mb-6">
                        <div className="flex items-center">
                          <span className="text-xl font-bold text-primary">Wisata<span className="text-secondary">Jelajah</span></span>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-500">Nomor Booking</p>
                          <p className="font-bold">{booking.booking_number}</p>
                        </div>
                      </div>
                      
                      <div className="flex flex-col md:flex-row gap-6 mb-6">
                        <div className="md:w-1/3 flex flex-col items-center justify-center">
                          <div className="w-full max-w-[180px] bg-white p-2 border rounded-md">
                            <QRCode 
                              value={`${generateBookingCode()}`}
                              size={160}
                              level={"H"}
                              includeMargin={true}
                              className="w-full"
                            />
                          </div>
                          <p className="text-center mt-2 font-mono font-bold text-lg">{generateBookingCode()}</p>
                        </div>
                        
                        <div className="md:w-2/3">
                          <h3 className="font-bold text-xl mb-3">{destination.name}</h3>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm text-gray-500">Nama Pengunjung</p>
                              <p className="font-medium">{booking.visitor_name}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Tanggal Kunjungan</p>
                              <p className="font-medium">
                                {format(new Date(booking.visit_date), 'dd MMMM yyyy', { locale: id })}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Jenis Tiket</p>
                              <p className="font-medium">{ticketType.name}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Jumlah Tiket</p>
                              <p className="font-medium">{booking.quantity} orang</p>
                            </div>
                          </div>
                          
                          <div className="mt-4 p-3 bg-gray-50 rounded-md">
                            <p className="text-sm font-medium">Instruksi:</p>
                            <ul className="text-sm text-gray-600 list-disc pl-5 mt-1">
                              <li>Tunjukkan kode QR ini kepada petugas di pintu masuk</li>
                              <li>E-Tiket berlaku sesuai tanggal kunjungan yang tertera</li>
                              <li>Harap datang minimal 15 menit sebelum waktu kunjungan</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                      
                      <div className="border-t border-gray-200 pt-4 text-center text-sm text-gray-500">
                        <p>E-Tiket ini diterbitkan oleh WisataJelajah</p>
                        <p>Tanggal Pembelian: {format(new Date(booking.created_at), 'dd MMMM yyyy, HH:mm', { locale: id })}</p>
                      </div>
                    </div>
                    
                    <div className="flex justify-center gap-4 mt-6">
                      <Button onClick={downloadTicketAsPDF} className="flex items-center gap-2">
                        <Download className="w-4 h-4" />
                        Unduh PDF
                      </Button>
                      <Button variant="outline" onClick={printTicket} className="flex items-center gap-2">
                        <Printer className="w-4 h-4" />
                        Cetak Tiket
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          
          {/* Right column: Payment instructions or ticket */}
          <div>
            {!isPaid ? (
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-4">Instruksi Pembayaran</h3>
                  
                  <Tabs defaultValue="bank_transfer">
                    <TabsList className="grid w-full grid-cols-2 mb-4">
                      <TabsTrigger value="bank_transfer">Transfer Bank</TabsTrigger>
                      <TabsTrigger value="e_wallet">E-Wallet</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="bank_transfer">
                      <div className="space-y-4">
                        <div>
                          <p className="font-medium">Bank BCA</p>
                          <div className="mt-1 p-3 bg-gray-50 rounded-md">
                            <p className="font-medium">1234567890</p>
                            <p className="text-sm text-gray-600">a.n. PT Wisata Jelajah Indonesia</p>
                          </div>
                        </div>
                        
                        <div>
                          <p className="font-medium">Bank Mandiri</p>
                          <div className="mt-1 p-3 bg-gray-50 rounded-md">
                            <p className="font-medium">0987654321</p>
                            <p className="text-sm text-gray-600">a.n. PT Wisata Jelajah Indonesia</p>
                          </div>
                        </div>
                        
                        <div>
                          <p className="font-medium">Bank BNI</p>
                          <div className="mt-1 p-3 bg-gray-50 rounded-md">
                            <p className="font-medium">1122334455</p>
                            <p className="text-sm text-gray-600">a.n. PT Wisata Jelajah Indonesia</p>
                          </div>
                        </div>
                        
                        <div>
                          <p className="font-medium">Total yang harus dibayar:</p>
                          <div className="mt-1 p-3 bg-primary/10 rounded-md">
                            <p className="font-bold text-lg text-primary">Rp {booking.total_price.toLocaleString('id-ID')}</p>
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="e_wallet">
                      <div className="space-y-4">
                        <div>
                          <p className="font-medium">QRIS</p>
                          <div className="mt-1 p-3 bg-gray-50 rounded-md flex justify-center">
                            <div className="w-48 h-48 bg-gray-200 flex items-center justify-center">
                              <p className="text-gray-500 text-sm text-center">Kode QRIS akan ditampilkan di sini</p>
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <p className="font-medium">Total yang harus dibayar:</p>
                          <div className="mt-1 p-3 bg-primary/10 rounded-md">
                            <p className="font-bold text-lg text-primary">Rp {booking.total_price.toLocaleString('id-ID')}</p>
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                  
                  <div className="mt-6 space-y-4">
                    <div className="p-3 border border-yellow-200 bg-yellow-50 rounded-md">
                      <div className="flex items-start">
                        <Clock className="text-yellow-500 w-5 h-5 mt-0.5 mr-2 flex-shrink-0" />
                        <div>
                          <p className="font-medium text-yellow-800">Batas Waktu Pembayaran</p>
                          <p className="text-sm text-yellow-700">
                            {format(new Date(new Date(booking.created_at).getTime() + 24 * 60 * 60 * 1000), 'dd MMMM yyyy, HH:mm', { locale: id })}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    {isWaitingConfirmation ? (
                      <div className="p-3 border border-blue-200 bg-blue-50 rounded-md">
                        <div className="flex items-start">
                          <AlertCircle className="text-blue-500 w-5 h-5 mt-0.5 mr-2 flex-shrink-0" />
                          <div>
                            <p className="font-medium text-blue-800">Pembayaran Sedang Diproses</p>
                            <p className="text-sm text-blue-700">
                              Bukti pembayaran Anda sedang diverifikasi. Mohon tunggu konfirmasi dari kami.
                            </p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <Label htmlFor="payment_proof">Unggah Bukti Pembayaran</Label>
                        <Input 
                          id="payment_proof" 
                          type="file" 
                          accept="image/*,.pdf"
                          onChange={handleFileChange}
                        />
                        <p className="text-xs text-gray-500">Format: JPG, PNG, atau PDF. Maksimal 5MB.</p>
                        
                        <div className="pt-2">
                          <Button 
                            onClick={uploadPaymentProof} 
                            disabled={!paymentProof || fileUploading}
                            className="w-full"
                          >
                            {fileUploading ? "Mengunggah..." : "Unggah Bukti Pembayaran"}
                          </Button>
                        </div>
                      </div>
                    )}
                    
                    {/* FOR DEMO: Button to simulate payment confirmation */}
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <p className="text-sm text-gray-500 mb-2">Demo Only: Simulate Payment Confirmation</p>
                      <Button 
                        variant="outline" 
                        className="w-full"
                        onClick={simulatePaymentConfirmation}
                      >
                        Konfirmasi Pembayaran (Demo)
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 text-green-600 mb-4">
                    <Check className="h-6 w-6" />
                    <h3 className="font-semibold text-lg">Pembayaran Berhasil</h3>
                  </div>
                  
                  <div className="p-4 bg-green-50 rounded-lg mb-6">
                    <p className="text-green-800">
                      Pembayaran Anda telah berhasil dikonfirmasi. E-Tiket sudah dapat digunakan pada tanggal kunjungan.
                    </p>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-500">Status Pembayaran</p>
                      <p className="font-medium text-green-600">Terbayar</p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-500">Metode Pembayaran</p>
                      <p className="font-medium">
                        {booking.payment_method === 'bank_transfer' ? 'Transfer Bank' :
                         booking.payment_method === 'e_wallet' ? 'E-Wallet' :
                         booking.payment_method === 'on_site' ? 'Bayar di Tempat' :
                         booking.payment_method}
                      </p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-500">Tanggal Pembayaran</p>
                      <p className="font-medium">
                        {format(new Date(booking.updated_at), 'dd MMMM yyyy, HH:mm', { locale: id })}
                      </p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-500">Total Pembayaran</p>
                      <p className="font-bold text-primary">Rp {booking.total_price.toLocaleString('id-ID')}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
            
            <div className="mt-6">
              <Button variant="outline" className="w-full" onClick={() => navigate('/bookings')}>
                Kembali ke Pesanan Saya
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Payment;
