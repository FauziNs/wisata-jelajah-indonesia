
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { useDestinationDetail } from '@/hooks/useDestinationDetail';
import DestinationContent from '@/components/destination/DestinationContent';
import { useAuth } from '@/context/AuthContext';
import { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

const DestinationDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  
  const { 
    destination, 
    ticketTypes, 
    loading, 
    isSaved, 
    setIsSaved, 
    user 
  } = useDestinationDetail(id);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      toast({
        title: "Login Diperlukan",
        description: "Silakan login terlebih dahulu untuk melihat detail destinasi",
        variant: "default"
      });
      navigate('/login', { state: { from: `/destinasi/${id}` } });
    }
  }, [isAuthenticated, navigate, id, toast]);

  if (!isAuthenticated) {
    return null; // Don't render anything if not authenticated
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!destination) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="container-custom py-8 flex-grow">
          <div className="text-center py-12">
            <h3 className="text-xl font-medium text-gray-700 mb-2">Destinasi tidak ditemukan</h3>
            <p className="text-gray-500 mb-6">Destinasi yang Anda cari tidak ditemukan</p>
            <Button onClick={() => navigate('/destinasi')}>
              Jelajahi Destinasi Lain
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="container-custom py-8 flex-grow">
        {destination && (
          <DestinationContent
            destination={destination}
            ticketTypes={ticketTypes}
            isSaved={isSaved}
            setIsSaved={setIsSaved}
            userId={user?.id}
            isAuthenticated={isAuthenticated}
          />
        )}
      </div>

      <Footer />
    </div>
  );
};

export default DestinationDetail;
