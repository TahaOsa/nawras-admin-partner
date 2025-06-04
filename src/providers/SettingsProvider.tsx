import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { UserSettings, SettingsContextType } from '../types';
import { DEFAULT_SETTINGS } from '../types';

// Create the settings context
const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

// Local storage key
const SETTINGS_STORAGE_KEY = 'nawras-admin-settings';

interface SettingsProviderProps {
  children: ReactNode;
}

export const SettingsProvider: React.FC<SettingsProviderProps> = ({ children }) => {
  const [settings, setSettings] = useState<UserSettings>(() => {
    // Load settings from localStorage on initialization
    try {
      const savedSettings = localStorage.getItem(SETTINGS_STORAGE_KEY);
      if (savedSettings) {
        const parsed = JSON.parse(savedSettings);
        // Merge with default settings to ensure all properties exist
        return { ...DEFAULT_SETTINGS, ...parsed };
      }
    } catch (error) {
      console.error('Failed to load settings from localStorage:', error);
    }
    return DEFAULT_SETTINGS;
  });

  // Save settings to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
    } catch (error) {
      console.error('Failed to save settings to localStorage:', error);
    }
  }, [settings]);

  // Update settings function
  const updateSettings = (updates: Partial<UserSettings>) => {
    setSettings(prev => {
      const newSettings = { ...prev };

      // Handle nested updates for notifications and profile
      if (updates.notifications) {
        newSettings.notifications = { ...prev.notifications, ...updates.notifications };
      }

      if (updates.profile) {
        newSettings.profile = { ...prev.profile, ...updates.profile };
      }

      // Apply other updates
      Object.keys(updates).forEach(key => {
        if (key !== 'notifications' && key !== 'profile') {
          (newSettings as any)[key] = (updates as any)[key];
        }
      });

      return newSettings;
    });
  };

  // Reset settings to defaults
  const resetSettings = () => {
    setSettings(DEFAULT_SETTINGS);
  };

  // Export settings as JSON string
  const exportSettings = (): string => {
    return JSON.stringify(settings, null, 2);
  };

  // Import settings from JSON string
  const importSettings = (settingsJson: string): boolean => {
    try {
      const parsed = JSON.parse(settingsJson);

      // Validate that the imported data has the expected structure
      if (typeof parsed === 'object' && parsed !== null) {
        // Merge with default settings to ensure all properties exist
        const mergedSettings = { ...DEFAULT_SETTINGS, ...parsed };
        setSettings(mergedSettings);
        return true;
      }

      return false;
    } catch (error) {
      console.error('Failed to import settings:', error);
      return false;
    }
  };

  const contextValue: SettingsContextType = {
    settings,
    updateSettings,
    resetSettings,
    exportSettings,
    importSettings,
  };

  return (
    <SettingsContext.Provider value={contextValue}>
      {children}
    </SettingsContext.Provider>
  );
};

// Custom hook to use settings context
export const useSettings = (): SettingsContextType => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};

export default SettingsProvider;
