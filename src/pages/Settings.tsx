/**
 * Azze Platform - Settings
 * Parent Company: Arca
 */

import { motion } from 'framer-motion';
import { User, Bell, Shield, Link, ChevronRight } from 'lucide-react';
import { useApp } from '../store/AppContext';
import { supabase, signInWithGitHub } from '../lib/supabase';

export function DashboardSettings() {
  const { user, updateUser } = useApp();

  const handleSectionClick = async (id: string) => {
    if (id === 'profile') {
      const newName = window.prompt('Enter your new Display Name:', user?.displayName || '');
      if (newName && newName.trim() !== '') {
        try {
          const { error } = await supabase.auth.updateUser({
            data: { display_name: newName.trim() }
          });
          if (error) throw error;
          
          if (user) {
            updateUser({ ...user, displayName: newName.trim() });
            alert('Profile updated successfully!');
          }
        } catch (err: any) {
          alert('Failed to update profile: ' + err.message);
        }
      }
    } else if (id === 'integrations') {
      const confirm = window.confirm('Would you like to connect your GitHub account?');
      if (confirm) {
        await signInWithGitHub();
      }
    } else {
      alert(`Settings for ${id} are currently unavailable.`);
    }
  };

  const settingsSections = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'integrations', label: 'Integrations', icon: Link },
  ];

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
        <p className="text-slate-600">Manage your account preferences</p>
      </div>

      <div className="max-w-2xl space-y-6">
        {settingsSections.map((section) => {
          const Icon = section.icon;
          return (
            <motion.div
              key={section.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={() => handleSectionClick(section.id)}
              className="card p-6 cursor-pointer hover:border-[#c37a4c] transition-colors group"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center group-hover:bg-[#c37a4c]/10 transition-colors">
                    <Icon className="w-5 h-5 text-slate-600 group-hover:text-[#c37a4c]" />
                  </div>
                  <h2 className="text-lg font-semibold text-slate-900">{section.label}</h2>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-[#c37a4c]" />
              </div>
              <p className="text-slate-500">
                {section.id === 'profile' 
                  ? `Update your display name, avatar, and bio`
                  : `Configure your ${section.label.toLowerCase()} settings`}
              </p>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}