
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

const AdminRegister = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple validation
    if (!formData.email || !formData.password || !formData.fullName) {
      toast.error('Semua field harus diisi');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error('Password tidak cocok');
      return;
    }

    setLoading(true);

    try {
      // Register the user with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName,
            role: 'admin'
          }
        }
      });

      if (authError) throw authError;

      if (authData.user) {
        // Set role in profiles table
        const { error: profileError } = await supabase
          .from('profiles')
          .update({ role: 'admin' })
          .eq('id', authData.user.id);

        if (profileError) {
          console.error('Error updating profile:', profileError);
          throw new Error('Failed to set admin role');
        }

        toast.success('Pendaftaran admin berhasil. Silakan login.');
        navigate('/login');
      }
    } catch (error: any) {
      console.error('Registration error:', error);
      toast.error(error.message || 'Gagal mendaftarkan akun');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-1 flex items-center justify-center py-12 bg-gray-50">
        <div className="container-custom max-w-md">
          <Card className="shadow-md">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold">Daftar Sebagai Admin</CardTitle>
              <CardDescription>
                Buat akun admin baru untuk mengelola aplikasi
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Nama Lengkap</Label>
                  <Input
                    id="fullName"
                    placeholder="Masukkan nama lengkap"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="contoh@email.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Masukkan password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    minLength={6}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Konfirmasi Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Konfirmasi password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <Button
                  type="submit"
                  className="w-full"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Mendaftar...
                    </>
                  ) : (
                    'Daftar'
                  )}
                </Button>
              </form>
            </CardContent>
            
            <CardFooter className="justify-center border-t pt-5">
              <p className="text-sm text-gray-600">
                Sudah memiliki akun?{' '}
                <Link to="/login" className="font-medium text-primary hover:underline">
                  Login
                </Link>
              </p>
            </CardFooter>
          </Card>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default AdminRegister;
