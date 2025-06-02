
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import DestinationCard from '@/components/DestinationCard';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Trash2, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface SavedDestination {
  id: string;
  name: string;
  location: string;
  image: string;
  rating: number;
  price: string;
  category: string;
  saved_id: string;
}

const SavedDestinations = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [savedDestinations, setSavedDestinations] = useState<SavedDestination[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/saved-destinations' } });
      return;
    }

    fetchSavedDestinations();
  }, [isAuthenticated, navigate, user, toast]);

  const fetchSavedDestinations = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      
      // Fetch saved destinations with destination details
      const { data: savedData, error: savedError } = await supabase
        .from('saved_destinations')
        .select(`
          id,
          saved_at,
          destinations (
            id,
            name,
            location,
            image_url,
            rating,
            category,
            price
          )
        `)
        .eq('user_id', user.id)
        .order('saved_at', { ascending: false });
      
      if (savedError) {
        console.error('Error fetching saved destinations:', savedError);
        toast({
          title: "Error",
          description: "Gagal memuat destinasi tersimpan",
          variant: "destructive"
        });
        setSavedDestinations([]);
        return;
      }
      
      if (savedData && savedData.length > 0) {
        const formattedData: SavedDestination[] = savedData
          .filter(item => item.destinations) // Filter out items where destination might be null
          .map(item => ({
            id: item.destinations.id,
            name: item.destinations.name,
            location: item.destinations.location,
            image: item.destinations.image_url || 'https://images.unsplash.com/photo-1539367628448-4bc5c9d171c8',
            rating: item.destinations.rating || 0,
            price: `Mulai dari Rp ${(item.destinations.price || 50000).toLocaleString('id-ID')}`,
            category: item.destinations.category || 'Wisata',
            saved_id: item.id
          }));
        
        setSavedDestinations(formattedData);
      } else {
        setSavedDestinations([]);
      }
    } catch (error) {
      console.error('Error fetching saved destinations:', error);
      toast({
        title: "Error",
        description: "Terjadi kesalahan saat memuat destinasi tersimpan",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFromSaved = async (savedId: string, destinationName: string) => {
    try {
      const { error } = await supabase
        .from('saved_destinations')
        .delete()
        .eq('id', savedId);
      
      if (error) throw error;
      
      // Remove the destination from the list
      setSavedDestinations(prev => prev.filter(item => item.saved_id !== savedId));
      
      toast({
        title: "Berhasil dihapus",
        description: `${destinationName} berhasil dihapus dari daftar tersimpan`,
        variant: "default"
      });
    } catch (error) {
      console.error('Error removing destination:', error);
      toast({
        title: "Error",
        description: "Gagal menghapus destinasi dari daftar tersimpan",
        variant: "destructive"
      });
    }
  };

  const handleCardClick = (id: string) => {
    navigate(`/destinasi/${id}`);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="container-custom py-8 flex-grow">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">Destinasi Tersimpan</h1>
            <p className="text-gray-600">Daftar destinasi yang Anda simpan untuk dikunjungi nanti</p>
          </div>
          
          <Button 
            variant="outline"
            onClick={fetchSavedDestinations}
            disabled={loading}
          >
            {loading ? 'Memuat...' : 'Refresh'}
          </Button>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : savedDestinations.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedDestinations.map((destination) => (
              <div key={destination.saved_id} className="relative group">
                <div className="cursor-pointer" onClick={() => handleCardClick(destination.id)}>
                  <DestinationCard
                    id={destination.id}
                    name={destination.name}
                    location={destination.location}
                    image={destination.image}
                    rating={destination.rating}
                    price={destination.price}
                    category={destination.category}
                  />
                </div>
                
                {/* Remove button */}
                <div className="absolute top-2 right-2 flex gap-2">
                  <div className="bg-white rounded-full p-1 shadow-md">
                    <Heart className="h-4 w-4 fill-red-500 text-red-500" />
                  </div>
                  
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="destructive"
                        size="icon"
                        className="h-8 w-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Hapus dari Tersimpan?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Apakah Anda yakin ingin menghapus "{destination.name}" dari daftar destinasi tersimpan? 
                          Tindakan ini tidak dapat dibatalkan.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Batal</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleRemoveFromSaved(destination.saved_id, destination.name)}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          Hapus
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="mb-4">
              <Heart className="h-16 w-16 text-gray-300 mx-auto" />
            </div>
            <h3 className="text-xl font-medium text-gray-700 mb-2">Belum ada destinasi tersimpan</h3>
            <p className="text-gray-500 mb-6">
              Simpan destinasi favorit Anda dengan mengklik tombol ♥ pada halaman detail destinasi
            </p>
            <Button onClick={() => navigate('/destinasi')}>
              Jelajahi Destinasi
            </Button>
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  );
};

export default SavedDestinations;
