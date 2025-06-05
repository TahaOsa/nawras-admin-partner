// Application configuration management
export const config = {
  // API Configuration
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 
    (import.meta.env.PROD ? window.location.origin : 'http://localhost:3001'),

  // App Information
  appName: import.meta.env.VITE_APP_NAME || 'Nawras Admin',
  appVersion: import.meta.env.VITE_APP_VERSION || '1.0.0',

  // Environment
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,

  // Feature Flags
  enableDevTools: import.meta.env.VITE_ENABLE_DEV_TOOLS === 'true',
  enableAnalytics: import.meta.env.VITE_ENABLE_ANALYTICS === 'true',
  enableErrorReporting: import.meta.env.VITE_ENABLE_ERROR_REPORTING === 'true',

  // Logging
  logLevel: import.meta.env.VITE_LOG_LEVEL || 'info',

  // Security
  enableCSP: import.meta.env.VITE_ENABLE_CSP === 'true',
  secureCookies: import.meta.env.VITE_SECURE_COOKIES === 'true',
} as const;

// Type-safe environment validation
export const validateConfig = () => {
  const requiredVars = ['VITE_API_BASE_URL'];
  const missing = requiredVars.filter(varName => !import.meta.env[varName]);

  if (missing.length > 0) {
    console.warn('Missing environment variables:', missing);
  }

  return missing.length === 0;
};

// Logger utility based on log level
export const logger = {
  debug: (...args: any[]) => {
    if (config.logLevel === 'debug' || config.isDevelopment) {
      console.debug('[DEBUG]', ...args);
    }
  },
  info: (...args: any[]) => {
    if (['debug', 'info'].includes(config.logLevel)) {
      console.info('[INFO]', ...args);
    }
  },
  warn: (...args: any[]) => {
    if (['debug', 'info', 'warn'].includes(config.logLevel)) {
      console.warn('[WARN]', ...args);
    }
  },
  error: (...args: any[]) => {
    console.error('[ERROR]', ...args);
  },
};

// Initialize configuration validation
if (config.isDevelopment) {
  validateConfig();
  logger.info('Configuration loaded:', {
    apiBaseUrl: config.apiBaseUrl,
    appName: config.appName,
    appVersion: config.appVersion,
    environment: config.isDevelopment ? 'development' : 'production',
  });
}
