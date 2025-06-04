import React, { useState } from 'react';
import { LogOut } from 'lucide-react';
import { useAuth } from './AuthProvider';

interface LogoutButtonProps {
  className?: string;
  showText?: boolean;
}

export const LogoutButton: React.FC<LogoutButtonProps> = ({ 
  className = '', 
  showText = true 
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const { user, signOut } = useAuth();

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await signOut();
      // The auth provider will handle the state update
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleLogout}
      disabled={isLoading}
      className={`inline-flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors ${className}`}
      title={`Sign out ${user?.name || ''}`}
    >
      {isLoading ? (
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
      ) : (
        <LogOut className="h-4 w-4" />
      )}
      {showText && <span>{isLoading ? 'Signing out...' : 'Sign Out'}</span>}
    </button>
  );
};
