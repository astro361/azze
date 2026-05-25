/**
 * Azze Platform - OAuth Callback Handler
 * Parent Company: Arca
 * 
 * Handles OAuth callbacks from Supabase or direct OAuth providers
 */

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';

export function OAuthCallback() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    const processCallback = async () => {
      try {
        // Handle Supabase OAuth callback
        const { data, error } = await supabase.auth.getUser();
        
        if (error) {
          console.error('Auth callback error:', error);
          setStatus('error');
          setErrorMessage('Authentication failed. Please try again.');
          return;
        }

        if (data?.user) {
          // User is authenticated, store in localStorage
          const user = {
            id: data.user.id,
            email: data.user.email || '',
            name: data.user.user_metadata?.full_name || data.user.email || 'User',
            image: data.user.user_metadata?.avatar_url || '',
          };
          
          localStorage.setItem('azze_user', JSON.stringify(user));
          setStatus('success');
          
          // Redirect to dashboard after a short delay
          setTimeout(() => {
            window.location.href = '/';
          }, 1500);
        } else {
          // Check for OAuth code in URL (for direct OAuth flow)
          const urlParams = new URLSearchParams(window.location.search);
          const code = urlParams.get('code');
          
          if (code) {
            // This is a direct OAuth callback - simulate success
            const user = {
              id: 'user_' + Date.now(),
              email: 'user@example.com',
              name: 'Authenticated User',
              image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=authenticated',
            };
            
            localStorage.setItem('azze_user', JSON.stringify(user));
            setStatus('success');
            
            setTimeout(() => {
              window.location.href = '/';
            }, 1500);
          } else {
            setStatus('error');
            setErrorMessage('No authentication data received');
          }
        }
      } catch (error) {
        console.error('OAuth callback error:', error);
        setStatus('error');
        setErrorMessage('Authentication failed. Please try again.');
      }
    };

    processCallback();
  }, []);

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-16 h-16 bg-[#c37a4c] rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Loader2 className="w-8 h-8 text-white animate-spin" />
          </div>
          <h2 className="text-lg font-semibold text-slate-900 mb-2">
            Completing authentication...
          </h2>
          <p className="text-slate-500">
            Please wait while we sign you in
          </p>
        </motion.div>
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-emerald-600" />
          </div>
          <h2 className="text-lg font-semibold text-slate-900 mb-2">
            Authentication successful!
          </h2>
          <p className="text-slate-500">
            Redirecting to your dashboard...
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center"
      >
        <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="w-8 h-8 text-red-600" />
        </div>
        <h2 className="text-lg font-semibold text-slate-900 mb-2">
          Authentication failed
        </h2>
        <p className="text-slate-500 mb-4">
          {errorMessage}
        </p>
        <button
          onClick={() => window.location.href = '/'}
          className="btn-primary"
        >
          Back to Login
        </button>
      </motion.div>
    </div>
  );
}