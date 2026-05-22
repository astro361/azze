/**
 * Azze Platform - Supabase Client
 * Parent Company: Arca
 * 
 * Supabase client for authentication and database operations
 */

import { createClient } from '@supabase/supabase-js';
import { env } from '../config/env';
import { GitHubRepo } from '../types';

// Create Supabase client
export const supabase = createClient(
  env.SUPABASE_URL,
  env.SUPABASE_ANON_KEY
);

/**
 * Sign in with Google OAuth using Supabase
 */
export async function signInWithGoogle() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${env.APP_URL}/auth/callback`,
    },
  });

  if (error) {
    console.error('Google sign-in error:', error);
    throw error;
  }

  return data;
}

/**
 * Sign in with GitHub OAuth using Supabase
 */
export async function signInWithGitHub() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'github',
    options: {
      redirectTo: `${env.APP_URL}/auth/callback`,
    },
  });

  if (error) {
    console.error('GitHub sign-in error:', error);
    throw error;
  }

  return data;
}

/**
 * Handle OAuth callback from Supabase
 */
export async function handleSupabaseCallback() {
  const { data, error } = await supabase.auth.getUser();
  
  if (error) {
    console.error('Callback error:', error);
    return null;
  }

  return data.user;
}

/**
 * Sign out
 */
export async function signOut() {
  const { error } = await supabase.auth.signOut();
  
  if (error) {
    console.error('Sign out error:', error);
    throw error;
  }
}

/**
 * Get current user
 */
export function getCurrentUser() {
  return supabase.auth.getUser();
}

/**
 * Fetch user's GitHub repositories using GitHub API
 * Requires the user to have authorized the GitHub OAuth app
 */
export async function fetchUserGitHubRepos(): Promise<GitHubRepo[]> {
  try {
    // Get the current session to access the GitHub access token
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      throw new Error('No active session');
    }

    // Get the provider token (GitHub access token)
    const providerToken = session.provider_token;
    
    if (!providerToken) {
      // User needs to sign in with GitHub first
      return [];
    }

    // Fetch repositories from GitHub API
    const response = await fetch('https://api.github.com/user/repos?sort=updated&per_page=100', {
      headers: {
        'Authorization': `token ${providerToken}`,
        'Accept': 'application/vnd.github.v3+json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch repositories');
    }

    const repos = await response.json();
    
    return repos.map((repo: any) => ({
      id: repo.id,
      name: repo.name,
      full_name: repo.full_name,
      html_url: repo.html_url,
      description: repo.description,
      language: repo.language,
      stargazers_count: repo.stargazers_count,
      forks_count: repo.forks_count,
      updated_at: repo.updated_at,
      default_branch: repo.default_branch,
    }));
  } catch (error) {
    console.error('Error fetching GitHub repos:', error);
    return [];
  }
}