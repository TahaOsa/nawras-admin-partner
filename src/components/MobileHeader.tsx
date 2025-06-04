import React from 'react';
import { useLocation } from 'wouter';

const getPageTitle = (path: string): string => {
  switch (path) {
    case '/':
      return 'Dashboard';
    case '/add-expense':
      return 'Add Expense';
    case '/settlement':
      return 'Settlement';
    case '/history':
      return 'History';
    case '/reports':
      return 'Reports';
    case '/settings':
      return 'Settings';
    default:
      return 'Nawras Admin';
  }
};

const MobileHeader: React.FC = () => {
  const [location] = useLocation();
  const title = getPageTitle(location);

  return (
    <div className="md:hidden bg-white border-b border-gray-200 px-4 py-3">
      <h1 className="text-lg font-semibold text-gray-900 text-center">
        {title}
      </h1>
    </div>
  );
};

export default MobileHeader;
