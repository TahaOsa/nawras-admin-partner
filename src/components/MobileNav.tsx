import React from 'react';
import { Link, useLocation } from 'wouter';
import {
  Home,
  Plus,
  HandCoins,
  History,
  BarChart3,
  Settings
} from 'lucide-react';
import { clsx } from 'clsx';

interface NavItem {
  path: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const navItems: NavItem[] = [
  { path: '/', label: 'Home', icon: Home },
  { path: '/add-expense', label: 'Add', icon: Plus },
  { path: '/settlement', label: 'Settle', icon: HandCoins },
  { path: '/history', label: 'History', icon: History },
  { path: '/reports', label: 'Reports', icon: BarChart3 },
  { path: '/settings', label: 'Settings', icon: Settings },
];

const MobileNav: React.FC = () => {
  const [location] = useLocation();

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 safe-area-inset-bottom">
      <nav className="flex justify-around items-center py-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location === item.path;

          return (
            <Link key={item.path} href={item.path}>
              <a
                className={clsx(
                  'flex flex-col items-center justify-center px-1 py-2 min-w-0 transition-colors min-h-[60px]',
                  isActive
                    ? 'text-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                )}
              >
                <Icon
                  className={clsx(
                    'h-6 w-6 mb-1',
                    isActive
                      ? 'text-blue-600'
                      : 'text-gray-400'
                  )}
                />
                <span
                  className={clsx(
                    'text-xs font-medium truncate',
                    isActive
                      ? 'text-blue-600'
                      : 'text-gray-500'
                  )}
                >
                  {item.label}
                </span>
              </a>
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

export default MobileNav;
