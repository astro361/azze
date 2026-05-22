/**
 * Azze Platform - Services Dashboard
 * Parent Company: Arca
 */

import { motion } from 'framer-motion';
import { Server, Plus } from 'lucide-react';
import { useApp } from '../../store/AppContext';

export function DashboardServices() {
  const { projects, openCreateModal } = useApp();

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
              className="card p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-slate-900">{project.name}</h3>
                  <p className="text-sm text-slate-500">{project.githubUrl}</p>
                </div>
                <span className={`status-badge ${project.status === 'ACTIVE' ? 'ready' : 'building'}`}>
                  {project.status}
                </span>
              </div>
              <p className="text-sm text-slate-600">{project.description}</p>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}