/**
 * Azze Platform - OAuth Callback Handler
 * Parent Company: Arca
 * 
 * Handles the OAuth callback and exchanges code for user session
 */

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { handleOAuthCallback, completeOAuth } from '../lib/oauth';

export function OAuthCallback() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    const processCallback = async () => {
      const { code, provider } = handleOAuthCallback();
      
      if (!code || !provider) {
        setStatus('error');
        setErrorMessage('Invalid authentication callback');
        return;
      }

      try {
        // In a real application, you would call your backend API here:
        // const response = await fetch('/api/auth/callback', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify({ code, provider })
        // });
        // const userData = await response.json();
        
        // For demonstration, we'll simulate a successful response
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock user data (replace with actual API response)
        const user = {
          id: 'user_' + Date.now(),
          email: 'user@example.com',
          name: 'Authenticated User',
          image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=authenticated',
        };

        // Complete the OAuth flow
        completeOAuth(user);
        setStatus('success');
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