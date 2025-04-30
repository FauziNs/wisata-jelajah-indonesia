
import React from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Map, Image, List, Ticket, Search, Save, X } from 'lucide-react';
import InformationTab from '@/components/admin/DestinationForm/InformationTab';
import GalleryTab from '@/components/admin/DestinationForm/GalleryTab';
import DetailsFacilitiesTab from '@/components/admin/DestinationForm/DetailsFacilitiesTab';
import TicketsPricingTab from '@/components/admin/DestinationForm/TicketsPricingTab';
import SeoMetaTab from '@/components/admin/DestinationForm/SeoMetaTab';

// Define the destination form schema
const destinationFormSchema = z.object({
  // Information Tab
  name: z.string().min(3, { message: "Nama destinasi wajib diisi minimal 3 karakter" }),
  slug: z.string().optional(),
  shortDescription: z.string().max(160, { message: "Deskripsi singkat maksimal 160 karakter" }),
  fullDescription: z.string().min(10, { message: "Deskripsi lengkap wajib diisi" }),
  category: z.string({ required_error: "Pilih kategori" }),
  status: z.string().optional(),
  
  // Location
  province: z.string({ required_error: "Pilih provinsi" }),
  city: z.string().min(2, { message: "Nama kabupaten/kota wajib diisi" }),
  district: z.string().optional(),
  fullAddress: z.string().optional(),
  latitude: z.string().optional(),
  longitude: z.string().optional(),
  
  // Gallery Tab
  mainImage: z.any().optional(),
  galleryImages: z.any().optional(),
  youtubeUrl: z.string().optional(),
  
  // Details & Facilities
  operationalHours: z.record(z.object({
    isOpen: z.boolean().optional(),
    openTime: z.string().optional(),
    closeTime: z.string().optional(),
  })).optional(),
  facilities: z.record(z.boolean().optional()).optional(),
  rules: z.string().optional(),
  
  // Tickets & Pricing
  tickets: z.array(
    z.object({
      name: z.string().optional(),
      price: z.string().optional(),
      description: z.string().optional(),
      availability: z.string().optional(),
      quota: z.string().optional(),
    })
  ).optional(),
  discount: z.string().optional(),
  promoCode: z.string().optional(),
  promoStartDate: z.string().optional(),
  promoEndDate: z.string().optional(),
  
  // SEO & Meta
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  canonicalUrl: z.string().optional(),
  ogImage: z.any().optional(),
});

type DestinationFormValues = z.infer<typeof destinationFormSchema>;

const defaultValues: Partial<DestinationFormValues> = {
  status: "Regular",
  operationalHours: {
    monday: { isOpen: true, openTime: "08:00", closeTime: "17:00" },
    tuesday: { isOpen: true, openTime: "08:00", closeTime: "17:00" },
    wednesday: { isOpen: true, openTime: "08:00", closeTime: "17:00" },
    thursday: { isOpen: true, openTime: "08:00", closeTime: "17:00" },
    friday: { isOpen: true, openTime: "08:00", closeTime: "17:00" },
    saturday: { isOpen: true, openTime: "08:00", closeTime: "17:00" },
    sunday: { isOpen: true, openTime: "08:00", closeTime: "17:00" },
  },
  facilities: {
    toilet: false,
    prayerRoom: false,
    parking: false,
    diningArea: false,
    photoSpot: false,
    wifi: false,
    accommodation: false,
    souvenir: false,
    guide: false,
    disabilityAccess: false,
    atm: false,
  },
};

const DestinationForm = () => {
  const form = useForm<DestinationFormValues>({
    resolver: zodResolver(destinationFormSchema),
    defaultValues,
    mode: "onChange",
  });
  
  const [activeTab, setActiveTab] = React.useState("information");
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  // Handle form submission
  const onSubmit = (data: DestinationFormValues) => {
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      console.log("Form submitted:", data);
      toast.success("Destinasi berhasil disimpan!");
      setIsSubmitting(false);
      // In a real app, you would redirect to the destinations list or show more feedback
    }, 1500);
  };

  const handleCancel = () => {
    if (confirm("Apakah Anda yakin ingin membatalkan? Semua perubahan akan hilang.")) {
      // Navigate to destinations list
      window.location.href = "/admin/destinations";
    }
  };

  return (
    <div className="py-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold">Tambah Destinasi Baru</h1>
          <p className="text-gray-500">Isi formulir untuk menambahkan destinasi wisata baru</p>
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            onClick={handleCancel}
            className="flex items-center gap-2"
            disabled={isSubmitting}
          >
            <X size={16} /> Batal
          </Button>
          <Button
            type="button"
            onClick={form.handleSubmit(onSubmit)}
            className="flex items-center gap-2"
            disabled={isSubmitting}
          >
            <Save size={16} /> {isSubmitting ? "Menyimpan..." : "Simpan"}
          </Button>
        </div>
      </div>

      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Card className="mb-6">
            <CardHeader className="bg-muted/20">
              <CardTitle>Form Tambah Destinasi Wisata</CardTitle>
              <CardDescription>
                Isi informasi destinasi wisata dengan lengkap untuk hasil yang optimal
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid grid-cols-2 md:grid-cols-5 mb-8 w-full">
                  <TabsTrigger value="information" className="flex gap-2 items-center">
                    <Map className="h-4 w-4" />
                    <span className="hidden md:inline">Informasi Dasar</span>
                    <span className="md:hidden">Info</span>
                  </TabsTrigger>
                  <TabsTrigger value="gallery" className="flex gap-2 items-center">
                    <Image className="h-4 w-4" />
                    <span>Galeri</span>
                  </TabsTrigger>
                  <TabsTrigger value="details" className="flex gap-2 items-center">
                    <List className="h-4 w-4" />
                    <span className="hidden md:inline">Detail & Fasilitas</span>
                    <span className="md:hidden">Detail</span>
                  </TabsTrigger>
                  <TabsTrigger value="tickets" className="flex gap-2 items-center">
                    <Ticket className="h-4 w-4" />
                    <span className="hidden md:inline">Tiket & Harga</span>
                    <span className="md:hidden">Tiket</span>
                  </TabsTrigger>
                  <TabsTrigger value="seo" className="flex gap-2 items-center">
                    <Search className="h-4 w-4" />
                    <span>SEO</span>
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="information">
                  <InformationTab />
                </TabsContent>
                
                <TabsContent value="gallery">
                  <GalleryTab />
                </TabsContent>
                
                <TabsContent value="details">
                  <DetailsFacilitiesTab />
                </TabsContent>
                
                <TabsContent value="tickets">
                  <TicketsPricingTab />
                </TabsContent>
                
                <TabsContent value="seo">
                  <SeoMetaTab />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          <div className="flex justify-end space-x-4 mb-8">
            <Button
              variant="outline"
              type="button"
              onClick={handleCancel}
              disabled={isSubmitting}
              className="gap-2"
            >
              <X size={16} /> Batal
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="gap-2"
            >
              <Save size={16} /> {isSubmitting ? "Menyimpan..." : "Simpan Destinasi"}
            </Button>
          </div>
        </form>
      </FormProvider>
    </div>
  );
};

export default DestinationForm;
