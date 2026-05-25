/**
 * Azze Platform - Main Dashboard
 * Parent Company: Arca
 */

import { motion, AnimatePresence } from 'framer-motion';
import { Routes, Route, useLocation } from 'react-router-dom';
import { Sidebar } from '../../components/Layout/Sidebar';
import { DashboardHome } from './Home';
import { DashboardServices } from './Services';
import { ServiceDetails } from './ServiceDetails';
import { DashboardSettings } from '../Settings';
import { Support } from '../Support';
import { Logs } from '../Logs';
import { CreateProjectModal } from '../../components/CreateProjectModal';
import { RepoDrawer } from '../../components/RepoDrawer';
import { ProjectSettings } from '../../components/ProjectSettings';
import { useApp } from '../../store/AppContext';

export function Dashboard() {
  const location = useLocation();
  const { 
    isCreateModalOpen, 
    closeCreateModal,
    isRepoDrawerOpen,
    closeRepoDrawer,
    isSettingsOpen,
    closeSettings,
    selectedProject
  } = useApp();

  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar />
      
      <main className="flex-1 overflow-y-auto relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="h-full"
          >
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<DashboardHome />} />
              <Route path="/services" element={<DashboardServices />} />
              <Route path="/services/:id" element={<ServiceDetails />} />
              <Route path="/logs" element={<Logs />} />
              <Route path="/support" element={<Support />} />
              <Route path="/settings" element={<DashboardSettings />} />
            </Routes>
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