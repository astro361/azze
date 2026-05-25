/**
 * Azze Platform - Application State Management
 * Parent Company: Arca
 */

import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { User, Project, Deployment, LiveLog, GitHubRepo, EnvVar } from '../types';
import { mockProjects, mockDeployments, mockEnvVars, buildLogTemplates } from './mockData';
import { signInWithGoogle, signInWithGitHub, signOut, supabase, fetchUserGitHubRepos } from '../lib/supabase';
import { deployToVercel, triggerVercelRedeploy } from '../lib/vercel';

interface AppContextType {
  // Auth state
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  
  // Dashboard state
  projects: Project[];
  deployments: Deployment[];
  selectedProject: Project | null;
  selectedDeployment: Deployment | null;
  isCreateModalOpen: boolean;
  isSettingsOpen: boolean;
  isRepoDrawerOpen: boolean;
  githubRepos: GitHubRepo[];
  isDashboardLoading: boolean;
  liveLogs: LiveLog[];
  envVars: EnvVar[];
  
  // Auth actions
  login: (provider: 'google' | 'github') => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (user: User) => void;
  
  // Project actions
  createProject: (name: string, githubUrl: string, description?: string) => Promise<void>;
  deleteProject: (projectId: string) => void;
  selectProject: (project: Project | null) => void;
  
  // Deployment actions
  selectDeployment: (deployment: Deployment | null) => void;
  triggerDeployment: (repo: GitHubRepo) => Promise<void>;
  redeployProject: (projectId: string) => Promise<void>;
  
  // Environment variables
  addEnvVar: (projectId: string, key: string, value: string, isSecret: boolean) => void;
  updateEnvVar: (envVarId: string, value: string) => void;
  deleteEnvVar: (envVarId: string) => void;
  
