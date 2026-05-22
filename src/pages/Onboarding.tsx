/**
 * Azze Platform - User Onboarding
 * Parent Company: Arca
 * 
 * Forces new users to set up their profile before accessing the app
 */

import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Camera, CheckCircle } from 'lucide-react';
import { useApp } from '../store/AppContext';
import { supabase } from '../lib/supabase';

export function Onboarding() {
  const { user } = useApp();
  const [displayName, setDisplayName] = useState(user?.name || '');
  const [username, setUsername] = useState('');
  const [avatarUrl, setAvatarUrl] = useState(user?.image || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    if (!username.trim()) {
      setError('Username is required');
      setIsSubmitting(false);
      return;
    }

    try {
      // Update user profile in Supabase
      const { error } = await supabase.auth.updateUser({
        data: {
          display_name: displayName,
          username: username,
          avatar_url: avatarUrl,
        }
      });

      if (error) throw error;

      // Also update in localStorage
      const updatedUser = {
        ...user,
        name: displayName,
        username: username,
        image: avatarUrl,
      };
      localStorage.setItem('azze_user', JSON.stringify(updatedUser));

      // Force reload to trigger auth check
      window.location.reload();
    } catch (err: any) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-[#c37a4c] rounded-2xl flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">
            Welcome to Azze
          </h1>
          <p className="text-slate-600">
            Set up your profile to get started
          </p>
        </div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6"
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Avatar Preview */}
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center overflow-hidden">
                  {avatarUrl ? (
                    <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-10 h-10 text-slate-400" />
                  )}
                </div>
                <button
                  type="button"
                  className="absolute bottom-0 right-0 w-6 h-6 bg-[#c37a4c] rounded-full flex items-center justify-center"
                >
                  <Camera className="w-3 h-3 text-white" />
                </button>
              </div>
            </div>

            {/* Display Name */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Display Name
              </label>
              <input
                type="text"
                value={displayName}
                onChange={e => setDisplayName(e.target.value)}
                className="input"
                placeholder="John Doe"
              />
            </div>

            {/* Username */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Username <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">@</span>
                <input
                  type="text"
                  value={username}
                  onChange={e => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                  className="input pl-8"
                  placeholder="johndoe"
                  required
                />
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Used for your profile URL and mentions
              </p>
            </div>

            {/* Avatar URL */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Avatar URL (optional)
              </label>
              <input
                type="url"
                value={avatarUrl}
                onChange={e => setAvatarUrl(e.target.value)}
                className="input"
                placeholder="https://example.com/avatar.jpg"
              />
            </div>

            {/* Error */}
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting || !username.trim()}
              className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Saving...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  Complete Setup
                </span>
              )}
            </button>
          </form>
        </motion.div>
      </motion.div>
    </div>
  );
}