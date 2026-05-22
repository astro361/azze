/**
 * Azze Platform - Mock Data for Development
 * Parent Company: Arca
 * 
 * This file contains minimal mock data for development.
 * In production, all data comes from Supabase.
 */

import { Project, Deployment, EnvVar } from '../types';

// Empty projects array - real projects come from Supabase
export const mockProjects: Project[] = [];

// Empty deployments array - real deployments come from Supabase
export const mockDeployments: Deployment[] = [];

// Empty env vars array - real env vars come from Supabase
export const mockEnvVars: EnvVar[] = [];

// Build log templates for real-time simulation (kept for demo purposes)
export const buildLogTemplates = [
  { content: 'Initializing build environment...', level: 'INFO' as const },
  { content: 'Cloning repository from GitHub...', level: 'INFO' as const },
  { content: 'Repository cloned successfully', level: 'SUCCESS' as const },
  { content: 'Checking out branch: main', level: 'INFO' as const },
  { content: 'Installing dependencies...', level: 'INFO' as const },
  { content: 'npm install completed in 12.4s', level: 'SUCCESS' as const },
  { content: 'Running TypeScript compilation...', level: 'INFO' as const },
  { content: 'Found 0 errors in 24 files', level: 'SUCCESS' as const },
  { content: 'Running tests...', level: 'INFO' as const },
  { content: '✓ All 47 tests passed', level: 'SUCCESS' as const },
  { content: 'Building production bundle...', level: 'INFO' as const },
  { content: 'Bundle size: 2.4 MB (gzipped: 680 KB)', level: 'INFO' as const },
  { content: 'Creating Docker image...', level: 'INFO' as const },
  { content: 'Image built: azze-api-server:latest', level: 'SUCCESS' as const },
  { content: 'Pushing to container registry...', level: 'INFO' as const },
  { content: 'Image pushed successfully', level: 'SUCCESS' as const },
  { content: 'Deploying to production servers...', level: 'INFO' as const },
  { content: 'Health check passed', level: 'SUCCESS' as const },
  { content: 'Deployment completed successfully!', level: 'SUCCESS' as const },
];