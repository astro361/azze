/**
 * Azze Platform - Video Feed
 * Parent Company: Arca
 */

import { motion } from 'framer-motion';
import { Video, Plus } from 'lucide-react';

export function DashboardVideos() {
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Video Feed</h1>
          <p className="text-slate-600">Share and discover technical content</p>
        </div>
        <button className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Upload Video
        </button>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-12"
      >
        <Video className="w-12 h-12 text-slate-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-slate-900 mb-2">
          No videos yet
        </h3>
        <p className="text-slate-500">
          Be the first to share technical content with the community
        </p>
      </motion.div>
    </div>
  );
}