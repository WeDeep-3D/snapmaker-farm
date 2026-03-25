# AGENTS.md

## Project Overview

Snapmaker Farm is a Bun workspace monorepo for managing Snapmaker 3D printer farms.

The repository contains:
- a web frontend for operators
- a REST API backend
- PostgreSQL-backed business data storage
- direct integration with Snapmaker devices over the local network

The most developed end-to-end workflow in the current codebase is device discovery and management:
- define regions
- scan local network ranges for devices
- inspect recognized devices
- bind/unbind devices to the farm
- download device logs

Project and plate management APIs already exist on the backend, but the frontend for those areas is still partial compared with the device workflow.

---

## Repository Layout

```text
snapmaker-farm/
├─ package.json              # Root Bun workspace scripts
├─ bun.lock
├─ compose.dev.yaml          # Local PostgreSQL container for development
├─ README.md
├─ AGENTS.md
└─ packages/
   ├─ frontend/              # Vue 3 + Quasar SPA
   └─ backend/               # Elysia + Drizzle REST API
```

### Workspace Structure

The root `package.json` uses Bun workspaces:

```json
{
  "workspaces": [
    "packages/*"
  ]
}
```

There is no Turbo or pnpm workspace configuration in this repository.

---

## Tech Stack

### Frontend
- Vue 3
- TypeScript
- Quasar Framework (Vite-based)
- Vue Router
- Pinia
- `pinia-plugin-persistedstate`
- `vue-i18n`
- `@elysiajs/eden` for typed API calls

### Backend
- Bun
- TypeScript
- Elysia
- `@elysiajs/openapi`
- `@elysiajs/static`
- `@elysiajs/cors`
- Drizzle ORM
- Drizzle Kit
- PostgreSQL

### Device Integration
- HTTP requests to Snapmaker/Moonraker-like endpoints on port `7125`
- WebSocket support for device state tracking exists in backend code
- Some frontend flows also talk directly to device HTTP endpoints instead of only going through the backend

---

## What the Product Does

At a high level, Snapmaker Farm is a management system for physical Snapmaker devices on a LAN.

### Main business areas currently present in the codebase
- **Regions**: logical grouping for devices
- **Device scanning**: scan IP ranges and recognize reachable devices
- **Device binding**: associate devices with the current farm/backend instance
- **Device monitoring data**: fetch live printer information from devices
- **Device log download**: collect logs from device storage and stream them as ZIP
- **Projects**: backend CRUD exists; frontend is not yet fully built out
- **Plates**: backend CRUD exists; frontend is not yet fully built out

### Important architecture characteristic
This project is not only a CRUD app backed by PostgreSQL. It also manages real devices.

The backend stores canonical business records in PostgreSQL, but many device operations involve live communication with printers:
- checking device availability by IP
- reading printer/system info
- uploading or deleting binding files on devices
- listing and downloading files from device storage

---

## Frontend Architecture

Root package:
- `packages/frontend/package.json`

App config:
- `packages/frontend/quasar.config.ts`

Source root:
- `packages/frontend/src/`

### Frontend Directory Highlights

```text
packages/frontend/src/
├─ App.vue
├─ boot/
│  ├─ bus.ts
│  ├─ eden.ts
│  └─ i18n.ts
├─ components/
│  ├─ LocaleButton.vue
│  ├─ ThemeButton.vue
│  └─ devices/
├─ composables/
│  └─ devices/
├─ i18n/
│  ├─ en-US/
│  └─ zh-CN/
├─ layouts/
│  ├─ MainLayout.vue
│  ├─ headers/
│  └─ drawers/
├─ pages/
│  ├─ ErrorNotFound.vue
│  └─ main/
├─ router/
├─ stores/
│  ├─ scans/
│  └─ settings/
└─ utils/
```

### Frontend Entry and Routing

Key files:
- `packages/frontend/src/App.vue`
- `packages/frontend/src/router/index.ts`
- `packages/frontend/src/router/routes.ts`
- `packages/frontend/src/layouts/MainLayout.vue`

Notes:
- Quasar owns the actual bootstrap process.
- `App.vue` is the root component.
- Router mode is currently `hash` in `quasar.config.ts`.
- Main route family is under `/main`.
- The app uses named views to compose page content, header, and drawers.

Important routes:
- `/main/dashboard`
- `/main/devices`
- `/main/projects`
- fallback `404` route

### Layout Pattern

`MainLayout.vue` is the UI shell.

It renders named router views for:
- `header`
- `leftDrawer`
- `default`
- `rightDrawer`
- `footer`

This means each route can swap not only the page body but also drawer/header content.

### State Management

Key files:
- `packages/frontend/src/stores/index.ts`
- `packages/frontend/src/stores/settings/index.ts`
- `packages/frontend/src/stores/scans/index.ts`

