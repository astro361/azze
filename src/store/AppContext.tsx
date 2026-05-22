/**
 * Azze Platform - Application State Management
 * Parent Company: Arca
 */

import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { User, Project, Deployment, LiveLog, GitHubRepo, EnvVar } from '../types';
import { mockProjects, mockDeployments, mockGitHubRepos, mockEnvVars, buildLogTemplates } from './mockData';
import { initiateGoogleLogin, initiateGithubLogin, isOAuthConfigured } from '../lib/oauth';

interface AppContextType {
  // Auth state
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  
  // Dashboard state
  projects: Project[];
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
  logout: () => void;
  
  // Project actions
  createProject: (name: string, githubUrl: string, description?: string) => Promise<void>;
  deleteProject: (projectId: string) => void;
  selectProject: (project: Project | null) => void;
  
  // Deployment actions
  selectDeployment: (deployment: Deployment | null) => void;
  triggerDeployment: (repo: GitHubRepo) => Promise<void>;
  
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
    setIsLoading(false);
  }, []);

  const loadUserData = () => {
    setProjects(mockProjects);
    setDeployments(mockDeployments);
    setEnvVars(mockEnvVars);
  };

  const login = useCallback(async (provider: 'google' | 'github') => {
    // Check if OAuth is configured
    const oauthConfig = isOAuthConfigured();
    
    if (provider === 'google' && !oauthConfig.google) {
      alert('Google OAuth is not configured. Please set VITE_GOOGLE_CLIENT_ID in your environment.');
      return;
    }
    
    if (provider === 'github' && !oauthConfig.github) {
      alert('GitHub OAuth is not configured. Please set VITE_GITHUB_CLIENT_ID in your environment.');
      return;
    }

    // Initiate real OAuth flow
    if (provider === 'google') {
      initiateGoogleLogin();
    } else {
      initiateGithubLogin();
    }
    
    // Note: The user will be redirected to the OAuth provider
    // After successful authentication, they'll be redirected back
    // The callback handler will set the user state
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('azze_user');
    setProjects([]);
    setDeployments([]);
    setEnvVars([]);
    setSelectedProject(null);
    setSelectedDeployment(null);
    setLiveLogs([]);
  }, []);

  const createProject = useCallback(async (name: string, githubUrl: string, description?: string) => {
    setIsDashboardLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newProject: Project = {
      id: `proj_${Date.now()}`,
      name,
      description,
      githubUrl,
      ownerId: user!.id,
      status: 'INACTIVE',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    setProjects(prev => [...prev, newProject]);
    setIsDashboardLoading(false);
    setIsCreateModalOpen(false);
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

  const triggerDeployment = useCallback(async (repo: GitHubRepo) => {
    setIsDashboardLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const newDeployment: Deployment = {
      id: `deploy_${Date.now()}`,
      uuid: crypto.randomUUID(),
      projectId: selectedProject!.id,
      commitHash: repo.default_branch.substring(0, 8),
      commitMessage: `Deploy from ${repo.default_branch}`,
      branch: repo.default_branch,
      status: 'BUILDING',
      startedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    setDeployments(prev => [newDeployment, ...prev]);
    setSelectedDeployment(newDeployment);
    setIsDashboardLoading(false);
    setIsRepoDrawerOpen(false);
    
    // Start streaming logs
    streamBuildLogs(newDeployment.id);
  }, [selectedProject]);

  const streamBuildLogs = useCallback((deploymentId: string) => {
    let logIndex = 0;
    const interval = setInterval(() => {
      if (logIndex >= buildLogTemplates.length) {
        clearInterval(interval);
        // Update deployment status to READY
        setDeployments(prev => prev.map(d => 
          d.id === deploymentId 
            ? { ...d, status: 'READY', completedAt: new Date().toISOString() }
            : d
        ));
        return;
      }
      
      const template = buildLogTemplates[logIndex];
      const newLog: LiveLog = {
        id: `log_${deploymentId}_${logIndex}`,
        deploymentId,
        content: template.content,
        level: template.level,
        timestamp: new Date().toISOString(),
      };
      
      setLiveLogs(prev => [...prev, newLog]);
      logIndex++;
    }, 800);
  }, []);

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

  const openCreateModal = useCallback(() => setIsCreateModalOpen(true), []);
  const closeCreateModal = useCallback(() => setIsCreateModalOpen(false), []);
  const openSettings = useCallback(() => setIsSettingsOpen(true), []);
  const closeSettings = useCallback(() => setIsSettingsOpen(false), []);
  const openRepoDrawer = useCallback(() => {
    setGithubRepos(mockGitHubRepos);
    setIsRepoDrawerOpen(true);
  }, []);
  const closeRepoDrawer = useCallback(() => setIsRepoDrawerOpen(false), []);

  const value: AppContextType = {
    // Auth state
    user,
    isAuthenticated,
    isLoading,
    
    // Dashboard state
    projects,
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
    createProject,
    deleteProject,
    selectProject,
    selectDeployment,
    triggerDeployment,
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

// Export a function to complete OAuth and set user
export function completeOAuth(user: User) {
  const appContext = {
    setUser: (u: User) => {
      localStorage.setItem('azze_user', JSON.stringify(u));
    }
  };
  appContext.setUser(user);
}