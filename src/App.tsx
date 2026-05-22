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

function AppContent() {
  const { isAuthenticated, isLoading, user } = useApp();
  const [isCallbackPage, setIsCallbackPage] = useState(false);
  const [needsOnboarding, setNeedsOnboarding] = useState(false);

  // Check if we're on the auth callback page
  useEffect(() => {
    const isCallback = window.location.pathname === '/auth/callback';
    setIsCallbackPage(isCallback);
  }, []);

  // Check if user needs onboarding (no username set)
  useEffect(() => {
    if (user && isAuthenticated) {
      const hasUsername = user.username && user.username.trim() !== '';
      setNeedsOnboarding(!hasUsername);
    }
  }, [user, isAuthenticated]);

  // Handle Supabase auth callback
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          // User is signed in, check for username
          const hasUsername = session.user.user_metadata?.username;
          if (!hasUsername) {
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
          <div className="w-12 h-12 bg-[#c37a4c] rounded-xl flex items-center justify-center mx-auto mb-4 animate-pulse">
            <span className="text-white font-bold text-xl">A</span>
          </div>
          <p className="text-slate-500">Loading Azze...</p>
        </div>
      </div>
    );
  }

  // Show OAuth callback handler if we're on the callback path
  if (isCallbackPage) {
    return <OAuthCallback />;
  }

  // Show onboarding if user needs to set up profile
  if (isAuthenticated && needsOnboarding) {
    return <Onboarding />;
  }

  return isAuthenticated ? <Dashboard /> : <AuthScreen />;
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;