Current stores:
- `settings`: dark mode and locale
- `scans`: IP ranges used during scan workflow

Pinia persistence is enabled, so user preferences and scan inputs survive reloads.

### Internationalization

Key files:
- `packages/frontend/src/boot/i18n.ts`
- `packages/frontend/src/i18n/index.ts`
- `packages/frontend/src/i18n/zh-CN/index.ts`
- `packages/frontend/src/i18n/en-US/index.ts`

Notes:
- Default locale is `zh-CN`
- `en-US` is also present
- The helper in `packages/frontend/src/utils/common.ts` provides scoped translation access via `i18nSubPath(...)`

### API Access from Frontend

Key files:
- `packages/frontend/src/boot/eden.ts`
- `packages/frontend/src/composables/devices/regionsApi/index.ts`
- `packages/frontend/src/composables/devices/scansApi/index.ts`

The frontend uses Eden treaty client for typed backend calls.

Development default base URL behavior:
- if `HTTP_BASE_URL` is provided, use it
- otherwise, in dev mode, frontend defaults to `http://localhost:3000`

### Device UI Workflow

The device flow is the strongest implemented frontend area.

Key files include:
- `packages/frontend/src/pages/main/DevicesPage.vue`
- `packages/frontend/src/layouts/drawers/devices/AddDevicesDrawer.vue`
- `packages/frontend/src/components/devices/ScanRegionPanel.vue`
- `packages/frontend/src/components/devices/ScanRangesPanel.vue`
- `packages/frontend/src/components/devices/ScanResultPanel.vue`
- `packages/frontend/src/components/devices/ScanResultGridView.vue`
- `packages/frontend/src/components/devices/ScanResultListView.vue`
- `packages/frontend/src/components/devices/AddRegionDialog.vue`

The intended operator flow is roughly:
1. open the device page
2. choose or create a region
3. enter scan ranges
4. request a scan
5. poll scan progress
6. inspect recognized devices
7. perform follow-up actions such as file upload or log download

### Frontend Maturity Notes

Do not assume the whole frontend is equally complete.

Areas that are clearly more mature:
- device scan workflow
- region creation and selection
- theme/locale switching

Areas that appear partial or placeholder-like:
- dashboard page
- projects page UI
- some device details / list panels
- some drawer content

When working on frontend tasks, inspect the actual component before assuming a feature already exists.

---

## Backend Architecture

Root package:
- `packages/backend/package.json`

Source root:
- `packages/backend/src/`

Entry point:
- `packages/backend/src/index.ts`

### Backend Directory Highlights

```text
packages/backend/src/
├─ index.ts
├─ log.ts
├─ api/
│  └─ snapmaker/
├─ database/
│  ├─ index.ts
│  └─ schema.ts
├─ modules/
│  ├─ devices/
│  ├─ plates/
│  ├─ projects/
│  ├─ regions/
│  └─ scans/
└─ utils/
```

### Application Setup

`packages/backend/src/index.ts` is responsible for:
- creating the Elysia app
- validating required environment variables
- enabling OpenAPI docs
- enabling static file serving for frontend assets under `/public`
- enabling CORS
- mounting all business modules
- listening on port `3000`

Mounted backend modules:
- `regions`
- `devices`
- `plates`
- `projects`
- `scans`

OpenAPI docs are exposed at:
- `http://localhost:3000/openapi`

### Common Module Pattern

Most modules follow this structure:
- `index.ts` — route definitions
- `model.ts` — request/response schema definitions
- `service.ts` — business logic
- `repository.ts` — database access

This pattern exists in at least:
- `modules/regions`
- `modules/devices`
- `modules/projects`
- `modules/plates`

The `scans` module is slightly different because it manages in-memory scanning tasks rather than normal CRUD only.

---

## Backend Business Modules

### Regions

Key files:
- `packages/backend/src/modules/regions/index.ts`
- `packages/backend/src/modules/regions/service.ts`
- `packages/backend/src/modules/regions/repository.ts`

Purpose:
- CRUD for region records
- regions are used to organize devices

API prefix:
- `/api/v1/regions`

### Devices

Key files:
- `packages/backend/src/modules/devices/index.ts`
- `packages/backend/src/modules/devices/model.ts`
- `packages/backend/src/modules/devices/service.ts`
- `packages/backend/src/modules/devices/repository.ts`
- `packages/backend/src/modules/devices/utils.ts`
- `packages/backend/src/modules/devices/constants.ts`

Purpose:
- list devices, optionally filtered by region
- create/bind devices
- remove/unbind devices
- download device logs

API prefix:
- `/api/v1/devices`

Important behavior:
- device creation is not just a DB insert
- the backend checks and writes a binding file on the physical device
- device removal also attempts to clean up the device-side binding file
- device listing enriches DB records with live `printerInfo`

