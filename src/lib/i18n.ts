import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translation files
import enCommon from '../locales/en/common.json';
import enAuth from '../locales/en/auth.json';
import enExpenses from '../locales/en/expenses.json';
import enSettlement from '../locales/en/settlement.json';

import arCommon from '../locales/ar/common.json';
import arAuth from '../locales/ar/auth.json';
import arExpenses from '../locales/ar/expenses.json';
import arSettlement from '../locales/ar/settlement.json';

const resources = {
  en: {
    common: enCommon,
    auth: enAuth,
    expenses: enExpenses,
    settlement: enSettlement,
  },
  ar: {
    common: arCommon,
    auth: arAuth,
    expenses: arExpenses,
    settlement: arSettlement,
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en', // default language
    fallbackLng: 'en',
    debug: process.env.NODE_ENV === 'development',

    // Namespace configuration
    defaultNS: 'common',
    ns: ['common', 'auth', 'expenses', 'settlement'],

    interpolation: {
      escapeValue: false, // React already escapes values
    },

    // Language detection options
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
      lookupLocalStorage: 'i18nextLng',
    },

    // RTL support
    react: {
      useSuspense: false,
    },
  });

export default i18n; 