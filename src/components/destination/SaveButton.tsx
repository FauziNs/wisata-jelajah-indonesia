
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface SaveButtonProps {
  destinationId: string | number;
  isSaved: boolean;
  setIsSaved: (saved: boolean) => void;
  userId?: string;
  isAuthenticated: boolean;
}

const SaveButton = ({ 
  destinationId, 
  isSaved, 
  setIsSaved,
  userId,
  isAuthenticated 
}: SaveButtonProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const toggleSaveDestination = async () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/destinasi/${destinationId}` } });
      return;
    }

    if (!userId) {
      toast({
        title: "Error",
        description: "User ID tidak ditemukan",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Ensure destinationId is always a string
      const destId = typeof destinationId === 'number' ? destinationId.toString() : destinationId;

      if (isSaved) {
        // Remove from saved destinations
        const { error: deleteError } = await supabase
          .from('saved_destinations')
          .delete()
          .eq('user_id', userId)
          .eq('destination_id', destId);

        if (deleteError) throw deleteError;
        
        setIsSaved(false);
        toast({
          title: "Berhasil",
          description: "Destinasi dihapus dari daftar tersimpan",
          variant: "default"
        });
      } else {
        // Add to saved destinations
        const { error: insertError } = await supabase
          .from('saved_destinations')
          .insert({
            user_id: userId,
            destination_id: destId
          });

        if (insertError) {
          // Check if it's a duplicate error
          if (insertError.code === '23505') {
            // Already saved, just update the state
            setIsSaved(true);
            toast({
              title: "Sudah Tersimpan",
              description: "Destinasi sudah ada dalam daftar tersimpan",
              variant: "default"
            });
          } else {
            throw insertError;
          }
        } else {
          setIsSaved(true);
          toast({
            title: "Berhasil",
            description: "Destinasi ditambahkan ke daftar tersimpan",
            variant: "default"
          });
        }
      }
    } catch (error) {
      console.error("Error toggling saved status:", error);
      toast({
        title: "Error",
        description: "Gagal mengubah status simpan",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant="secondary"
      className="absolute top-2 right-2"
      onClick={toggleSaveDestination}
      disabled={isLoading}
    >
      {isSaved ? (
        <>
          <Heart className="mr-2 h-4 w-4 fill-red-500 text-red-500" />
          {isLoading ? 'Menghapus...' : 'Disimpan'}
        </>
      ) : (
        <>
          <Heart className="mr-2 h-4 w-4" />
          {isLoading ? 'Menyimpan...' : 'Simpan'}
        </>
      )}
    </Button>
  );
};

export default SaveButton;
