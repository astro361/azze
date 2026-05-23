/**
 * Azze Platform - Main Dashboard
 * Parent Company: Arca
 */

import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Settings, 
  LogOut, 
  GitBranch, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Loader2,
  Terminal,
  Server,
  Code2
} from 'lucide-react';
import { useApp } from '../store/AppContext';
import { Deployment } from '../types';
import { LiveLogsTerminal } from './LiveLogsTerminal';
import { ProjectSettings } from './ProjectSettings';
import { CreateProjectModal } from './CreateProjectModal';
import { RepoDrawer } from './RepoDrawer';

export function Dashboard() {
  const {
    user,
    projects,
    selectedProject,
    selectedDeployment,
    isCreateModalOpen,
    isSettingsOpen,
    isRepoDrawerOpen,
    isDashboardLoading,
    logout,
    selectProject,
    selectDeployment,
    openCreateModal,
    closeCreateModal,
    openSettings,
    closeSettings,
    openRepoDrawer,
    closeRepoDrawer,
  } = useApp();

  const getStatusIcon = (status: Deployment['status']) => {
    switch (status) {
      case 'BUILDING':
        return <Loader2 className="w-4 h-4 animate-spin text-amber-500" />;
      case 'READY':
        return <CheckCircle className="w-4 h-4 text-emerald-500" />;
      case 'FAILED':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      case 'DEPLOYING':
        return <Loader2 className="w-4 h-4 animate-spin text-blue-500" />;
    }
  };

  const getStatusBadgeClass = (status: Deployment['status']) => {
    switch (status) {
      case 'BUILDING':
        return 'status-badge building';
      case 'READY':
        return 'status-badge ready';
      case 'FAILED':
        return 'status-badge failed';
      case 'DEPLOYING':
        return 'status-badge deploying';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#c37a4c] rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">A</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900">Azze</h1>
                <p className="text-xs text-slate-500">by Arca</p>
              </div>
            </div>

            {/* User Menu */}
            <div className="flex items-center gap-4">
              <button
                onClick={openCreateModal}
                className="btn-primary flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                New Service
              </button>
              
              <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-medium text-slate-900">{user?.displayName || user?.fullName}</p>
                  <p className="text-xs text-slate-500">{user?.email}</p>
                </div>
                <img
                  src={user?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=user'}
                  alt={user?.fullName || 'User'}
                  className="w-10 h-10 rounded-full border-2 border-slate-200 bg-slate-50"
                />
                <button
                  onClick={logout}
                  className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                  title="Sign out"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Projects Grid */}
          <div className="lg:col-span-2 space-y-6">
            {/* Page Header */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">Your Services</h2>
                <p className="text-slate-500 mt-1">
                  Manage and deploy your backend applications
                </p>
              </div>
              <button
                onClick={openRepoDrawer}
                disabled={!selectedProject}
                className="btn-secondary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <GitBranch className="w-4 h-4" />
                Deploy
              </button>
            </div>

            {/* Loading State */}
            {isDashboardLoading && (
              <div className="dashboard-grid">
                {[1, 2, 3].map(i => (
                  <div key={i} className="card p-6 space-y-4">
                    <div className="skeleton h-6 w-3/4" />
                    <div className="skeleton h-4 w-full" />
                    <div className="skeleton h-4 w-2/3" />
                    <div className="flex gap-2 pt-4">
                      <div className="skeleton h-8 w-20" />
                      <div className="skeleton h-8 w-20" />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Projects Grid */}
            {!isDashboardLoading && (
              <motion.div
                layout
                className="dashboard-grid"
              >
                <AnimatePresence>
                  {projects.map((project, index) => (
                    <motion.div
                      key={project.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      onClick={() => selectProject(project)}
                      className={`card p-6 cursor-pointer transition-all hover:shadow-lg ${
                        selectedProject?.id === project.id 
                          ? 'ring-2 ring-[#c37a4c] border-[#c37a4c]' 
                          : ''
                      }`}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center">
                            <Server className="w-6 h-6 text-slate-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-slate-900">{project.name}</h3>
                            <p className="text-sm text-slate-500">{project.githubUrl}</p>
                          </div>
                        </div>
                        <span className={`status-badge ${project.status === 'ACTIVE' ? 'ready' : 'building'}`}>
                          <span className={`status-dot ${project.status === 'ACTIVE' ? 'ready' : 'building'}`} />
                          {project.status}
                        </span>
                      </div>

                      <p className="text-sm text-slate-600 mb-4 line-clamp-2">
                        {project.description || 'No description provided'}
                      </p>

                      <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                        <div className="flex items-center gap-4 text-sm text-slate-500">
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {new Date(project.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            selectProject(project);
                            openSettings();
                          }}
                          className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                        >
                          <Settings className="w-4 h-4" />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {/* Empty State */}
                {projects.length === 0 && (
                  <div className="col-span-full text-center py-12">
                    <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Code2 className="w-8 h-8 text-slate-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">
                      No services yet
                    </h3>
                    <p className="text-slate-500 mb-6">
                      Create your first backend service to get started
                    </p>
                    <button onClick={openCreateModal} className="btn-primary">
                      Create Service
                    </button>
                  </div>
                )}
              </motion.div>
            )}
          </div>

          {/* Deployment Details Panel */}
          <div className="space-y-6">
            {selectedProject ? (
              <>
                {/* Selected Project Info */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="card p-6"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-slate-900">Deployments</h3>
                    <button
                      onClick={openRepoDrawer}
                      className="text-sm text-[#c37a4c] hover:text-[#a66340] font-medium flex items-center gap-1"
                    >
                      <GitBranch className="w-4 h-4" />
                      New Deploy
                    </button>
                  </div>

                  <div className="space-y-3">
                    {projects
                      .find(p => p.id === selectedProject.id)
                      ?.deployments?.slice(0, 5)
                      .map((deployment) => (
                        <div
                          key={deployment.id}
                          onClick={() => selectDeployment(deployment)}
                          className={`p-3 rounded-lg border cursor-pointer transition-all ${
                            selectedDeployment?.id === deployment.id
                              ? 'bg-[#c37a4c]/10 border-[#c37a4c]/30'
                              : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-mono text-slate-600">
                              {deployment.commitHash}
                            </span>
                            <div className={getStatusBadgeClass(deployment.status)}>
                              {getStatusIcon(deployment.status)}
                              <span className={`status-dot ${deployment.status.toLowerCase()}`} />
                              {deployment.status}
                            </div>
                          </div>
                          <p className="text-xs text-slate-500 truncate">
                            {deployment.commitMessage || 'No commit message'}
                          </p>
                          <p className="text-xs text-slate-400 mt-1">
                            {new Date(deployment.startedAt).toLocaleString()}
                          </p>
                        </div>
                      ))}

                    {(!selectedProject.deployments || selectedProject.deployments.length === 0) && (
                      <div className="text-center py-8 text-slate-500">
                        <GitBranch className="w-8 h-8 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">No deployments yet</p>
                      </div>
                    )}
                  </div>
                </motion.div>

                {/* Live Logs Terminal */}
                {selectedDeployment && (
                  <LiveLogsTerminal
                    deployment={selectedDeployment}
                    logs={useApp().liveLogs}
                  />
                )}
              </>
            ) : (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="card p-6 text-center"
              >
                <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Terminal className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">
                  Select a Service
                </h3>
                <p className="text-sm text-slate-500">
                  Choose a service from the grid to view deployments and logs
                </p>
              </motion.div>
            )}
          </div>
        </div>
      </main>

      {/* Modals & Drawers */}
      <AnimatePresence>
        {isCreateModalOpen && <CreateProjectModal onClose={closeCreateModal} />}
        {isSettingsOpen && selectedProject && (
          <ProjectSettings project={selectedProject} onClose={closeSettings} />
        )}
        {isRepoDrawerOpen && (
          <RepoDrawer onClose={closeRepoDrawer} />
        )}
      </AnimatePresence>
    </div>
  );
}
