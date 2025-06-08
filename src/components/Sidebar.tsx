import React, { useState } from 'react';
import { Link, useLocation } from 'wouter';
import {
  Home,
  Plus,
  HandCoins,
  History,
  BarChart3,
  Settings,
  User,
  LogOut,
  AlertCircle
} from 'lucide-react';
import { clsx } from 'clsx';
import { useAuth } from '../providers';
import { useCommonTranslation } from '../hooks/useI18n';
import LanguageSelector from './LanguageSelector';

interface NavItem {
  path: string;
  labelKey: string;
  icon: React.ComponentType<{ className?: string }>;
}

const navItems: NavItem[] = [
  { path: '/', labelKey: 'nav.dashboard', icon: Home },
  { path: '/add-expense', labelKey: 'nav.addExpense', icon: Plus },
  { path: '/settlement', labelKey: 'nav.settlement', icon: HandCoins },
  { path: '/history', labelKey: 'nav.history', icon: History },
  { path: '/reports', labelKey: 'nav.reports', icon: BarChart3 },
  { path: '/settings', labelKey: 'nav.settings', icon: Settings },
];

const Sidebar: React.FC = () => {
  const [location] = useLocation();
  const { user, signOut } = useAuth();
  const { t, isRTL } = useCommonTranslation();
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [signOutError, setSignOutError] = useState<string | null>(null);

  const handleSignOut = async () => {
    setIsSigningOut(true);
    setSignOutError(null);

    try {
      await signOut();
    } catch (error: any) {
      console.error('Sign out error:', error);
      setSignOutError('Failed to sign out. Please try again.');
    } finally {
      setIsSigningOut(false);
    }
  };

  return (
    <div className={`hidden md:flex md:w-64 md:flex-col ${isRTL ? 'font-arabic' : ''}`}>
      <div className={`flex flex-col flex-grow pt-5 pb-4 overflow-y-auto bg-white ${isRTL ? 'border-l' : 'border-r'} border-gray-200`}>
        {/* Logo/Brand */}
        <div className="flex items-center justify-between flex-shrink-0 px-4 mb-8">
          <h1 className="text-xl font-bold text-gray-900">
            Nawras Admin
          </h1>
          <LanguageSelector />
        </div>

        {/* Navigation */}
        <nav className="mt-5 flex-1 px-2 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location === item.path;
            
            return (
              <Link key={item.path} href={item.path}>
                <a
                  className={clsx(
                    'group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors',
                    isActive
                      ? 'bg-blue-100 text-blue-900'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  )}
                >
                  <Icon
                    className={clsx(
                      'mr-3 flex-shrink-0 h-5 w-5',
                      isActive
                        ? 'text-blue-500'
                        : 'text-gray-400 group-hover:text-gray-500'
                    )}
                  />
                  {t(item.labelKey)}
                </a>
              </Link>
            );
          })}
        </nav>

        {/* User Info & Footer */}
        <div className="flex-shrink-0 border-t border-gray-200">
          {/* User Info */}
          {user && (
            <div className="p-4 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="h-5 w-5 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {user.user_metadata?.name || user.email?.split('@')[0] || 'User'}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {user.email}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Sign Out Section */}
          <div className="p-4">
            {signOutError && (
              <div className="mb-3 p-2 bg-red-50 border border-red-200 rounded-md">
                <div className="flex items-start">
                  <AlertCircle className="h-4 w-4 text-red-400 mt-0.5 mr-2" />
                  <p className="text-xs text-red-700">{signOutError}</p>
                </div>
              </div>
            )}
            
            <button
              onClick={handleSignOut}
              disabled={isSigningOut}
              className="w-full flex items-center justify-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSigningOut ? (
                <>
                  <div className={`animate-spin h-4 w-4 border-2 border-gray-400 border-t-transparent rounded-full ${isRTL ? 'ml-2' : 'mr-2'}`}></div>
                  {t('buttons.signingIn')}
                </>
              ) : (
                <>
                  <LogOut className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                  {t('buttons.signOut')}
                </>
              )}
            </button>
          </div>

          {/* App Info */}
          <div className="px-4 pb-4">
            <div className="text-xs text-gray-500">
              Nawras Partner Expenses
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
