/**
 * Azze Platform - Settings
 * Parent Company: Arca
 */

import { motion } from 'framer-motion';
import { User, Bell, Shield, Link } from 'lucide-react';
import { useApp } from '../store/AppContext';

export function DashboardSettings() {
  useApp();

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
              className="card p-6"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                  <Icon className="w-5 h-5 text-slate-600" />
                </div>
                <h2 className="text-lg font-semibold text-slate-900">{section.label}</h2>
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