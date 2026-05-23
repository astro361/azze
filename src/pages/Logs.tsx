/**
 * Azze Platform - Platform Logs
 * Parent Company: Arca
 */

import { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Terminal, MessageSquare } from 'lucide-react';
import { useApp } from '../store/AppContext';
import { LiveLog } from '../types';

export function Logs() {
  const { user, liveLogs, selectedDeployment } = useApp();
  const logsEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new logs arrive
  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [liveLogs]);

  const getLogColor = (level: LiveLog['level']) => {
    switch (level) {
      case 'SUCCESS':
        return 'text-emerald-400';
      case 'ERROR':
        return 'text-red-400';
      case 'WARN':
        return 'text-amber-400';
      case 'DEBUG':
        return 'text-slate-400';
      case 'INFO':
      default:
        return 'text-slate-300';
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

      <div className="flex-1 bg-[#1E1E1E] rounded-2xl shadow-sm border border-slate-800 overflow-hidden flex flex-col">
        <div className="bg-slate-900 px-4 py-3 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2 text-slate-300">
            <Terminal className="w-4 h-4" />
            <span className="text-sm font-mono">
              {selectedDeployment ? `deployment_logs/${selectedDeployment.uuid.slice(0, 8)}` : 'system.azze.arca/events'}
            </span>
          </div>
          <span className="text-xs text-slate-500 font-mono">
            {user?.email}
          </span>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 terminal-scroll font-mono text-sm leading-relaxed">
          {liveLogs.length === 0 ? (
            <div className="h-full flex items-center justify-center text-slate-500">
              <div className="text-center">
                <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>Waiting for build logs... Deploy a service to stream output.</p>
              </div>
            </div>
          ) : (
            <div className="space-y-1">
              {liveLogs.map((log) => (
                <motion.div
                  key={log.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-start gap-3 hover:bg-slate-800/50 px-2 py-1 rounded"
                >
                  <span className="text-slate-500 flex-shrink-0 text-xs mt-1 w-20">
                    {new Date(log.timestamp).toLocaleTimeString('en-US', { hour12: false })}
                  </span>
                  <span className={`flex-1 break-all ${getLogColor(log.level)}`}>
                    {log.content}
                  </span>
                </motion.div>
              ))}
              <div ref={logsEndRef} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}