/**
 * Azze Platform - Authentication Screen
 * Parent Company: Arca
 */

import { motion } from 'framer-motion';
import { Loader2, AlertCircle } from 'lucide-react';
import { useApp } from '../store/AppContext';
import { isOAuthConfigured } from '../lib/oauth';

export function AuthScreen() {
  const { login, isLoading } = useApp();
  const oauthConfig = isOAuthConfigured();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Logo & Branding */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="inline-flex items-center gap-3 mb-4"
          >
            <div className="w-12 h-12 bg-[#c37a4c] rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-xl">A</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Azze</h1>
              <p className="text-sm text-slate-500">by Arca</p>
            </div>
          </motion.div>
          <p className="text-slate-600">
            Deploy and manage your backend services with ease
          </p>
        </div>

        {/* Configuration Warning */}
        {!oauthConfig.google && !oauthConfig.github && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg"
          >
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-sm font-medium text-amber-800">
                  OAuth Not Configured
                </h3>
                <p className="text-xs text-amber-700 mt-1">
                  Please set <code className="bg-amber-100 px-1 rounded">VITE_GOOGLE_CLIENT_ID</code> and{' '}
                  <code className="bg-amber-100 px-1 rounded">VITE_GITHUB_CLIENT_ID</code> in your environment.
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Auth Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white rounded-2xl shadow-lg border border-slate-100 p-8"
        >
          <h2 className="text-lg font-semibold text-slate-900 mb-2">
            Welcome back
          </h2>
          <p className="text-sm text-slate-500 mb-6">
            Sign in to access your dashboard
          </p>

          {/* OAuth Buttons */}
          <div className="space-y-3">
            {/* Google Login */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => login('google')}
              disabled={isLoading || !oauthConfig.google}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white text-slate-700 rounded-lg font-medium border border-slate-200 hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.26-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.47 8.55 1 10.22 1 12s.47 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
              )}
              Continue with Google
              {!oauthConfig.google && (
                <span className="text-xs text-amber-600">(Not Configured)</span>
              )}
            </motion.button>

            {/* GitHub Login */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => login('github')}
              disabled={isLoading || !oauthConfig.github}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-4.003 0-.881.314-1.592.829-2.154-.835-.098-1.717-.422-1.717-.422s-.098-.835-.422-1.717c-.562.515-1.273.829-2.154.829-1.498 0-2.772-1.024-2.772-2.772 0-.603.194-1.162.523-1.615-.526-.658-1.111-1.658-1.111-3.315 0-.729.23-1.407.621-1.965C4.076 3.598 4.998 3 6 3c1.003 0 1.925.598 2.399 1.501.39.558.621 1.236.621 1.965 0 1.657-.585 2.657-1.111 3.315.329.553.523 1.112.523 1.615 0 1.748-1.274 2.772-2.772 2.772-.998 0-1.879-.325-2.404-.842-.301.546-.523 1.224-.523 1.953v2.891c0 .316.194.688.793.577C8.562 21.8 12 17.302 12 12c0-6.627-5.373-12-12-12z"/>
                </svg>
              )}
              Continue with GitHub
              {!oauthConfig.github && (
                <span className="text-xs text-amber-400">(Not Configured)</span>
              )}
            </motion.button>
          </div>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-slate-500">
                Secure authentication
              </span>
            </div>
          </div>

          {/* Features */}
          <div className="space-y-3 text-sm text-slate-600">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-[#c37a4c]" />
              Real-time deployment logs
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-[#c37a4c]" />
              One-click GitHub integration
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-[#c37a4c]" />
              Environment variable management
            </div>
          </div>
        </motion.div>

        {/* Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center text-xs text-slate-400 mt-6"
        >
          By continuing, you agree to our Terms of Service and Privacy Policy
        </motion.p>
      </motion.div>
    </div>
  );
}
