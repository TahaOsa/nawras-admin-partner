import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { QueryProvider, SettingsProvider, AuthProvider } from './providers'
import { ErrorBoundary } from './components'

// Initialize i18n
import './lib/i18n'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <AuthProvider>
      <SettingsProvider>
        <QueryProvider>
          <App />
        </QueryProvider>
      </SettingsProvider>
      </AuthProvider>
    </ErrorBoundary>
  </StrictMode>,
)
