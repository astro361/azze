/**
 * Azze Platform - Live Logs Terminal
 * Parent Company: Arca
 */

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Terminal, CheckCircle, AlertCircle, Info, MessageSquare, Bug } from 'lucide-react';
import { Deployment, LiveLog } from '../types';

interface LiveLogsTerminalProps {
  deployment: Deployment;
  logs: LiveLog[];
}

export function LiveLogsTerminal({ deployment, logs }: LiveLogsTerminalProps) {
  const logsEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new logs arrive
  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const getLogIcon = (level: LiveLog['level']) => {
    switch (level) {
      case 'SUCCESS':
        return <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />;
      case 'ERROR':
        return <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />;
      case 'WARN':
        return <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0" />;
      case 'DEBUG':
        return <Bug className="w-4 h-4 text-slate-400 flex-shrink-0" />;
      case 'INFO':
      default:
        return <Info className="w-4 h-4 text-blue-400 flex-shrink-0" />;
    }
  };

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

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card overflow-hidden"
    >
      {/* Terminal Header */}
      <div className="bg-slate-900 px-4 py-3 flex items-center justify-between border-b border-slate-700">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-slate-400" />
          <span className="text-sm font-medium text-slate-300">
            Live Logs - {deployment.uuid.slice(0, 8)}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className={`status-badge ${deployment.status.toLowerCase()}`}>
            <span className={`status-dot ${deployment.status.toLowerCase()}`} />
            {deployment.status}
          </span>
        </div>
      </div>

      {/* Terminal Content */}
      <div className="terminal terminal-scroll h-80 overflow-y-auto p-4 font-mono text-sm">
        {logs.length === 0 ? (
          <div className="h-full flex items-center justify-center text-slate-500">
            <div className="text-center">
              <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>Waiting for build logs...</p>
            </div>
          </div>
        ) : (
          <div className="space-y-1">
            {logs.map((log) => (
              <motion.div
                key={log.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2 }}
                className="terminal-line flex items-start gap-2"
              >
                <span className="text-slate-500 flex-shrink-0 text-xs pt-0.5">
                  {formatTimestamp(log.timestamp)}
                </span>
                {getLogIcon(log.level)}
                <span className={getLogColor(log.level)}>{log.content}</span>
              </motion.div>
            ))}
            <div ref={logsEndRef} />
          </div>
        )}
      </div>

      {/* Terminal Footer */}
      <div className="bg-slate-800 px-4 py-2 flex items-center justify-between border-t border-slate-700">
        <div className="flex items-center gap-4 text-xs text-slate-400">
          <span>Branch: {deployment.branch}</span>
          <span>Commit: {deployment.commitHash}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs text-slate-400">Live</span>
        </div>
      </div>
    </motion.div>
  );
}
