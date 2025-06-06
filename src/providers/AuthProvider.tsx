import React, { createContext, useContext, useEffect, useState } from 'react';
import type { User, Session } from '@supabase/supabase-js';
import { auth } from '../lib/supabase';
import { logError } from '../lib/errorLogger';

interface AuthState {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

interface AuthContextType extends AuthState {
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const { session: initialSession, error } = await auth.getCurrentSession();
        
        if (error) {
          console.error('Error getting initial session:', error);
          logError(error.message, { context: 'auth_initial_session' });
        } else {
          setSession(initialSession);
          setUser(initialSession?.user ?? null);
        }
      } catch (error: any) {
        console.error('Unexpected error getting initial session:', error);
        logError(error, { context: 'auth_initial_session_unexpected' });
      } finally {
        setIsLoading(false);
      }
    };

    getInitialSession();

    // Listen for auth state changes
    const { data: { subscription } } = auth.onAuthStateChange(
      async (event, newSession) => {
        console.log('Auth state changed:', event, newSession?.user?.email);
        
        setSession(newSession);
        setUser(newSession?.user ?? null);
        setIsLoading(false);

        // Log auth events for debugging
        if (event === 'SIGNED_IN') {
          console.log('User signed in:', newSession?.user?.email);
        } else if (event === 'SIGNED_OUT') {
          console.log('User signed out');
        } else if (event === 'TOKEN_REFRESHED') {
          console.log('Token refreshed for user:', newSession?.user?.email);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    try {
      const { error } = await auth.signOut();
      if (error) {
        console.error('Error signing out:', error);
        logError(error.message, { context: 'auth_signout' });
        throw error;
      }
    } catch (error: any) {
      console.error('Unexpected error signing out:', error);
      logError(error, { context: 'auth_signout_unexpected' });
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    session,
    isLoading,
    isAuthenticated: !!user,
    signOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 