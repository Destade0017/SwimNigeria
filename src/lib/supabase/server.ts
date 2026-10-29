/**
 * SwimNigeria — Supabase Server Client Factory
 *
 * Responsibilities:
 * - Initializes the server-side Supabase client using @supabase/ssr's createServerClient.
 * - Uses Next.js asynchronous cookies() store from `next/headers`.
 * - Implements the official getAll() and setAll() batch cookie adapter interface.
 * - Supports React Server Components (RSC), Server Actions, and Route Handlers.
 *
 * Cookie Mutation & Server Components Note:
 * - In Next.js App Router, React Server Components have a read-only cookie store.
 * - Attempting to call cookieStore.set() during RSC rendering throws a ReadonlyRequestCookiesError.
 * - We catch and safely ignore this expected error because session refreshing is handled
 *   upstream by Next.js request interception (src/proxy.ts).
 * - Any unexpected or unrelated error is rethrown to avoid concealing defects.
 *
 * Security:
 * - Uses strictly public anon keys. Does NOT use SUPABASE_SERVICE_ROLE_KEY.
 * - Preserves HttpOnly, Secure, and SameSite cookie options provided by @supabase/ssr.
 */

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { getSupabasePublicEnv } from "@/lib/supabase/env";

export async function createClient() {
  const cookieStore = await cookies();
  const { url, anonKey } = getSupabasePublicEnv();

  return createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
        } catch (error) {
          // In Next.js App Router, Server Components cannot modify cookies (read-only cookie store).
          // Next.js throws ReadonlyRequestCookiesError when cookieStore.set() is called in a Server Component.
          // This is expected and safe to ignore in Server Components because session refresh is
          // guaranteed upstream by the request interception proxy (src/proxy.ts).
          // In Server Actions and Route Handlers, cookieStore.set() succeeds normally.
          if (
            error instanceof Error &&
            (error.name === "ReadonlyRequestCookiesError" ||
              error.message.includes(
                "Cookies can only be modified in a Server Action or Route Handler",
              ))
          ) {
            return;
          }

          // Rethrow any unrelated or unexpected error
          throw error;
        }
      },
    },
  });
}
