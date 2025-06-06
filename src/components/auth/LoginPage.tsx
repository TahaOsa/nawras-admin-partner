import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { Mail, Lock, Eye, EyeOff, LogIn, Key, AlertCircle, CheckCircle } from 'lucide-react';
import { auth } from '../../lib/supabase';
import { logError } from '../../lib/errorLogger';

interface LoginFormData {
  email: string;
  password: string;
}

interface LoginErrors {
  email?: string;
  password?: string;
  general?: string;
}

const LoginPage: React.FC = () => {
  const [, setLocation] = useLocation();
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<LoginErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmailSent, setResetEmailSent] = useState(false);

  // Form validation
  const validateForm = (): boolean => {
    const newErrors: LoginErrors = {};

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Password validation (only for sign in)
    if (!showForgotPassword && !formData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle input changes
  const handleInputChange = (field: keyof LoginFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
    
    // Clear general error when user makes changes
    if (errors.general) {
      setErrors(prev => ({ ...prev, general: undefined }));
    }
  };

  // Handle sign in
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      const { data, error } = await auth.signInWithEmail(formData.email, formData.password);

      if (error) {
        console.error('Sign in error:', error);
        logError(error.message, { 
          context: 'login', 
          email: formData.email,
          errorCode: error.message
        });

        // Handle specific auth errors
        if (error.message.includes('Invalid login credentials')) {
          setErrors({ general: 'Invalid email or password. Please check your credentials and try again.' });
        } else if (error.message.includes('Email not confirmed')) {
          setErrors({ general: 'Please check your email and click the confirmation link before signing in.' });
        } else if (error.message.includes('Too many requests')) {
          setErrors({ general: 'Too many sign in attempts. Please wait a moment before trying again.' });
        } else {
          setErrors({ general: 'Unable to sign in. Please try again later.' });
        }
        return;
      }

      if (data.user) {
        console.log('User signed in successfully:', data.user.email);
        // Redirect to dashboard
        setLocation('/');
      }

    } catch (error: any) {
      console.error('Unexpected sign in error:', error);
      logError(error, { context: 'login_unexpected' });
      setErrors({ general: 'An unexpected error occurred. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle forgot password
  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email.trim()) {
      setErrors({ email: 'Email is required for password reset' });
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setErrors({ email: 'Please enter a valid email address' });
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      const { error } = await auth.resetPassword(formData.email);

      if (error) {
        console.error('Password reset error:', error);
        logError(error.message, { 
          context: 'password_reset', 
          email: formData.email 
        });
        setErrors({ general: 'Unable to send reset email. Please try again later.' });
        return;
      }

      setResetEmailSent(true);
      console.log('Password reset email sent to:', formData.email);

    } catch (error: any) {
      console.error('Unexpected password reset error:', error);
      logError(error, { context: 'password_reset_unexpected' });
      setErrors({ general: 'An unexpected error occurred. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  // Reset form when switching between sign in and forgot password
  const toggleForgotPassword = () => {
    setShowForgotPassword(!showForgotPassword);
    setErrors({});
    setResetEmailSent(false);
    if (showForgotPassword) {
      setFormData(prev => ({ ...prev, password: '' }));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            {showForgotPassword ? 'Reset Password' : 'Sign In'}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {showForgotPassword 
              ? 'Enter your email to receive a password reset link'
              : 'Welcome back to Nawras Admin Partner'
            }
          </p>
        </div>

        {/* Success message for password reset */}
        {resetEmailSent && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-start">
              <CheckCircle className="h-5 w-5 text-green-400 mt-0.5 mr-3" />
              <div>
                <h3 className="text-sm font-medium text-green-800">
                  Reset Email Sent
                </h3>
                <p className="text-sm text-green-700 mt-1">
                  We've sent a password reset link to <strong>{formData.email}</strong>.
                  Please check your email and follow the instructions.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Form */}
        <form 
          className="mt-8 space-y-6" 
          onSubmit={showForgotPassword ? handleForgotPassword : handleSignIn}
        >
          <div className="space-y-4">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                <Mail className="inline h-4 w-4 mr-1" />
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.email ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="your.email@example.com"
                disabled={isLoading}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            {/* Password Field (only for sign in) */}
            {!showForgotPassword && (
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  <Lock className="inline h-4 w-4 mr-1" />
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={isPasswordVisible ? 'text' : 'password'}
                    autoComplete="current-password"
                    required
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    className={`w-full px-3 py-2 pr-10 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.password ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Enter your password"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                    disabled={isLoading}
                  >
                    {isPasswordVisible ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                )}
              </div>
            )}
          </div>

          {/* General Error */}
          {errors.general && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-start">
                <AlertCircle className="h-5 w-5 text-red-400 mt-0.5 mr-3" />
                <p className="text-sm text-red-700">{errors.general}</p>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={isLoading || resetEmailSent}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                  {showForgotPassword ? 'Sending...' : 'Signing In...'}
                </>
              ) : (
                <>
                  {showForgotPassword ? (
                    <>
                      <Key className="h-4 w-4 mr-2" />
                      Send Reset Link
                    </>
                  ) : (
                    <>
                      <LogIn className="h-4 w-4 mr-2" />
                      Sign In
                    </>
                  )}
                </>
              )}
            </button>
          </div>

          {/* Toggle between Sign In and Forgot Password */}
          <div className="text-center">
            <button
              type="button"
              onClick={toggleForgotPassword}
              disabled={isLoading}
              className="text-sm text-blue-600 hover:text-blue-500 font-medium disabled:opacity-50"
            >
              {showForgotPassword ? (
                '← Back to Sign In'
              ) : (
                'Forgot your password?'
              )}
            </button>
          </div>
        </form>

        {/* Footer */}
        <div className="text-center text-xs text-gray-500 mt-8">
          <p>Nawras Admin Partner - Secure Access</p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
