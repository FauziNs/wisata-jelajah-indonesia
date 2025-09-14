
import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import {
  Search,
  HelpCircle,
  MessageCircle,
  Phone,
  Mail,
  ChevronDown,
  ChevronUp,
  User,
  Ticket,
  CreditCard,
  QrCode,
  ArrowLeft,
  Clock,
  CheckCircle,
  ExternalLink
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface HelpCategory {
  id: string;
  name: string;
  icon: string;
  display_order: number;
}

interface HelpArticle {
  id: string;
  category_id: string;
  question: string;
  answer: string;
  display_order: number;
  is_featured: boolean;
}

const getIconComponent = (iconName: string) => {
  const icons: { [key: string]: any } = {
    'user': User,
    'ticket': Ticket,
    'credit-card': CreditCard,
    'qr-code': QrCode,
    'arrow-left': ArrowLeft,
    'help-circle': HelpCircle
  };
  return icons[iconName] || HelpCircle;
};


const FAQ = ({ articles }: { articles: HelpArticle[] }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  
  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };
  
  return (
    <div className="space-y-4">
      {articles.map((article, index) => (
        <div 
          key={article.id} 
          className="border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
        >
          <button
            className="w-full px-6 py-4 flex items-center justify-between text-left font-medium hover:bg-muted/50 transition-colors"
            onClick={() => toggleFAQ(index)}
          >
            <div className="flex items-center gap-3">
              {article.is_featured && (
                <Badge className="bg-accent text-white">Popular</Badge>
              )}
              <span className="text-lg">{article.question}</span>
            </div>
            {openIndex === index ? 
              <ChevronUp className="h-5 w-5 text-muted-foreground" /> : 
              <ChevronDown className="h-5 w-5 text-muted-foreground" />
            }
          </button>
          
          {openIndex === index && (
            <div className="px-6 py-4 bg-muted/30 border-t">
              <p className="text-muted-foreground leading-relaxed">{article.answer}</p>
            </div>
          )}
        </div>
      ))}
      {articles.length === 0 && (
        <div className="text-center py-8">
          <HelpCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">Belum ada artikel untuk kategori ini.</p>
        </div>
      )}
    </div>
  );
};

