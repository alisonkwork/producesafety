# ProduceSafe - FSMA Compliance Application

## Overview

ProduceSafe is a full-stack web application designed to help farmers and produce handlers navigate FDA Food Safety Modernization Act (FSMA) Produce Safety Rule compliance. The application provides an exemption status wizard to determine regulatory coverage, digital record-keeping for compliance documentation (worker training, cleaning & sanitizing, agricultural water, compost), and a customizable dashboard for monitoring compliance status.

### Dashboard Features
- **FSMA Status** card at top showing exemption status
- **Customizable action boxes**: Worker Training, Cleaning & Sanitizing, Agricultural Water, Compost, All Records
- Users can show/hide boxes they don't need (e.g., hide Compost if not used)
- Preferences persist per user via `user_preferences` table

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript, using Vite as the build tool
- **Routing**: Wouter (lightweight React router)
- **State Management**: TanStack React Query for server state, local React state for UI
- **Styling**: Tailwind CSS with shadcn/ui component library (New York style variant)
- **Animations**: Framer Motion for wizard transitions and page animations
- **Design System**: Agricultural theme with Forest Green (primary), Harvest Orange (secondary), Sunflower Yellow (accent), Inter font for UI, Merriweather for headings

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ESM modules
- **API Design**: REST API with typed route definitions in `shared/routes.ts` using Zod schemas
- **Build**: Custom esbuild script for production bundling, Vite for development with HMR

### Data Storage
- **Database**: PostgreSQL with Drizzle ORM
- **Schema Location**: `shared/schema.ts` for shared types, `shared/models/auth.ts` for auth tables
- **Migrations**: Drizzle Kit with `db:push` command for schema synchronization
- **Session Storage**: PostgreSQL-backed sessions via `connect-pg-simple`

### Authentication
- **Provider**: Replit Auth (OpenID Connect)
- **Session Management**: Express sessions with PostgreSQL store
- **User Storage**: Users table with Replit profile data (id, email, name, avatar)
- **Protection**: `isAuthenticated` middleware for protected routes

### Key Design Patterns
- **Shared Types**: Schema and route definitions in `shared/` directory are used by both client and server
- **Type-Safe API**: Zod schemas validate request/response data with shared type inference
- **Storage Abstraction**: `IStorage` interface in `server/storage.ts` allows database implementation swapping
- **Component Library**: shadcn/ui components in `client/src/components/ui/` with consistent styling

### Project Structure
```
├── client/           # React frontend
│   └── src/
│       ├── components/   # UI components and layout
│       ├── hooks/        # React Query hooks for API calls
│       ├── pages/        # Route pages (dashboard, onboarding, records)
│       └── lib/          # Utilities and query client
├── server/           # Express backend
│   ├── replit_integrations/  # Auth, audio, image utilities
│   └── storage.ts    # Database operations
├── shared/           # Shared types and schemas
│   ├── schema.ts     # Drizzle tables and Zod schemas
│   └── routes.ts     # API route definitions
└── migrations/       # Drizzle migrations output
```

## External Dependencies

### Database
- **PostgreSQL**: Primary database, connection via `DATABASE_URL` environment variable
- **Drizzle ORM**: Type-safe database operations with automatic migrations

### Authentication
- **Replit Auth**: OpenID Connect provider for user authentication
- **Required Environment Variables**: `ISSUER_URL`, `REPL_ID`, `SESSION_SECRET`, `DATABASE_URL`

### Third-Party Libraries
- **Radix UI**: Accessible UI primitives for shadcn/ui components
- **TanStack Query**: Server state management with caching
- **date-fns**: Date formatting for records display
- **Framer Motion**: Animation library for wizard transitions
- **Zod**: Runtime type validation for API contracts