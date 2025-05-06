
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import DestinationCard from '@/components/DestinationCard';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

const SavedDestinations = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [savedDestinations, setSavedDestinations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/saved' } });
      return;
    }

    const fetchSavedDestinations = async () => {
      try {
        setLoading(true);
        
        // Directly query saved_destinations table
        const { data: savedData, error: savedError } = await supabase
          .from('saved_destinations')
          .select('id, destination_id, saved_at')
          .eq('user_id', user.id)
          .order('saved_at', { ascending: false });
        
        if (savedError) {
          console.error('Error fetching saved destinations:', savedError);
          setSavedDestinations([]);
          setLoading(false);
          return;
        }
        
        if (savedData && savedData.length > 0) {
          fetchDestinationDetails(savedData);
        } else {
          setSavedDestinations([]);
          setLoading(false);
        }
      } catch (error) {
        console.error('Error fetching saved destinations:', error);
        toast({
          title: "Error",
          description: "Failed to load saved destinations",
          variant: "destructive"
        });
        setLoading(false);
      }
    };
    
    const fetchDestinationDetails = async (savedItems) => {
      try {
        const destinationPromises = savedItems.map(async (item) => {
          const { data: destData, error: destError } = await supabase
            .from('destinations')
            .select('id, name, location, image_url, rating, category')
            .eq('id', item.destination_id)
            .single();
          
          if (destError) return null;
          
          return {
            id: destData.id,
            name: destData.name,
            location: destData.location,
            image: destData.image_url,
            rating: destData.rating || 0,
            price: 'Mulai dari Rp 50.000',
            category: destData.category,
            saved_id: item.id
          };
        });
        
        const results = await Promise.all(destinationPromises);
        setSavedDestinations(results.filter(item => item !== null));
      } catch (error) {
        console.error('Error fetching destination details:', error);
        toast({
          title: "Error",
          description: "Failed to load destination details",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchSavedDestinations();
  }, [isAuthenticated, navigate, user, toast]);

  const handleRemoveFromSaved = async (savedId) => {
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
        description: "Destinasi berhasil dihapus dari daftar tersimpan",
        variant: "default"
      });
    } catch (error) {
      console.error('Error removing destination:', error);
      toast({
        title: "Error",
        description: "Failed to remove destination from saved list",
        variant: "destructive"
      });
    }
  };

  const handleCardClick = (id) => {
    navigate(`/destinasi/${id}`);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="container-custom py-8 flex-grow">
        <h1 className="text-3xl font-bold mb-2">Destinasi Tersimpan</h1>
        <p className="text-gray-600 mb-6">Daftar destinasi yang Anda simpan untuk dikunjungi nanti</p>
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : savedDestinations.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedDestinations.map((destination) => (
              <div key={destination.id} className="relative group">
                <DestinationCard
                  {...destination}
                  onClick={() => handleCardClick(destination.id)}
                />
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveFromSaved(destination.saved_id);
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-xl font-medium text-gray-700 mb-2">Belum ada destinasi tersimpan</h3>
            <p className="text-gray-500 mb-6">Simpan destinasi favorit Anda untuk dikunjungi nanti</p>
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
