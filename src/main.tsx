import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { QueryProvider, SettingsProvider } from './providers'
import { ErrorBoundary } from './components'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <SettingsProvider>
        <QueryProvider>
          <App />
        </QueryProvider>
      </SettingsProvider>
    </ErrorBoundary>
  </StrictMode>,
)
