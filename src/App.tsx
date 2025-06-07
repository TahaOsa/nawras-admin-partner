import React from 'react';
import { Route, Switch } from 'wouter';

// Auth components
import { useAuth } from './providers';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import LoginPage from './components/auth/LoginPage';

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
  const { isAuthenticated, isLoading } = useAuth();

  // Show loading screen while checking authentication (with timeout protection)
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
          <p className="text-xs text-gray-400 mt-2">If this takes too long, please refresh the page</p>
        </div>
      </div>
    );
  }

  // Show login page if not authenticated
  if (!isAuthenticated) {
    return <LoginPage />;
  }

  // Show main app if authenticated
  return (
    <ProtectedRoute>
      <AppContent />
    </ProtectedRoute>
  );
}

export default App
