import React from 'react';
import { useLocation } from 'wouter';
import { useCommonTranslation } from '../hooks/useI18n';
import LanguageSelector from './LanguageSelector';

const getPageTitle = (t: any, path: string): string => {
  switch (path) {
    case '/':
      return t('nav.dashboard');
    case '/add-expense':
      return t('nav.addExpense');
    case '/settlement':
      return t('nav.settlement');
    case '/history':
      return t('nav.history');
    case '/reports':
      return t('nav.reports');
    case '/settings':
      return t('nav.settings');
    default:
      return 'Nawras Admin';
  }
};

const MobileHeader: React.FC = () => {
  const [location] = useLocation();
  const { t, isRTL } = useCommonTranslation();
  const title = getPageTitle(t, location);

  return (
    <div className={`md:hidden bg-white border-b border-gray-200 px-4 py-3 ${isRTL ? 'font-arabic' : ''}`}>
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold text-gray-900 flex-1 text-center">
          {title}
        </h1>
        <div className="ml-4">
          <LanguageSelector />
        </div>
      </div>
    </div>
  );
};

export default MobileHeader;
