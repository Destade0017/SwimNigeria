---
kind: configuration_system
name: Environment & Runtime Configuration System
category: configuration_system
scope:
    - '**'
source_files:
    - .env.example
    - next.config.ts
    - src/lib/constants.ts
    - src/lib/supabase/env.ts
    - src/lib/supabase/client.ts
    - src/lib/supabase/server.ts
    - src/proxy.ts
    - vitest.config.ts
---

## Overview

SwimNigeria uses a layered configuration approach built on Next.js's built-in environment variable system, with a dedicated validation layer for Supabase credentials and a small set of in-memory constants for app identity and branding. There is no external config library (no `dotenv`, `conf`, `configstore`, YAML/TOML loaders); configuration is sourced directly from `process.env` and compiled into the bundle via Next.js's `NEXT_PUBLIC_*` convention.

## Key Files and Packages

- `.env.example` — template of all required environment variables; documents which are public (`NEXT_PUBLIC_*`) vs server-only (`SUPABASE_SERVICE_ROLE_KEY`, `RESEND_API_KEY`).
- `next.config.ts` — Next.js runtime configuration (React Strict Mode, dev origins).
- `src/lib/constants.ts` — in-memory app identity and brand color palette (`APP_CONFIG`, `BRAND_COLORS`, `getAppIdentity()`).
- `src/lib/supabase/env.ts` — central validation and resolution layer for Supabase public env vars and trusted origin.
- `src/lib/supabase/client.ts` — browser client factory using `@supabase/ssr`'s `createBrowserClient`.
- `src/lib/supabase/server.ts` — server client factory using `@supabase/ssr`'s `createServerClient` with cookie adapter.
- `src/proxy.ts` — Next.js 16 request interception proxy that delegates session refresh to `updateSession`.
- `vitest.config.ts` — test runner configuration (jsdom environment, `@` alias, include/exclude globs).
- `playwright.config.ts` — E2E runner configuration (not shown but present at repo root).

## Architecture and Conventions

### 1. Environment Variable Layering

Variables follow Next.js conventions:

- **Public variables** are prefixed `NEXT_PUBLIC_` so Next.js statically inlines them into browser bundles. These include `NEXT_PUBLIC_APP_URL`, `NEXT_PUBLIC_SITE_NAME`, `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `NEXT_PUBLIC_WHATSAPP_NUMBER`, `NEXT_PUBLIC_INSTAGRAM_HANDLE`, `NEXT_PUBLIC_CONTACT_EMAIL`.
- **Server-only secrets** have no `NEXT_PUBLIC_` prefix: `SUPABASE_SERVICE_ROLE_KEY`, `RESEND_API_KEY`, `CONTACT_RECIPIENT_EMAIL`. The comment in `.env.example` explicitly warns: "NEVER commit actual secrets or production keys to version control."

The `.env.example` file serves as the single source of truth for which variables exist; it is not loaded at runtime by the application code itself.

### 2. Validation-Centric Env Access

All Supabase-related env access goes through `src/lib/supabase/env.ts`:

- `validateSupabasePublicEnv(url?, anonKey?)` checks presence, rejects placeholder values (matches fragments like `your-project-ref`, `your-anon-key-placeholder`, `placeholder`, `<your-`, `example.com`), validates URL structure via `new URL()`, and enforces `http:`/`https:` protocols.
- On failure it throws `SupabaseConfigurationError`, a custom error class whose message includes `[SupabaseConfigurationError]` and actionable guidance referencing `.env.local`.
- `getSupabasePublicEnv()` is the single entry point used by both `client.ts` and `server.ts`; callers never read `process.env.NEXT_PUBLIC_SUPABASE_*` directly.
- `getTrustedAppOrigin(request?)` resolves the trusted redirect origin with priority: configured `NEXT_PUBLIC_APP_URL` → incoming request origin → fallback `http://localhost:3000`. It also rejects placeholder URLs and malformed protocols.

This pattern ensures every runtime path surfaces clear, non-secret error messages when configuration is missing or incomplete.

### 3. Client Factory Pattern

Both browser and server Supabase clients are created through factories that delegate credential resolution to `getSupabasePublicEnv()`:

- `createClient()` in `client.ts` calls `createBrowserClient(url, anonKey)` from `@supabase/ssr`.
- `createClient()` in `server.ts` calls `createServerClient(url, anonKey, { cookies })` with a cookie adapter implementing `getAll()` / `setAll()` backed by `next/headers` `cookies()`.

Both factories document (via JSDoc) that they use only public anonymous credentials and do not import or expose `SUPABASE_SERVICE_ROLE_KEY`.

### 4. Request Interception Proxy

`src/proxy.ts` implements Next.js 16's new `proxy` export (replacing `middleware.ts`). It delegates to `updateSession()` from `@/lib/supabase/proxy` and applies a matcher that excludes static assets (`_next/static`, `_next/image`, favicon, robots, sitemap, common static extensions). The comment states it does NOT enforce route protection in Phase 5.1 — protection is reserved for Phase 5.5.

### 5. In-Memory Constants

`src/lib/constants.ts` holds immutable app metadata and brand colors as `as const` objects. This is separate from env-driven configuration and represents compile-time defaults rather than runtime overrides.

### 6. Test Configuration

`vitest.config.ts` sets up jsdom, enables globals, registers `./src/__tests__/setup.ts` as a setup file, aliases `@` to `./src`, and scopes tests to `src/**/*.{test,spec}.{ts,tsx}` while excluding `e2e/**`, `node_modules/**`, `.next/**`.

## Conventions and Constraints

- **No external config library**: All env access is direct `process.env` reads inside the validation layer; there is no `dotenv` dependency or dynamic config loader.
- **Placeholders are rejected at runtime**: Values matching known placeholder fragments from `.env.example` cause `SupabaseConfigurationError` to be thrown before any network call is made.
- **Secrets never leave server context**: Server-side client factories explicitly avoid importing `SUPABASE_SERVICE_ROLE_KEY`; only `NEXT_PUBLIC_SUPABASE_ANON_KEY` is exposed to the browser.
- **URLs must be valid HTTP(S)**: Both `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_APP_URL` are parsed with `new URL()` and restricted to `http:`/`https:` protocols.
- **Trusted origin fallback**: If neither configured app URL nor request origin is valid, `getTrustedAppOrigin` falls back to `http://localhost:3000`.
- **Cookie mutation safety**: Server-side cookie writes catch `ReadonlyRequestCookiesError` (and messages containing `Cookies can only be modified in a Server Action or Route Handler`) because RSC rendering has a read-only cookie store; unrelated errors are rethrown.
- **Proxy matcher excludes static assets**: The default export `config.matcher` regex skips `_next/static`, `_next/image`, `favicon.ico`, `robots.txt`, `sitemap.xml`, and common static file extensions.
- **Next.js build config is minimal**: `next.config.ts` only sets `reactStrictMode: true` and `allowedDevOrigins` for local development IPs.
- **Test setup polyfills HTMLDialogElement**: The Vitest setup file patches `showModal`/`close` on `HTMLDialogElement` if absent in jsdom.