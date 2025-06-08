import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';

// RTL languages
const RTL_LANGUAGES = ['ar', 'he', 'fa', 'ur'];

export function useI18n() {
  const { t, i18n } = useTranslation();

  const isRTL = RTL_LANGUAGES.includes(i18n.language);

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  // Update document direction based on language
  useEffect(() => {
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    document.documentElement.lang = i18n.language;
  }, [i18n.language, isRTL]);

  return {
    t,
    i18n,
    isRTL,
    currentLanguage: i18n.language,
    changeLanguage,
  };
}

// Specialized hooks for different namespaces
export function useAuthTranslation() {
  const { t, i18n } = useTranslation('auth');
  const isRTL = RTL_LANGUAGES.includes(i18n.language);
  
  return { t, isRTL, currentLanguage: i18n.language };
}

export function useExpenseTranslation() {
  const { t, i18n } = useTranslation('expenses');
  const isRTL = RTL_LANGUAGES.includes(i18n.language);
  
  return { t, isRTL, currentLanguage: i18n.language };
}

export function useSettlementTranslation() {
  const { t, i18n } = useTranslation('settlement');
  const isRTL = RTL_LANGUAGES.includes(i18n.language);
  
  return { t, isRTL, currentLanguage: i18n.language };
}

export function useCommonTranslation() {
  const { t, i18n } = useTranslation('common');
  const isRTL = RTL_LANGUAGES.includes(i18n.language);
  
  return { t, isRTL, currentLanguage: i18n.language };
} 