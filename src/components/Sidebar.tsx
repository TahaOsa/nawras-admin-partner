import React from 'react';
import { Link, useLocation } from 'wouter';
import {
  Home,
  Plus,
  HandCoins,
  History,
  BarChart3,
  Settings,
  User
} from 'lucide-react';
import { clsx } from 'clsx';
import { useAuth, LogoutButton } from './auth';

interface NavItem {
  path: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const navItems: NavItem[] = [
  { path: '/', label: 'Dashboard', icon: Home },
  { path: '/add-expense', label: 'Add Expense', icon: Plus },
  { path: '/settlement', label: 'Settlement', icon: HandCoins },
  { path: '/history', label: 'History', icon: History },
  { path: '/reports', label: 'Reports', icon: BarChart3 },
  { path: '/settings', label: 'Settings', icon: Settings },
];

const Sidebar: React.FC = () => {
  const [location] = useLocation();
  const { user } = useAuth();

  return (
    <div className="hidden md:flex md:w-64 md:flex-col">
      <div className="flex flex-col flex-grow pt-5 pb-4 overflow-y-auto bg-white border-r border-gray-200">
        {/* Logo/Brand */}
        <div className="flex items-center flex-shrink-0 px-4 mb-8">
          <h1 className="text-xl font-bold text-gray-900">
            Nawras Admin
          </h1>
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
                  {item.label}
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
                    {user.name}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {user.email}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Logout Button */}
          <div className="p-4">
            <LogoutButton className="w-full justify-center" />
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
