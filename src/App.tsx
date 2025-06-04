
import React from 'react';
import { Route, Switch } from 'wouter';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

// Auth components
import { AuthProvider, ProtectedRoute } from './components/auth';

// Layout components
import Sidebar from './components/Sidebar';
import MobileNav from './components/MobileNav';
import MobileHeader from './components/MobileHeader';

// Page components
import HomePage from './pages/index.tsx';
import AddExpensePage from './pages/add-expense';
import SettlementPage from './pages/settlement';
import HistoryPage from './pages/history';
import ReportsPage from './pages/reports';
import SettingsPage from './pages/settings';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
      refetchOnWindowFocus: false,
      retry: 2,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
    mutations: {
      retry: 1,
      retryDelay: 1000,
    },
  },
});

const AppContent: React.FC = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <MobileHeader />

        <main className="flex-1 overflow-x-hidden overflow-y-auto pb-16 md:pb-0">
          <Switch>
            <Route path="/" component={HomePage} />
            <Route path="/add-expense" component={AddExpensePage} />
            <Route path="/settlement" component={SettlementPage} />
            <Route path="/history" component={HistoryPage} />
            <Route path="/reports" component={ReportsPage} />
            <Route path="/settings" component={SettingsPage} />
            <Route>
              {/* 404 fallback */}
              <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                  <h1 className="text-4xl font-bold text-gray-800 mb-4">404</h1>
                  <p className="text-gray-600">Page not found</p>
                </div>
              </div>
            </Route>
          </Switch>
        </main>
      </div>

      <MobileNav />
    </div>
  );
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ProtectedRoute>
          <AppContent />
        </ProtectedRoute>
      </AuthProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App
