// Context providers
// - AuthProvider (user authentication context)
// - QueryClientProvider (React Query)
// - SettingsProvider (user preferences)
// - ThemeProvider (if needed)

export { AuthProvider, useAuth } from './AuthProvider';
export { default as QueryProvider } from './QueryProvider';
export { default as SettingsProvider, useSettings } from './SettingsProvider';
