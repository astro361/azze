/**
 * Azze Platform - Main Dashboard
 * Parent Company: Arca
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sidebar } from '../../components/Layout/Sidebar';
import { DashboardHome } from './Home';
import { DashboardServices } from './Services';
import { DashboardSettings } from '../Settings';
import { Support } from '../Support';
import { Logs } from '../Logs';
import { CreateProjectModal } from '../../components/CreateProjectModal';
import { RepoDrawer } from '../../components/RepoDrawer';
import { ProjectSettings } from '../../components/ProjectSettings';
import { useApp } from '../../store/AppContext';

export function Dashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const { 
    isCreateModalOpen, 
    closeCreateModal,
    isRepoDrawerOpen,
    closeRepoDrawer,
    isSettingsOpen,
    closeSettings,
    selectedProject
  } = useApp();

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardHome />;
      case 'services':
        return <DashboardServices />;
      case 'logs':
        return <Logs />;
      case 'support':
        return <Support />;
      case 'settings':
        return <DashboardSettings />;
      default:
        return <DashboardHome />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      
      <main className="flex-1 overflow-y-auto relative">
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

        {/* Global Modals */}
        <AnimatePresence>
          {isCreateModalOpen && <CreateProjectModal onClose={closeCreateModal} />}
          {isSettingsOpen && selectedProject && (
            <ProjectSettings project={selectedProject} onClose={closeSettings} />
          )}
          {isRepoDrawerOpen && (
            <RepoDrawer onClose={closeRepoDrawer} />
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}