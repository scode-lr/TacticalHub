# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**TacticalHub** is a multi-club sports management platform (Angular 21 + Ionic 8) where multiple clubs coexist and users can belong to several clubs with different roles. Roles: **Admin (1)** — club coordinators, **Coach (2)** — team coaches, **Viewer (3)** — parents/players, **Guest (4)** — unauthenticated club visitors.

There is a secondary app, **VoltregaCF**, sharing the same codebase via Angular's multi-project setup.

## Commands

```bash
npm start                        # Dev server on port 4200
npm run build                    # Production build (TacticalHub)
npm run build:voltregacf:prod    # Production build (VoltregaCF)
npm test                         # Run Karma/Jasmine tests
npm run lint                     # ESLint check
npm run lint:fix                 # ESLint auto-fix

# Mobile
npm run ios:tactical             # Build + Capacitor sync + open Xcode
npm run android:tactical         # Build + Capacitor sync + open Android Studio
npm run cap:tactical:sync        # Sync all platforms without opening IDE
```

## Architecture

### Multi-Project Monorepo
- `angular.json` defines two projects: `app` (TacticalHub) and `voltregacf.hub`
- TacticalHub builds to `projects/tactical.hub/www`
- Shared assets in `projects/shared/assets/`; app-specific in `projects/tactical.hub/assets/`
- App ID: `com.tactical.hub`; dev API: `https://api-dev.tactical.hub`

### Routing & Role-Based Navigation
Routes are role-segmented by a number prefix that doubles as the `roleId` URL param:

```
/auth/*              — public (authGuard with requiresAuth: false)
/app/1/:roleId/*     — Admin pages  (RoleType.Admin = 1)
/app/3/:roleId/*     — Viewer pages (RoleType.Viewer = 3)
/app/4/:clubId/*     — Guest pages  (RoleType.Guest = 4)
/teams/*             — Team selection/join/invitation
```

Guards: `authGuard` checks in-memory token + stored user; `roleAccessGuard` validates RoleType matches the route prefix.

`NavigationService` wraps the Angular Router and extracts the current `roleId` from URL params.

### State Management
No NgRx. State is managed via:
- **Angular Signals** — `AuthService`, `TokenService`, `NotificationsService` expose `signal()`-based reactive state
- **RxJS Observables** — service calls and async coordination (e.g., concurrent 401 queuing)
- **`StorageService`** — thin `localStorage` wrapper using typed keys from `core/constants/storage-keys.ts`

### Authentication & Token Security
- **Access token**: stored in-memory only (`TokenService` signal) — never in `localStorage`/`sessionStorage`
- **Refresh token**: HttpOnly cookie (server-managed, never JS-accessible)
- All HTTP requests use `withCredentials: true`
- `AuthService.initializeAuth()` runs as `APP_INITIALIZER` — restores user from `localStorage`, attempts silent refresh via cookie, clears session on failure
- `TokenService` coordinates concurrent 401s with a `BehaviorSubject` queue: multiple in-flight requests wait for one refresh rather than all triggering simultaneously
- `authInterceptor` handles the 401 → refresh → retry flow; signs out and redirects on failure

### Component Patterns
All components and pages are **standalone** (no NgModules). Key conventions:
- `pages/` — feature pages, lazy-loaded via `loadComponent()` / `loadChildren()`
- `components/` — reusable UI components, all exported from `components/index.ts`
- `core/services/` — injectable services (business logic, API calls, state)
- `core/models/` — TypeScript interfaces and enums
- `core/requests/` / `core/responses/` — typed API DTOs

### i18n
- Custom `TranslationService` (not Angular's built-in i18n)
- Use the `TranslatePipe` in templates: `{{ 'key' | translate }}`
- Supported languages: `en`, `es`, `ca` (configured in `environment.ts`)

### Path Aliases (tsconfig.json)
```
@environment    → src/environments/environment
@services/*     → src/app/core/services/*
@components/*   → src/app/components/*
@pages/*        → src/app/pages/*
@core/*         → src/app/core/*
@models/*       → src/app/core/models/*
@pipes/*        → src/app/core/pipes/*
@directives/*   → src/app/core/directives/*
@assets/*       → src/assets/*
@shared/*       → src/app/shared/*
@mocks/*        → src/mocks/*
```

### Key Libraries
- **Ionic 8** — mobile navigation, UI primitives, `IonicRouteStrategy` (route caching), animations
- **PrimeNG 21** with Aura theme — enterprise UI components (dark mode disabled: `darkModeSelector: false`)
- **Capacitor 7** — native iOS/Android packaging
- `provideIonicAngular()` disables nav animation on desktop (custom config in `app.config.ts`)
