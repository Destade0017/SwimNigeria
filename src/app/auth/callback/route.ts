/**
 * SwimNigeria — PKCE Authentication Callback Route Handler
 *
 * Responsibilities:
 * - Receives the one-time authorization code (`code`) emitted by Supabase Auth (e.g. email verification, password reset, OAuth).
 * - Exchanges the authorization code for a session via `supabase.auth.exchangeCodeForSession(code)`.
 * - Sets the resulting session cookies securely on the response via `@supabase/ssr`.
 * - Uses the redirect sanitizer (`sanitizeRedirectUrl`) to safely redirect to the internal destination (`next`).
 *
 * Security Constraints:
 * - Validates the trusted application origin using `getTrustedAppOrigin(request)` rather than blindly trusting arbitrary Host headers.
 * - Rejects missing, invalid, or expired authorization codes, redirecting to a safe generic fallback.
 * - Enforces same-origin internal destination boundaries; rejects external URLs, protocol-relative paths (`//evil.com`),
 *   backslash tricks (`/\evil.com`), and unsafe URI schemes (`javascript:`).
 * - Never includes authorization codes, tokens, database details, or stack traces in redirect destinations.
 * - Code exchange merely creates an authenticated session; it does NOT grant admin permissions or course enrolment.
 */

import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { sanitizeRedirectUrl } from "@/lib/supabase/redirect";
import { getTrustedAppOrigin } from "@/lib/supabase/env";

export async function GET(request: Request) {
  const origin = getTrustedAppOrigin(request);

  try {
    const requestUrl = new URL(request.url);
    const code = requestUrl.searchParams.get("code");
    const candidateNext = requestUrl.searchParams.get("next");

    // Strictly sanitize the candidate redirect target against the trusted application origin
    const safeNext = sanitizeRedirectUrl(candidateNext, origin, "/");

    if (!code) {
      // Missing authorization code: return safe generic error redirect
      return NextResponse.redirect(`${origin}/?auth_error=missing_code`);
    }

    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      // Exchange error (expired, invalid, or reused code): return safe generic error redirect
      return NextResponse.redirect(`${origin}/?auth_error=exchange_failed`);
    }

    // Successful exchange: redirect strictly to the sanitized internal path
    return NextResponse.redirect(`${origin}${safeNext}`);
  } catch {
    // Malformed request URL or unexpected error: return safe generic error redirect
    return NextResponse.redirect(`${origin}/?auth_error=callback_error`);
  }
}
