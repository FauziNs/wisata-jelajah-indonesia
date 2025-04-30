
import React from 'react';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Image, X, Upload, Youtube } from 'lucide-react';
import { useFormContext } from 'react-hook-form';

const GalleryTab = () => {
  const { control } = useFormContext();

  const [mainPreview, setMainPreview] = React.useState<string | null>(null);
  const [galleryPreviews, setGalleryPreviews] = React.useState<string[]>([]);

  const handleMainImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      validateImageFile(file) && setMainPreview(URL.createObjectURL(file));
    }
  };

  const handleGalleryImagesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length) {
      const newPreviews: string[] = [];
      
      for (let i = 0; i < files.length; i++) {
        if (validateImageFile(files[i])) {
          newPreviews.push(URL.createObjectURL(files[i]));
        }
      }
      
      setGalleryPreviews([...galleryPreviews, ...newPreviews]);
    }
  };

  const validateImageFile = (file: File): boolean => {
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    const maxSize = 2 * 1024 * 1024; // 2MB
    
    if (!validTypes.includes(file.type)) {
      alert('File harus berformat JPG, PNG, atau WebP');
      return false;
    }
    
    if (file.size > maxSize) {
      alert('Ukuran file tidak boleh melebihi 2MB');
      return false;
    }
    
    return true;
  };

  const removeGalleryImage = (index: number) => {
    const newPreviews = [...galleryPreviews];
    newPreviews.splice(index, 1);
    setGalleryPreviews(newPreviews);
  };

  return (
    <div className="space-y-6">
      <FormField
        control={control}
        name="mainImage"
        render={({ field: { value, onChange, ...field } }) => (
          <FormItem>
            <FormLabel>
              Foto Utama <span className="text-destructive">*</span>
            </FormLabel>
            <FormControl>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Input
                    id="mainImage"
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className="hidden"
                    onChange={(e) => {
                      handleMainImageChange(e);
                      onChange(e.target.files?.[0]);
                    }}
                    {...field}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById('mainImage')?.click()}
                    className="flex gap-2 items-center"
                  >
                    <Upload size={16} /> Pilih Foto
                  </Button>
                  <span className="text-sm text-gray-500">
                    Format: JPG, PNG, WebP. Maks: 2MB
                  </span>
                </div>
                
                {mainPreview && (
                  <div className="relative inline-block">
                    <img
                      src={mainPreview}
                      alt="Preview"
                      className="h-48 w-auto object-cover rounded-md border"
                    />
                    <Button
                      type="button"
                      size="icon"
                      variant="destructive"
                      className="absolute top-2 right-2 h-6 w-6"
                      onClick={() => {
                        setMainPreview(null);
                        onChange(null);
                      }}
                    >
                      <X size={14} />
                    </Button>
                  </div>
                )}
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="galleryImages"
        render={({ field: { value, onChange, ...field } }) => (
          <FormItem>
            <FormLabel>
              Galeri Foto <span className="text-destructive">*</span>{' '}
              <span className="text-sm font-normal text-gray-500">(Min. 5 foto)</span>
            </FormLabel>
            <FormControl>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Input
                    id="galleryImages"
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    multiple
                    className="hidden"
                    onChange={(e) => {
                      handleGalleryImagesChange(e);
                      // Handle the file list for the form
                      if (e.target.files) {
                        const fileList = Array.from(e.target.files);
                        onChange(fileList);
                      }
                    }}
                    {...field}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById('galleryImages')?.click()}
                    className="flex gap-2 items-center"
                  >
                    <Image size={16} /> Unggah Foto
                  </Button>
                  <span className="text-sm text-gray-500">
                    Format: JPG, PNG, WebP. Maks: 2MB per foto
                  </span>
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                  {galleryPreviews.map((preview, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={preview}
                        alt={`Gallery ${index + 1}`}
                        className="h-28 w-full object-cover rounded-md border"
                      />
                      <Button
                        type="button"
                        size="icon"
                        variant="destructive"
                        className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => removeGalleryImage(index)}
                      >
                        <X size={14} />
                      </Button>
                    </div>
                  ))}
                </div>
                
                {galleryPreviews.length > 0 && (
                  <p className="text-sm text-gray-500">
                    {galleryPreviews.length} foto ditambahkan{' '}
                    {galleryPreviews.length < 5 && (
                      <span className="text-amber-500">
                        (min. 5 foto diperlukan)
                      </span>
                    )}
                  </p>
                )}
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="youtubeUrl"
        render={({ field }) => (
          <FormItem>
            <FormLabel>URL Video YouTube</FormLabel>
            <FormControl>
              <div className="flex items-center gap-3">
                <Youtube size={20} className="text-red-600" />
                <Input placeholder="https://youtube.com/watch?v=..." {...field} />
              </div>
            </FormControl>
            <p className="text-xs text-gray-500 mt-1">
              Opsional: Masukkan URL video YouTube untuk ditampilkan di halaman detail destinasi
            </p>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default GalleryTab;