Current device endpoints:
- `GET /api/v1/devices/`
- `POST /api/v1/devices/`
- `DELETE /api/v1/devices/:id`
- `GET /api/v1/devices/:id/logs`

### Scans

Key files:
- `packages/backend/src/modules/scans/index.ts`
- `packages/backend/src/modules/scans/model.ts`
- `packages/backend/src/modules/scans/service.ts`
- `packages/backend/src/modules/scans/helper.ts`
- `packages/backend/src/modules/scans/utils.ts`

Purpose:
- accept IP ranges
- schedule LAN scans
- check whether device port `7125` is open
- identify devices via live API calls
- expose scan progress and recognized device data

API prefix:
- `/api/v1/scans`

Important behavior:
- this module is task-oriented and uses in-memory scan state
- it is not a simple database CRUD module
- the frontend polls scan progress after creating a scan

### Projects

Key files:
- `packages/backend/src/modules/projects/index.ts`
- `packages/backend/src/modules/projects/service.ts`
- `packages/backend/src/modules/projects/repository.ts`

Purpose:
- CRUD for projects

API prefix:
- `/api/v1/projects`

### Plates

Key files:
- `packages/backend/src/modules/plates/index.ts`
- `packages/backend/src/modules/plates/service.ts`
- `packages/backend/src/modules/plates/repository.ts`

Purpose:
- CRUD for plate records and related production data

API prefix:
- `/api/v1/plates`

---

## Device Communication Layer

Key files:
- `packages/backend/src/api/snapmaker/index.ts`
- `packages/backend/src/api/snapmaker/types.ts`
- `packages/backend/src/modules/devices/snapmaker/index.ts`
- `packages/backend/src/modules/devices/snapmaker/types.ts`

### HTTP-Level Device Integration

The backend wraps device HTTP APIs for operations such as:
- getting Moonraker info
- getting printer info
- getting system info
- listing roots/files
- downloading files
- uploading files
- deleting files

The device base URL pattern is:
- `http://<ip>:7125`

### WebSocket-Level Device Integration

The backend also contains a `SnapmakerDevice` abstraction that can connect to:
- `ws://<ip>:7125/websocket`

It tracks device runtime state such as:
- `klippyState`
- `printState`

This is important context when adding real-time features, even if not every current route uses the WebSocket path directly.

---

## Database Model

Key files:
- `packages/backend/src/database/index.ts`
- `packages/backend/src/database/schema.ts`
- `packages/backend/drizzle.config.ts`

### Database Stack
- PostgreSQL
- Drizzle ORM
- Drizzle Kit

### Core Tables Present in Schema
- `farm_metadata`
- `devices`
- `regions`
- `projects`
- `plates`
- `filaments`
- `plate_related_filaments`

### Important Schema Notes
- `farm_metadata` stores farm-level metadata used to generate the binding fingerprint for devices
- `devices` stores both persistent identity data and relational links such as region/project/plate
- `device_model` enum currently includes `Snapmaker:U1`
- filament-related tables exist in schema even though no dedicated API module for them was found yet

### Migration Notes

Useful backend scripts:
- `migration:generate`
- `migration:check`
- `migration:push`
- `migration:pull`

At the time this file was written, the repository exposed Drizzle config and migration scripts, but no checked-in `packages/backend/drizzle/` migration output directory was present.

---

## Request / Data Flow Summary

### Device Scan Flow
1. frontend submits IP ranges to `POST /api/v1/scans`
2. backend expands ranges and checks reachability on port `7125`
3. backend calls device APIs to recognize Snapmaker devices
4. frontend polls `GET /api/v1/scans/:scanId`
5. recognized devices are displayed in scan result components

### Device Bind Flow
1. frontend submits device data to `POST /api/v1/devices`
2. backend chooses an available device IP
3. backend checks existing binding file on device
4. backend writes/overwrites the binding file if allowed
5. backend upserts the device record in PostgreSQL
6. backend attempts rollback if DB write fails after device-side mutation

### Device Listing Flow
1. backend loads device rows from PostgreSQL
2. backend resolves usable IP addresses
3. backend fetches live printer info from devices
4. backend returns combined business + runtime data

### Log Download Flow
1. frontend requests device logs from backend
2. backend lists log files on the device
3. backend downloads files
4. backend packages them as ZIP stream
5. frontend downloads the archive

---

## Local Development Workflow

## Prerequisites
- Bun
- Docker

### Install Dependencies

From repo root:

```bash
bun install
```

### Start Development Database

```bash
bun run docker-dev:create
```

This uses `compose.dev.yaml` to start PostgreSQL 18 with:
- host: `localhost:5432`
- database: `app`
- user: `app`
- password: `app`

### Backend Environment

The backend expects at least:

```env
DATABASE_URL=postgresql://app:app@localhost:5432/app
```

Relevant file:
- `packages/backend/.env`

### Push Database Schema

From repo root:

