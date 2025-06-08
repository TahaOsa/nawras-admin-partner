import React from 'react';
import { Globe, ChevronDown } from 'lucide-react';
import { useSettings } from '../providers/SettingsProvider';
import { useI18n } from '../hooks/useI18n';

export const LanguageSelector: React.FC = () => {
  const { settings, updateSettings } = useSettings();
  const { isRTL } = useI18n();
  
  const languages = [
    { code: 'en', name: 'English', nativeName: 'English' },
    { code: 'ar', name: 'Arabic', nativeName: 'العربية' }
  ];

  const currentLanguage = languages.find(lang => lang.code === settings.language);

  const handleLanguageChange = (languageCode: string) => {
    updateSettings({ language: languageCode as 'en' | 'ar' });
  };

  return (
    <div className={`relative group ${isRTL ? 'font-arabic' : ''}`}>
      <button
        className={`
          flex items-center gap-2 px-3 py-2 
          bg-white border border-gray-200 rounded-lg 
          hover:bg-gray-50 transition-colors
          text-sm font-medium text-gray-700
          ${isRTL ? 'flex-row-reverse' : ''}
        `}
        title="Select Language"
      >
        <Globe className="h-4 w-4 text-gray-500" />
        <span>{currentLanguage?.nativeName}</span>
        <ChevronDown className="h-4 w-4 text-gray-500" />
      </button>

      {/* Dropdown Menu */}
      <div className={`
        absolute top-full mt-1 w-48
        bg-white border border-gray-200 rounded-lg shadow-lg
        opacity-0 invisible group-hover:opacity-100 group-hover:visible
        transition-all duration-200 z-50
        ${isRTL ? 'right-0' : 'left-0'}
      `}>
        {languages.map((language) => (
          <button
            key={language.code}
            onClick={() => handleLanguageChange(language.code)}
            className={`
              w-full px-4 py-3 text-left hover:bg-gray-50
              transition-colors border-b border-gray-100 last:border-b-0
              first:rounded-t-lg last:rounded-b-lg
              ${settings.language === language.code ? 'bg-blue-50 text-blue-700' : 'text-gray-700'}
              ${isRTL && language.code === 'ar' ? 'text-right font-arabic' : ''}
            `}
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">{language.nativeName}</div>
                <div className="text-xs text-gray-500">{language.name}</div>
              </div>
              {settings.language === language.code && (
                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default LanguageSelector; 