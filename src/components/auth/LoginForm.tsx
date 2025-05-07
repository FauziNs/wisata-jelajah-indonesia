
import React, { useState } from 'react';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { signIn, resetPassword } from '@/integrations/supabase/auth';
import { useToast } from '@/hooks/use-toast';

interface LoginFormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

interface LoginFormProps {
  redirectTo: string;
}

const LoginForm = ({ redirectTo }: LoginFormProps) => {
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
    rememberMe: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
      
      // Clear error for this field when user starts typing again
      if (errors[name]) {
        setErrors(prev => {
          const newErrors = {...prev};
          delete newErrors[name];
          return newErrors;
        });
      }
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    // Validate email
    if (!formData.email) {
      newErrors.email = 'Email wajib diisi';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)) {
      newErrors.email = 'Format email tidak valid';
    }
    
    // Validate password
    if (!formData.password) {
      newErrors.password = 'Password wajib diisi';
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

    try {
      const { error } = await signIn({
        email: formData.email,
        password: formData.password,
      });
      
      if (error) {
        if (error.message.includes('Invalid login')) {
          toast({
            title: "Login gagal",
            description: "Email atau password salah. Silakan coba lagi.",
            variant: "destructive"
          });
        } else if (error.message.includes('Email not confirmed')) {
          toast({
            title: "Email belum diverifikasi",
            description: "Silakan periksa email Anda untuk verifikasi akun.",
            variant: "destructive"
          });
        } else {
          toast({
            title: "Login gagal",
            description: error.message,
            variant: "destructive"
          });
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "Login gagal!",
        description: "Terjadi kesalahan saat login. Silakan coba lagi.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleForgotPassword = async () => {
    if (!formData.email) {
      setErrors({
        email: 'Masukkan email Anda untuk reset password'
      });
      return;
    }
    
    if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)) {
      setErrors({
        email: 'Format email tidak valid'
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const { error } = await resetPassword(formData.email);
      
      if (error) {
        toast({
          title: "Reset password gagal",
          description: error.message,
          variant: "destructive"
        });
        return;
      }
      
      toast({
        title: "Email reset password terkirim",
        description: "Silakan periksa email Anda untuk instruksi reset password."
      });
    } catch (error) {
      console.error('Reset password error:', error);
      toast({
        title: "Reset password gagal",
        description: "Terjadi kesalahan. Silakan coba lagi.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const toggleShowPassword = () => {
    setShowPassword(prev => !prev);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="email" className="text-sm font-medium">Email</label>
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
      
      <div className="space-y-2">
        <div className="flex justify-between">
          <label htmlFor="password" className="text-sm font-medium">Password</label>
          <button 
            type="button" 
            onClick={handleForgotPassword}
            className="text-sm text-primary hover:underline"
          >
            Lupa password?
          </button>
        </div>
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
            onClick={toggleShowPassword}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>
        {errors.password && (
          <p className="text-xs text-red-500">{errors.password}</p>
        )}
      </div>
      
      <div className="flex items-center">
        <div className="flex items-center h-5">
          <Checkbox
            id="rememberMe"
            checked={formData.rememberMe}
            onCheckedChange={(checked) => {
              setFormData(prev => ({
                ...prev,
                rememberMe: checked === true
              }));
            }}
          />
        </div>
        <label htmlFor="rememberMe" className="ml-2 text-sm text-gray-600">
          Ingat saya
        </label>
      </div>
      
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? 'Memproses...' : 'Masuk'}
      </Button>
    </form>
  );
};

export default LoginForm;
