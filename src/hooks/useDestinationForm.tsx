
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';

// Define the destination form schema
export const destinationFormSchema = z.object({
  // Information Tab
  name: z.string().min(3, { message: "Nama destinasi wajib diisi minimal 3 karakter" }),
  slug: z.string().optional(),
  shortDescription: z.string().max(160, { message: "Deskripsi singkat maksimal 160 karakter" }),
  fullDescription: z.string().min(10, { message: "Deskripsi lengkap wajib diisi" }),
  category: z.string({ required_error: "Pilih kategori" }),
  status: z.string().optional(),
  price: z.string().transform(val => {
    const num = Number(val);
    return isNaN(num) ? 0 : num;
  }),
  
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
  price: "0",
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
  const form = useForm<DestinationFormValues>({
    resolver: zodResolver(destinationFormSchema),
    defaultValues,
    mode: "onChange",
  });
  
  const [activeTab, setActiveTab] = useState("information");
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  return {
    form,
    activeTab,
    setActiveTab,
    isSubmitting,
    onSubmit,
    handleCancel
  };
};
