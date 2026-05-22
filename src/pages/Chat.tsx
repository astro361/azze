/**
 * Azze Platform - Real-time Chat
 * Parent Company: Arca
 */

import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';

export function DashboardChat() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Community Chat</h1>
        <p className="text-slate-600">Connect with other developers</p>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-12"
      >
        <MessageCircle className="w-12 h-12 text-slate-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-slate-900 mb-2">
          Chat Coming Soon
        </h3>
        <p className="text-slate-500">
          Real-time chat support will be available soon
        </p>
      </motion.div>
    </div>
  );
}