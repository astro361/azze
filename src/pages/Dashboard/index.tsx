/**
 * Azze Platform - Main Dashboard
 * Parent Company: Arca
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sidebar } from '../../components/Layout/Sidebar';
import { DashboardHome } from './Home';
import { DashboardServices } from './Services';
import { DashboardVideos } from '../Videos';
import { DashboardChat } from '../Chat';
import { DashboardSettings } from '../Settings';

export function Dashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardHome />;
      case 'services':
        return <DashboardServices />;
      case 'videos':
        return <DashboardVideos />;
      case 'chat':
        return <DashboardChat />;
      case 'settings':
        return <DashboardSettings />;
      default:
        return <DashboardHome />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      
      <main className="flex-1 overflow-y-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}