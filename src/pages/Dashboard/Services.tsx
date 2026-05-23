/**
 * Azze Platform - Services Dashboard
 * Parent Company: Arca
 */

import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Server, Plus, Settings, GitBranch } from 'lucide-react';
import { useApp } from '../../store/AppContext';

export function DashboardServices() {
  const navigate = useNavigate();
  const { projects, openCreateModal, selectProject, openSettings, openRepoDrawer } = useApp();

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Services</h1>
          <p className="text-slate-600">Manage your backend services</p>
        </div>
        <button onClick={openCreateModal} className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" />
          New Service
        </button>
      </div>

      {projects.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <Server className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-900 mb-2">
            No services yet
          </h3>
          <p className="text-slate-500">
            Create your first backend service to get started
          </p>
        </motion.div>
      ) : (
        <div className="dashboard-grid">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="card p-6 cursor-pointer hover:border-[#c37a4c] transition-colors"
              onClick={() => navigate(`/services/${project.id}`)}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-slate-900">{project.name}</h3>
                  <p className="text-sm text-slate-500">{project.githubUrl}</p>
                </div>
                {project.status === 'ACTIVE' && (
                  <span className="px-2.5 py-0.5 text-xs font-bold bg-emerald-100 text-emerald-700 rounded-full border border-emerald-200">
                    ACTIVE
                  </span>
                )}
                {project.status === 'BUILDING' && (
                  <span className="px-2.5 py-0.5 text-xs font-bold bg-amber-100 text-amber-700 rounded-full border border-amber-200 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                    BUILDING
                  </span>
                )}
                {project.status === 'FAILED' && (
                  <span className="px-2.5 py-0.5 text-xs font-bold bg-red-100 text-red-700 rounded-full border border-red-200">
                    FAILED
                  </span>
                )}
                {project.status === 'INACTIVE' && (
                  <span className="px-2.5 py-0.5 text-xs font-bold bg-slate-100 text-slate-700 rounded-full border border-slate-200">
                    SETUP
                  </span>
                )}
              </div>
              <p className="text-sm text-slate-600 mb-6">{project.description}</p>
              
              <div className="flex items-center gap-2 pt-4 border-t border-slate-100">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    selectProject(project);
                    openRepoDrawer();
                  }}
                  className="flex-1 flex items-center justify-center gap-2 py-2 bg-slate-50 text-slate-700 rounded-lg hover:bg-slate-100 text-sm font-medium transition-colors"
                >
                  <GitBranch className="w-4 h-4" />
                  Deploy
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    selectProject(project);
                    openSettings();
                  }}
                  className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                  title="Environment Variables & Settings"
                >
                  <Settings className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}