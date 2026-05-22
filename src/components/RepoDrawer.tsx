/**
 * Azze Platform - Repository Connect Drawer
 * Parent Company: Arca
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, GitBranch, Star, GitFork, Clock, ExternalLink, Loader2 } from 'lucide-react';
import { useApp } from '../store/AppContext';
import { GitHubRepo } from '../types';
import { signInWithGitHub } from '../lib/supabase';

interface RepoDrawerProps {
  onClose: () => void;
}

export function RepoDrawer({ onClose }: RepoDrawerProps) {
  const { githubRepos, triggerDeployment, isDashboardLoading } = useApp();
  const [selectedRepo, setSelectedRepo] = useState<GitHubRepo | null>(null);

  const handleDeploy = async (repo: GitHubRepo) => {
    setSelectedRepo(repo);
    await triggerDeployment(repo);
    setSelectedRepo(null);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <>
      {/* Overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40"
        onClick={onClose}
      />

      {/* Drawer */}
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="drawer z-50 flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-white">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Select Repository
            </h2>
            <p className="text-sm text-slate-500">
              Choose a GitHub repo to deploy
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-3">
          {githubRepos.length === 0 ? (
            <div className="text-center py-12">
              <GitBranch className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-900 mb-2">
                No repositories found
              </h3>
              <p className="text-slate-500 mb-4">
                Connect your GitHub account to see your repositories
              </p>
              <button onClick={async () => { await signInWithGitHub(); }} className="btn-primary">
                Connect GitHub
              </button>
            </div>
          ) : (
            <AnimatePresence>
              {githubRepos.map((repo, index) => (
                <motion.div
                  key={repo.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ delay: index * 0.05 }}
                  className={`p-4 border rounded-xl transition-all cursor-pointer ${
                    selectedRepo?.id === repo.id
                      ? 'border-[#c37a4c] bg-[#c37a4c]/5'
                      : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-md'
                  } ${isDashboardLoading && selectedRepo?.id !== repo.id ? 'opacity-50 pointer-events-none' : ''}`}
                  onClick={() => !isDashboardLoading && setSelectedRepo(repo)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center">
                        <GitBranch className="w-4 h-4 text-slate-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-slate-900">{repo.name}</h3>
                        <p className="text-xs text-slate-500">{repo.full_name}</p>
                      </div>
                    </div>
                    <a
                      href={repo.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                      onClick={e => e.stopPropagation()}
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>

                  {repo.description && (
                    <p className="text-sm text-slate-600 mb-3 line-clamp-2">
                      {repo.description}
                    </p>
                  )}

                  <div className="flex items-center gap-4 text-xs text-slate-500 mb-3">
                    {repo.language && (
                      <span className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-blue-400" />
                        {repo.language}
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <Star className="w-3 h-3" />
                      {repo.stargazers_count}
                    </span>
                    <span className="flex items-center gap-1">
                      <GitFork className="w-3 h-3" />
                      {repo.forks_count}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatDate(repo.updated_at)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-400 font-mono">
                      Branch: {repo.default_branch}
                    </span>
                    <button
                      onClick={() => handleDeploy(repo)}
                      disabled={isDashboardLoading}
                      className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                        selectedRepo?.id === repo.id
                          ? 'bg-[#c37a4c] text-white hover:bg-[#a66340]'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      {isDashboardLoading && selectedRepo?.id === repo.id ? (
                        <span className="flex items-center gap-2">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Deploying...
                        </span>
                      ) : (
                        'Deploy'
                      )}
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50">
          <p className="text-xs text-slate-500 text-center">
            Select a repository and click Deploy to start the build process
          </p>
        </div>
      </motion.div>
    </>
  );
}
