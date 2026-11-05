---
kind: error_handling
name: Error Handling in SwimNigeria Next.js Platform
category: error_handling
scope:
    - '**'
source_files:
    - src/lib/supabase/env.ts
    - src/lib/supabase/redirect.ts
    - src/lib/validation/auth.ts
    - src/app/login/actions.ts
    - src/app/register/actions.ts
    - src/app/auth/callback/route.ts
---

## Approach

The SwimNigeria codebase uses a layered, explicit error-handling model built around three pillars:

1. **Zod schema validation** for all user-facing input (registration, login, forgot-password, reset-password).
2. **A single custom error class `SupabaseConfigurationError`** for environment/configuration failures.
3. **Server Actions + route handlers** that catch errors, log them server-side via `console.error`, and return structured, user-safe result objects — never raw exceptions or stack traces to the client.

There is no global error middleware, no centralized error-reporting SDK, and no `throw`-based domain error hierarchy beyond `SupabaseConfigurationError`. Errors are handled locally at each boundary.

## Key Files

- `src/lib/supabase/env.ts` — defines `SupabaseConfigurationError` and validates `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY`; throws on missing, empty, placeholder, or malformed values.
- `src/lib/supabase/redirect.ts` — `sanitizeRedirectUrl(candidate, trustedOrigin, fallback)`; rejects open redirects, protocol-relative paths (`//evil.com`), backslash tricks, unsafe schemes (`javascript:`, `data:`), control characters, and CRLF injection.
- `src/lib/validation/auth.ts` — Zod schemas (`registerSchema`, `loginSchema`, `forgotPasswordSchema`, `resetPasswordSchema`) plus per-action field-error shape types (`RegisterFieldErrors`, `LoginFieldErrors`, etc.).
- `src/app/login/actions.ts` — `loginLearner` / `loginLearnerAction` / `logoutLearnerAction`.
- `src/app/register/actions.ts` — `registerLearner` / `registerLearnerAction`.
- `src/app/forgot-password/actions.ts` — forgot-password and reset-password flows (same pattern).
- `src/app/auth/callback/route.ts` — PKCE code exchange route handler.

## Architecture & Conventions

### 1. Validation-first errors
Every Server Action starts with `schema.safeParse(rawInput)`. On failure it flattens the Zod error into a field-specific object and returns `{ success: false, errors: { ... } }`. This is the only path where field-level messages reach the UI; there is no generic `throw new Error(...)` from these actions.

### 2. Custom configuration error type
`SupabaseConfigurationError extends Error` is the only domain error class in the repo. It is thrown by `validateSupabasePublicEnv` when Supabase env vars are missing, contain placeholders (e.g. `your-project-ref`, `your-anon-key-placeholder`), or have an invalid URL/protocol. Callers catch it explicitly:

```ts
catch (err) {
  if (err instanceof SupabaseConfigurationError) {
    // return safe "service temporarily unavailable" response
  }
}
```

This pattern is repeated in `login/actions.ts`, `register/actions.ts`, and `forgot-password/actions.ts`.

### 3. Structured result objects instead of throws
Server Actions return typed result interfaces rather than throwing:

- `LoginActionResult`: `{ success, redirectTo?, isUnverified?, email?, errors? }`
- `RegisterActionResult`: `{ success, email?, fullName?, errors? }`
- `LogoutActionResult`: `{ success, error? }`

Callers (pages/forms) inspect `success` and render the corresponding message. There is no `try/catch` around the action call site in pages — errors are represented as data.

### 4. External API error classification
Supabase Auth responses are inspected by `error.code`, `error.status`, and substring checks on `error.message`:

- `email_not_confirmed` → sets `isUnverified: true` and prompts verification.
- `over_request_rate_limit` / status `429` → rate-limit friendly message.
- `invalid_credentials` / status `400` / `invalid login credentials` → generic credential error.
- Registration duplicate (`user_already_exists`, `already registered`) → treated as success with enumeration resistance.
- Generic fallback → logs diagnostic info and returns a sanitized form message.

No raw Supabase error codes or messages are forwarded to the client.

### 5. Redirect safety
All post-auth redirect targets go through `sanitizeRedirectUrl(origin, candidate, fallback)`. The callback route (`/auth/callback`) also sanitizes its `next` parameter before redirecting. If any step fails, it falls back to `/` or a safe query-string error flag (`?auth_error=missing_code|exchange_failed|callback_error`).

### 6. Logging policy
All caught exceptions are logged via `console.error` with a prefixed tag (e.g. `[LoginAction]`, `[RegisterAction]`) and only the `.message` string — never full objects, stack traces, passwords, tokens, or session cookies. Sensitive diagnostics are deliberately omitted from the user-facing response.

### 7. Route handler vs Server Action distinction
`/auth/callback/route.ts` (a Next.js route handler) returns `NextResponse.redirect(...)` directly and wraps everything in a `try/catch` that maps failures to `?auth_error=...` redirects. Server Actions return structured data instead, because they are invoked from React forms and need to update component state.

## Conventions & Constraints

Observed conventions (descriptive):

- User input is validated with Zod `safeParse` before any external call.
- Field-level validation errors are flattened and returned inside a typed `errors` object.
- Configuration/environment failures throw `SupabaseConfigurationError`; callers distinguish this from runtime/network errors.
- Supabase Auth errors are classified by code/status/message and mapped to human-friendly strings.
- No raw exception, stack trace, password, token, or database detail is sent to the client.
- All redirect URLs pass through `sanitizeRedirectUrl` against a trusted origin resolved by `getTrustedAppOrigin`.
- Account enumeration is resisted: duplicate registration returns the same success signal as a new account.
- Rate-limited requests receive a distinct user-facing message.

Documented rules enforced by comments in source files:

- `src/app/login/actions.ts` header: "Never returns raw server errors, exceptions, or database details to the client." and "Zero Service-Role Key usage: strictly anon public key through `createClient()`."
- `src/app/register/actions.ts` header: "Protects against sensitive data leakage: never logs passwords, codes, or tokens." and "Non-Authoritative Metadata … must NEVER be used for authorization decisions or RLS policies."
- `src/lib/supabase/env.ts` header: "Does NOT import, expose, or require SUPABASE_SERVICE_ROLE_KEY."
- `src/lib/supabase/redirect.ts` header: "Rejects external URLs, protocol-relative paths (`//evil.com`), backslash normalization evasion (`/\evil.com`, `\\evil.com`), unsafe schemes (`javascript:`, `data:`), and control-character / CRLF header injection."

## What Is Not Present

- No global error boundary or Next.js `error.tsx` page.
- No centralized logging service (Sentry, Datadog, etc.).
- No domain-specific sentinel error classes beyond `SupabaseConfigurationError`.
- No `panic`/`recover` equivalent (not applicable to JS/TS).
- No HTTP status-code mapping layer; route handlers use `NextResponse.redirect` and Server Actions return plain objects.