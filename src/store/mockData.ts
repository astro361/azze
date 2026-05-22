/**
 * Azze Platform - Mock Data for Development
 * Parent Company: Arca
 */

import { User, Project, Deployment, GitHubRepo, EnvVar, LogLevel } from '../types';

// Mock current user
export const mockUser: User = {
  id: 'user_1',
  email: 'developer@arca.io',
  name: 'Alex Developer',
  image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alex',
  emailVerified: new Date().toISOString(),
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

// Mock GitHub repositories
export const mockGitHubRepos: GitHubRepo[] = [
  {
    id: 1,
    name: 'api-server',
    full_name: 'alexdev/api-server',
    html_url: 'https://github.com/alexdev/api-server',
    description: 'REST API server with Node.js and Express',
    language: 'TypeScript',
    stargazers_count: 42,
    forks_count: 8,
    updated_at: new Date().toISOString(),
    default_branch: 'main',
  },
  {
    id: 2,
    name: 'auth-service',
    full_name: 'alexdev/auth-service',
    html_url: 'https://github.com/alexdev/auth-service',
    description: 'Authentication microservice with JWT',
    language: 'TypeScript',
    stargazers_count: 28,
    forks_count: 5,
    updated_at: new Date().toISOString(),
    default_branch: 'main',
  },
  {
    id: 3,
    name: 'data-processor',
    full_name: 'alexdev/data-processor',
    html_url: 'https://github.com/alexdev/data-processor',
    description: 'Real-time data processing pipeline',
    language: 'Python',
    stargazers_count: 156,
    forks_count: 23,
    updated_at: new Date().toISOString(),
    default_branch: 'main',
  },
  {
    id: 4,
    name: 'notification-worker',
    full_name: 'alexdev/notification-worker',
    html_url: 'https://github.com/alexdev/notification-worker',
    description: 'Background job processor for notifications',
    language: 'TypeScript',
    stargazers_count: 34,
    forks_count: 7,
    updated_at: new Date().toISOString(),
    default_branch: 'main',
  },
  {
    id: 5,
    name: 'analytics-engine',
    full_name: 'alexdev/analytics-engine',
    html_url: 'https://github.com/alexdev/analytics-engine',
    description: 'Real-time analytics and reporting engine',
    language: 'Go',
    stargazers_count: 89,
    forks_count: 12,
    updated_at: new Date().toISOString(),
    default_branch: 'main',
  },
];

// Mock projects
export const mockProjects: Project[] = [
  {
    id: 'proj_1',
    name: 'api-server',
    description: 'REST API server with Node.js and Express',
    githubUrl: 'https://github.com/alexdev/api-server',
    ownerId: 'user_1',
    status: 'ACTIVE',
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'proj_2',
    name: 'auth-service',
    description: 'Authentication microservice with JWT',
    githubUrl: 'https://github.com/alexdev/auth-service',
    ownerId: 'user_1',
    status: 'ACTIVE',
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'proj_3',
    name: 'data-processor',
    description: 'Real-time data processing pipeline',
    githubUrl: 'https://github.com/alexdev/data-processor',
    ownerId: 'user_1',
    status: 'INACTIVE',
    createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// Mock deployments
export const mockDeployments: Deployment[] = [
  {
    id: 'deploy_1',
    uuid: '550e8400-e29b-41d4-a716-446655440001',
    projectId: 'proj_1',
    commitHash: 'a1b2c3d4',
    commitMessage: 'feat: add new endpoint for user management',
    branch: 'main',
    status: 'READY',
    startedAt: new Date(Date.now() - 3600000).toISOString(),
    completedAt: new Date(Date.now() - 3500000).toISOString(),
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'deploy_2',
    uuid: '550e8400-e29b-41d4-a716-446655440002',
    projectId: 'proj_2',
    commitHash: 'e5f6g7h8',
    commitMessage: 'fix: resolve token expiration issue',
    branch: 'main',
    status: 'BUILDING',
    startedAt: new Date(Date.now() - 120000).toISOString(),
    createdAt: new Date(Date.now() - 120000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'deploy_3',
    uuid: '550e8400-e29b-41d4-a716-446655440003',
    projectId: 'proj_1',
    commitHash: 'i9j0k1l2',
    commitMessage: 'chore: update dependencies',
    branch: 'main',
    status: 'FAILED',
    startedAt: new Date(Date.now() - 7200000).toISOString(),
    completedAt: new Date(Date.now() - 7100000).toISOString(),
    createdAt: new Date(Date.now() - 7200000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// Mock environment variables
export const mockEnvVars: EnvVar[] = [
  {
    id: 'env_1',
    projectId: 'proj_1',
    key: 'DATABASE_URL',
    value: 'postgresql://user:pass@localhost:5432/api_db',
    isSecret: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'env_2',
    projectId: 'proj_1',
    key: 'NODE_ENV',
    value: 'production',
    isSecret: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'env_3',
    projectId: 'proj_1',
    key: 'PORT',
    value: '3000',
    isSecret: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'env_4',
    projectId: 'proj_2',
    key: 'JWT_SECRET',
    value: 'super-secret-jwt-key-12345',
    isSecret: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'env_5',
    projectId: 'proj_2',
    key: 'TOKEN_EXPIRY',
    value: '3600',
    isSecret: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// Build log templates for real-time simulation
export const buildLogTemplates = [
  { content: 'Initializing build environment...', level: 'INFO' as LogLevel },
  { content: 'Cloning repository from GitHub...', level: 'INFO' as LogLevel },
  { content: 'Repository cloned successfully', level: 'SUCCESS' as LogLevel },
  { content: 'Checking out branch: main', level: 'INFO' as LogLevel },
  { content: 'Commit: abc123def - "feat: new feature"', level: 'DEBUG' as LogLevel },
  { content: 'Installing dependencies...', level: 'INFO' as LogLevel },
  { content: 'npm install completed in 12.4s', level: 'SUCCESS' as LogLevel },
  { content: 'Running TypeScript compilation...', level: 'INFO' as LogLevel },
  { content: 'Found 0 errors in 24 files', level: 'SUCCESS' as LogLevel },
  { content: 'Running tests...', level: 'INFO' as LogLevel },
  { content: '✓ All 47 tests passed', level: 'SUCCESS' as LogLevel },
  { content: 'Building production bundle...', level: 'INFO' as LogLevel },
  { content: 'Bundle size: 2.4 MB (gzipped: 680 KB)', level: 'INFO' as LogLevel },
  { content: 'Optimizing assets...', level: 'INFO' as LogLevel },
  { content: 'Assets optimized successfully', level: 'SUCCESS' as LogLevel },
  { content: 'Creating Docker image...', level: 'INFO' as LogLevel },
  { content: 'Image built: azze-api-server:latest', level: 'SUCCESS' as LogLevel },
  { content: 'Pushing to container registry...', level: 'INFO' as LogLevel },
  { content: 'Image pushed successfully', level: 'SUCCESS' as LogLevel },
  { content: 'Deploying to production servers...', level: 'INFO' as LogLevel },
  { content: 'Health check passed', level: 'SUCCESS' as LogLevel },
  { content: 'Deployment completed successfully!', level: 'SUCCESS' as LogLevel },
];
