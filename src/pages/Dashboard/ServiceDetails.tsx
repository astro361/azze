/**
 * Azze Platform - Service Details View
 * Parent Company: Arca
 */

import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Server, Activity, Terminal, GitBranch, Settings, ExternalLink, RefreshCw } from 'lucide-react';
import { useApp } from '../../store/AppContext';
import { LiveLogsTerminal } from '../../components/LiveLogsTerminal';
import { Project, Deployment } from '../../types';
import { supabase } from '../../lib/supabase';
import { triggerVercelRedeploy } from '../../lib/vercel';

export function ServiceDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { projects, deployments, liveLogs, selectProject, selectDeployment, openSettings } = useApp();
  const [service, setService] = useState<Project | null>(null);
  const [latestDeployment, setLatestDeployment] = useState<Deployment | null>(null);

  useEffect(() => {
    // Find service from context or fetch from Supabase
    const found = projects.find(p => p.id === id);
    if (found) {
      setService(found);
      selectProject(found);
      const serviceDeps = deployments.filter(d => d.projectId === found.id).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      if (serviceDeps.length > 0) {
        setLatestDeployment(serviceDeps[0]);
        selectDeployment(serviceDeps[0]);
      }
    } else if (id) {
      // Fetch from Supabase if not in local context
      const fetchService = async () => {
        const { data } = await supabase.from('services').select('*').eq('id', id).single();
        if (data) {
          const fetchedProject: Project = {
            id: data.id,
            name: data.name,
            description: data.description,
            githubUrl: data.github_url,
            ownerId: data.owner_id,
            status: data.status,
            createdAt: data.created_at || new Date().toISOString(),
            updatedAt: data.updated_at || new Date().toISOString(),
          };
          setService(fetchedProject);
          selectProject(fetchedProject);
        }
      };
      fetchService();
    }
  }, [id, projects, deployments, selectProject, selectDeployment]);

  const handleRedeploy = async () => {
    // ACTIVE REAL REDEPLOY API REQUEST TO VERCEL
    if (!service) return;
    try {
      setService({ ...service, status: 'BUILDING' });
      await supabase.from('services').update({ status: 'BUILDING' }).eq('id', service.id);

      // Hit the official Vercel Redeploy endpoint
      console.log('Triggering real redeployment via Vercel for:', service.name);
      const vercelResponse = await triggerVercelRedeploy(service.name);
      
      // The API returns the new live build URL
      const liveUrl = `https://${vercelResponse.url}`;

      // Update Supabase records securely
      const { data, error } = await supabase.from('services').update({ 
        status: 'ACTIVE',
        deployed_url: liveUrl 
      }).eq('id', service.id).select();
      
      console.log('REDEPLOYMENT API COMPLETED. NEW URL:', liveUrl);

      if (!error && data) {
        setService({ ...service, status: 'ACTIVE', deployedUrl: liveUrl });
      }
    } catch (e: any) {
      console.error('Redeploy failed:', e);
      alert('Failed to trigger redeployment: ' + e.message);
      setService({ ...service, status: 'FAILED' });
      await supabase.from('services').update({ status: 'FAILED' }).eq('id', service.id);
    }
  };

  if (!service) {
    return (
      <div className="p-6 flex items-center justify-center h-full">
        <div className="text-center text-slate-500">
          <Server className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p>Loading service details...</p>
        </div>
      </div>
    );
  }

  const isBuilding = latestDeployment?.status === 'BUILDING' || latestDeployment?.status === 'DEPLOYING';
  const isFailed = latestDeployment?.status === 'FAILED';
  const isActive = service.status === 'ACTIVE' || latestDeployment?.status === 'READY';

  return (
    <div className="p-6 h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button 
          onClick={() => navigate('/services')}
          className="p-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-slate-600" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
            {service.name}
            {isActive && (
              <span className="px-2.5 py-0.5 text-xs font-bold bg-emerald-100 text-emerald-700 rounded-full border border-emerald-200">
                ACTIVE
              </span>
            )}
            {isBuilding && (
              <span className="px-2.5 py-0.5 text-xs font-bold bg-amber-100 text-amber-700 rounded-full border border-amber-200 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                BUILDING
              </span>
            )}
            {isFailed && (
              <span className="px-2.5 py-0.5 text-xs font-bold bg-red-100 text-red-700 rounded-full border border-red-200">
                FAILED
              </span>
            )}
          </h1>
          <p className="text-slate-500">{service.description || 'No description provided.'}</p>
        </div>
        
        <div className="ml-auto flex items-center gap-3">
          <button 
            onClick={handleRedeploy}
            className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${isBuilding ? 'animate-spin' : ''}`} />
            Redeploy
          </button>
          <button
            onClick={() => { selectProject(service); openSettings(); }}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors"
          >
            <Settings className="w-4 h-4" />
            Settings
          </button>
        </div>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="card p-5">
          <div className="flex items-center gap-3 mb-3">
            <Activity className="w-5 h-5 text-blue-500" />
            <h3 className="font-semibold text-slate-900">Live URL</h3>
          </div>
          <a 
            href={`/deployments/${service.id}`} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-[#c37a4c] hover:underline font-mono text-sm bg-slate-50 p-2 rounded-lg break-all"
          >
            {window.location.origin}/deployments/{service.id}
            <ExternalLink className="w-3 h-3" />
          </a>
        </motion.div>
        
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card p-5">
          <div className="flex items-center gap-3 mb-3">
            <GitBranch className="w-5 h-5 text-slate-600" />
            <h3 className="font-semibold text-slate-900">GitHub Connection</h3>
          </div>
          <div className="text-sm font-mono text-slate-600 bg-slate-50 p-2 rounded-lg flex items-center justify-between">
            <span>{service.githubUrl.replace('https://github.com/', '')}</span>
            <span className="text-xs px-2 py-0.5 bg-slate-200 rounded">main</span>
          </div>
        </motion.div>
      </div>

      {/* Terminal View */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="flex-1 flex flex-col min-h-0">
        <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
          <Terminal className="w-5 h-5 text-slate-600" />
          Deployment Logs
        </h3>
        <div className="flex-1 overflow-hidden">
          {latestDeployment ? (
            <LiveLogsTerminal deployment={latestDeployment} logs={liveLogs} />
          ) : (
            <div className="h-full bg-[#1E1E1E] rounded-2xl border border-slate-800 flex items-center justify-center text-slate-500">
              <p>No deployments found for this service.</p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}