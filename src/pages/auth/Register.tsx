import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Eye, EyeOff, Mail, Lock, User, Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { signUp, uploadProfileImage, updateProfile, createUserProfile } from '@/integrations/supabase/auth';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { supabase, testSupabaseConnection } from '@/integrations/supabase/client';

const Register = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [profileImagePreview, setProfileImagePreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [debugInfo, setDebugInfo] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const target = e.target as HTMLInputElement;
      setFormData(prev => ({
        ...prev,
        [name]: target.checked
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    
    // Clear error for this field when user starts typing again
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = {...prev};
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Check file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        setErrors(prev => ({
          ...prev,
          profileImage: 'Ukuran file maksimal 2MB'
        }));
        return;
      }
      
      // Check file type
      if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
        setErrors(prev => ({
          ...prev,
          profileImage: 'Format file harus JPG, PNG, atau WebP'
        }));
        return;
      }
      
      setProfileImage(file);
      setProfileImagePreview(URL.createObjectURL(file));
      
      // Clear error if exists
      if (errors.profileImage) {
        setErrors(prev => {
          const newErrors = {...prev};
          delete newErrors.profileImage;
          return newErrors;
        });
      }
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    // Validate name
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Nama lengkap wajib diisi';
    }
    
    // Validate email
    if (!formData.email) {
      newErrors.email = 'Email wajib diisi';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)) {
      newErrors.email = 'Format email tidak valid';
    }
    
    // Validate password
    if (!formData.password) {
      newErrors.password = 'Password wajib diisi';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password minimal 8 karakter';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Password harus mengandung huruf besar, huruf kecil, dan angka';
    }
    
    // Validate confirm password
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Konfirmasi password tidak cocok';
    }
    
    // Validate terms agreement
    if (!formData.agreeTerms) {
      newErrors.agreeTerms = 'Anda harus menyetujui syarat dan ketentuan';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    setDebugInfo(null);

    try {
      console.log('Starting registration with data:', {
        email: formData.email,
        fullName: formData.fullName
      });
      
      // Test Supabase connection first
      const connectionTest = await testSupabaseConnection();
      setDebugInfo(`Connection test: ${connectionTest.success ? 'Success' : 'Failed'}`);
      
      if (!connectionTest.success) {
        setDebugInfo(prev => `${prev}\nError: ${connectionTest.message}`);
        
        toast({
          title: "Connection Error",
          description: "Cannot connect to the server. Please try again later.",
          variant: "destructive"
        });
        return;
      }
      
      // Register the user with Supabase
      const { user, error, session } = await signUp({
        email: formData.email,
        password: formData.password,
        fullName: formData.fullName
      });
      
      if (error) {
        setDebugInfo(`Registration error: ${error.message}`);
        console.error('Registration error details:', error);
        
        if (error.message.includes('already registered')) {
          toast({
            title: "Email sudah terdaftar",
            description: "Silakan gunakan email lain atau lakukan login",
            variant: "destructive"
          });
        } else {
          toast({
            title: "Registrasi gagal",
            description: error.message,
            variant: "destructive"
          });
        }
        return;
      }
      
      // Output debug info about the created user
      console.log('User created successfully:', user);
      setDebugInfo(`User created with ID: ${user?.id}. Session: ${session ? 'Active' : 'Not active'}`);
      
      // Ensure the profile is created (as a fallback if the trigger doesn't work)
      if (user) {
        // Check if the profile was automatically created by the trigger
        const { data: profileCheck } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
          
        if (!profileCheck) {
          // Manually create profile if trigger didn't work
          const manualProfileResult = await createUserProfile(user.id, {
            full_name: formData.fullName
          });
          
          if (manualProfileResult.error) {
            console.log('Manual profile creation attempted but failed:', manualProfileResult.error);
            setDebugInfo(prevDebug => `${prevDebug}\nManual profile creation: Failed - ${manualProfileResult.error.message}`);
          } else {
            console.log('Manual profile creation succeeded');
            setDebugInfo(prevDebug => `${prevDebug}\nManual profile creation: Success`);
          }
        } else {
          console.log('Profile was automatically created by trigger:', profileCheck);
          setDebugInfo(prevDebug => `${prevDebug}\nProfile was automatically created by trigger`);
        }
      }
      
      // If we have a profile image, upload it
      if (user && profileImage) {
        const { url: imageUrl, error: uploadError } = await uploadProfileImage(user.id, profileImage);
        
        if (uploadError) {
          toast({
            title: "Gagal mengunggah foto profil",
            description: "Profil Anda telah dibuat, tetapi foto profil gagal diunggah",
            variant: "destructive"
          });
          setDebugInfo(prevDebug => `${prevDebug}\nImage upload error: ${uploadError.message}`);
        } else if (imageUrl) {
          // Update the user's profile with the image URL
          await updateProfile(user.id, {
            profile_picture_url: imageUrl
          });
          setDebugInfo(prevDebug => `${prevDebug}\nProfile image uploaded: ${imageUrl}`);
        }
      }
      
      // Show success message
      toast({
        title: "Registrasi berhasil!",
        description: "Silakan masuk dengan akun yang baru Anda buat."
      });
      
      // Always redirect to login page after registration
      navigate('/login');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('Registration error:', error);
      setDebugInfo(`Unexpected error: ${errorMessage}`);
      toast({
        title: "Registrasi gagal!",
        description: "Terjadi kesalahan saat mendaftar. Silakan coba lagi.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-1 flex items-center justify-center py-12 bg-gray-50">
        <div className="container-custom max-w-xl">
          <Card className="shadow-md">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold">Buat Akun Baru</CardTitle>
              <CardDescription>
                Daftar untuk menjelajahi berbagai destinasi wisata
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              {debugInfo && (
                <Alert className="mb-4 bg-yellow-50">
                  <AlertTitle>Debug Information</AlertTitle>
                  <AlertDescription className="whitespace-pre-wrap text-xs">
                    {debugInfo}
                  </AlertDescription>
                </Alert>
              )}
              
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Profile Picture */}
                <div className="flex flex-col items-center mb-6">
                  <div className="relative mb-4">
                    <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-100 border border-gray-200">
                      {profileImagePreview ? (
                        <img 
                          src={profileImagePreview} 
                          alt="Preview" 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <User size={40} />
                        </div>
                      )}
                    </div>
                    <label 
                      htmlFor="profileImage"
                      className="absolute bottom-0 right-0 bg-primary text-white rounded-full p-2 cursor-pointer"
                    >
                      <Upload size={14} />
                    </label>
                    <input
                      id="profileImage"
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      className="hidden"
                      onChange={handleImageChange}
                    />
                  </div>
                  <p className="text-xs text-gray-500">
                    Upload foto profil (opsional)
                  </p>
                  {errors.profileImage && (
                    <p className="text-xs text-red-500 mt-1">{errors.profileImage}</p>
                  )}
                </div>
                
                {/* Full Name */}
                <div className="space-y-2">
                  <label htmlFor="fullName" className="text-sm font-medium">
                    Nama Lengkap
                    <span className="text-red-500"> *</span>
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
                    <Input
                      id="fullName"
                      name="fullName"
                      placeholder="Nama lengkap Anda"
                      className="pl-10"
                      value={formData.fullName}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  {errors.fullName && (
                    <p className="text-xs text-red-500">{errors.fullName}</p>
                  )}
                </div>
                
                {/* Email */}
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">
                    Email
                    <span className="text-red-500"> *</span>
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="email@example.com"
                      className="pl-10"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  {errors.email && (
                    <p className="text-xs text-red-500">{errors.email}</p>
                  )}
                </div>
                
                {/* Password */}
                <div className="space-y-2">
                  <label htmlFor="password" className="text-sm font-medium">
                    Password
                    <span className="text-red-500"> *</span>
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      className="pl-10 pr-10"
                      value={formData.password}
                      onChange={handleChange}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  {errors.password ? (
                    <p className="text-xs text-red-500">{errors.password}</p>
                  ) : (
                    <p className="text-xs text-gray-500">
                      Minimal 8 karakter dengan huruf besar, huruf kecil, dan angka
                    </p>
                  )}
                </div>
                
                {/* Confirm Password */}
                <div className="space-y-2">
                  <label htmlFor="confirmPassword" className="text-sm font-medium">
                    Konfirmasi Password
                    <span className="text-red-500"> *</span>
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      className="pl-10 pr-10"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-xs text-red-500">{errors.confirmPassword}</p>
                  )}
                </div>
                
                {/* Terms and Conditions */}
                <div>
                  <div className="flex items-start">
                    <div className="flex items-center h-5 mt-1">
                      <Checkbox
                        id="agreeTerms"
                        checked={formData.agreeTerms}
                        onCheckedChange={(checked) => {
                          setFormData(prev => ({
                            ...prev,
                            agreeTerms: checked === true
                          }));
                          
                          if (errors.agreeTerms) {
                            setErrors(prev => {
                              const newErrors = {...prev};
                              delete newErrors.agreeTerms;
                              return newErrors;
                            });
                          }
                        }}
                      />
                    </div>
                    <label htmlFor="agreeTerms" className="ml-2 text-sm text-gray-600">
                      Saya menyetujui <Link to="/terms" className="text-primary hover:underline">Syarat dan Ketentuan</Link> serta <Link to="/privacy" className="text-primary hover:underline">Kebijakan Privasi</Link>
                    </label>
                  </div>
                  {errors.agreeTerms && (
                    <p className="text-xs text-red-500 mt-1">{errors.agreeTerms}</p>
                  )}
                </div>
                
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <span className="mr-2">
                        <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      </span>
                      Memproses...
                    </>
                  ) : 'Daftar'}
                </Button>
              </form>
              
              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">Atau daftar dengan</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-3 mt-6">
                  <Button variant="outline" type="button" className="w-full">
                    <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                      <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
                        <path fill="#4285F4" d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z"/>
                        <path fill="#34A853" d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z"/>
                        <path fill="#FBBC05" d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z"/>
                        <path fill="#EA4335" d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z"/>
                      </g>
                    </svg>
                    Google
                  </Button>
                  <Button variant="outline" type="button" className="w-full">
                    <svg className="h-5 w-5 mr-2 text-[#1877F2]" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M9.19795 21.5H13.198V13.4901H16.8021L17.198 9.50977H13.198V7.5C13.198 6.94772 13.6457 6.5 14.198 6.5H17.198V2.5H14.198C11.4365 2.5 9.19795 4.73858 9.19795 7.5V9.50977H7.19795L6.80206 13.4901H9.19795V21.5Z" />
                    </svg>
                    Facebook
                  </Button>
                </div>
              </div>
            </CardContent>
            
            <CardFooter className="justify-center">
              <p className="text-sm text-gray-600">
                Sudah memiliki akun?{' '}
                <Link to="/login" className="font-medium text-primary hover:underline">
                  Masuk sekarang
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

export default Register;
