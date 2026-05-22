# Azze - Backend Hosting Platform

**Parent Company:** Arca

A comprehensive, real-time backend hosting platform built with React, Vite, and Tailwind CSS. Azze provides seamless deployment management, real-time build logs, and environment variable configuration for your backend services.

## Features

### 🔐 Authentication
- Google OAuth integration - opens official Google authentication popup
- GitHub OAuth integration - opens official GitHub authentication popup
- Secure session management with state verification

### 📊 Dashboard
- Project grid view with status indicators
- Real-time deployment monitoring
- Service creation and management
- Responsive, mobile-friendly design

### 🚀 Deployments
- One-click GitHub repository deployment
- Real-time build log streaming
- Deployment status tracking (Building, Ready, Failed, Deploying)
- Commit hash and branch information

### 📝 Live Logs Terminal
- Real-time terminal output streaming
- Color-coded log levels (INFO, SUCCESS, WARN, ERROR, DEBUG)
- Auto-scrolling to latest logs
- Timestamp display for each log entry

### ⚙️ Environment Variables
- Secure environment variable management
- Secret masking/unmasking toggle
- Add, update, and delete variables
- Encrypted at rest

## Design System

### Colors
- **Primary:** Pure White (#FFFFFF)
- **Accent:** Burnt Terracotta Clay Orange (#c37a4c)
- **Dark Accents:** Deep Dark Slate (#0F172A - #64748B)

### UI Components
- Smooth Framer Motion animations
- Skeleton loading states
- Responsive flex-grid layouts
- Custom terminal styling

## Project Structure

```
src/
├── App.tsx                 # Main application entry
├── index.css               # Global styles & design tokens
├── vite-env.d.ts          # Vite environment types
├── config/
│   └── env.ts             # Environment configuration
├── types/
│   └── index.ts           # TypeScript type definitions
├── store/
│   ├── AppContext.tsx     # Global state management
│   └── mockData.ts        # Mock data for development
├── lib/
│   └── oauth.ts           # OAuth integration library
├── pages/
│   └── OAuthCallback.tsx  # OAuth callback handler
└── components/
    ├── AuthScreen.tsx     # Authentication UI
    ├── Dashboard.tsx      # Main dashboard
    ├── LiveLogsTerminal.tsx  # Real-time log viewer
    ├── ProjectSettings.tsx   # Environment variables panel
    ├── CreateProjectModal.tsx # New service creation
    └── RepoDrawer.tsx     # GitHub repo selection
```

## Database Schema

The platform uses Prisma ORM with PostgreSQL. Key models include:

- **User:** Authenticated user accounts
- **Project:** Backend service configurations
- **Deployment:** Individual deployment instances
- **LiveLog:** Real-time terminal output streams
- **EnvVar:** Environment variables per project
- **Account/Session:** OAuth and session management

See `prisma/schema.prisma` for the complete schema.

## Environment Configuration

Create a `.env` file in the project root with the following variables:

```env
# GitHub OAuth Configuration
# Create at: https://github.com/settings/developers
VITE_GITHUB_CLIENT_ID=your_github_client_id

# Google OAuth Configuration
# Create at: https://console.cloud.google.com/apis/credentials
VITE_GOOGLE_CLIENT_ID=your_google_client_id

# Database Configuration (optional for demo mode)
VITE_DATABASE_URL=postgresql://user:password@localhost:5432/azze_db
```

### OAuth Setup Instructions

#### GitHub OAuth
1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click "New OAuth App"
3. Fill in the details:
   - **Application name**: Azze
   - **Homepage URL**: `http://localhost:5173` (or your domain)
   - **Authorization callback URL**: `http://localhost:5173` (or your domain)
4. Copy the **Client ID** to your `.env` file

#### Google OAuth
1. Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Create a new OAuth 2.0 Client ID
3. Set **Authorized redirect URIs**: `http://localhost:5173`
4. Copy the **Client ID** to your `.env` file

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- PostgreSQL database (for production)

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Technology Stack

- **Frontend:** React 19, Vite 7, Tailwind CSS 4
- **State Management:** React Context API
- **Animations:** Framer Motion
- **Icons:** Lucide React
- **Styling:** Custom CSS with CSS Variables
- **TypeScript:** Full type safety

## License

© 2024 Arca. All rights reserved.