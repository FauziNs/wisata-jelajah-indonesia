
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { DestinationType, TicketType } from '@/types/destination';

export const useDestinationDetail = (id: string | undefined) => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const { toast } = useToast();

  const [destination, setDestination] = useState<DestinationType | null>(null);
  const [ticketTypes, setTicketTypes] = useState<TicketType[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!isAuthenticated) {
      toast({
        title: "Login Diperlukan",
        description: "Silakan login terlebih dahulu untuk melihat detail destinasi",
        variant: "default"
      });
      navigate('/login', { state: { from: `/destinasi/${id}` } });
      return;
    }

    if (!id) {
      navigate('/destinasi');
      return;
    }

    fetchData();
    if (isAuthenticated && user) {
      checkIfSaved();
    }
  }, [id, isAuthenticated, user, navigate]);

  const fetchData = async () => {
    try {
      setLoading(true);
      console.log("Fetching destination with ID:", id);

      // First, try to fetch from Supabase if connected
      let destinationData = null;
      if (supabase) {
        try {
          const { data, error } = await supabase
            .from('destinations')
            .select('*')
            .eq('id', id)
            .single();

          if (data && !error) {
            destinationData = data;
            console.log("Destination data from Supabase:", destinationData);
          } else if (error) {
            console.error("Error fetching from Supabase:", error);
          }
        } catch (error) {
          console.error("Supabase fetch error:", error);
        }
      }

      // If we don't have data from Supabase, use dummy data
      if (!destinationData) {
        console.log("Using dummy data for destination");
        
        // Find destination in dummy data
        const dummyDestinations: DestinationType[] = [
          {
            id: '1',
            name: 'Pantai Kuta',
            location: 'Bali',
            image_url: 'https://images.unsplash.com/photo-1539367628448-4bc5c9d171c8',
            rating: 4.7,
            price: 'Rp 50.000',
            description: 'Pantai Kuta adalah salah satu pantai terkenal di Bali dengan ombak yang cocok untuk berselancar, pemandangan sunset yang menakjubkan, dan berbagai aktivitas menarik.',
            category: 'Pantai',
            slug: 'pantai-kuta',
            operational_hours: '08:00 - 18:00 (Setiap Hari)',
            amenities: 'Toilet, Tempat Parkir, Food Court, Penyewaan Papan Selancar',
            address: 'Jalan Pantai Kuta, Kuta, Badung, Bali'
          },
          {
            id: '2',
            name: 'Candi Borobudur',
            location: 'Jawa Tengah',
            image_url: 'https://images.unsplash.com/photo-1596402184320-417e7178b2cd',
            rating: 4.8,
            price: 'Rp 85.000',
            description: 'Candi Borobudur adalah candi Buddha terbesar di dunia yang dibangun pada abad ke-8. Merupakan salah satu warisan budaya Indonesia yang tercatat sebagai Warisan Dunia UNESCO.',
            category: 'Wisata Sejarah',
            slug: 'candi-borobudur',
            operational_hours: '06:00 - 17:00 (Setiap Hari)',
            amenities: 'Toilet, Tempat Parkir, Pemandu Wisata, Museum',
            address: 'Jalan Badrawati, Kec. Borobudur, Magelang, Jawa Tengah'
          }
        ];
        
        destinationData = dummyDestinations.find(dest => dest.id === id || dest.slug === id) ||
          dummyDestinations[0]; // Default to first destination if not found
      }
      
      setDestination(destinationData);

      // Attempt to fetch ticket data
      if (supabase) {
        try {
          const { data: ticketData, error: ticketError } = await supabase
            .from('ticket_types')
            .select('*')
            .eq('destination_id', id);

          if (!ticketError && ticketData) {
            setTicketTypes(ticketData as TicketType[]);
          } else {
            console.log("Using dummy ticket data");
            setTicketTypes([
              {
                id: '1',
                name: 'Tiket Dewasa',
                price: 50000,
                description: 'Untuk pengunjung berusia 12 tahun ke atas',
                capacity: 'Tidak terbatas',
                validity_duration: '1'
              },
              {
                id: '2',
                name: 'Tiket Anak-anak',
                price: 25000,
                description: 'Untuk pengunjung berusia 5-11 tahun',
                capacity: 'Tidak terbatas',
                validity_duration: '1'
              }
            ]);
          }
        } catch (error) {
          console.error("Error fetching tickets:", error);
          // Fallback to dummy ticket data
          setTicketTypes([
            {
              id: '1',
              name: 'Tiket Dewasa',
              price: 50000,
              description: 'Untuk pengunjung berusia 12 tahun ke atas',
              capacity: 'Tidak terbatas',
              validity_duration: '1'
            },
            {
              id: '2',
              name: 'Tiket Anak-anak',
              price: 25000,
              description: 'Untuk pengunjung berusia 5-11 tahun',
              capacity: 'Tidak terbatas',
              validity_duration: '1'
            }
          ]);
        }
      } else {
        // Use dummy ticket data if no Supabase
        setTicketTypes([
          {
            id: '1',
            name: 'Tiket Dewasa',
            price: 50000,
            description: 'Untuk pengunjung berusia 12 tahun ke atas',
            capacity: 'Tidak terbatas',
            validity_duration: '1'
          },
          {
            id: '2',
            name: 'Tiket Anak-anak',
            price: 25000,
            description: 'Untuk pengunjung berusia 5-11 tahun',
            capacity: 'Tidak terbatas',
            validity_duration: '1'
          }
        ]);
      }
    } catch (error) {
      console.error('Error fetching destination details:', error);
      toast({
        title: "Error",
        description: "Gagal memuat detail destinasi",
        variant: "destructive"
      });
      navigate('/destinasi');
    } finally {
      setLoading(false);
    }
  };

  // Check if destination is saved
  const checkIfSaved = async () => {
    if (!isAuthenticated || !user) {
      setIsSaved(false);
      return;
    }

    try {
      const destinationId = id;
      
      const { data, error } = await supabase
        .from('saved_destinations')
        .select('id')
        .eq('user_id', user.id)
        .eq('destination_id', destinationId);

      if (error) {
        console.error("Error checking saved status:", error);
        return;
      }

      setIsSaved(data && data.length > 0);
    } catch (error) {
      console.error("Error checking saved status:", error);
    }
  };

  return {
    destination,
    ticketTypes,
    loading,
    isSaved,
    setIsSaved,
    isAuthenticated,
    user
  };
};
