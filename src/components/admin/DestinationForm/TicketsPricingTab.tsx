
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Trash, Plus, Ticket, Percent, Calendar } from 'lucide-react';
import { useFormContext, Controller } from 'react-hook-form';

type TicketType = {
  name: string;
  price: string;
  description: string;
  availability: string;
  quota?: string;
};

const TicketsPricingTab = () => {
  const { control } = useFormContext();
  const [tickets, setTickets] = React.useState<TicketType[]>([
    {
      name: '',
      price: '',
      description: '',
      availability: 'Available',
      quota: '',
    },
  ]);

  const [hasPromo, setHasPromo] = React.useState(false);

  const handleAddTicket = () => {
    setTickets([
      ...tickets,
      {
        name: '',
        price: '',
        description: '',
        availability: 'Available',
        quota: '',
      },
    ]);
  };

  const handleRemoveTicket = (index: number) => {
    if (tickets.length === 1) return;
    const newTickets = [...tickets];
    newTickets.splice(index, 1);
    setTickets(newTickets);
  };

  const handleTicketChange = (
    index: number,
    field: keyof TicketType,
    value: string
  ) => {
    const newTickets = [...tickets];
    newTickets[index][field] = value;
    setTickets(newTickets);
  };

  const formatPrice = (value: string) => {
    // Remove non-numeric characters
    const numericValue = value.replace(/[^0-9]/g, '');
    
    // Format with thousand separators
    if (numericValue) {
      return new Intl.NumberFormat('id-ID').format(parseInt(numericValue));
    }
    return '';
  };

  return (
    <div className="space-y-6">
      <div className="border p-4 rounded-md bg-gray-50">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <Ticket className="text-primary mr-2" />
            <h3 className="font-medium">Jenis Tiket</h3>
          </div>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={handleAddTicket}
            className="flex items-center gap-1"
          >
            <Plus size={14} /> Tambah Tiket
          </Button>
        </div>

        <div className="space-y-6">
          {tickets.map((ticket, index) => (
            <div key={index} className="border rounded-md p-4 bg-white">
              <div className="flex justify-between items-center mb-3">
                <h4 className="text-sm font-medium">Tiket #{index + 1}</h4>
                {tickets.length > 1 && (
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    className="h-8 w-8 p-0 text-destructive"
                    onClick={() => handleRemoveTicket(index)}
                  >
                    <Trash size={14} />
                  </Button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <FormLabel>Nama Tiket <span className="text-destructive">*</span></FormLabel>
                  <Input
                    placeholder="Contoh: Dewasa, Anak-anak, Wisatawan Asing"
                    value={ticket.name}
                    onChange={(e) =>
                      handleTicketChange(index, 'name', e.target.value)
                    }
                  />
                </div>

                <div>
                  <FormLabel>Harga Tiket (Rp) <span className="text-destructive">*</span></FormLabel>
                  <Input
                    placeholder="Masukkan harga tiket"
                    value={ticket.price}
                    onChange={(e) => {
                      const formattedPrice = formatPrice(e.target.value);
                      handleTicketChange(index, 'price', formattedPrice);
                    }}
                  />
                </div>
              </div>

              <div className="mt-3">
                <FormLabel>Deskripsi Tiket</FormLabel>
                <Textarea
                  placeholder="Deskripsi atau informasi tambahan tentang tiket"
                  value={ticket.description}
                  onChange={(e) =>
                    handleTicketChange(index, 'description', e.target.value)
                  }
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                <div>
                  <FormLabel>Status Ketersediaan</FormLabel>
                  <Select
                    value={ticket.availability}
                    onValueChange={(value) =>
                      handleTicketChange(index, 'availability', value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Available">Available</SelectItem>
                      <SelectItem value="Limited">Limited</SelectItem>
                      <SelectItem value="Sold Out">Sold Out</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <FormLabel>Kuota Tiket (Opsional)</FormLabel>
                  <Input
                    type="number"
                    placeholder="Jumlah tiket tersedia"
                    value={ticket.quota}
                    onChange={(e) =>
                      handleTicketChange(index, 'quota', e.target.value)
                    }
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="border p-4 rounded-md bg-gray-50">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <Percent className="text-primary mr-2" />
            <h3 className="font-medium">Diskon/Promo (Opsional)</h3>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="hasPromo"
              className="mr-2"
              checked={hasPromo}
              onChange={(e) => setHasPromo(e.target.checked)}
            />
            <label htmlFor="hasPromo" className="text-sm cursor-pointer">
              Tambahkan Promo
            </label>
          </div>
        </div>

        {hasPromo && (
          <div className="space-y-4 bg-white p-4 rounded-md border">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={control}
                name="discount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Persentase Diskon (%)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Contoh: 10"
                        min="0"
                        max="100"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="promoCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Kode Promo</FormLabel>
                    <FormControl>
                      <Input placeholder="Contoh: SUMMER2023" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <FormLabel>Tanggal Mulai Promo</FormLabel>
                <div className="flex items-center gap-2">
                  <Calendar size={16} className="text-gray-500" />
                  <Input type="date" />
                </div>
              </div>

              <div>
                <FormLabel>Tanggal Akhir Promo</FormLabel>
                <div className="flex items-center gap-2">
                  <Calendar size={16} className="text-gray-500" />
                  <Input type="date" />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TicketsPricingTab;
