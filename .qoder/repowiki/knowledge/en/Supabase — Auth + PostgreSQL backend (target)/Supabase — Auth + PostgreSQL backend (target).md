---
kind: external_dependency
name: Supabase — Auth + PostgreSQL backend (target)
slug: supabase
category: external_dependency
category_hints:
    - vendor_identity
    - auth_protocol
scope:
    - '**'
source_files:
    - .env.example
    - package.json
    - src/lib/supabase/client.ts
    - src/lib/supabase/server.ts
---

### Identity
Supabase (PostgreSQL + Auth) is the planned backend for SwimNigeria.

### Role in this repo
- `@supabase/ssr` provides two factories: `createBrowserClient` (client.ts, browser-only, anon key only) and `createServerClient` (server.ts, Next.js App Router RSC/Route Handler/Server Action).
- Only public anon credentials are used from both clients; `SUPABASE_SERVICE_ROLE_KEY` exists in `.env.example` but is not imported by these clients.

### Integration shape
- Public env vars: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
- Service-role secret: `SUPABASE_SERVICE_ROLE_KEY` (reserved for server-side admin operations).
- Session state is stored in HttpOnly, Secure, SameSite cookies managed by `@supabase/ssr`; no localStorage/sessionStorage usage.

### Direction
Phase 1 scaffolding has no business features or migrations yet; Phase 5 targets SSR HttpOnly cookie auth on top of this setup.