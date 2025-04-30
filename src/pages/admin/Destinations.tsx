
import React from 'react';
import { Link } from 'react-router-dom';
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
  MapPin 
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

// Sample data for destinations
const destinations = [
  {
    id: 1,
    name: "Pantai Kuta",
    location: "Bali",
    category: "Pantai",
    status: "Featured",
    createdAt: "2023-04-15",
    image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=200&h=100",
  },
  {
    id: 2,
    name: "Candi Borobudur",
    location: "Jawa Tengah",
    category: "Wisata Sejarah",
    status: "Regular",
    createdAt: "2023-04-12",
    image: "https://images.unsplash.com/photo-1564511287568-54483a74087b?auto=format&fit=crop&w=200&h=100",
  },
  {
    id: 3,
    name: "Kawah Putih",
    location: "Jawa Barat",
    category: "Wisata Alam",
    status: "Highlight",
    createdAt: "2023-04-10",
    image: "https://images.unsplash.com/photo-1535249677413-75a5175a0b17?auto=format&fit=crop&w=200&h=100",
  },
  {
    id: 4,
    name: "Taman Mini Indonesia Indah",
    location: "DKI Jakarta",
    category: "Edukasi",
    status: "Regular",
    createdAt: "2023-04-08",
    image: "https://images.unsplash.com/photo-1589182456208-55142fe24607?auto=format&fit=crop&w=200&h=100",
  },
  {
    id: 5,
    name: "Malioboro",
    location: "DI Yogyakarta",
    category: "Pusat Belanja",
    status: "Special",
    createdAt: "2023-04-05",
    image: "https://images.unsplash.com/photo-1551963831-b3b1ca40c98e?auto=format&fit=crop&w=200&h=100",
  },
];

const DestinationsList = () => {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [selectedCategory, setSelectedCategory] = React.useState("");
  const [selectedStatus, setSelectedStatus] = React.useState("");

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

  const handleDelete = (id: number, name: string) => {
    if (confirm(`Apakah Anda yakin ingin menghapus destinasi "${name}"?`)) {
      // In a real app, you would call an API to delete the destination
      toast.success(`Destinasi "${name}" berhasil dihapus`);
    }
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
                  <SelectItem value="">Semua Kategori</SelectItem>
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
                  <SelectItem value="">Semua Status</SelectItem>
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
            {destinations
              .filter(dest => 
                (!searchTerm || dest.name.toLowerCase().includes(searchTerm.toLowerCase())) &&
                (!selectedCategory || dest.category === selectedCategory) &&
                (!selectedStatus || dest.status === selectedStatus)
              )
              .map((destination) => (
                <TableRow key={destination.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <img 
                        src={destination.image} 
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
                  <TableCell>{destination.category}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={getStatusColor(destination.status)}>
                      {destination.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{destination.createdAt}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" title="Lihat">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" title="Edit">
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
            {destinations.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  Tidak ada destinasi yang ditemukan
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
