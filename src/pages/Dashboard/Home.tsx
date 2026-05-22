/**
 * Azze Platform - Dashboard Home
 * Parent Company: Arca
 */

import { motion } from 'framer-motion';
import { Server, Activity, Clock, CheckCircle } from 'lucide-react';
import { useApp } from '../../store/AppContext';

export function DashboardHome() {
  const { user, projects } = useApp();
  const deployments: any[] = [];

  const stats = [
    { label: 'Active Services', value: projects.filter(p => p.status === 'ACTIVE').length, icon: Server, color: 'text-emerald-500' },
    { label: 'Total Deployments', value: deployments.length, icon: Activity, color: 'text-blue-500' },
    { label: 'Ready Services', value: projects.filter(p => p.status === 'ACTIVE').length, icon: CheckCircle, color: 'text-emerald-500' },
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
          Welcome back, {user?.name || 'Developer'}!
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

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="card p-6"
      >
        <h2 className="text-lg font-semibold text-slate-900 mb-4">
          Recent Activity
        </h2>
        {deployments.length === 0 ? (
          <div className="text-center py-8 text-slate-500">
            <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>No recent activity</p>
          </div>
        ) : (
          <div className="space-y-4">
            {deployments.slice(0, 5).map((deployment) => (
              <div key={deployment.id} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
                <div>
                  <p className="font-medium text-slate-900">
                    {deployment.commitMessage || 'Deployment'}
                  </p>
                  <p className="text-sm text-slate-500">
                    {deployment.commitHash?.substring(0, 8)} • {new Date(deployment.startedAt).toLocaleDateString()}
                  </p>
                </div>
                <span className={`status-badge ${deployment.status.toLowerCase()}`}>
                  {deployment.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}