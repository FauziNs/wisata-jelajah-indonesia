
import React from 'react';
import { FormProvider } from 'react-hook-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Map, Image, List, Ticket, Search, Save, X } from 'lucide-react';
import InformationTab from './InformationTab';
import GalleryTab from './GalleryTab';
import DetailsFacilitiesTab from './DetailsFacilitiesTab';
import TicketsPricingTab from './TicketsPricingTab';
import SeoMetaTab from './SeoMetaTab';
import { useDestinationForm } from '@/hooks/useDestinationForm';

const DestinationFormContainer = () => {
  const { 
    form, 
    activeTab, 
    setActiveTab, 
    isSubmitting, 
    onSubmit, 
    handleCancel 
  } = useDestinationForm();

  return (
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
  );
};

export default DestinationFormContainer;
