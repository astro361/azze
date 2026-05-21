/**
 * Azze Platform - Main Application
 * Parent Company: Arca
 * 
 * A comprehensive real-time backend hosting platform
 */

import { AppProvider, useApp } from './store/AppContext';
import { AuthScreen } from './components/AuthScreen';
import { Dashboard } from './components/Dashboard';

function AppContent() {
  const { isAuthenticated, isLoading } = useApp();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 bg-[#c37a4c] rounded-xl flex items-center justify-center mx-auto mb-4 animate-pulse">
            <span className="text-white font-bold text-xl">A</span>
          </div>
          <p className="text-slate-500">Loading Azze...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AuthScreen />;
  }

  return <Dashboard />;
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
