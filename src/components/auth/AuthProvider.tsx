import React, { createContext, useContext, useEffect, useState } from 'react';
import { authClient } from '../../lib/auth/auth-client';
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
        const session = await authClient.getSession();
        if (session) {
          setAuthState({
            user: session.user,
            session,
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
  }, []);

  const signIn = async (credentials: SignInCredentials) => {
    setAuthState(prev => ({ ...prev, isLoading: true }));
    
    try {
      const { user, session } = await authClient.signIn(credentials);
      setAuthState({
        user,
        session,
        isLoading: false,
        isAuthenticated: true,
      });
    } catch (error) {
      setAuthState(prev => ({ ...prev, isLoading: false }));
      throw error;
    }
  };

  const signOut = async () => {
    setAuthState(prev => ({ ...prev, isLoading: true }));
    
    try {
      await authClient.signOut();
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
