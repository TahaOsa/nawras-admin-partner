import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, supabase } from '../../lib/supabase';
import type { AuthContextType, User, Session, SignInCredentials } from '../../types/auth';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [authState, setAuthState] = useState<{
    user: User | null;
    session: Session | null;
    isLoading: boolean;
    isAuthenticated: boolean;
  }>({
    user: null,
    session: null,
    isLoading: true,
    isAuthenticated: false,
  });

  // Check for existing session on mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        const { session } = await auth.getCurrentSession();
        if (session) {
          setAuthState({
            user: session.user,
            session: session,
            isLoading: false,
            isAuthenticated: true,
          });
        } else {
          setAuthState({
            user: null,
            session: null,
            isLoading: false,
            isAuthenticated: false,
          });
        }
      } catch (error) {
        console.error('Failed to check session:', error);
        setAuthState({
          user: null,
          session: null,
          isLoading: false,
          isAuthenticated: false,
        });
      }
    };

    checkSession();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session) {
          setAuthState({
            user: session.user,
            session: session,
            isLoading: false,
            isAuthenticated: true,
          });
        } else {
          setAuthState({
            user: null,
            session: null,
            isLoading: false,
            isAuthenticated: false,
          });
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (credentials: SignInCredentials) => {
    setAuthState(prev => ({ ...prev, isLoading: true }));
    
    try {
      const { data, error } = await auth.signInWithEmail(credentials.email, credentials.password);
      
      if (error) {
        setAuthState(prev => ({ ...prev, isLoading: false }));
        throw error;
      }

      if (data.session && data.user) {
        setAuthState({
          user: data.user,
          session: data.session,
          isLoading: false,
          isAuthenticated: true,
        });
      }
    } catch (error) {
      setAuthState(prev => ({ ...prev, isLoading: false }));
      throw error;
    }
  };

  const signOut = async () => {
    setAuthState(prev => ({ ...prev, isLoading: true }));
    
    try {
      const { error } = await auth.signOut();
      if (error) {
        console.error('Sign out failed:', error);
      }
      // Clear state regardless of error
      setAuthState({
        user: null,
        session: null,
        isLoading: false,
        isAuthenticated: false,
      });
    } catch (error) {
      console.error('Sign out failed:', error);
      // Even if sign out fails on server, clear local state
      setAuthState({
        user: null,
        session: null,
        isLoading: false,
        isAuthenticated: false,
      });
    }
  };

  const contextValue: AuthContextType = {
    ...authState,
    signIn,
    signOut,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
