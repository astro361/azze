/**
 * Azze Platform - Project Settings Panel
 * Parent Company: Arca
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Key, Eye, EyeOff, Plus, Trash2, Save } from 'lucide-react';
import { useApp } from '../store/AppContext';
import { Project } from '../types';

interface ProjectSettingsProps {
  project: Project;
  onClose: () => void;
}

export function ProjectSettings({ project, onClose }: ProjectSettingsProps) {
  const { envVars, addEnvVar, updateEnvVar, deleteEnvVar } = useApp();
  const [showSecrets, setShowSecrets] = useState<Record<string, boolean>>({});
  const [newKey, setNewKey] = useState('');
  const [newValue, setNewValue] = useState('');
  const [newIsSecret, setNewIsSecret] = useState(true);

  const projectEnvVars = envVars.filter(ev => ev.projectId === project.id);

  const toggleSecretVisibility = (key: string) => {
    setShowSecrets(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleAddEnvVar = () => {
    if (!newKey.trim() || !newValue.trim()) return;
    addEnvVar(project.id, newKey.trim(), newValue.trim(), newIsSecret);
    setNewKey('');
    setNewValue('');
    setNewIsSecret(true);
  };

  const maskValue = (value: string) => {
    return '•'.repeat(Math.min(value.length, 20));
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2 }}
        className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Environment Variables
            </h2>
            <p className="text-sm text-slate-500">{project.name}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {/* Add New Variable */}
          <div className="mb-6 p-4 bg-slate-50 rounded-xl border border-slate-200">
            <h3 className="text-sm font-medium text-slate-700 mb-3 flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Add New Variable
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <input
                type="text"
                placeholder="KEY_NAME"
                value={newKey}
                onChange={e => setNewKey(e.target.value)}
                className="input sm:col-span-1"
              />
              <input
                type="text"
                placeholder="Value"
                value={newValue}
                onChange={e => setNewValue(e.target.value)}
                className="input sm:col-span-2"
              />
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newIsSecret}
                    onChange={e => setNewIsSecret(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-300 text-[#c37a4c] focus:ring-[#c37a4c]"
                  />
                  Secret
                </label>
                <button
                  onClick={handleAddEnvVar}
                  disabled={!newKey.trim() || !newValue.trim()}
                  className="btn-primary flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Plus className="w-4 h-4" />
                  Add
                </button>
              </div>
            </div>
          </div>

          {/* Existing Variables */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-slate-700 flex items-center gap-2">
              <Key className="w-4 h-4" />
              Variables ({projectEnvVars.length})
            </h3>

            {projectEnvVars.length === 0 ? (
              <div className="text-center py-8 text-slate-500">
                <Key className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No environment variables configured</p>
              </div>
            ) : (
              <AnimatePresence>
                {projectEnvVars.map((envVar) => (
                  <motion.div
                    key={envVar.id}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="flex items-center gap-3 p-3 bg-white border border-slate-200 rounded-lg"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm font-medium text-slate-900">
                          {envVar.key}
                        </span>
                        {envVar.isSecret && (
                          <span className="px-1.5 py-0.5 bg-amber-100 text-amber-700 text-xs rounded">
                            Secret
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <code className="text-sm text-slate-600 font-mono bg-slate-100 px-2 py-0.5 rounded">
                          {envVar.isSecret && !showSecrets[envVar.key]
                            ? maskValue(envVar.value)
                            : envVar.value}
                        </code>
                        {envVar.isSecret && (
                          <button
                            onClick={() => toggleSecretVisibility(envVar.key)}
                            className="p-1 text-slate-400 hover:text-slate-600"
                          >
                            {showSecrets[envVar.key] ? (
                              <EyeOff className="w-4 h-4" />
                            ) : (
                              <Eye className="w-4 h-4" />
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          const newValue = prompt('Enter new value:', envVar.value);
                          if (newValue !== null) {
                            updateEnvVar(envVar.id, newValue);
                          }
                        }}
                        className="p-2 text-slate-400 hover:text-[#c37a4c] hover:bg-slate-100 rounded-lg transition-colors"
                      >
                        <Save className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteEnvVar(envVar.id)}
                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <p className="text-xs text-slate-500">
            Environment variables are encrypted at rest and only exposed during deployment
          </p>
          <button
            onClick={onClose}
            className="btn-secondary"
          >
            Done
          </button>
        </div>
      </motion.div>
    </div>
  );
}