  // UI actions
  openCreateModal: () => void;
  closeCreateModal: () => void;
  openSettings: () => void;
  closeSettings: () => void;
  openRepoDrawer: () => void;
  closeRepoDrawer: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  // Auth state
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Dashboard state
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [selectedDeployment, setSelectedDeployment] = useState<Deployment | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isRepoDrawerOpen, setIsRepoDrawerOpen] = useState(false);
  const [githubRepos, setGithubRepos] = useState<GitHubRepo[]>([]);
  const [deployments, setDeployments] = useState<Deployment[]>([]);
  const [envVars, setEnvVars] = useState<EnvVar[]>([]);
  const [liveLogs, setLiveLogs] = useState<LiveLog[]>([]);
  const [isDashboardLoading, setIsDashboardLoading] = useState(false);

  // Check for existing session on mount
  useEffect(() => {
    const checkUser = async () => {
      const savedUser = localStorage.getItem('azze_user');
      if (savedUser) {
        try {
          setUser(JSON.parse(savedUser));
          setIsAuthenticated(true);
          loadUserData();
        } catch (e) {
          localStorage.removeItem('azze_user');
        }
      }
      
      // Check Supabase session
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const meta = session.user.user_metadata || {};
        const userData = {
          id: session.user.id,
          email: session.user.email || '',
          fullName: meta.full_name || '',
          displayName: meta.display_name || '',
          phoneNumber: meta.phone_number || '',
          avatar: meta.avatar_url || '',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        setUser(userData);
        setIsAuthenticated(true);
        localStorage.setItem('azze_user', JSON.stringify(userData));
        loadUserData();
      }
      
      setIsLoading(false);
    };

    checkUser();
  }, []);

  const loadUserData = () => {
    setProjects(mockProjects);
    setDeployments(mockDeployments);
    setEnvVars(mockEnvVars);
  };

  const login = useCallback(async (provider: 'google' | 'github') => {
    try {
      if (provider === 'google') {
        await signInWithGoogle();
      } else {
        await signInWithGitHub();
      }
      // Supabase will redirect to the OAuth provider
      // After callback, the user will be redirected back and authenticated
    } catch (error) {
      console.error('Login error:', error);
      alert('Authentication failed. Please try again.');
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem('azze_user');
      setProjects([]);
      setDeployments([]);
      setEnvVars([]);
      setSelectedProject(null);
      setSelectedDeployment(null);
      setLiveLogs([]);
    }
  }, []);

  const createProject = useCallback(async (name: string, githubUrl: string, description?: string) => {
    if (!user) return;
    setIsDashboardLoading(true);
    
    const newProject = {
      name,
      description,
      github_url: githubUrl,
      owner_id: user.id,
      status: 'INACTIVE',
      // deployed_url is generated securely after insert using the DB ID
    };
    
    try {
      // EXPLICIT DATABASE SAVE
      const { data, error } = await supabase.from('services').insert([newProject]).select();
      
      console.log('EXPLICIT DB INSERT (Services Table):', data);
      
      if (error) {
        console.warn('Supabase insert failed, falling back to local state:', error.message);
        // Fallback for development if the table doesn't exist yet
        const localProject: Project = {
          id: `proj_${Date.now()}`,
          name,
          description,
          githubUrl,
          ownerId: user.id,
          status: 'INACTIVE',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        setProjects(prev => [...prev, localProject]);
      } else if (data && data[0]) {
        // Now that we have the generated ID, update the deployed_url to use the exact ID slug
        const generatedSlug = data[0].id;
        const liveUrl = `${window.location.origin}/deployments/${generatedSlug}`;
        
        const { data: updatedData } = await supabase
          .from('services')
          .update({ deployed_url: liveUrl })
          .eq('id', generatedSlug)
          .select();
          
        console.log('EXPLICIT DEPLOYED URL UPDATE:', updatedData);

        const projectData = updatedData ? updatedData[0] : data[0];

        const createdProject: Project = {
          id: projectData.id,
          name: projectData.name,
          description: projectData.description,
          githubUrl: projectData.github_url,
          ownerId: projectData.owner_id,
          status: projectData.status,
          deployedUrl: projectData.deployed_url,
          vercelId: projectData.vercel_id,
          createdAt: projectData.created_at || new Date().toISOString(),
          updatedAt: projectData.updated_at || new Date().toISOString(),
        };
        setProjects(prev => [...prev, createdProject]);
      }
    } catch (err) {
      console.error('Failed to create service:', err);
    } finally {
      setIsDashboardLoading(false);
      setIsCreateModalOpen(false);
    }
  }, [user]);

  const deleteProject = useCallback((projectId: string) => {
    setProjects(prev => prev.filter(p => p.id !== projectId));
    if (selectedProject?.id === projectId) {
      setSelectedProject(null);
    }
  }, [selectedProject]);

  const selectProject = useCallback((project: Project | null) => {
    setSelectedProject(project);
    if (project) {
      const projectDeployments = deployments.filter(d => d.projectId === project.id);
      if (projectDeployments.length > 0) {
        setSelectedDeployment(projectDeployments[0]);
      }
    } else {
      setSelectedDeployment(null);
    }
    setLiveLogs([]);
  }, [deployments]);

  const selectDeployment = useCallback((deployment: Deployment | null) => {
    setSelectedDeployment(deployment);
    if (deployment) {
      // Load existing logs for this deployment
      const existingLogs: LiveLog[] = buildLogTemplates.slice(0, 10).map((template, index) => ({
        id: `log_${deployment.id}_${index}`,
        deploymentId: deployment.id,
        content: template.content,
        level: template.level,
        timestamp: new Date(Date.now() - (10 - index) * 1000).toISOString(),
      }));
      setLiveLogs(existingLogs);
    } else {
      setLiveLogs([]);
    }
  }, []);

  const streamBuildLogs = useCallback(async (vercelDeploymentId: string, localDeploymentId: string, projectId: string) => {
    // Check for explicit local or environment token
    const vercelToken = import.meta.env.VITE_VERCEL_API_TOKEN;
    if (!vercelToken) {
      console.warn('Vercel API Token missing. Cannot stream live logs.');
      return;
    }

    try {
      // Connect to Vercel's official deployment events stream
      const response = await fetch(`https://api.vercel.com/v3/deployments/${vercelDeploymentId}/events?follow=1`, {
        headers: {
          'Authorization': `Bearer ${vercelToken}`
        }
      });

      if (!response.body) return;

      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        // Keep the last incomplete fragment in the buffer
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (!line.trim()) continue;

          try {
            const event = JSON.parse(line);
            let content = '';
            let level: 'INFO' | 'SUCCESS' | 'WARN' | 'ERROR' | 'DEBUG' = 'INFO';
            
            // Extract the true output stream from Vercel's payload format
            if (event.type === 'stdout' || event.type === 'stderr' || event.type === 'command') {
               content = event.payload?.text || '';
               level = event.type === 'stderr' ? 'ERROR' : 'INFO';
            } else if (event.type === 'state') {
               content = `Deployment State Updated: ${event.payload?.state}`;
               level = event.payload?.state === 'READY' ? 'SUCCESS' : 
                       event.payload?.state === 'ERROR' ? 'ERROR' : 'INFO';
            }

            // Only update local UI if valid text was parsed
            if (content.trim()) {
              const newLog: LiveLog = {
                id: `log_${Date.now()}_${Math.random()}`,
                deploymentId: localDeploymentId,
                content: content.replace(/\n$/, ''), // trim trailing newlines
                level,
                timestamp: new Date(event.payload?.date || Date.now()).toISOString(),
              };
              setLiveLogs(prev => [...prev, newLog]);
            }
          } catch (e) {
            // Ignored standard heartbeat / keep-alive chunks that aren't JSON
          }
        }
      }

      // Stream successfully completed; the build is officially finished.
      setDeployments(prev => prev.map(d => 
        d.id === localDeploymentId 
          ? { ...d, status: 'READY', completedAt: new Date().toISOString() }
          : d
      ));
      
      setProjects(prev => prev.map(p => 
        p.id === projectId ? { ...p, status: 'ACTIVE' } : p
      ));
      
      await supabase.from('services').update({ status: 'ACTIVE' }).eq('id', projectId);

    } catch (err) {
      console.error('Real-time streaming interrupted:', err);
    }
  }, []);

  const triggerDeployment = useCallback(async (repo: GitHubRepo) => {
    if (!selectedProject) return;
    setIsDashboardLoading(true);
    
    try {
      // 1. Send REAL deployment request to Vercel API
      console.log('Initiating real deployment to Vercel for repository:', repo.name);
      const vercelResponse = await deployToVercel(selectedProject.name, repo.id, repo.default_branch);
      
      // Vercel returns the generated live URL structure in `vercelResponse.url`
      const liveUrl = `https://${vercelResponse.url}`;
      
      const newDeployment: Deployment = {
        id: `deploy_${Date.now()}`,
        uuid: vercelResponse.id || crypto.randomUUID(),
        projectId: selectedProject.id,
        commitHash: repo.default_branch.substring(0, 8),
        commitMessage: `Deploy from ${repo.default_branch} (Vercel Build)`,
        branch: repo.default_branch,
        status: 'BUILDING',
        startedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      setDeployments(prev => [newDeployment, ...prev]);
      setSelectedDeployment(newDeployment);
      
      // Set to building while logs stream
      await supabase.from('services').update({
        status: 'BUILDING',
        deployed_url: liveUrl
      }).eq('id', selectedProject.id);

      setProjects(prev => prev.map(p => 
        p.id === selectedProject.id ? { ...p, status: 'BUILDING', deployedUrl: liveUrl } : p
      ));
      
      // Start live Vercel logs stream
      streamBuildLogs(vercelResponse.id, newDeployment.id, selectedProject.id);
    } catch (err: any) {
      console.error('Deployment Failed:', err);
      alert(err.message || 'Failed to trigger Vercel deployment.');
      
      await supabase.from('services').update({ status: 'FAILED' }).eq('id', selectedProject.id);
      setProjects(prev => prev.map(p => 
        p.id === selectedProject.id ? { ...p, status: 'FAILED' } : p
      ));
    } finally {
      setIsDashboardLoading(false);
      setIsRepoDrawerOpen(false);
    }
  }, [selectedProject, streamBuildLogs]);

  // Implement the global Redeploy API handler
  const redeployProject = useCallback(async (projectId: string) => {
    const project = projects.find(p => p.id === projectId);
    if (!project) return;
    
    try {
      // Temporarily mark building locally and remotely
      setProjects(prev => prev.map(p => p.id === projectId ? { ...p, status: 'BUILDING' } : p));
      await supabase.from('services').update({ status: 'BUILDING' }).eq('id', projectId);

      console.log('Triggering real redeployment via Vercel for:', project.name);
      
      // Make real POST Request to Vercel
      const vercelResponse = await triggerVercelRedeploy(project.name);
      const liveUrl = `https://${vercelResponse.url}`;

      const newDeployment: Deployment = {
        id: `deploy_${Date.now()}`,
        uuid: vercelResponse.id || crypto.randomUUID(),
        projectId: project.id,
        commitHash: 'redeploy',
        commitMessage: `Manual Redeploy (Vercel Build)`,
        branch: 'main', // assume main for redeploy 
        status: 'BUILDING',
        startedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      setDeployments(prev => [newDeployment, ...prev]);
      setSelectedDeployment(newDeployment);

      // Save live URL securely to Supabase
      const { data, error } = await supabase.from('services').update({ 
        status: 'BUILDING', 
        deployed_url: liveUrl 
      }).eq('id', project.id).select();
      
      if (!error && data) {
        setProjects(prev => prev.map(p => 
          p.id === projectId ? { ...p, status: 'BUILDING', deployedUrl: liveUrl } : p
        ));
      }

      // Stream the fresh build logs for this redeploy natively
      streamBuildLogs(vercelResponse.id, newDeployment.id, project.id);
    } catch (e: any) {
      console.error('Redeploy failed:', e);
      alert('Failed to trigger redeployment: ' + e.message);
      setProjects(prev => prev.map(p => p.id === projectId ? { ...p, status: 'FAILED' } : p));
      await supabase.from('services').update({ status: 'FAILED' }).eq('id', projectId);
    }
  }, [projects, streamBuildLogs]);

  const addEnvVar = useCallback((projectId: string, key: string, value: string, isSecret: boolean) => {
    const newEnvVar: EnvVar = {
      id: `env_${Date.now()}`,
      projectId,
      key,
      value,
      isSecret,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setEnvVars(prev => [...prev, newEnvVar]);
  }, []);

  const updateEnvVar = useCallback((envVarId: string, value: string) => {
    setEnvVars(prev => prev.map(ev => 
      ev.id === envVarId ? { ...ev, value, updatedAt: new Date().toISOString() } : ev
    ));
  }, []);

  const deleteEnvVar = useCallback((envVarId: string) => {
    setEnvVars(prev => prev.filter(ev => ev.id !== envVarId));
  }, []);

  const openCreateModal = useCallback(async () => {
    const repos = await fetchUserGitHubRepos();
    setGithubRepos(repos);
    setIsCreateModalOpen(true);
  }, []);
  const closeCreateModal = useCallback(() => setIsCreateModalOpen(false), []);
  const openSettings = useCallback(() => setIsSettingsOpen(true), []);
  const closeSettings = useCallback(() => setIsSettingsOpen(false), []);
  const openRepoDrawer = useCallback(async () => {
    const repos = await fetchUserGitHubRepos();
    setGithubRepos(repos);
    setIsRepoDrawerOpen(true);
  }, []);
  const closeRepoDrawer = useCallback(() => setIsRepoDrawerOpen(false), []);

  const updateUser = useCallback((updatedUser: User) => {
    setUser(updatedUser);
    setIsAuthenticated(true);
    localStorage.setItem('azze_user', JSON.stringify(updatedUser));
  }, []);

  const value: AppContextType = {
    // Auth state
    user,
    isAuthenticated,
    isLoading,
    
    // Dashboard state
    projects,
    deployments,
    selectedProject,
    selectedDeployment,
    isCreateModalOpen,
    isSettingsOpen,
    isRepoDrawerOpen,
    githubRepos,
    isDashboardLoading,
    liveLogs,
    envVars,
    
    // Actions
    login,
    logout,
    updateUser,
    createProject,
    deleteProject,
    selectProject,
    selectDeployment,
    triggerDeployment,
    redeployProject,
    addEnvVar,
    updateEnvVar,
    deleteEnvVar,
    openCreateModal,
    closeCreateModal,
    openSettings,
    closeSettings,
    openRepoDrawer,
    closeRepoDrawer,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}