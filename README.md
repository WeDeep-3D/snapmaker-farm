# Snapmaker Farm

A management system for Snapmaker 3D printer farms, including a web-based frontend and a REST API backend.

## Tech Stack

| Component | Stack |
|---|---|
| **Frontend** | Vue 3 + Quasar Framework (Vite), Pinia, Vue Router, vue-i18n |
| **Backend** | Elysia (Bun), Drizzle ORM, PostgreSQL |
| **Package Manager** | Bun (workspaces) |

## Project Structure

```
snapmaker-farm/
├── packages/
│   ├── frontend/          # Vue 3 + Quasar SPA
│   └── backend/           # Elysia REST API
├── compose.dev.yaml       # PostgreSQL for development
├── package.json           # Bun workspaces root
└── bun.lock
```

## Prerequisites

- [Bun](https://bun.sh/) >= 1.0
- [Docker](https://www.docker.com/) (for development PostgreSQL)

## Getting Started

### 1. Install Dependencies

```bash
bun install
```

This installs dependencies for both frontend and backend via Bun workspaces.

### 2. Start the Database

```bash
bun run docker-dev:create
```

This starts a PostgreSQL 18 container with:
- Host: `localhost:5432`
- User / Password / Database: `app` / `app` / `app`

### 3. Configure the Backend

Create the environment file at `packages/backend/.env`:

```env
DATABASE_URL=postgresql://app:app@localhost:5432/app
```

Push the database schema:

```bash
bun run --cwd packages/backend migration:push
```

### 4. Start Development Servers

```bash
# Start backend (http://localhost:3000)
bun run dev:backend

# Start frontend (http://localhost:9000, in a separate terminal)
bun run dev:frontend
```

Or run them directly in each package directory:

```bash
cd packages/backend && bun run dev
cd packages/frontend && bun run dev
```

The backend serves OpenAPI docs at http://localhost:3000/openapi.

## Building for Production

### Frontend

```bash
bun run build:frontend
```

Build output is generated at `packages/frontend/dist/spa/`. The production build uses `/public/` as the base path, designed to be served by the backend's static file plugin.

### Deploy Frontend to Backend

Copy the frontend build output into the backend's static directory:

```bash
cp -r packages/frontend/dist/spa/* packages/backend/public/
```

The backend serves static files under the `/public` path via `@elysiajs/static`.

### Backend

Run the backend in production mode:

```bash
cd packages/backend
NODE_ENV=production bun run src/index.ts
```

Or compile to a standalone executable:

```bash
cd packages/backend
bun build --compile src/index.ts --outfile snapmaker-farm-backend
```

### Environment Variables

| Variable | Required | Default | Description |
|---|---|---|---|
| `DATABASE_URL` | Yes | - | PostgreSQL connection string |
| `HTTP_BASE_URL` | No | - | Base URL for frontend API requests |

## Available Scripts

### Root (convenience wrappers)

| Script | Description |
|---|---|
| `bun run dev:frontend` | Start frontend dev server |
| `bun run dev:backend` | Start backend dev server |
| `bun run build:frontend` | Build frontend for production |
| `bun run lint:frontend` | Lint frontend (ESLint) |
| `bun run lint:backend` | Lint backend (OxLint) |
| `bun run format:frontend` | Format frontend (Prettier) |
| `bun run format:backend` | Format backend (OxFmt) |
| `bun run docker-dev:create` | Create and start dev PostgreSQL |
| `bun run docker-dev:up` | Start existing dev PostgreSQL |
| `bun run docker-dev:stop` | Stop dev PostgreSQL |
| `bun run docker-dev:remove` | Stop and remove dev PostgreSQL (including data) |

### Backend (`packages/backend/`)

| Script | Description |
|---|---|
| `bun run dev` | Start with hot-reload and log formatting |
| `bun run lint` / `lint:fix` | Lint with OxLint |
| `bun run format` / `format:check` | Format with OxFmt |
| `bun run migration:generate` | Generate Drizzle migration files |
| `bun run migration:push` | Push schema changes to database |
| `bun run migration:pull` | Pull schema from database |

### Frontend (`packages/frontend/`)

| Script | Description |
|---|---|
| `bun run dev` | Start Quasar dev server |
| `bun run build` | Build for production |
| `bun run lint` | Lint with ESLint |
| `bun run format` | Format with Prettier |

## Database Management

The project uses [Drizzle ORM](https://orm.drizzle.team/) with PostgreSQL.

Schema is defined at `packages/backend/src/database/schema.ts`.

```bash
# Generate migration from schema changes
bun run --cwd packages/backend migration:generate

# Apply schema directly to database (development)
bun run --cwd packages/backend migration:push

# Pull current database schema
bun run --cwd packages/backend migration:pull
```

## Docker (Development)

The `compose.dev.yaml` at the project root provides a PostgreSQL instance for development:

```bash
bun run docker-dev:create    # First-time setup
bun run docker-dev:up        # Start
bun run docker-dev:stop      # Stop (preserves data)
bun run docker-dev:remove    # Stop and delete all data
```
