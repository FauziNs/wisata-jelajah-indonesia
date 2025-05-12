
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  Edit, 
  Plus, 
  Search, 
  Trash2, 
  Eye, 
  Filter, 
  Star, 
  MapPin,
  Loader2 
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { DestinationType } from '@/types/destination';

const DestinationsList = () => {
  const navigate = useNavigate();
  const [destinations, setDestinations] = useState<DestinationType[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");

  // Fetch destinations data from Supabase
  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('destinations')
          .select('*');
        
        if (error) {
          throw error;
        }
        
        // Map the data to include status (we'll store this in the future)
        const statusOptions = ['Regular', 'Featured', 'Highlight', 'Special'];
        const destinationsWithStatus = data.map(dest => ({
          ...dest,
          status: dest.category === 'Popular' ? 'Featured' : 
                 dest.rating && dest.rating >= 4.5 ? 'Highlight' : 
                 dest.price && dest.price > 100000 ? 'Special' : 'Regular'
        }));
        
        setDestinations(destinationsWithStatus);
      } catch (error) {
        console.error('Error fetching destinations:', error);
        toast.error('Gagal memuat data destinasi');
      } finally {
        setLoading(false);
      }
    };

    fetchDestinations();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Featured":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "Highlight":
        return "bg-green-100 text-green-800 border-green-200";
      case "Special":
        return "bg-orange-100 text-orange-800 border-orange-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Apakah Anda yakin ingin menghapus destinasi "${name}"?`)) {
      try {
        const { error } = await supabase
          .from('destinations')
          .delete()
          .eq('id', id);
          
        if (error) throw error;
        
        // Update the local state to remove the deleted destination
        setDestinations(destinations.filter(dest => dest.id !== id));
        toast.success(`Destinasi "${name}" berhasil dihapus`);
      } catch (error) {
        console.error('Error deleting destination:', error);
        toast.error('Gagal menghapus destinasi');
      }
    }
  };

  const handleViewDestination = (id: string) => {
    window.open(`/destinasi/${id}`, '_blank');
  };

  const handleEditDestination = (id: string) => {
    navigate(`/admin/destinations/edit/${id}`);
  };

  return (
    <div className="py-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold">Daftar Destinasi</h1>
          <p className="text-gray-500">Kelola semua destinasi wisata dalam satu tampilan</p>
        </div>
        <Link to="/admin/destinations/new">
          <Button className="flex items-center gap-2">
            <Plus size={16} /> Tambah Destinasi
          </Button>
        </Link>
      </div>

      <div className="bg-white p-4 rounded-md shadow-sm mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cari destinasi..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <div className="w-40">
              <Select
                value={selectedCategory}
                onValueChange={setSelectedCategory}
              >
                <SelectTrigger>
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    <SelectValue placeholder="Kategori" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Kategori</SelectItem>
                  <SelectItem value="Wisata Alam">Wisata Alam</SelectItem>
                  <SelectItem value="Wisata Sejarah">Wisata Sejarah</SelectItem>
                  <SelectItem value="Pantai">Pantai</SelectItem>
                  <SelectItem value="Edukasi">Edukasi</SelectItem>
                  <SelectItem value="Pusat Belanja">Pusat Belanja</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="w-40">
              <Select
                value={selectedStatus}
                onValueChange={setSelectedStatus}
              >
                <SelectTrigger>
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4" />
                    <SelectValue placeholder="Status" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Status</SelectItem>
                  <SelectItem value="Regular">Regular</SelectItem>
                  <SelectItem value="Featured">Featured</SelectItem>
                  <SelectItem value="Highlight">Highlight</SelectItem>
                  <SelectItem value="Special">Special</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-md shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Destinasi</TableHead>
              <TableHead>Lokasi</TableHead>
              <TableHead>Kategori</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Tanggal Dibuat</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  <div className="flex justify-center items-center">
                    <Loader2 className="h-6 w-6 text-primary animate-spin mr-2" />
                    <span>Memuat data...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : destinations
              .filter(dest => 
                (!searchTerm || dest.name.toLowerCase().includes(searchTerm.toLowerCase())) &&
                (!selectedCategory || selectedCategory === "all" || dest.category === selectedCategory) &&
                (!selectedStatus || selectedStatus === "all" || dest.status === selectedStatus)
              )
              .map((destination) => (
                <TableRow key={destination.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <img 
                        src={destination.image_url || 'https://images.unsplash.com/photo-1589182456208-55142fe24607?auto=format&fit=crop&w=200&h=100'} 
                        alt={destination.name}
                        className="w-12 h-12 rounded object-cover" 
                      />
                      <span className="font-medium">{destination.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5 text-gray-500" />
                      {destination.location}
                    </div>
                  </TableCell>
                  <TableCell>{destination.category || 'Uncategorized'}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={getStatusColor(destination.status || 'Regular')}>
                      {destination.status || 'Regular'}
                    </Badge>
                  </TableCell>
                  <TableCell>{new Date(destination.created_at || Date.now()).toLocaleDateString('id-ID')}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        title="Lihat"
                        onClick={() => handleViewDestination(destination.id)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        title="Edit"
                        onClick={() => handleEditDestination(destination.id)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-destructive hover:text-destructive/90 hover:bg-destructive/10" 
                        title="Hapus"
                        onClick={() => handleDelete(destination.id, destination.name)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            
            {!loading && destinations.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  Tidak ada destinasi yang ditemukan
                </TableCell>
              </TableRow>
            )}
            
            {!loading && destinations.length > 0 && 
              destinations.filter(dest => 
                (!searchTerm || dest.name.toLowerCase().includes(searchTerm.toLowerCase())) &&
                (!selectedCategory || selectedCategory === "all" || dest.category === selectedCategory) &&
                (!selectedStatus || selectedStatus === "all" || dest.status === selectedStatus)
              ).length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    Tidak ada destinasi yang cocok dengan kriteria pencarian
                  </TableCell>
                </TableRow>
              )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default DestinationsList;
