/**
 * SwimNigeria — Supabase Session Refresh Utility for Next.js Request Interception
 *
 * Responsibilities:
 * - Reads and synchronizes Supabase authentication session cookies on incoming requests.
 * - Updates response cookies when tokens are refreshed.
 * - Calls supabase.auth.getUser() to perform cryptographic token verification and refresh.
 * - Implements a fast-path bypass for genuinely anonymous requests, preventing unnecessary
 *   external authentication pings on public marketing and curriculum routes.
 *
 * Security Considerations:
 * - Cookie presence is treated ONLY as a performance hint to check session validity,
 *   NEVER as proof of authentication or authorization.
 * - Authorization decisions remain server-side in later milestone Server Components / Actions.
 * - Authentication failures do not crash the application or redirect public visitors.
 * - Does NOT enforce route protection in Phase 5.1 (deferred to Phase 5.5).
 */

import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { getSupabasePublicEnv } from "@/lib/supabase/env";

export async function updateSession(request: NextRequest): Promise<NextResponse> {
  // 1. Initialize an unmodified response object with request headers forwarded
  let supabaseResponse = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  // 2. Fast-path optimization for anonymous public visitors:
  // Supabase Auth tokens are stored with cookie names starting with 'sb-' and containing '-auth-token'.
  // If no matching cookies exist, the visitor is genuinely anonymous.
  // We return immediately to avoid introducing latency on public pages (articles, catalogue, syllabuses).
  const allCookies = request.cookies.getAll();
  const hasPotentialAuthCookie = allCookies.some(
    (cookie) => cookie.name.startsWith("sb-") && cookie.name.includes("-auth-token"),
  );

  if (!hasPotentialAuthCookie) {
    return supabaseResponse;
  }

  // 3. For requests carrying potential auth cookies, verify and refresh the session
  try {
    const { url, anonKey } = getSupabasePublicEnv();

    const supabase = createServerClient(url, anonKey, {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          // Synchronize cookies to incoming request for downstream Server Components
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));

          // Clone response and apply refreshed cookies for the client browser
          supabaseResponse = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    });

    // IMPORTANT: Always use getUser(), never getSession().
    // getUser() contacts Supabase Auth to validate the token and rotate expiring tokens.
    // If the token is invalid or expired and cannot be refreshed, Supabase Auth clears the cookies.
    await supabase.auth.getUser();

    return supabaseResponse;
  } catch {
    // If environment configuration is missing, network fails, or Supabase is unreachable:
    // Return the unmodified response so public content remains accessible without crashing or redirect loops.
    return supabaseResponse;
  }
}
