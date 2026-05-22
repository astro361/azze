/**
 * Azze Platform - Supabase Client
 * Parent Company: Arca
 * 
 * Supabase client for authentication and database operations
 */

import { createClient } from '@supabase/supabase-js';
import { env } from '../config/env';

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