// Settings and preferences types

export interface UserSettings {
  // Display preferences
  currency: 'USD' | 'EUR' | 'GBP' | 'TRY';
  currencySymbol: string;
  dateFormat: 'MM/DD/YYYY' | 'DD/MM/YYYY' | 'YYYY-MM-DD';
  timeFormat: '12h' | '24h';
  
  // Notification preferences
  notifications: {
    emailNotifications: boolean;
    pushNotifications: boolean;
    expenseReminders: boolean;
    settlementReminders: boolean;
    weeklyReports: boolean;
    monthlyReports: boolean;
  };
  
  // App preferences
  theme: 'light' | 'dark' | 'system';
  language: 'en' | 'tr' | 'ar';
  defaultExpenseCategory: string;
  autoSaveExpenses: boolean;
  showDecimalPlaces: boolean;
  
  // Privacy preferences
  dataRetention: '1year' | '2years' | '5years' | 'forever';
  shareAnalytics: boolean;
  
  // User profile
  profile: {
    name: string;
    email: string;
    avatar?: string;
    timezone: string;
  };
}

export interface SettingsContextType {
  settings: UserSettings;
  updateSettings: (updates: Partial<UserSettings>) => void;
  resetSettings: () => void;
  exportSettings: () => string;
  importSettings: (settingsJson: string) => boolean;
}

// Default settings
export const DEFAULT_SETTINGS: UserSettings = {
  currency: 'USD',
  currencySymbol: '$',
  dateFormat: 'MM/DD/YYYY',
  timeFormat: '12h',
  
  notifications: {
    emailNotifications: true,
    pushNotifications: false,
    expenseReminders: true,
    settlementReminders: true,
    weeklyReports: false,
    monthlyReports: true,
  },
  
  theme: 'system',
  language: 'en',
  defaultExpenseCategory: 'Food',
  autoSaveExpenses: true,
  showDecimalPlaces: true,
  
  dataRetention: '2years',
  shareAnalytics: false,
  
  profile: {
    name: 'User',
    email: '',
    timezone: 'America/New_York',
  },
};

// Currency options
export const CURRENCY_OPTIONS = [
  { value: 'USD', label: 'US Dollar', symbol: '$' },
  { value: 'EUR', label: 'Euro', symbol: '€' },
  { value: 'GBP', label: 'British Pound', symbol: '£' },
  { value: 'TRY', label: 'Turkish Lira', symbol: '₺' },
] as const;

// Date format options
export const DATE_FORMAT_OPTIONS = [
  { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY (US)', example: '01/15/2024' },
  { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY (EU)', example: '15/01/2024' },
  { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD (ISO)', example: '2024-01-15' },
] as const;

// Language options
export const LANGUAGE_OPTIONS = [
  { value: 'en', label: 'English' },
  { value: 'tr', label: 'Türkçe' },
  { value: 'ar', label: 'العربية' },
] as const;

// Theme options
export const THEME_OPTIONS = [
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
  { value: 'system', label: 'System' },
] as const;
