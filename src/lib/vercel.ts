/**
 * Azze Platform - Vercel Deployment API
 * Parent Company: Arca
 * 
 * Handles real deployment requests to Vercel's hosting architecture.
 */

import { env } from '../config/env';

const VERCEL_API_URL = 'https://api.vercel.com/v13/deployments?skipAutoDetectionConfirmation=1';

/**
 * Trigger a new deployment using Vercel's REST API
 * @param projectName The slugified name of the project
 * @param githubRepoId The numeric ID of the GitHub repository
 * @param branch The branch to deploy
 */
export async function deployToVercel(projectName: string, githubRepoId: number | string, branch: string = 'main') {
  // Always pull the freshest token directly from the environment to prevent cache drops
  const vercelToken = env.VERCEL_API_TOKEN || import.meta.env.VITE_VERCEL_API_TOKEN;
  
  if (!vercelToken) {
    throw new Error('Missing VITE_VERCEL_API_TOKEN in environment configuration. Cannot trigger real deployments.');
  }

  const payload = {
    name: projectName.toLowerCase().replace(/[^a-z0-9-]/g, '-').slice(0, 52),
    target: "production",
    gitSource: {
      type: "github",
      repoId: githubRepoId.toString(),
      ref: branch
    }
  };

  const response = await fetch(VERCEL_API_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${vercelToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message || `Vercel API Error: ${response.statusText}`);
  }

  const data = await response.json();
  return data; // Returns the deployment payload including the generated `.url`
}

/**
 * Trigger a redeploy of an existing Vercel project
 * @param projectName The slugified name of the project
 */
export async function triggerVercelRedeploy(projectName: string) {
  const vercelToken = env.VERCEL_API_TOKEN || import.meta.env.VITE_VERCEL_API_TOKEN;

  if (!vercelToken) {
    throw new Error('Missing VITE_VERCEL_API_TOKEN in environment configuration.');
  }

  const payload = {
    name: projectName.toLowerCase().replace(/[^a-z0-9-]/g, '-').slice(0, 52),
    target: "production"
  };

  const response = await fetch(VERCEL_API_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${vercelToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message || `Vercel API Error: ${response.statusText}`);
  }

  const data = await response.json();
  return data;
}