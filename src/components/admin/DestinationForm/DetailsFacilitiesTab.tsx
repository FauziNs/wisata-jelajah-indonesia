
import React from 'react';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useFormContext } from 'react-hook-form';
import { Clock, List, Plus, Trash } from 'lucide-react';

const facilities = [
  { id: 'toilet', label: 'Toilet' },
  { id: 'prayerRoom', label: 'Tempat Ibadah' },
  { id: 'parking', label: 'Tempat Parkir' },
  { id: 'diningArea', label: 'Area Makan' },
  { id: 'photoSpot', label: 'Spot Foto' },
  { id: 'wifi', label: 'Wifi' },
  { id: 'accommodation', label: 'Penginapan' },
  { id: 'souvenir', label: 'Toko Souvenir' },
  { id: 'guide', label: 'Pemandu Wisata' },
  { id: 'disabilityAccess', label: 'Fasilitas Disabilitas' },
  { id: 'atm', label: 'ATM/Bank' },
];

const daysOfWeek = [
  { id: 'monday', label: 'Senin' },
  { id: 'tuesday', label: 'Selasa' },
  { id: 'wednesday', label: 'Rabu' },
  { id: 'thursday', label: 'Kamis' },
  { id: 'friday', label: 'Jumat' },
  { id: 'saturday', label: 'Sabtu' },
  { id: 'sunday', label: 'Minggu' },
];

const DetailsFacilitiesTab = () => {
  const { control, watch } = useFormContext();
  const [faqs, setFaqs] = React.useState([{ question: '', answer: '' }]);

  const handleAddFaq = () => {
    setFaqs([...faqs, { question: '', answer: '' }]);
  };

  const handleRemoveFaq = (index: number) => {
    const newFaqs = [...faqs];
    newFaqs.splice(index, 1);
    setFaqs(newFaqs);
  };

  const handleFaqChange = (index: number, field: 'question' | 'answer', value: string) => {
    const newFaqs = [...faqs];
    newFaqs[index][field] = value;
    setFaqs(newFaqs);
  };

  return (
    <div className="space-y-8">
      <div className="border p-4 rounded-md bg-gray-50">
        <div className="flex items-center mb-4">
          <Clock className="text-primary mr-2" />
          <h3 className="font-medium">Jam Operasional</h3>
        </div>
        
        <div className="space-y-4">
          {daysOfWeek.map((day) => (
            <div key={day.id} className="grid grid-cols-12 gap-4 items-center">
              <div className="col-span-3 sm:col-span-2">
                <FormField
                  control={control}
                  name={`operationalHours.${day.id}.isOpen`}
                  render={({ field }) => (
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id={`open-${day.id}`}
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                      <label
                        htmlFor={`open-${day.id}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {day.label}
                      </label>
                    </div>
                  )}
                />
              </div>
              
              <div className="col-span-9 sm:col-span-10">
                <div className="flex flex-wrap gap-2">
                  <FormField
                    control={control}
                    name={`operationalHours.${day.id}.openTime`}
                    render={({ field }) => (
                      <FormItem className="flex-1 min-w-[120px]">
                        <FormControl>
                          <Input
                            type="time"
                            placeholder="Jam Buka"
                            disabled={!watch(`operationalHours.${day.id}.isOpen`)}
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <span className="text-sm flex items-center">sampai</span>
                  <FormField
                    control={control}
                    name={`operationalHours.${day.id}.closeTime`}
                    render={({ field }) => (
                      <FormItem className="flex-1 min-w-[120px]">
                        <FormControl>
                          <Input
                            type="time"
                            placeholder="Jam Tutup"
                            disabled={!watch(`operationalHours.${day.id}.isOpen`)}
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="border p-4 rounded-md bg-gray-50">
        <div className="flex items-center mb-4">
          <List className="text-primary mr-2" />
          <h3 className="font-medium">Fasilitas Tersedia</h3>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {facilities.map((facility) => (
            <FormField
              key={facility.id}
              control={control}
              name={`facilities.${facility.id}`}
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-2 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel className="font-normal cursor-pointer">
                    {facility.label}
                  </FormLabel>
                </FormItem>
              )}
            />
          ))}
        </div>
      </div>

      <FormField
        control={control}
        name="rules"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Aturan dan Ketentuan</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="Masukkan aturan dan ketentuan destinasi wisata"
                className="min-h-[120px]"
                {...field} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div>
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-medium">FAQ Destinasi</h3>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={handleAddFaq}
            className="flex items-center gap-1"
          >
            <Plus size={14} /> Tambah FAQ
          </Button>
        </div>
        
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="border rounded-md p-3">
              <div className="flex justify-between items-start mb-2">
                <h4 className="text-sm font-medium">FAQ #{index + 1}</h4>
                {faqs.length > 1 && (
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    className="h-8 w-8 p-0 text-destructive"
                    onClick={() => handleRemoveFaq(index)}
                  >
                    <Trash size={14} />
                  </Button>
                )}
              </div>
              
              <div className="space-y-3">
                <div>
                  <Input
                    placeholder="Pertanyaan"
                    value={faq.question}
                    onChange={(e) => handleFaqChange(index, 'question', e.target.value)}
                  />
                </div>
                <div>
                  <Textarea
                    placeholder="Jawaban"
                    value={faq.answer}
                    onChange={(e) => handleFaqChange(index, 'answer', e.target.value)}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DetailsFacilitiesTab;
