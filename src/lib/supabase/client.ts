/**
 * SwimNigeria — Supabase Browser Client Factory
 *
 * Responsibilities:
 * - Initializes the browser-side Supabase client using @supabase/ssr's createBrowserClient.
 * - Uses centralized public environment configuration (URL and Anon Key).
 * - Manages cookie-based session state in browser contexts.
 *
 * Security:
 * - Uses ONLY public anonymous credentials.
 * - Does NOT import or expose any server-side secret keys.
 * - Stores authentication tokens strictly in browser cookies managed by @supabase/ssr.
 *   Does NOT store tokens in localStorage or sessionStorage.
 */

import { createBrowserClient } from "@supabase/ssr";
import { getSupabasePublicEnv } from "@/lib/supabase/env";

export function createClient() {
  const { url, anonKey } = getSupabasePublicEnv();
  return createBrowserClient(url, anonKey);
}
