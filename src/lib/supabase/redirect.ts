/**
 * SwimNigeria — Redirect URL Sanitizer
 *
 * Responsibilities:
 * - Sanitizes candidate post-authentication redirect targets.
 * - Enforces strict same-origin internal destination boundaries.
 * - Protects against open-redirect vulnerabilities, protocol-relative attacks (//evil.com),
 *   backslash normalization evasion (/\evil.com, \\evil.com), unsafe schemes (javascript:, data:),
 *   and control-character / CRLF header injection.
 */

/**
 * Sanitizes candidate redirect target URLs to ensure they resolve strictly
 * to safe, relative, same-origin application routes.
 *
 * @param candidate - The raw candidate path or URL from query parameters.
 * @param trustedOrigin - The verified application origin (e.g., https://swimnigeria.org).
 * @param fallback - The default fallback path when candidate is invalid (default: "/").
 * @returns A safe, normalized relative path (e.g. "/courses" or "/courses/water-safety?tab=outline").
 */
export function sanitizeRedirectUrl(
  candidate: string | null | undefined,
  trustedOrigin: string = "http://localhost:3000",
  fallback: string = "/",
): string {
  if (!candidate || typeof candidate !== "string") {
    return fallback;
  }

  const trimmed = candidate.trim();
  if (!trimmed) {
    return fallback;
  }

  // Must begin with a single forward slash and NOT a double slash (protocol-relative)
  if (!trimmed.startsWith("/") || trimmed.startsWith("//")) {
    return fallback;
  }

  // Reject any backslash characters to prevent Windows path separator normalization tricks
  if (trimmed.includes("\\")) {
    return fallback;
  }

  // Reject control characters (CRLF, null bytes) to prevent HTTP response splitting
  if (/[\u0000-\u001F\u007F]/.test(trimmed)) {
    return fallback;
  }

  // Verify decoded URI does not contain hidden control chars, backslashes, or encoded double slashes
  try {
    const decoded = decodeURIComponent(trimmed);
    if (
      /[\u0000-\u001F\u007F]/.test(decoded) ||
      decoded.includes("\\") ||
      !decoded.startsWith("/") ||
      decoded.startsWith("//")
    ) {
      return fallback;
    }
  } catch {
    // Malformed URI encoding (e.g., incomplete % sequence)
    return fallback;
  }

  try {
    // Parse the candidate relative to the trusted origin
    const base = new URL(trustedOrigin).origin;
    const resolved = new URL(trimmed, base);

    // Assert that the parsed URL matches the exact trusted origin
    if (resolved.origin !== base) {
      return fallback;
    }

    // Protocol must remain http or https
    if (resolved.protocol !== "http:" && resolved.protocol !== "https:") {
      return fallback;
    }

    // Reconstruct the clean relative path consisting only of pathname, search, and hash
    const safePath = resolved.pathname + resolved.search + resolved.hash;

    // Final sanity check: must start with / and not // or contain backslash
    if (!safePath.startsWith("/") || safePath.startsWith("//") || safePath.includes("\\")) {
      return fallback;
    }

    return safePath;
  } catch {
    return fallback;
  }
}