```bash
bun run migration:push
```

Or directly:

```bash
bun run --cwd packages/backend migration:push
```

### Start Backend

```bash
bun run dev:backend
```

Backend default URL:
- `http://localhost:3000`

### Start Frontend

```bash
bun run dev:frontend
```

Frontend dev URL is described in README as:
- `http://localhost:9000`

### Production Frontend Build

```bash
bun run build:frontend
```

Build output:
- `packages/frontend/dist/spa/`

To serve frontend from backend static hosting, copy build output into:
- `packages/backend/public/`

The backend serves frontend assets under:
- `/public`

---

## Useful Commands

### Root Commands
- `bun run dev:frontend`
- `bun run dev:backend`
- `bun run build:frontend`
- `bun run lint:frontend`
- `bun run lint:backend`
- `bun run format:frontend`
- `bun run format:backend`
- `bun run docker-dev:create`
- `bun run docker-dev:remove`
- `bun run docker-dev:recreate`
- `bun run migration:push`

### Backend Commands
- `bun run --cwd packages/backend dev`
- `bun run --cwd packages/backend lint`
- `bun run --cwd packages/backend format`
- `bun run --cwd packages/backend migration:generate`
- `bun run --cwd packages/backend migration:push`
- `bun run --cwd packages/backend migration:pull`

### Frontend Commands
- `bun run --cwd packages/frontend dev`
- `bun run --cwd packages/frontend build`
- `bun run --cwd packages/frontend lint`
- `bun run --cwd packages/frontend format`

---

## Important Notes for Future Agents

### 1. Device Management Is the Primary Implemented Workflow
If you need the most complete example of current business behavior, start with:
- frontend device components and composables
- backend `devices`, `scans`, and `regions` modules

### 2. Frontend Uses Both Backend APIs and Direct Device Requests
Do not assume every action is proxied through the backend.
Some UI actions talk directly to device HTTP endpoints on port `7125`.

### 3. Backend Modules Mix DB Logic and Real Device Side Effects
Especially in the `devices` module, actions can mutate both:
- PostgreSQL state
- physical device state

Be careful when refactoring device flows because these are compensating-action workflows, not simple transaction-only CRUD.

### 4. Project / Plate Backend Exists Ahead of Frontend Completion
Do not assume the frontend fully covers all backend capabilities.
Inspect backend modules first when adding project- or plate-related UI features.

### 5. Frontend Types Often Come From Eden/Treaty Inference
Many frontend types are derived from backend route definitions instead of being maintained as independent handwritten domain models.
Check composable `types.ts` files and `boot/eden.ts` before creating duplicate interfaces.

### 6. Named Views Matter in the Frontend Layout
When editing navigation or page composition, remember that routes provide multiple named components, not just a single page component.

### 7. README vs Root Scripts
At the time this file was written, the README mentioned `docker-dev:up` and `docker-dev:stop`, but the root `package.json` only defined:
- `docker-dev:create`
- `docker-dev:remove`
- `docker-dev:recreate`

Always trust the current `package.json` over stale documentation if they differ.

---

## Recommended Starting Points by Task Type

### If the task is about device scanning
Start with:
- `packages/frontend/src/composables/devices/scansApi/index.ts`
- `packages/frontend/src/components/devices/ScanResultPanel.vue`
- `packages/backend/src/modules/scans/service.ts`
- `packages/backend/src/modules/scans/utils.ts`

### If the task is about device binding or logs
Start with:
- `packages/backend/src/modules/devices/service.ts`
- `packages/backend/src/modules/devices/repository.ts`
- `packages/backend/src/api/snapmaker/index.ts`
- `packages/frontend/src/components/devices/ScanResultGridView.vue`
- `packages/frontend/src/components/devices/ScanResultListView.vue`

### If the task is about regions
Start with:
- `packages/frontend/src/composables/devices/regionsApi/index.ts`
- `packages/frontend/src/components/devices/AddRegionDialog.vue`
- `packages/backend/src/modules/regions/index.ts`

### If the task is about frontend structure/navigation
Start with:
- `packages/frontend/src/router/routes.ts`
- `packages/frontend/src/layouts/MainLayout.vue`
- `packages/frontend/src/layouts/headers/MainHeader.vue`
- `packages/frontend/src/layouts/drawers/`

### If the task is about database/schema
Start with:
- `packages/backend/src/database/schema.ts`
- `packages/backend/drizzle.config.ts`
- relevant module `repository.ts`

---

## Quick Orientation Summary

If you only remember a few things about this repo, remember these:
- this is a Bun workspace with `frontend` and `backend`
- the product manages real Snapmaker devices, not just database records
- the device workflow is the most complete part of the app today
- the backend serves both API routes and built frontend static files
- PostgreSQL + Drizzle is the persistence layer
- direct device communication on port `7125` is a core part of the system
