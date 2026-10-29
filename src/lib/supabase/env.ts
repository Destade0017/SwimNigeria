/**
 * SwimNigeria — Supabase Environment Configuration & Validation
 *
 * Responsibilities:
 * - Reads public Supabase configuration (URL and Anonymous Key).
 * - Detects missing variables and placeholder strings from .env.example.
 * - Validates URL structure and protocol.
 * - Resolves the trusted application origin.
 * - Provides clear, actionable error messages without exposing secret values.
 *
 * Security Notes:
 * - Uses direct process.env references so Next.js static bundling inlines NEXT_PUBLIC_* variables.
 * - Does NOT import, expose, or require SUPABASE_SERVICE_ROLE_KEY.
 */

export class SupabaseConfigurationError extends Error {
  constructor(message: string) {
    super(`[SupabaseConfigurationError] ${message}`);
    this.name = "SupabaseConfigurationError";
  }
}

export interface SupabasePublicEnv {
  url: string;
  anonKey: string;
}

/**
 * Known placeholder fragments from .env.example templates.
 */
const KNOWN_PLACEHOLDERS = [
  "your-project-ref",
  "your-anon-key-placeholder",
  "your-key-placeholder",
  "placeholder",
  "<your-",
  "example.com",
];

function containsPlaceholder(val: string): boolean {
  const lower = val.toLowerCase();
  return KNOWN_PLACEHOLDERS.some((p) => lower.includes(p));
}

/**
 * Validates candidate Supabase public configuration.
 * Throws a SupabaseConfigurationError with actionable guidance on failure.
 */
export function validateSupabasePublicEnv(
  url?: string | null,
  anonKey?: string | null,
): SupabasePublicEnv {
  if (!url || typeof url !== "string" || url.trim() === "") {
    throw new SupabaseConfigurationError(
      "Missing NEXT_PUBLIC_SUPABASE_URL environment variable. Please configure this in your .env.local file.",
    );
  }

  const trimmedUrl = url.trim();

  if (containsPlaceholder(trimmedUrl)) {
    throw new SupabaseConfigurationError(
      "NEXT_PUBLIC_SUPABASE_URL contains an unconfigured placeholder value. Please replace it with your actual Supabase project URL.",
    );
  }

  try {
    const parsed = new URL(trimmedUrl);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      throw new Error("Invalid protocol");
    }
  } catch {
    throw new SupabaseConfigurationError(
      "NEXT_PUBLIC_SUPABASE_URL is malformed. It must be a valid HTTP or HTTPS URL (e.g. https://your-project.supabase.co).",
    );
  }

  if (!anonKey || typeof anonKey !== "string" || anonKey.trim() === "") {
    throw new SupabaseConfigurationError(
      "Missing NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable. Please configure this in your .env.local file.",
    );
  }

  const trimmedKey = anonKey.trim();

  if (containsPlaceholder(trimmedKey)) {
    throw new SupabaseConfigurationError(
      "NEXT_PUBLIC_SUPABASE_ANON_KEY contains an unconfigured placeholder value. Please replace it with your actual Supabase anonymous API key.",
    );
  }

  return {
    url: trimmedUrl,
    anonKey: trimmedKey,
  };
}

/**
 * Returns validated public Supabase environment variables.
 * Uses direct property access to ensure Next.js can inline variables into browser bundles.
 */
export function getSupabasePublicEnv(): SupabasePublicEnv {
  return validateSupabasePublicEnv(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
}

/**
 * Resolves the trusted application origin for redirects and callbacks.
 * Priority:
 * 1. Validated NEXT_PUBLIC_APP_URL.
 * 2. Incoming request URL origin (if provided and valid).
 * 3. Fallback: http://localhost:3000 (standard local development port).
 */
export function getTrustedAppOrigin(request?: Request): string {
  const configuredAppUrl = process.env.NEXT_PUBLIC_APP_URL?.trim();

  if (configuredAppUrl && !containsPlaceholder(configuredAppUrl)) {
    try {
      const parsed = new URL(configuredAppUrl);
      if (parsed.protocol === "http:" || parsed.protocol === "https:") {
        return parsed.origin;
      }
    } catch {
      // Malformed configured URL; fall through to request or default
    }
  }

  if (request) {
    try {
      const parsedReq = new URL(request.url);
      if (parsedReq.protocol === "http:" || parsedReq.protocol === "https:") {
        return parsedReq.origin;
      }
    } catch {
      // Fall through to default
    }
  }

  return "http://localhost:3000";
}
