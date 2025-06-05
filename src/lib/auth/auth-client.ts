import type { SignInCredentials, User, Session } from '../../types/auth';

const API_BASE = process.env.NODE_ENV === 'production' 
  ? window.location.origin 
  : 'http://localhost:8080';

export class AuthClient {
  private baseURL: string;

  constructor(baseURL: string = API_BASE) {
    this.baseURL = baseURL;
  }

  async signIn(credentials: SignInCredentials): Promise<{ user: User; session: Session }> {
    const response = await fetch(`${this.baseURL}/api/auth/sign-in`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Authentication failed');
    }

    const data = await response.json();
    if (!data.success) {
      throw new Error(data.error || 'Authentication failed');
    }

    return data.data;
  }

  async signOut(): Promise<void> {
    const response = await fetch(`${this.baseURL}/api/auth/sign-out`, {
      method: 'POST',
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Sign out failed');
    }
  }

  async getSession(): Promise<Session | null> {
    try {
      const response = await fetch(`${this.baseURL}/api/auth/session`, {
        credentials: 'include',
      });

      if (!response.ok) {
        return null;
      }

      const data = await response.json();
      return data.success ? data.data : null;
    } catch (error) {
      console.error('Failed to get session:', error);
      return null;
    }
  }
}

export const authClient = new AuthClient();
