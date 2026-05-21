/**
 * Azze Platform - Environment Configuration
 * Parent Company: Arca
 * 
 * Place these environment variables in your .env file:
 * 
 * # GitHub OAuth Configuration
 * GITHUB_CLIENT_ID=your_github_client_id
 * GITHUB_CLIENT_SECRET=your_github_client_secret
 * 
 * # Google OAuth Configuration
 * GOOGLE_CLIENT_ID=your_google_client_id
 * GOOGLE_CLIENT_SECRET=your_google_client_secret
 * 
 * # Database Configuration
 * DATABASE_URL=postgresql://user:password@localhost:5432/azze_db
 * 
 * # Application Configuration
 * NEXTAUTH_URL=http://localhost:3000
 * NEXTAUTH_SECRET=your_nextauth_secret
 */

export const env = {
  // GitHub OAuth
  GITHUB_CLIENT_ID: import.meta.env.VITE_GITHUB_CLIENT_ID || '',
  GITHUB_CLIENT_SECRET: import.meta.env.VITE_GITHUB_CLIENT_SECRET || '',
  
  // Google OAuth
  GOOGLE_CLIENT_ID: import.meta.env.VITE_GOOGLE_CLIENT_ID || '',
  GOOGLE_CLIENT_SECRET: import.meta.env.VITE_GOOGLE_CLIENT_SECRET || '',
  
  // Database
  DATABASE_URL: import.meta.env.VITE_DATABASE_URL || '',
  
  // Application
  API_URL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  WS_URL: import.meta.env.VITE_WS_URL || 'ws://localhost:3000',
};

export const isDevelopment = import.meta.env.DEV;
