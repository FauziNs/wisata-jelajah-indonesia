
import { supabase } from './client';
import { Session, User, AuthError } from '@supabase/supabase-js';

export type AuthFormData = {
  email: string;
  password: string;
  fullName?: string;
  phone?: string;
  address?: string;
  confirmPassword?: string;
  profileImage?: File | null;
};

export const signUp = async (data: AuthFormData): Promise<{ user: User | null; error: AuthError | null; session: Session | null }> => {
  try {
    const { email, password, fullName, phone, address } = data;
    
    // Create auth user with Supabase
    const { data: authData, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          phone_number: phone,
          alamat: address
        }
      }
    });

    if (error) {
      console.error('Registration error:', error);
      return { user: null, error, session: null };
    }

    return { 
      user: authData?.user || null, 
      session: authData?.session || null,
      error: null 
    };
  } catch (err) {
    console.error('Unexpected error during registration:', err);
    return { 
      user: null, 
      session: null,
      error: err as AuthError 
    };
  }
};

export const signIn = async (data: AuthFormData): Promise<{ user: User | null; error: AuthError | null; session: Session | null }> => {
  try {
    const { email, password } = data;
    
    const { data: authData, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error('Login error:', error);
      return { user: null, error, session: null };
    }

    return { 
      user: authData?.user || null, 
      session: authData?.session || null,
      error: null 
    };
  } catch (err) {
    console.error('Unexpected error during login:', err);
    return { 
      user: null, 
      session: null,
      error: err as AuthError 
    };
  }
};

export const signOut = async (): Promise<{ error: AuthError | null }> => {
  try {
    const { error } = await supabase.auth.signOut();
    return { error };
  } catch (err) {
    console.error('Unexpected error during logout:', err);
    return { error: err as AuthError };
  }
};

export const resetPassword = async (email: string): Promise<{ error: AuthError | null }> => {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    return { error };
  } catch (err) {
    console.error('Unexpected error during password reset:', err);
    return { error: err as AuthError };
  }
};

export const updateProfile = async (userId: string, data: Partial<{
  full_name: string;
  phone_number: string;
  alamat: string;
  profile_picture_url: string;
}>): Promise<{ error: Error | null }> => {
  try {
    const { error } = await supabase
      .from('profiles')
      .update(data)
      .eq('id', userId);
    
    return { error };
  } catch (err) {
    console.error('Unexpected error updating profile:', err);
    return { error: err as Error };
  }
};

export const uploadProfileImage = async (userId: string, file: File): Promise<{ url: string | null; error: Error | null }> => {
  try {
    // Create a unique file path for the image
    const filePath = `profiles/${userId}/${Date.now()}_${file.name}`;
    
    // Upload the file to Supabase storage
    const { error: uploadError } = await supabase.storage
      .from('profile-images')
      .upload(filePath, file);
    
    if (uploadError) {
      return { url: null, error: uploadError };
    }
    
    // Get the public URL for the uploaded file
    const { data } = supabase.storage
      .from('profile-images')
      .getPublicUrl(filePath);
    
    const publicUrl = data?.publicUrl || null;
    
    return { url: publicUrl, error: null };
  } catch (err) {
    console.error('Error uploading profile image:', err);
    return { url: null, error: err as Error };
  }
};
