/**
 * Azze Platform - Dashboard Home
 * Parent Company: Arca
 */

import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Server, Activity, CheckCircle } from 'lucide-react';
import { useApp } from '../../store/AppContext';

export function DashboardHome() {
  const navigate = useNavigate();
  const { user, projects } = useApp();

  const stats = [
    { label: 'Active Services', value: projects.filter(p => p.status === 'ACTIVE').length, icon: Server, color: 'text-emerald-500' },
    { label: 'Total Deployments', value: projects.length, icon: Activity, color: 'text-blue-500' },
    { label: 'Building Services', value: projects.filter(p => p.status === 'BUILDING').length, icon: CheckCircle, color: 'text-amber-500' },
  ];

  return (
    <div className="p-6">
      {/* Welcome */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-2xl font-bold text-slate-900 mb-2">
          Welcome back, {user?.displayName || user?.fullName || 'Developer'}!
        </h1>
        <p className="text-slate-600">
          Here's an overview of your backend services
        </p>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
      >
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + index * 0.1 }}
              className="card p-6"
            >
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center ${stat.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                  <p className="text-sm text-slate-500">{stat.label}</p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Active Services Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-slate-900">
            Active Services
          </h2>
        </div>
        
        {projects.length === 0 ? (
          <div className="card p-12 text-center text-slate-500">
            <Server className="w-12 h-12 mx-auto mb-4 text-slate-300" />
            <h3 className="text-lg font-medium text-slate-900 mb-2">No Services Found</h3>
            <p className="mb-4">You haven't connected any backend services yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.slice(0, 3).map((project) => (
              <div 
                key={project.id} 
                onClick={() => navigate(`/services/${project.id}`)}
                className="card p-5 hover:border-[#c37a4c] cursor-pointer transition-colors"
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-slate-900 truncate">{project.name}</h3>
                  <div className={`w-2 h-2 rounded-full ${
                    project.status === 'ACTIVE' ? 'bg-emerald-500' : 
                    project.status === 'FAILED' ? 'bg-red-500' : 
                    project.status === 'BUILDING' ? 'bg-amber-500 animate-pulse' : 
                    'bg-slate-300'
                  }`} />
                </div>
                <p className="text-xs text-slate-500 font-mono truncate mb-4">
                  {project.githubUrl.replace('https://github.com/', '')}
                </p>
                <div className="flex items-center gap-2 text-xs font-medium">
                  <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded-md">
                    Service
                  </span>
                  <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded-md">
                    Production
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}