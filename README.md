# Azze - Backend Hosting Platform

**Parent Company:** Arca

A comprehensive, real-time backend hosting platform built with React, Vite, and Tailwind CSS. Azze provides seamless deployment management, real-time build logs, and environment variable configuration for your backend services.

## Features

### 🔐 Authentication
- Google OAuth integration
- GitHub OAuth integration
- Secure session management with NextAuth patterns

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
VITE_GITHUB_CLIENT_ID=your_github_client_id
VITE_GITHUB_CLIENT_SECRET=your_github_client_secret

# Google OAuth Configuration
VITE_GOOGLE_CLIENT_ID=your_google_client_id
VITE_GOOGLE_CLIENT_SECRET=your_google_client_secret

# Database Configuration
VITE_DATABASE_URL=postgresql://user:password@localhost:5432/azze_db

# Application Configuration
VITE_API_URL=http://localhost:3000
VITE_WS_URL=ws://localhost:3000
```

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

## API Integration (Backend Implementation Notes)

For a production implementation, you would need to:

1. **NextAuth.js** for OAuth authentication
2. **Prisma Client** for database operations
3. **WebSocket Server** for real-time log streaming
4. **GitHub API** for repository access
5. **Docker/Kubernetes** for containerized deployments

## License

© 2024 Arca. All rights reserved.
