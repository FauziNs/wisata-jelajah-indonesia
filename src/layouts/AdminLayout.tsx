
import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const AdminLayout = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const [adminCheckComplete, setAdminCheckComplete] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdminAccess = async () => {
      try {
        if (isLoading) return;
        
        if (!user) {
          console.log('User not logged in, redirecting to login...');
          // If not logged in, redirect to login page
          navigate('/login?redirect=/admin');
          return;
        }
        
        console.log('Checking admin role for user:', user.id);
        // Check if the user has admin role
        const { data, error } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();
          
        if (error) {
          console.error('Error fetching user role:', error);
          toast.error('Terjadi kesalahan saat memverifikasi akses admin');
          navigate('/');
          return;
        }
        
        if (!data || data.role !== 'admin') {
          console.log('Access denied: User is not an admin', data);
          toast.error('Akses ditolak: Anda bukan admin');
          navigate('/');
          return;
        }
        
        console.log('Admin access granted:', data);
        setIsAdmin(true);
        setAdminCheckComplete(true);
      } catch (error) {
        console.error('Error in admin check:', error);
        toast.error('Terjadi kesalahan saat memverifikasi akses');
        navigate('/');
      }
    };

    checkAdminAccess();
  }, [user, isLoading, navigate]);

  // Show loading indicator while checking authentication
  if (isLoading || !adminCheckComplete) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
      </div>
    );
  }

  // If user is not admin, we shouldn't render anything (we should have redirected)
  if (!isAdmin) {
    return null;
  }

  // If user is authenticated and admin check is complete, show admin layout
  return (
    <div className="flex h-screen bg-gray-50">
      <AdminSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto bg-gray-50 p-4">
          <div className="container mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
