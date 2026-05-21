/**
 * Azze Platform - Authentication Screen
 * Parent Company: Arca
 */

import { motion } from 'framer-motion';
import { Globe, Loader2 } from 'lucide-react';
import { useApp } from '../store/AppContext';

export function AuthScreen() {
  const { login, isLoading } = useApp();

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
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => login('github')}
              disabled={isLoading}
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
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => login('google')}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white text-slate-700 rounded-lg font-medium border border-slate-200 hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Globe className="w-5 h-5" />
              )}
              Continue with Google
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
