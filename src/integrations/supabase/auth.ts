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
    
    console.log('Starting registration process...');
    console.log('Registration data:', { email, fullName, phone, address });
    
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

    console.log('Supabase auth response:', { 
      user: authData?.user ? `User ID: ${authData.user.id}` : null,
      session: authData?.session ? 'Session present' : 'No session',
      error: error ? `Error: ${error.message}` : 'No error'
    });

    if (error) {
      console.error('Registration error:', error);
      return { user: null, error, session: null };
    }

    // Verify the user was created in auth system
    if (authData?.user) {
      console.log('User successfully created in auth system:', authData.user.id);
      
      // Check if the database trigger created a profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authData.user.id)
        .single();
        
      if (profileError) {
        console.log('Profile verification error (might be normal if RLS prevents reading):', profileError);
        
        // As a fallback, manually try to create the profile
        await createUserProfile(authData.user.id, {
          full_name: fullName || '',
          phone_number: phone,
          alamat: address
        });
      } else {
        console.log('Profile automatically created:', profileData);
      }
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

// Manual profile creation as a fallback if the trigger doesn't work
export const createUserProfile = async (userId: string, userData: { 
  full_name?: string;
  phone_number?: string;
  alamat?: string;
  profile_picture_url?: string;
}): Promise<{ success: boolean; error: any }> => {
  try {
    console.log('Creating user profile manually:', { userId, userData });
    
    const { error } = await supabase
      .from('profiles')
      .insert([
        { 
          id: userId,
          full_name: userData.full_name || '',
          phone_number: userData.phone_number,
          alamat: userData.alamat,
          profile_picture_url: userData.profile_picture_url
        }
      ]);
    
    if (error) {
      console.error('Manual profile creation error:', error);
      return { success: false, error };
    }
    
    console.log('Profile created successfully via manual insertion');
    return { success: true, error: null };
  } catch (err) {
    console.error('Unexpected error creating profile:', err);
    return { success: false, error: err };
  }
};

export const signIn = async (data: AuthFormData): Promise<{ user: User | null; error: AuthError | null; session: Session | null }> => {
  try {
    const { email, password } = data;
    
    console.log('Starting login process...');
    
    const { data: authData, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error('Login error:', error);
      return { user: null, error, session: null };
    }

    console.log('Login successful:', authData.user?.id);
    
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
    const filePath = `${userId}/${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
    
    console.log(`Uploading profile image to storage/profile-images/${filePath}`);
    
    // Upload the file to Supabase storage
    const { error: uploadError } = await supabase.storage
      .from('profile-images')
      .upload(filePath, file);
    
    if (uploadError) {
      console.error('Profile image upload error:', uploadError);
      return { url: null, error: uploadError };
    }
    
    // Get the public URL for the uploaded file
    const { data } = supabase.storage
      .from('profile-images')
      .getPublicUrl(filePath);
    
    const publicUrl = data?.publicUrl || null;
    console.log('Profile image uploaded successfully, URL:', publicUrl);
    
    return { url: publicUrl, error: null };
  } catch (err) {
    console.error('Error uploading profile image:', err);
    return { url: null, error: err as Error };
  }
};
