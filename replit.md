# TikTok-Style Short Video Application

## Overview

This is a TikTok-inspired short-form video sharing platform built as a full-stack web application. The application enables users to discover, watch, create, and interact with short video content through features like likes, comments, and trending feeds. It uses a mobile-first design approach optimized for rapid content consumption and engagement.

## User Preferences

Preferred communication style: Simple, everyday language.

## Recent Changes

### November 17, 2024
- **Expanded Video Library**: Increased from 4 sample videos to 5,000 diverse video entries
- **Content Categories**: Added 15 different content categories including:
  - Anime clips & AMVs
  - Gaming highlights & gameplay
  - Comedy & funny moments
  - Movie trailers & reviews
  - Music videos & covers
  - Dance performances
  - Cooking & food content
  - Travel vlogs
  - Sports highlights
  - Tech reviews & tutorials
  - Art & creative content
  - Fitness & motivation
  - Pet & animal videos
  - Magic tricks
  - Science experiments
- **User Base**: Expanded from 3 users to 100 creators across all categories
- **Sample Comments**: Added 100 sample comments across the first 10 videos

## System Architecture

### Frontend Architecture

**Framework & Build System**
- React 18 with TypeScript for type-safe component development
- Vite as the build tool and development server for fast hot module replacement
- Wouter for lightweight client-side routing (alternative to React Router)
- Single-page application (SPA) architecture

**State Management & Data Fetching**
- TanStack Query (React Query) for server state management, caching, and data synchronization
- Query client configured with infinite stale time and disabled automatic refetching for optimal performance
- Custom query functions with automatic error handling and 401 unauthorized behavior

**UI Component System**
- shadcn/ui component library built on Radix UI primitives
- Tailwind CSS for utility-first styling with custom design tokens
- Custom theme system supporting both light and dark modes via CSS variables
- Mobile-first responsive design following TikTok's proven design patterns

**Design System Principles**
- Full viewport height (100vh) sections for immersive video feed
- Snap-scroll behavior for seamless video-to-video transitions
- Absolute positioned overlay controls (profile, like, comment, share) on right side
- Bottom navigation bar for primary app navigation
- Typography hierarchy optimized for readability at mobile sizes

**Form Handling & Validation**
- React Hook Form for performant form state management
- Zod for runtime type validation integrated with Drizzle schema
- @hookform/resolvers for seamless integration between validation libraries

### Backend Architecture

**Server Framework**
- Express.js server with TypeScript for type-safe backend development
- ESM (ES Modules) throughout the codebase for modern JavaScript standards
- Custom middleware for request logging with duration tracking and JSON response capture
- Vite middleware integration for development mode with HMR support

**API Design**
- RESTful API endpoints organized by resource (videos, users, comments, likes)
- Consistent error handling with appropriate HTTP status codes
- JSON request/response format with automatic body parsing
- Request body preservation for webhook integration (rawBody property)

**Data Layer Strategy**
- In-memory storage implementation (MemStorage class) for development and testing
- Interface-based storage abstraction (IStorage) enabling future database integration
- Drizzle ORM configured for PostgreSQL with Neon serverless driver
- Schema-first approach with Zod validation derived from Drizzle schemas

**Database Schema Design**
- Users table: profiles with follower/following/likes counters
- Videos table: content metadata with engagement metrics (likes, comments, views)
- Comments table: threaded conversations on videos
- Likes table: user-video relationships for favorites
- All tables use varchar primary keys for UUID-based identification
- Timestamps for temporal tracking of content creation

### External Dependencies

**Database**
- PostgreSQL via Neon serverless (@neondatabase/serverless)
- Drizzle ORM for type-safe database queries and migrations
- Connection pooling handled by Neon's serverless driver
- Configured via DATABASE_URL environment variable

**UI Component Libraries**
- Radix UI primitives for accessible, unstyled components
- Embla Carousel for touch-friendly carousels
- Lucide React for consistent iconography
- date-fns for human-readable date formatting

**Development Tools**
- tsx for TypeScript execution in development
- esbuild for production server bundling
- Replit-specific plugins for development banner and error overlay (conditional loading)
- PostCSS with Autoprefixer for CSS processing

**Session Management**
- connect-pg-simple for PostgreSQL-backed session storage
- Configured for future authentication implementation

**Type Safety**
- TypeScript with strict mode enabled
- Path aliases (@/, @shared/, @assets/) for clean imports
- Shared schema definitions between client and server
- Drizzle-zod for automatic schema validation generation