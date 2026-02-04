# Academic Management System

A modern school management system built with TypeScript, tRPC, React 19, and Drizzle ORM in a pnpm + Turborepo monorepo.

## Tech Stack

### Monorepo

- **Package Manager**: pnpm 10.x
- **Build System**: Turborepo 2.8.x
- **Runtime**: Node.js >=24.13.0

### Backend

- **Framework**: Express
- **API Layer**: tRPC for end-to-end type safety
- **Database**: PostgreSQL 18.1 (via Docker)
- **ORM**: Drizzle ORM
- **Build Tool**: tsup
- **Runtime**: Node.js with TypeScript

### Frontend

- **Framework**: React 19
- **Build Tool**: Vite
- **State Management**: TanStack Query (React Query)
- **Forms**: react-hook-form with Zod validation
- **Charts**: Recharts
- **Type Safety**: End-to-end via tRPC

### Shared

- **Type System**: TypeScript 5.9.x
- **Schema Validation**: Zod
- **Code Quality**: ESLint + Prettier

## Project Structure

```
academic-management-system/
├── packages/
│   ├── common/              # Shared types and schemas (Zod)
│   ├── backend/             # Express + tRPC API server
│   │   └── src/
│   │       ├── entities/    # Package-by-entity architecture
│   │       │   └── student/ # Student entity (model, service, router)
│   │       ├── server.ts    # Express server setup
│   │       └── index.ts     # Entry point
│   └── frontend/            # React 19 + Vite frontend
│       └── src/
│           ├── App.tsx      # Main app with tRPC client
│           └── main.tsx     # Entry point
├── infra/
│   ├── docker-compose.dev.yml  # PostgreSQL + pgAdmin
│   ├── .env.example           # Environment variables template
│   └── init/sql/              # Database initialization scripts
├── turbo.json               # Turborepo configuration
├── pnpm-workspace.yaml      # pnpm workspace configuration
├── tsconfig.base.json       # Base TypeScript config
└── package.json             # Root package.json with scripts
```

## Quick Start

### Prerequisites

- Node.js >= 24.13.0
- pnpm 10.x
- Docker & Docker Compose

### Installation

1. **Install dependencies**:

   ```bash
   pnpm install
   ```

2. **Start infrastructure (PostgreSQL)**:

   ```bash
   pnpm infra:up
   ```

3. **Run development servers**:

   Run all services:

   ```bash
   pnpm dev
   ```

   Or run individually:

   ```bash
   # Backend only (port 4000)
   pnpm dev:backend

   # Frontend only (port 3000)
   pnpm dev:frontend
   ```

4. **Access the application**:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:4000
   - Health Check: http://localhost:4000/health
   - tRPC Endpoint: http://localhost:4000/trpc

### Database Management

```bash
# Start database
pnpm infra:up

# Stop database
pnpm infra:down

# View database logs
pnpm infra:logs

# Access pgAdmin (optional)
docker compose -f infra/docker-compose.dev.yml --profile tools up -d
# Then visit http://localhost:5050
```

### Available Scripts

```bash
# Development
pnpm dev              # Run all packages in dev mode
pnpm dev:backend      # Run backend only
pnpm dev:frontend     # Run frontend only

# Building
pnpm build            # Build all packages

# Code Quality
pnpm lint             # Lint all packages
pnpm type-check       # TypeScript type checking
pnpm format           # Format code with Prettier
pnpm format:check     # Check code formatting

# Cleanup
pnpm clean            # Clean all build outputs and node_modules

# Infrastructure
pnpm infra:up         # Start Docker services
pnpm infra:down       # Stop Docker services
pnpm infra:logs       # View Docker logs
```

## Features

### End-to-End Type Safety

- Shared Zod schemas in `packages/common`
- TypeScript types inferred from Zod schemas
- tRPC provides compile-time type safety from backend to frontend
- No manual type synchronization needed

### Package-by-Entity Architecture

Backend code is organized by entity (e.g., `student`):

```
entities/student/
├── model.ts      # Drizzle ORM table definition
├── service.ts    # Business logic
└── router.ts     # tRPC router endpoints
```

### Database Schema

- Drizzle ORM for type-safe database queries
- PostgreSQL 18.1 running in Docker
- Schema migrations via Drizzle Kit

```bash
# Generate migrations
pnpm --filter @academic/backend db:generate

# Run migrations
pnpm --filter @academic/backend db:migrate

# Open Drizzle Studio (GUI)
pnpm --filter @academic/backend db:studio
```

## Environment Variables

Copy `infra/.env.example` to `infra/.env` and adjust as needed:

```env
POSTGRES_USER=admin
POSTGRES_PASSWORD=admin123
POSTGRES_DB=academic_db
DATABASE_URL=postgresql://admin:admin123@localhost:5432/academic_db
```

## Development Workflow

1. **Define shared types** in `packages/common/src/index.ts` using Zod
2. **Create Drizzle models** in `packages/backend/src/entities/{entity}/model.ts`
3. **Implement services** in `packages/backend/src/entities/{entity}/service.ts`
4. **Create tRPC routers** in `packages/backend/src/entities/{entity}/router.ts`
5. **Use in frontend** with full type safety via the tRPC client

Example:

```typescript
// In frontend components
import { trpc } from './App';

function MyComponent() {
  // Fully typed, autocomplete works!
  const { data: students } = trpc.students.list.useQuery();
  // ...
}
```

## Package Dependencies

Packages reference each other using workspace protocol:

```json
{
  "dependencies": {
    "@academic/common": "workspace:*"
  }
}
```

## License

MIT
