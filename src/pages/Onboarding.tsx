/**
 * Azze Platform - User Onboarding
 * Parent Company: Arca
 * 
 * Forces new users to set up their profile before accessing the app
 */

import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, CheckCircle, Smartphone, Type, Image as ImageIcon } from 'lucide-react';
import { useApp } from '../store/AppContext';
import { supabase } from '../lib/supabase';

// Built-in avatar options
const AVATAR_OPTIONS = [
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix&backgroundColor=c37a4c',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka&backgroundColor=334155',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Jude&backgroundColor=10B981',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Eden&backgroundColor=F59E0B',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Chase&backgroundColor=3B82F6',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Luna&backgroundColor=8B5CF6'
];

export function Onboarding() {
  const { user, updateUser } = useApp();
  
  const [fullName, setFullName] = useState(user?.fullName || '');
  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber || '');
  const [selectedAvatar, setSelectedAvatar] = useState(user?.avatar || AVATAR_OPTIONS[0]);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const isFormValid = fullName.trim() !== '' && phoneNumber.trim() !== '' && displayName.trim() !== '';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isFormValid) {
      setError('Please fill in all required fields.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      // 1. AWAIT the Supabase API to completely finish and guarantee 200 SUCCESS
      const { data, error: updateError } = await supabase.auth.updateUser({
        data: {
          full_name: fullName.trim(),
          display_name: displayName.trim(),
          phone_number: phoneNumber.trim(),
          avatar_url: selectedAvatar,
        }
      });

      if (updateError) throw updateError;

      // 2. Once confirmed successful, carefully sync local state with the exact format
      if (data.user && user) {
        const syncedUser = {
          ...user,
          fullName: fullName.trim(),
          displayName: displayName.trim(),
          phoneNumber: phoneNumber.trim(),
          avatar: selectedAvatar,
          updatedAt: new Date().toISOString()
        };
        
        // 3. This single call to context drops us cleanly out of the onboarding loop 
        // without reloading the page, instantly transitioning to the Dashboard
        updateUser(syncedUser);
      }
    } catch (err: any) {
      console.error('Profile update error:', err);
      setError(err.message || 'Failed to update profile. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-xl"
      >
        <div className="text-center mb-8">
          <img src="/logo.png" alt="Logo" className="h-16 w-auto mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-slate-900 mb-2">
            Complete Your Profile
          </h1>
          <p className="text-slate-600">
            Tell us a little bit about yourself to continue
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl shadow-lg border border-slate-100 p-8"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Avatar Grid Selection */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-3 flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-slate-400" />
                Select Profile Picture
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-4">
                {AVATAR_OPTIONS.map((avatar, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedAvatar(avatar)}
                    className={`relative rounded-xl overflow-hidden aspect-square border-2 transition-all ${
                      selectedAvatar === avatar 
                        ? 'border-[#c37a4c] shadow-md scale-105' 
                        : 'border-transparent hover:scale-105 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={avatar} alt={`Avatar option ${idx + 1}`} className="w-full h-full object-cover bg-slate-50" />
                    {selectedAvatar === avatar && (
                      <div className="absolute inset-0 bg-black/10 flex items-center justify-center">
                        <CheckCircle className="w-6 h-6 text-white" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Full Name */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-2">
                  <Type className="w-4 h-4 text-slate-400" />
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  className="input bg-slate-50"
                  placeholder="John Doe"
                  required
                />
              </div>

              {/* Display Name */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-2">
                  <User className="w-4 h-4 text-slate-400" />
                  Display Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={displayName}
                  onChange={e => setDisplayName(e.target.value)}
                  className="input bg-slate-50"
                  placeholder="johndoe123"
                  required
                />
              </div>
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-slate-400" />
                Phone Number <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                value={phoneNumber}
                onChange={e => setPhoneNumber(e.target.value)}
                className="input bg-slate-50"
                placeholder="+1 (555) 000-0000"
                required
              />
              <p className="text-xs text-slate-500 mt-1">Required for security and urgent deployment alerts.</p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600 flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0" />
                {error}
              </div>
            )}

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting || !isFormValid}
                className="w-full btn-primary py-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Saving Profile...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <CheckCircle className="w-5 h-5" />
                    Complete Setup
                  </span>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </div>
  );
}