const Help = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [categories, setCategories] = useState<HelpCategory[]>([]);
  const [articles, setArticles] = useState<HelpArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchHelpData();
  }, []);

  const fetchHelpData = async () => {
    try {
      const [categoriesResponse, articlesResponse] = await Promise.all([
        supabase
          .from('help_categories')
          .select('*')
          .order('display_order'),
        supabase
          .from('help_articles')
          .select('*')
          .order('display_order')
      ]);

      if (categoriesResponse.error) throw categoriesResponse.error;
      if (articlesResponse.error) throw articlesResponse.error;

      setCategories(categoriesResponse.data || []);
      setArticles(articlesResponse.data || []);
    } catch (error) {
      console.error('Error fetching help data:', error);
      toast({
        title: "Error",
        description: "Gagal memuat data bantuan. Silakan coba lagi.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getArticlesByCategory = (categoryId: string) => {
    return articles.filter(article => article.category_id === categoryId);
  };
  
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Searching for:', searchQuery);
    // Implement search functionality here
  };
  
  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Pesan terkirim!",
        description: "Tim kami akan menghubungi Anda dalam 24 jam.",
      });
      
      // Reset form
      setContactForm({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal mengirim pesan. Silakan coba lagi.",
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setContactForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="bg-gradient-to-br from-primary via-primary/90 to-secondary text-white py-16">
          <div className="container-custom text-center">
            <Skeleton className="h-8 w-64 mx-auto mb-6 bg-white/20" />
            <Skeleton className="h-6 w-96 mx-auto mb-8 bg-white/20" />
            <Skeleton className="h-12 w-full max-w-xl mx-auto bg-white/20" />
          </div>
        </div>
        <div className="container-custom py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <Skeleton className="h-6 w-full mb-2" />
                  <Skeleton className="h-4 w-full mb-4" />
                  <Skeleton className="h-8 w-24" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary via-primary/90 to-secondary text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-black/10 to-transparent"></div>
        <div className="container-custom text-center relative z-10">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="bg-accent/20 p-3 rounded-full">
              <HelpCircle className="h-8 w-8 text-accent" />
            </div>
            <div>
              <Badge className="bg-accent text-white mb-2">24/7 Support</Badge>
              <h1 className="text-4xl md:text-6xl font-bold">
                Pusat <span className="text-accent">Bantuan</span>
              </h1>
            </div>
          </div>
          <p className="text-lg text-white/90 max-w-2xl mx-auto mb-8 leading-relaxed">
            Temukan jawaban untuk pertanyaan Anda atau hubungi kami untuk bantuan lebih lanjut
          </p>
          
          <form onSubmit={handleSearchSubmit} className="max-w-2xl mx-auto relative">
            <div className="relative">
              <Input
                type="text"
                placeholder="Cari pertanyaan, topik, atau kata kunci..."
                className="pl-12 h-14 text-lg text-black border-0 shadow-lg rounded-xl"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
              <Button 
                type="submit" 
                className="absolute right-2 top-2 bg-accent hover:bg-accent/90 text-white rounded-lg h-10 px-6"
              >
                <Search className="h-4 w-4 mr-2" />
                Cari
              </Button>
            </div>
          </form>
        </div>
      </div>
      
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Quick Links */}
          <div className="lg:col-span-4">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-3">Bantuan Cepat</h2>
              <p className="text-muted-foreground text-lg">Pilih cara yang paling mudah untuk mendapatkan bantuan</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              <Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg hover:scale-105">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className="bg-gradient-to-br from-primary to-primary/80 p-4 rounded-xl text-white group-hover:scale-110 transition-transform">
                      <MessageCircle className="h-6 w-6" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">Chat Bantuan</CardTitle>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-sm text-green-600 font-medium">Online</span>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-muted-foreground mb-4">Chat langsung dengan tim layanan pelanggan kami yang siap membantu 24/7</p>
                  <Button className="w-full bg-primary hover:bg-primary/90 text-white">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Mulai Chat
                  </Button>
                </CardContent>
              </Card>
              
              <Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg hover:scale-105">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className="bg-gradient-to-br from-secondary to-secondary/80 p-4 rounded-xl text-white group-hover:scale-110 transition-transform">
                      <Phone className="h-6 w-6" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">Call Center</CardTitle>
                      <div className="flex items-center gap-2 mt-1">
                        <Clock className="w-3 h-3 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">08:00 - 20:00 WIB</span>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-muted-foreground mb-4">Hubungi langsung tim customer service untuk bantuan langsung</p>
                  <Button variant="outline" className="w-full hover:bg-secondary hover:text-white border-secondary">
                    <Phone className="h-4 w-4 mr-2" />
                    0800-1234-5678
                  </Button>
                </CardContent>
              </Card>
              
              <Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg hover:scale-105">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className="bg-gradient-to-br from-accent to-accent/80 p-4 rounded-xl text-white group-hover:scale-110 transition-transform">
                      <Mail className="h-6 w-6" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">Email Support</CardTitle>
                      <div className="flex items-center gap-2 mt-1">
                        <CheckCircle className="w-3 h-3 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">Respon 24 jam</span>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-muted-foreground mb-4">Kirim detail pertanyaan Anda melalui email untuk bantuan komprehensif</p>
                  <Button variant="outline" className="w-full hover:bg-accent hover:text-white border-accent">
                    <Mail className="h-4 w-4 mr-2" />
                    help@wisatajelajah.id
                    <ExternalLink className="h-3 w-3 ml-1" />
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
          
          {/* FAQs */}
          <div className="lg:col-span-3">
            <div className="mb-8">
              <h2 className="text-3xl font-bold mb-3">Pertanyaan yang Sering Diajukan</h2>
              <p className="text-muted-foreground text-lg">Temukan jawaban untuk pertanyaan umum tentang layanan kami</p>
            </div>
            
            {categories.length > 0 ? (
              <Tabs defaultValue={categories[0]?.id} className="w-full">
                <TabsList className="mb-8 bg-muted/50 p-1 rounded-xl grid-cols-3 lg:grid-cols-6">
                  {categories.map(category => {
                    const IconComponent = getIconComponent(category.icon);
                    return (
                      <TabsTrigger 
                        key={category.id} 
                        value={category.id} 
                        className="rounded-lg font-medium flex items-center gap-2 text-sm"
                      >
                        <IconComponent className="h-4 w-4" />
                        <span className="hidden sm:inline">{category.name}</span>
                      </TabsTrigger>
                    );
                  })}
                </TabsList>
                
                {categories.map(category => (
                  <TabsContent key={category.id} value={category.id}>
                    <FAQ articles={getArticlesByCategory(category.id)} />
                  </TabsContent>
                ))}
              </Tabs>
            ) : (
              <div className="text-center py-12">
                <HelpCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Sedang memuat data bantuan...</p>
              </div>
            )}
          </div>
          
          {/* Contact Form */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8 shadow-xl border-0">
              <CardHeader className="bg-gradient-to-r from-primary to-secondary text-white rounded-t-lg">
                <CardTitle className="text-xl flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  Hubungi Kami
                </CardTitle>
                <p className="text-white/90 text-sm">
                  Tidak menemukan jawaban? Kirim pesan kepada kami
                </p>
              </CardHeader>
              <CardContent className="p-6">
                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium">Nama Lengkap</label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="Masukkan nama lengkap"
                      value={contactForm.name}
                      onChange={handleInputChange}
                      required
                      className="rounded-lg"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium">Email</label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="nama@email.com"
                      value={contactForm.email}
                      onChange={handleInputChange}
                      required
                      className="rounded-lg"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="subject" className="text-sm font-medium">Kategori Pertanyaan</label>
                    <select
                      id="subject"
                      name="subject"
                      className="w-full h-10 rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      value={contactForm.subject}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="" disabled>Pilih kategori</option>
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
                      placeholder="Jelaskan pertanyaan atau masalah Anda dengan detail..."
                      rows={4}
                      value={contactForm.message}
                      onChange={handleInputChange}
                      required
                      className="rounded-lg resize-none"
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-primary hover:bg-primary/90 text-white rounded-lg h-11"
                    disabled={submitting}
                  >
                    {submitting ? (
                      <>
                        <Clock className="h-4 w-4 mr-2 animate-spin" />
                        Mengirim...
                      </>
                    ) : (
                      <>
                        <Mail className="h-4 w-4 mr-2" />
                        Kirim Pesan
                      </>
                    )}
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
