
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import LoginForm from '@/components/auth/LoginForm';
import SocialLogin from '@/components/auth/SocialLogin';
import AdminLoginForm from '@/components/auth/AdminLoginForm';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('customer');

  // Get redirect path from location state or URL params
  const from = location.state?.from || '/';
  const searchParams = new URLSearchParams(location.search);
  const redirectTo = searchParams.get('redirect') || from;

  useEffect(() => {
    // If user is already logged in, redirect them
    if (user) {
      checkUserRole(user.id);
    }
  }, [user]);

  // Check user role and redirect accordingly
  const checkUserRole = async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .single();
      
    if (!error && data) {
      if (data.role === 'admin') {
        navigate('/admin');
      } else {
        navigate(redirectTo);
      }
    } else {
      navigate(redirectTo);
    }
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-1 flex items-center justify-center py-12 bg-gray-50">
        <div className="container-custom max-w-md">
          <Card className="shadow-md">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold">Masuk ke Akun Anda</CardTitle>
              <CardDescription>
                Masuk untuk melanjutkan petualangan wisata Anda
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <Tabs value={activeTab} onValueChange={handleTabChange} className="mb-6">
                <TabsList className="grid grid-cols-2 w-full">
                  <TabsTrigger value="customer">Customer</TabsTrigger>
                  <TabsTrigger value="admin">Admin</TabsTrigger>
                </TabsList>
                
                <TabsContent value="customer">
                  <LoginForm redirectTo={redirectTo} />
                  <div className="mt-6">
                    <SocialLogin />
                  </div>
                </TabsContent>
                
                <TabsContent value="admin">
                  <AdminLoginForm />
                </TabsContent>
              </Tabs>
            </CardContent>
            
            <CardFooter className="justify-center flex flex-col space-y-4">
              <p className="text-sm text-gray-600">
                Belum memiliki akun?{' '}
                <Link to="/register" className="font-medium text-primary hover:underline">
                  Daftar sekarang
                </Link>
              </p>
              
              {activeTab === 'admin' && (
                <div className="w-full">
                  <Link to="/admin/register">
                    <Button variant="outline" className="w-full">
                      Daftar sebagai Admin
                    </Button>
                  </Link>
                </div>
              )}
            </CardFooter>
          </Card>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Login;
