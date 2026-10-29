/**
 * SwimNigeria — Next.js 16 Request Interception Proxy
 *
 * In Next.js 16+, `src/proxy.ts` replaces the deprecated `middleware.ts` convention.
 * Runs on the Node.js runtime and delegates session synchronization to updateSession().
 *
 * Route Matcher:
 * - Excludes static assets (_next/static, _next/image, favicon, public images/fonts).
 * - Matches application page routes and API routes to ensure session tokens are refreshed.
 * - Does NOT enforce route protection in Phase 5.1 (protected routes belong to Phase 5.5).
 */

import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/proxy";

export async function proxy(request: NextRequest) {
  return await updateSession(request);
}

export default proxy;

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - _next/static (static chunks and styles)
     * - _next/image (image optimization endpoints)
     * - favicon.ico, sitemap.xml, robots.txt
     * - static file extensions (svg, png, jpg, jpeg, gif, webp, ico, css, js, woff, woff2)
     */
    "/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|woff|woff2)$).*)",
  ],
};
