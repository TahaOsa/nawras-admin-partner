import type { User as SupabaseUser, Session as SupabaseSession } from '@supabase/supabase-js';

// Use Supabase types directly
export type User = SupabaseUser;
export type Session = SupabaseSession;

export interface AuthState {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export interface SignInCredentials {
  email: string;
  password: string;
}

export interface AuthContextType extends AuthState {
  signIn: (credentials: SignInCredentials) => Promise<void>;
  signOut: () => Promise<void>;
}
