/**
 * Azze Platform - OAuth Integration Library
 * Parent Company: Arca
 * 
 * Handles real OAuth flows using environment configuration
 */

import { env } from '../config/env';

interface OAuthConfig {
  clientId: string;
  redirectUri: string;
  scope: string;
}

// Google OAuth configuration
const GOOGLE_OAUTH_CONFIG: OAuthConfig = {
  clientId: env.GOOGLE_CLIENT_ID,
  redirectUri: `${window.location.origin}`,
  scope: 'openid email profile',
};

// GitHub OAuth configuration
const GITHUB_OAUTH_CONFIG: OAuthConfig = {
  clientId: env.GITHUB_CLIENT_ID,
  redirectUri: `${window.location.origin}`,
  scope: 'read:user user:email repo',
};

/**
 * Generate a random state string for OAuth security
 */
function generateState(): string {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
}

/**
 * Store OAuth state in session storage for verification
 */
function storeOAuthState(state: string, provider: string): void {
  sessionStorage.setItem('oauth_state', JSON.stringify({ state, provider }));
}

/**
 * Initiate Google OAuth login flow
 * Opens the official Google OAuth popup
 */
export function initiateGoogleLogin(): void {
  if (!GOOGLE_OAUTH_CONFIG.clientId) {
    console.error('Google Client ID not configured. Please set VITE_GOOGLE_CLIENT_ID');
    alert('Google OAuth is not configured. Please set VITE_GOOGLE_CLIENT_ID in your environment.');
    return;
  }

  const state = generateState();
  storeOAuthState(state, 'google');

  const params = new URLSearchParams({
    client_id: GOOGLE_OAUTH_CONFIG.clientId,
    redirect_uri: window.location.origin,
    response_type: 'code',
    scope: GOOGLE_OAUTH_CONFIG.scope,
    state: state,
    access_type: 'offline',
    prompt: 'consent',
  });

  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
  
  // Open in the same window for single-page app compatibility
  window.location.href = authUrl;
}

/**
 * Initiate GitHub OAuth login flow
 * Opens the official GitHub OAuth popup
 */
export function initiateGithubLogin(): void {
  if (!GITHUB_OAUTH_CONFIG.clientId) {
    console.error('GitHub Client ID not configured. Please set VITE_GITHUB_CLIENT_ID');
    alert('GitHub OAuth is not configured. Please set VITE_GITHUB_CLIENT_ID in your environment.');
    return;
  }

  const state = generateState();
  storeOAuthState(state, 'github');

  const params = new URLSearchParams({
    client_id: GITHUB_OAUTH_CONFIG.clientId,
    redirect_uri: window.location.origin,
    scope: GITHUB_OAUTH_CONFIG.scope,
    state: state,
  });

  const authUrl = `https://github.com/login/oauth/authorize?${params.toString()}`;
  
  // Open in the same window for single-page app compatibility
  window.location.href = authUrl;
}

/**
 * Parse URL parameters to check for OAuth callback
 */
export function handleOAuthCallback(): { code: string | null; state: string | null; provider: string | null } {
  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get('code');
  const state = urlParams.get('state');
  
  const stored = sessionStorage.getItem('oauth_state');
  const storedState = stored ? JSON.parse(stored) : null;
  
  // Verify state matches
  if (state && storedState && state === storedState.state) {
    // Clean up the URL by removing query params
    window.history.replaceState({}, document.title, window.location.pathname);
    return { code, state, provider: storedState.provider };
  }
  
  return { code: null, state: null, provider: null };
}

/**
 * Check if OAuth is properly configured
 */
export function isOAuthConfigured(): { google: boolean; github: boolean } {
  return {
    google: !!env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_ID !== '',
    github: !!env.GITHUB_CLIENT_ID && env.GITHUB_CLIENT_ID !== '',
  };
}

/**
 * Complete the OAuth flow by setting the user
 * This would typically be called after exchanging the code for tokens
 */
export function completeOAuth(user: { id: string; email: string; name: string; image?: string }): void {
  localStorage.setItem('azze_user', JSON.stringify(user));
  // Force a page reload to update the app state
  window.location.reload();
}