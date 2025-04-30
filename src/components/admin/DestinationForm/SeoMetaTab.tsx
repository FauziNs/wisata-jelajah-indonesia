
import React from 'react';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useFormContext } from 'react-hook-form';
import { Image, Search, X } from 'lucide-react';

const SeoMetaTab = () => {
  const { control } = useFormContext();
  const [ogImagePreview, setOgImagePreview] = React.useState<string | null>(null);
  const [keywords, setKeywords] = React.useState<string[]>([]);
  const [keywordInput, setKeywordInput] = React.useState('');

  const handleAddKeyword = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const newKeyword = keywordInput.trim();
      if (newKeyword && !keywords.includes(newKeyword)) {
        setKeywords([...keywords, newKeyword]);
        setKeywordInput('');
      }
    }
  };

  const handleRemoveKeyword = (keywordToRemove: string) => {
    setKeywords(keywords.filter(keyword => keyword !== keywordToRemove));
  };

  const handleOgImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      validateImageFile(file) && setOgImagePreview(URL.createObjectURL(file));
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

  return (
    <div className="space-y-6">
      <div className="border p-4 rounded-md bg-gray-50">
        <div className="flex items-center mb-4">
          <Search className="text-primary mr-2" />
          <h3 className="font-medium">Pengaturan SEO</h3>
        </div>
        
        <div className="space-y-4">
          <FormField
            control={control}
            name="metaTitle"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Meta Title</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Judul untuk mesin pencari (50-60 karakter)"
                    maxLength={60}
                    {...field} 
                  />
                </FormControl>
                <div className="text-xs text-gray-500 text-right">
                  {field.value?.length || 0}/60 karakter
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="metaDescription"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Meta Description</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Deskripsi untuk hasil pencarian (150-160 karakter)"
                    maxLength={160}
                    {...field} 
                  />
                </FormControl>
                <div className="text-xs text-gray-500 text-right">
                  {field.value?.length || 0}/160 karakter
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <div>
            <FormLabel>Focus Keywords</FormLabel>
            <div className="flex flex-wrap gap-2 mb-2">
              {keywords.map((keyword) => (
                <div key={keyword} className="bg-primary/10 text-primary px-2 py-1 rounded-md flex items-center">
                  <span>{keyword}</span>
                  <button 
                    type="button"
                    className="ml-2 text-primary hover:text-primary/80"
                    onClick={() => handleRemoveKeyword(keyword)}
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>
            <Input
              placeholder="Ketik keyword dan tekan Enter"
              value={keywordInput}
              onChange={(e) => setKeywordInput(e.target.value)}
              onKeyDown={handleAddKeyword}
            />
            <p className="text-xs text-gray-500 mt-1">
              Tambahkan keyword fokus dan tekan Enter untuk menambahkan
            </p>
          </div>

          <FormField
            control={control}
            name="canonicalUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Canonical URL</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="https://example.com/destinations/nama-destinasi"
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="ogImage"
            render={({ field: { value, onChange, ...field } }) => (
              <FormItem>
                <FormLabel>Open Graph Image</FormLabel>
                <FormControl>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Input
                        id="ogImage"
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        className="hidden"
                        onChange={(e) => {
                          handleOgImageChange(e);
                          onChange(e.target.files?.[0]);
                        }}
                        {...field}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => document.getElementById('ogImage')?.click()}
                        className="flex gap-2 items-center"
                      >
                        <Image size={16} /> Pilih Gambar
                      </Button>
                      <span className="text-sm text-gray-500">
                        Format: JPG, PNG, WebP. Ukuran ideal: 1200x630px
                      </span>
                    </div>
                    
                    {ogImagePreview && (
                      <div className="relative inline-block">
                        <img
                          src={ogImagePreview}
                          alt="Open Graph Preview"
                          className="h-32 w-auto object-cover rounded-md border"
                        />
                        <Button
                          type="button"
                          size="icon"
                          variant="destructive"
                          className="absolute top-2 right-2 h-6 w-6"
                          onClick={() => {
                            setOgImagePreview(null);
                            onChange(null);
                          }}
                        >
                          <X size={14} />
                        </Button>
                      </div>
                    )}
                  </div>
                </FormControl>
                <p className="text-xs text-gray-500 mt-1">
                  Gambar yang ditampilkan ketika destinasi dibagikan di media sosial
                </p>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
    </div>
  );
};

export default SeoMetaTab;
