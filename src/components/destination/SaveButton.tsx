
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

  const toggleSaveDestination = async () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/destinasi/${destinationId}` } });
      return;
    }

    try {
      if (!userId) {
        toast({
          title: "Error",
          description: "User ID tidak ditemukan",
          variant: "destructive"
        });
        return;
      }
      
      // Ensure destinationId is always a string
      const destId = typeof destinationId === 'number' ? destinationId.toString() : destinationId;

      if (isSaved) {
        // Find the saved record to delete
        const { data: savedData, error: findError } = await supabase
          .from('saved_destinations')
          .select('id')
          .eq('user_id', userId)
          .eq('destination_id', destId);

        if (findError) throw findError;
        
        if (savedData && savedData.length > 0) {
          // Delete using the found ID
          const { error: deleteError } = await supabase
            .from('saved_destinations')
            .delete()
            .eq('id', savedData[0].id);

          if (deleteError) throw deleteError;
          
          setIsSaved(false);
          toast({
            title: "Berhasil",
            description: "Destinasi dihapus dari daftar tersimpan",
            variant: "default"
          });
        }
      } else {
        // Insert new saved destination with string values
        const { error: insertError } = await supabase
          .from('saved_destinations')
          .insert({
            user_id: userId,
            destination_id: destId
          });

        if (insertError) throw insertError;
        
        setIsSaved(true);
        toast({
          title: "Berhasil",
          description: "Destinasi ditambahkan ke daftar tersimpan",
          variant: "default"
        });
      }
    } catch (error) {
      console.error("Error toggling saved status:", error);
      toast({
        title: "Error",
        description: "Gagal mengubah status simpan",
        variant: "destructive"
      });
    }
  };

  return (
    <Button
      variant="secondary"
      className="absolute top-2 right-2"
      onClick={toggleSaveDestination}
    >
      {isSaved ? (
        <>
          <Heart className="mr-2 h-4 w-4 fill-red-500 text-red-500" />
          Disimpan
        </>
      ) : (
        <>
          <Heart className="mr-2 h-4 w-4" />
          Simpan
        </>
      )}
    </Button>
  );
};

export default SaveButton;
