
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase, testSupabaseConnection } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  session: Session | null;
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  testConnection: () => Promise<{ success: boolean; message: string }>;
}

const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  isLoading: true,
  isAuthenticated: false,
  testConnection: async () => ({ success: false, message: 'AuthContext not initialized' }),
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    console.log('Auth provider initializing...');
    
    // First set up the auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        console.log('Auth state changed:', event, currentSession?.user?.id);
        setSession(currentSession);
        setUser(currentSession?.user || null);
        
        if (event === 'SIGNED_IN') {
          console.log('User signed in:', currentSession?.user?.id);
          toast({
            title: "Login berhasil",
            description: "Selamat datang kembali!",
          });
          // We removed the navigate call here since it should be handled by the component
        } else if (event === 'SIGNED_OUT') {
          console.log('User signed out');
          toast({
            title: "Logout berhasil",
            description: "Anda telah keluar dari akun",
          });
          // We removed the navigate call here since it should be handled by the component
        } else if (event === 'USER_UPDATED') {
          console.log('User updated');
        } else if (event === 'PASSWORD_RECOVERY') {
          console.log('Password recovery event');
          // We removed the navigate call here since it should be handled by the component
        }
      }
    );

    // Then fetch the initial session
    const getInitialSession = async () => {
      try {
        console.log('Fetching initial session...');
        const { data } = await supabase.auth.getSession();
        console.log('Initial session:', data.session?.user?.id || 'No session');
        setSession(data.session);
        setUser(data.session?.user || null);
      } catch (error) {
        console.error('Error fetching session:', error);
        toast({
          title: "Error",
          description: "Failed to retrieve authentication state",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    getInitialSession();

    return () => {
      console.log('Cleaning up auth subscription');
      subscription.unsubscribe();
    };
  }, [toast]);

  const testConnection = async () => {
    return await testSupabaseConnection();
  };

  const value = {
    session,
    user,
    isLoading,
    isAuthenticated: !!session,
    testConnection,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
