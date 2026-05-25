/**
 * Azze Platform - Type Definitions
 * Parent Company: Arca
 */

// User types
export interface User {
  id: string;
  email: string;
  fullName?: string;
  displayName?: string;
  phoneNumber?: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

// Project types
export type ProjectStatus = 'INACTIVE' | 'ACTIVE' | 'BUILDING' | 'FAILED' | 'SUSPENDED';

export interface Project {
  id: string;
  name: string;
  description?: string;
  githubUrl: string;
  ownerId: string;
  status: ProjectStatus;
  deployedUrl?: string;
  createdAt: string;
  updatedAt: string;
  deployments?: Deployment[];
  envVars?: EnvVar[];
}

// Deployment types
export type DeploymentStatus = 'BUILDING' | 'READY' | 'FAILED' | 'DEPLOYING';

export interface Deployment {
  id: string;
  uuid: string;
  projectId: string;
  commitHash: string;
  commitMessage?: string;
  branch: string;
  status: DeploymentStatus;
  startedAt: string;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
  logs?: LiveLog[];
}

// Live Log types
export type LogLevel = 'INFO' | 'WARN' | 'ERROR' | 'SUCCESS' | 'DEBUG';

export interface LiveLog {
  id: string;
  deploymentId: string;
  content: string;
  level: LogLevel;
  timestamp: string;
}

// Environment Variable types
export interface EnvVar {
  id: string;
  projectId: string;
  key: string;
  value: string;
  isSecret: boolean;
  createdAt: string;
  updatedAt: string;
}

// GitHub Repository types
export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  html_url: string;
  clone_url?: string;
  description?: string;
  language?: string;
  stargazers_count: number;
  forks_count: number;
  updated_at: string;
  default_branch: string;
}

// Auth types
export type AuthProvider = 'google' | 'github';

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// UI State types
export interface DashboardState {
  projects: Project[];
  selectedProject: Project | null;
  selectedDeployment: Deployment | null;
  isCreateModalOpen: boolean;
  isSettingsOpen: boolean;
  isRepoDrawerOpen: boolean;
  githubRepos: GitHubRepo[];
  isLoading: boolean;
}
