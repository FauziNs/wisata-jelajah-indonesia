
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

// Define the destination form schema
export const destinationFormSchema = z.object({
  // Information Tab
  name: z.string().min(3, { message: "Nama destinasi wajib diisi minimal 3 karakter" }),
  slug: z.string().optional(),
  shortDescription: z.string().max(160, { message: "Deskripsi singkat maksimal 160 karakter" }),
  fullDescription: z.string().min(10, { message: "Deskripsi lengkap wajib diisi" }),
  category: z.string({ required_error: "Pilih kategori" }),
  status: z.string().optional(),
  price: z.coerce.number().nonnegative({ message: "Harga tidak boleh negatif" }),
  
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

export type DestinationFormValues = z.infer<typeof destinationFormSchema>;

export const defaultValues: Partial<DestinationFormValues> = {
  status: "Regular",
  price: 0,
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

export const useDestinationForm = () => {
  const navigate = useNavigate();
  const form = useForm<DestinationFormValues>({
    resolver: zodResolver(destinationFormSchema),
    defaultValues,
    mode: "onChange",
  });
  
  const [activeTab, setActiveTab] = useState("information");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle form submission
  const onSubmit = async (data: DestinationFormValues) => {
    setIsSubmitting(true);
    
    try {
      // Create a destination object that matches our database schema
      const destinationData = {
        name: data.name,
        description: data.shortDescription,
        long_description: data.fullDescription,
        location: `${data.city}, ${data.province}`,
        full_location: data.fullAddress || `${data.district}, ${data.city}, ${data.province}`,
        category: data.category,
        price: data.price,
        operational_hours: JSON.stringify(data.operationalHours),
        image_url: typeof data.mainImage === 'string' ? data.mainImage : null,
        // Add other fields as needed
      };
      
      // Insert data into Supabase
      const { data: destinationResponse, error } = await supabase
        .from('destinations')
        .insert(destinationData)
        .select()
        .single();
      
      if (error) {
        throw error;
      }
      
      // If we have tickets data, add them too
      if (data.tickets && data.tickets.length > 0 && destinationResponse.id) {
        const ticketsData = data.tickets
          .filter(ticket => ticket.name && ticket.price) // Only process tickets that have a name and price
          .map(ticket => ({
            name: ticket.name || '',
            price: parseInt(ticket.price || '0'),
            description: ticket.description || '',
            destination_id: destinationResponse.id
          }));
        
        if (ticketsData.length > 0) {
          const { error: ticketsError } = await supabase
            .from('ticket_types')
            .insert(ticketsData);
          
          if (ticketsError) {
            console.error('Error adding tickets:', ticketsError);
            toast.error('Destinasi berhasil disimpan tetapi gagal menambahkan tiket');
          }
        }
      }
      
      toast.success("Destinasi berhasil disimpan!");
      // Wait a moment before redirecting to make sure the user sees the success toast
      setTimeout(() => {
        navigate('/admin/destinations');
      }, 1500);
    } catch (error: any) {
      console.error('Error saving destination:', error);
      toast.error(error.message || 'Gagal menyimpan destinasi');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (confirm("Apakah Anda yakin ingin membatalkan? Semua perubahan akan hilang.")) {
      navigate('/admin/destinations');
    }
  };

  return {
    form,
    activeTab,
    setActiveTab,
    isSubmitting,
    onSubmit,
    handleCancel
  };
};
