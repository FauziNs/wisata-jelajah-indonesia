
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import {
  Search,
  HelpCircle,
  MessageCircle,
  Phone,
  Mail,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const faqCategories = [
  { id: 'account', name: 'Akun dan Profil', icon: HelpCircle },
  { id: 'booking', name: 'Pemesanan Tiket', icon: HelpCircle },
  { id: 'payment', name: 'Pembayaran', icon: HelpCircle },
  { id: 'ticket', name: 'E-Tiket', icon: HelpCircle },
  { id: 'refund', name: 'Pembatalan & Refund', icon: HelpCircle },
  { id: 'site', name: 'Penggunaan Website', icon: HelpCircle },
];

const faqs = [
  {
    category: 'account',
    items: [
      {
        question: 'Bagaimana cara mendaftar akun di WisataJelajah?',
        answer: 'Untuk mendaftar, klik tombol "Daftar" di pojok kanan atas halaman. Isi formulir pendaftaran dengan nama, email, dan password Anda. Kemudian ikuti instruksi verifikasi email yang dikirimkan ke alamat email Anda.'
      },
      {
        question: 'Bagaimana cara mengubah password saya?',
        answer: 'Masuk ke akun Anda, klik profil di pojok kanan atas, pilih "Pengaturan Akun", kemudian pilih tab "Keamanan". Di sana Anda dapat mengubah password dengan memasukkan password lama dan password baru Anda.'
      },
      {
        question: 'Apakah saya bisa mengubah alamat email terdaftar?',
        answer: 'Ya, Anda dapat mengubah alamat email terdaftar melalui halaman Pengaturan Akun. Namun, Anda perlu memverifikasi alamat email baru sebelum perubahan diterapkan sepenuhnya.'
      },
      {
        question: 'Bagaimana cara menghapus akun saya?',
        answer: 'Untuk menghapus akun, silakan masuk ke Pengaturan Akun dan gulir ke bawah hingga menemukan opsi "Hapus Akun". Harap dicatat bahwa penghapusan akun bersifat permanen dan semua data terkait tidak dapat dipulihkan.'
      }
    ]
  },
  {
    category: 'booking',
    items: [
      {
        question: 'Bagaimana cara memesan tiket wisata?',
        answer: 'Pilih destinasi wisata yang ingin Anda kunjungi, pilih tanggal kunjungan dan jumlah tiket, kemudian klik "Beli Tiket". Ikuti langkah selanjutnya untuk menyelesaikan pembayaran dan menerima e-tiket.'
      },
      {
        question: 'Apakah saya bisa mengubah tanggal kunjungan setelah memesan?',
        answer: 'Ya, untuk sebagian besar tiket, Anda dapat mengubah tanggal kunjungan melalui halaman "Pesanan Saya". Namun, beberapa destinasi memiliki kebijakan tersendiri dan mungkin mengenakan biaya perubahan.'
      },
      {
        question: 'Berapa lama proses konfirmasi pesanan?',
        answer: 'Konfirmasi pesanan biasanya diterima secara instan setelah pembayaran berhasil. E-tiket akan dikirimkan ke email Anda dan juga tersimpan di akun WisataJelajah Anda.'
      },
      {
        question: 'Apakah saya perlu mencetak tiket?',
        answer: 'Sebagian besar destinasi menerima e-tiket digital yang dapat ditunjukkan melalui smartphone Anda. Namun, beberapa destinasi mungkin memerlukan tiket cetak. Informasi ini akan tercantum dalam detail e-tiket Anda.'
      }
    ]
  },
  {
    category: 'payment',
    items: [
      {
        question: 'Apa saja metode pembayaran yang tersedia?',
        answer: 'Kami menerima berbagai metode pembayaran termasuk kartu kredit/debit, transfer bank, e-wallet (GoPay, OVO, DANA, LinkAja), dan virtual account dari berbagai bank.'
      },
      {
        question: 'Berapa lama batas waktu pembayaran?',
        answer: 'Batas waktu pembayaran adalah 1 jam untuk metode pembayaran virtual account dan 15 menit untuk metode pembayaran lainnya. Jika tidak dibayar dalam tenggat waktu tersebut, pesanan akan otomatis dibatalkan.'
      },
      {
        question: 'Mengapa pembayaran saya gagal?',
        answer: 'Pembayaran dapat gagal karena berbagai alasan seperti saldo tidak mencukupi, masalah pada gateway pembayaran, atau kendala teknis lainnya. Periksa metode pembayaran Anda dan coba lagi, atau gunakan metode pembayaran alternatif.'
      },
      {
        question: 'Apakah ada biaya tambahan saat pembayaran?',
        answer: 'Beberapa metode pembayaran mungkin mengenakan biaya layanan tambahan. Informasi biaya tambahan ini akan ditampilkan sebelum Anda menyelesaikan pembayaran.'
      }
    ]
  },
  {
    category: 'ticket',
    items: [
      {
        question: 'Bagaimana cara menggunakan e-tiket?',
        answer: 'Tunjukkan e-tiket dari smartphone Anda atau cetak e-tiket dan bawa ke lokasi wisata. Petugas akan melakukan pemindaian QR code pada tiket Anda untuk validasi.'
      },
      {
        question: 'Bagaimana jika saya kehilangan e-tiket?',
        answer: 'Anda dapat mengakses kembali e-tiket melalui akun WisataJelajah Anda di menu "Pesanan Saya", atau melalui email konfirmasi yang dikirimkan setelah pembayaran berhasil.'
      },
      {
        question: 'Apakah e-tiket dapat digunakan untuk beberapa orang?',
        answer: 'Setiap e-tiket hanya berlaku untuk satu orang. Jika Anda membeli beberapa tiket, setiap orang harus memiliki tiket sendiri dengan QR code yang unik.'
      },
      {
        question: 'Apakah ada batas waktu penggunaan e-tiket?',
        answer: 'Ya, e-tiket hanya berlaku pada tanggal kunjungan yang telah Anda pilih saat pemesanan. Beberapa destinasi mungkin memiliki batasan jam operasional tertentu.'
      }
    ]
  },
  {
    category: 'refund',
    items: [
      {
        question: 'Bagaimana kebijakan pembatalan dan refund?',
        answer: 'Kebijakan pembatalan bervariasi tergantung destinasi. Secara umum, pembatalan minimal 3 hari sebelum tanggal kunjungan mendapatkan refund sebesar 75%, 1-2 hari sebelumnya mendapat refund 50%, dan pembatalan pada hari-H tidak mendapatkan refund.'
      },
      {
        question: 'Bagaimana cara mengajukan pembatalan dan refund?',
        answer: 'Masuk ke akun Anda, pilih menu "Pesanan Saya", pilih pesanan yang ingin dibatalkan, kemudian klik tombol "Batalkan Pesanan". Ikuti instruksi selanjutnya untuk mengajukan refund.'
      },
      {
        question: 'Berapa lama proses refund diproses?',
        answer: 'Proses refund membutuhkan waktu 7-14 hari kerja tergantung metode pembayaran yang Anda gunakan. Refund akan dikembalikan ke metode pembayaran asli yang digunakan saat pemesanan.'
      },
      {
        question: 'Apakah pembatalan karena cuaca buruk bisa mendapatkan refund penuh?',
        answer: 'Untuk pembatalan yang disebabkan oleh penutupan destinasi karena cuaca buruk atau alasan keamanan lainnya, Anda berhak mendapatkan refund penuh atau opsi reschedule tanpa biaya tambahan.'
      }
    ]
  },
  {
    category: 'site',
    items: [
      {
        question: 'Bagaimana cara mencari destinasi wisata?',
        answer: 'Anda dapat menggunakan fitur pencarian di halaman utama atau menjelajahi destinasi berdasarkan kategori, lokasi, atau rekomendasi yang ditampilkan di halaman beranda.'
      },
      {
        question: 'Apakah WisataJelajah memiliki aplikasi mobile?',
        answer: 'Ya, WisataJelajah tersedia dalam versi aplikasi mobile untuk Android dan iOS. Anda dapat mengunduhnya melalui Google Play Store atau Apple App Store.'
      },
      {
        question: 'Bagaimana cara menyimpan destinasi favorit?',
        answer: 'Untuk menyimpan destinasi favorit, klik ikon hati pada halaman detail destinasi. Destinasi yang disimpan dapat dilihat di menu "Favorit" pada profil Anda.'
      },
      {
        question: 'Apakah saya perlu login untuk memesan tiket?',
        answer: 'Ya, Anda perlu login atau mendaftar sebelum melakukan pemesanan tiket untuk memastikan e-tiket tersimpan di akun Anda dan dapat diakses kapan saja.'
      }
    ]
  }
];

const FAQ = ({ category }: { category: string }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  
  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };
  
  const categoryFaqs = faqs.find(faq => faq.category === category)?.items || [];
  
  return (
    <div className="space-y-4">
      {categoryFaqs.map((faq, index) => (
        <div 
          key={index} 
          className="border rounded-lg overflow-hidden"
        >
          <button
            className="w-full px-6 py-4 flex items-center justify-between text-left font-medium hover:bg-gray-50 transition-colors"
            onClick={() => toggleFAQ(index)}
          >
            <span>{faq.question}</span>
            {openIndex === index ? 
              <ChevronUp className="h-5 w-5 text-gray-500" /> : 
              <ChevronDown className="h-5 w-5 text-gray-500" />
            }
          </button>
          
          {openIndex === index && (
            <div className="px-6 py-4 bg-gray-50 border-t">
              <p className="text-gray-600">{faq.answer}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

const Help = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const { toast } = useToast();
  
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Searching for:', searchQuery);
    // Implement search functionality here
  };
  
  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Contact form submitted:', contactForm);
    
    // In a real app, send this data to your backend
    toast({
      title: "Pesan terkirim!",
      description: "Tim kami akan menghubungi Anda segera."
    });
    
    // Reset form
    setContactForm({
      name: '',
      email: '',
      subject: '',
      message: ''
    });
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setContactForm(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary to-blue-700 text-white py-16">
        <div className="container-custom text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-6">Pusat Bantuan</h1>
          <p className="text-lg text-blue-100 max-w-2xl mx-auto mb-8">
            Temukan jawaban untuk pertanyaan Anda atau hubungi kami untuk bantuan lebih lanjut
          </p>
          
          <form onSubmit={handleSearchSubmit} className="max-w-xl mx-auto relative">
            <Input
              type="text"
              placeholder="Cari pertanyaan atau topik..."
              className="pl-12 h-12 text-black"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Button type="submit" className="absolute right-1 top-1">
              Cari
            </Button>
          </form>
        </div>
      </div>
      
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Quick Links */}
          <div className="md:col-span-3">
            <h2 className="text-2xl font-semibold mb-6">Bantuan Cepat</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start">
                    <div className="bg-primary/10 p-3 rounded-full mr-4">
                      <MessageCircle className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Chat Bantuan</h3>
                      <p className="text-sm text-gray-500 mb-4">Chat langsung dengan tim layanan pelanggan kami</p>
                      <Button variant="outline" size="sm">Mulai Chat</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start">
                    <div className="bg-primary/10 p-3 rounded-full mr-4">
                      <Phone className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Call Center</h3>
                      <p className="text-sm text-gray-500 mb-4">Hubungi kami di jam kerja (08:00 - 20:00)</p>
                      <Button variant="outline" size="sm">0800-1234-5678</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start">
                    <div className="bg-primary/10 p-3 rounded-full mr-4">
                      <Mail className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Email</h3>
                      <p className="text-sm text-gray-500 mb-4">Kirim pesan dan dapatkan balasan dalam 24 jam</p>
                      <Button variant="outline" size="sm">help@wisatajelajah.id</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
          
          {/* FAQs */}
          <div className="md:col-span-2">
            <h2 className="text-2xl font-semibold mb-6">Pertanyaan Umum</h2>
            
            <Tabs defaultValue="account" className="w-full">
              <TabsList className="mb-6 flex flex-wrap">
                {faqCategories.map(category => (
                  <TabsTrigger key={category.id} value={category.id} className="mb-2">
                    {category.name}
                  </TabsTrigger>
                ))}
              </TabsList>
              
              {faqCategories.map(category => (
                <TabsContent key={category.id} value={category.id}>
                  <FAQ category={category.id} />
                </TabsContent>
              ))}
            </Tabs>
          </div>
          
          {/* Contact Form */}
          <div>
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-semibold mb-6">Hubungi Kami</h2>
                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium">Nama</label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="Nama lengkap Anda"
                      value={contactForm.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium">Email</label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="email@example.com"
                      value={contactForm.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="subject" className="text-sm font-medium">Perihal</label>
                    <select
                      id="subject"
                      name="subject"
                      className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                      value={contactForm.subject}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="" disabled>Pilih perihal</option>
                      <option value="general">Pertanyaan Umum</option>
                      <option value="booking">Masalah Pemesanan</option>
                      <option value="payment">Masalah Pembayaran</option>
                      <option value="refund">Pembatalan & Refund</option>
                      <option value="technical">Kendala Teknis</option>
                      <option value="other">Lainnya</option>
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="message" className="text-sm font-medium">Pesan</label>
                    <Textarea
                      id="message"
                      name="message"
                      placeholder="Tulis pesan Anda di sini..."
                      rows={5}
                      value={contactForm.message}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <Button type="submit" className="w-full">
                    Kirim Pesan
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Help;
