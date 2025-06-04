// User-related TypeScript type definitions

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  createdAt: string;
  lastLoginAt?: string;
}

// User authentication data
export interface AuthUser {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

// Login request
export interface LoginRequest {
  email: string;
  password: string;
}

// Login response
export interface LoginResponse {
  success: boolean;
  data: {
    user: AuthUser;
    token: string;
  };
  message?: string;
}

// User preferences
export interface UserPreferences {
  currency: string;
  dateFormat: string;
  notifications: boolean;
  theme: 'light' | 'dark' | 'auto';
}

// API response wrapper for user data
export interface UserResponse {
  success: boolean;
  data: User;
  timestamp?: string;
}
