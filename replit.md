# Replit.md - Cryptocurrency Dashboard Application

## Overview

This is a full-stack cryptocurrency dashboard application built with React, TypeScript, Express, and PostgreSQL. The app displays real-time cryptocurrency data including top 25 cryptocurrencies, market statistics, and interactive charts. It features a modern dark theme UI built with shadcn/ui components and integrates with the CoinGecko API for live crypto data.

## User Preferences

Preferred communication style: Simple, everyday language.
Project deployment: Optimized for Vercel platform with serverless functions.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **UI Framework**: shadcn/ui components based on Radix UI primitives
- **Styling**: Tailwind CSS with CSS variables for theming
- **State Management**: TanStack Query (React Query) for server state management
- **Routing**: Wouter for lightweight client-side routing
- **Charts**: Chart.js with React wrapper for cryptocurrency price charts

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Session Management**: Memory-based storage (with interface for future DB integration)
- **API Integration**: CoinGecko API for cryptocurrency data
- **Caching**: In-memory caching with 5-minute refresh intervals

### Database Schema
- **Users**: Basic user table (id, username, password)
- **Crypto Data**: Stores cryptocurrency information (id, name, symbol, price, market cap, etc.)
- **Market Stats**: Global market statistics (total market cap, volume, BTC dominance)

## Key Components

### Frontend Components
- **Dashboard**: Main page displaying top 25 cryptocurrencies and market stats
- **CryptoCard**: Individual cryptocurrency display cards with hover effects
- **CryptoChart**: Interactive price charts with time period selection
- **MarketStats**: Global market statistics display
- **Header**: Navigation with search functionality
- **SearchComponent**: Cryptocurrency search functionality

### Backend Components
- **Routes**: RESTful API endpoints for crypto data and market stats
- **Storage**: Abstracted storage layer with memory implementation
- **Vite Integration**: Development server integration for SPA serving

### API Endpoints
- `GET /api/crypto/top25` - Top 25 cryptocurrencies
- `GET /api/crypto/:id` - Individual cryptocurrency data
- `GET /api/crypto/:id/chart` - Chart data for specific periods
- `GET /api/market/stats` - Global market statistics

## Data Flow

1. **Client Request**: Frontend makes API requests using TanStack Query
2. **Cache Check**: Server checks in-memory cache for fresh data (5-minute TTL)
3. **External API**: If cache is stale, fetch from CoinGecko API
4. **Data Processing**: Transform and normalize API response
5. **Cache Update**: Store processed data in memory cache
6. **Database Sync**: Optionally sync to PostgreSQL for persistence
7. **Response**: Return formatted data to client
8. **UI Update**: Frontend updates with new data and animations

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: PostgreSQL database connection
- **drizzle-orm**: Type-safe database ORM
- **@tanstack/react-query**: Server state management
- **@radix-ui/***: Headless UI components
- **chart.js**: Chart rendering library
- **wouter**: Lightweight routing
- **tailwindcss**: Utility-first CSS framework

### Development Dependencies
- **vite**: Frontend build tool
- **typescript**: Type checking
- **tsx**: TypeScript execution for Node.js
- **esbuild**: JavaScript bundler for production

### External Services
- **CoinGecko API**: Free cryptocurrency data API
- **Neon Database**: Serverless PostgreSQL hosting

## Deployment Strategy

### Development Environment
- **Frontend**: Vite dev server with HMR on port 5173
- **Backend**: Express server with tsx on port 3000
- **Database**: PostgreSQL via Neon serverless connection
- **Hot Reload**: Automatic restart on file changes

### Production Build (Vercel)
- **Frontend**: Vite builds optimized static assets to `dist/public`
- **Backend**: Serverless functions in `api/` directory
- **API Structure**: 
  - `/api/crypto/top25.ts` - Top 25 cryptocurrencies
  - `/api/crypto/[id].ts` - Individual cryptocurrency data
  - `/api/crypto/[id]/chart.ts` - Chart data
  - `/api/market/stats.ts` - Market statistics
- **CORS**: Configured for cross-origin requests
- **Caching**: Optimized cache headers for performance

### Environment Variables
- `DATABASE_URL`: PostgreSQL connection string (optional)
- `NODE_ENV`: Environment mode (development/production)

### Build Commands
- `npm run dev`: Start development servers
- `npm run build`: Build frontend for production
- `npm run vercel-build`: Vercel-specific build command
- `npm run db:push`: Push database schema changes

### Vercel Configuration
- `vercel.json`: Routes and function configuration
- **Static Assets**: Served from `dist/public`
- **API Functions**: Node.js 18 runtime
- **Headers**: CORS configured for all API routes
- **Caching**: Strategic cache policies for different endpoints

The application is optimized for Vercel deployment with serverless architecture, providing automatic scaling and global CDN distribution.