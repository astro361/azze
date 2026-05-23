/**
 * Azze Platform - Main Application
 * Parent Company: Arca
 * 
 * A comprehensive real-time backend hosting platform
 */

import { useEffect, useState } from 'react';
import { AppProvider, useApp } from './store/AppContext';
import { AuthScreen } from './components/AuthScreen';
import { Dashboard } from './pages/Dashboard';
import { OAuthCallback } from './pages/OAuthCallback';
import { Onboarding } from './pages/Onboarding';
import { supabase } from './lib/supabase';

import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { DeploymentPreview } from './pages/DeploymentPreview';

function AppContent() {
  const { isAuthenticated, isLoading, user } = useApp();
  const [needsOnboarding, setNeedsOnboarding] = useState(false);
  const location = useLocation();

  // Check if user needs onboarding (strictly checking our new required fields)
  useEffect(() => {
    if (user && isAuthenticated) {
      const hasRequiredData = !!(
        user.fullName?.trim() && 
        user.phoneNumber?.trim()
      );
      setNeedsOnboarding(!hasRequiredData);
    }
  }, [user, isAuthenticated]);

  // Handle Supabase auth callback syncing
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          const meta = session.user.user_metadata || {};
          const hasRequiredData = !!(meta.full_name?.trim() && meta.phone_number?.trim());
          if (!hasRequiredData) {
            setNeedsOnboarding(true);
          }
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 animate-pulse">
            <img src="/logo.png" alt="Logo" className="h-12 w-auto mx-auto" />
          </div>
          <p className="text-slate-500">Loading Azze...</p>
        </div>
      </div>
    );
  }

  // Show OAuth callback handler if we're on the callback path
  if (location.pathname === '/auth/callback') {
    return <OAuthCallback />;
  }

  if (!isAuthenticated) {
    return <AuthScreen />;
  }

  // Show onboarding if user needs to set up profile
  if (needsOnboarding) {
    return <Onboarding />;
  }

  return (
    <Routes>
      <Route path="/deployments/:slug" element={<DeploymentPreview />} />
      <Route path="/*" element={<Dashboard />} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </BrowserRouter>
  );
}

export default App;