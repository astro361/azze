/**
 * Azze Platform - Create Project Modal
 * Parent Company: Arca
 */

import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Server } from 'lucide-react';
import { useApp } from '../store/AppContext';

interface CreateProjectModalProps {
  onClose: () => void;
}

export function CreateProjectModal({ onClose }: CreateProjectModalProps) {
  const { createProject, isDashboardLoading } = useApp();
  const [name, setName] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !githubUrl.trim()) return;
    await createProject(name.trim(), githubUrl.trim(), description.trim() || undefined);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2 }}
        className="bg-white rounded-2xl shadow-xl w-full max-w-lg"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#c37a4c]/10 rounded-xl flex items-center justify-center">
              <Server className="w-5 h-5 text-[#c37a4c]" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                Create New Service
              </h2>
              <p className="text-sm text-slate-500">
                Connect your GitHub repository
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Service Name
            </label>
            <input
              type="text"
              placeholder="my-awesome-api"
              value={name}
              onChange={e => setName(e.target.value)}
              className="input"
              required
              autoFocus
            />
            <p className="text-xs text-slate-500 mt-1">
              Lowercase letters, numbers, and hyphens only
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              GitHub Repository URL
            </label>
            <div className="relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-4.003 0-.881.314-1.592.829-2.154-.835-.098-1.717-.422-1.717-.422s-.098-.835-.422-1.717c-.562.515-1.273.829-2.154.829-1.498 0-2.772-1.024-2.772-2.772 0-.603.194-1.162.523-1.615-.526-.658-1.111-1.658-1.111-3.315 0-.729.23-1.407.621-1.965C4.076 3.598 4.998 3 6 3c1.003 0 1.925.598 2.399 1.501.39.558.621 1.236.621 1.965 0 1.657-.585 2.657-1.111 3.315.329.553.523 1.112.523 1.615 0 1.748-1.274 2.772-2.772 2.772-.998 0-1.879-.325-2.404-.842-.301.546-.523 1.224-.523 1.953v2.891c0 .316.194.688.793.577C8.562 21.8 12 17.302 12 12c0-6.627-5.373-12-12-12z"/>
              </svg>
              <input
                type="url"
                placeholder="https://github.com/username/repo"
                value={githubUrl}
                onChange={e => setGithubUrl(e.target.value)}
                className="input pl-10"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Description (optional)
            </label>
            <textarea
              placeholder="Describe what this service does..."
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="input min-h-[80px] resize-none"
              rows={3}
            />
          </div>

          {/* Info Box */}
          <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl">
            <p className="text-sm text-blue-700">
              <strong>Note:</strong> After creating the service, you'll be able to 
              select a branch and trigger your first deployment.
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isDashboardLoading || !name.trim() || !githubUrl.trim()}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isDashboardLoading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating...
                </span>
              ) : (
                'Create Service'
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
