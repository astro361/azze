/**
 * Azze Platform - Platform Logs
 * Parent Company: Arca
 */

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Terminal, Clock, ShieldAlert, CheckCircle, Info } from 'lucide-react';
import { useApp } from '../store/AppContext';

// Simple mock log generator for demonstration
const generateSystemLogs = () => {
  const types = ['INFO', 'SUCCESS', 'WARN', 'ERROR'];
  const messages = [
    'System heartbeat check completed successfully',
    'Database connection pool optimized',
    'User authentication token refreshed',
    'New deployment requested for backend-service',
    'Deployment successful: build #4092',
    'High memory usage detected on worker node',
    'API rate limit warning for upstream provider',
    'Failed to pull image from container registry'
  ];

  return Array.from({ length: 20 }).map((_, i) => {
    const type = types[Math.floor(Math.random() * types.length)];
    const msg = messages[Math.floor(Math.random() * messages.length)];
    return {
      id: `sys_log_${i}`,
      timestamp: new Date(Date.now() - Math.random() * 86400000).toISOString(),
      type,
      message: msg,
    };
  }).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
};

export function Logs() {
  const [logs, setLogs] = useState<any[]>([]);
  const { user } = useApp();

  useEffect(() => {
    setLogs(generateSystemLogs());
  }, []);

  const getLogIcon = (type: string) => {
    switch (type) {
      case 'SUCCESS': return <CheckCircle className="w-4 h-4 text-emerald-500" />;
      case 'WARN': return <ShieldAlert className="w-4 h-4 text-amber-500" />;
      case 'ERROR': return <ShieldAlert className="w-4 h-4 text-red-500" />;
      case 'INFO': 
      default: return <Info className="w-4 h-4 text-blue-500" />;
    }
  };

  const getLogStyle = (type: string) => {
    switch (type) {
      case 'SUCCESS': return 'border-emerald-500/20 bg-emerald-50/50';
      case 'WARN': return 'border-amber-500/20 bg-amber-50/50';
      case 'ERROR': return 'border-red-500/20 bg-red-50/50';
      case 'INFO': 
      default: return 'border-slate-200 bg-white';
    }
  };

  return (
    <div className="p-6 h-full flex flex-col">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Platform Logs</h1>
          <p className="text-slate-600">Real-time system events and operational streams</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-lg">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-medium text-slate-600">Live Stream Connected</span>
        </div>
      </div>

      <div className="flex-1 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
        <div className="bg-slate-900 px-4 py-3 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2 text-slate-300">
            <Terminal className="w-4 h-4" />
            <span className="text-sm font-mono">system.azze.arca/events</span>
          </div>
          <span className="text-xs text-slate-500 font-mono">
            {user?.email}
          </span>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50">
          {logs.map((log, index) => (
            <motion.div
              key={log.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`p-3 rounded-xl border flex gap-3 ${getLogStyle(log.type)}`}
            >
              <div className="pt-0.5">{getLogIcon(log.type)}</div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-xs font-bold px-1.5 py-0.5 rounded ${
                    log.type === 'SUCCESS' ? 'bg-emerald-100 text-emerald-700' :
                    log.type === 'ERROR' ? 'bg-red-100 text-red-700' :
                    log.type === 'WARN' ? 'bg-amber-100 text-amber-700' :
                    'bg-blue-100 text-blue-700'
                  }`}>
                    {log.type}
                  </span>
                  <span className="text-xs text-slate-400 flex items-center gap-1 font-mono">
                    <Clock className="w-3 h-3" />
                    {new Date(log.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                <p className="text-sm text-slate-700 font-mono mt-1">{log.message}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}