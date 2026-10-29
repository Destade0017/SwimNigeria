import { describe, it, expect } from "vitest";
import { sanitizeRedirectUrl } from "@/lib/supabase/redirect";

describe("Redirect Sanitizer (redirect.ts)", () => {
  const origin = "https://swimnigeria.org";

  describe("Legitimate internal routes", () => {
    it("preserves simple relative paths", () => {
      expect(sanitizeRedirectUrl("/courses", origin)).toBe("/courses");
      expect(sanitizeRedirectUrl("/articles", origin)).toBe("/articles");
      expect(sanitizeRedirectUrl("/about", origin)).toBe("/about");
      expect(sanitizeRedirectUrl("/contact", origin)).toBe("/contact");
    });

    it("preserves nested paths", () => {
      expect(sanitizeRedirectUrl("/courses/water-safety-overcoming-fear", origin)).toBe(
        "/courses/water-safety-overcoming-fear",
      );
      expect(
        sanitizeRedirectUrl(
          "/courses/water-safety-overcoming-fear/lessons/fear-as-a-survival-instinct",
          origin,
        ),
      ).toBe("/courses/water-safety-overcoming-fear/lessons/fear-as-a-survival-instinct");
    });

    it("preserves query parameters and hashes on internal routes", () => {
      expect(sanitizeRedirectUrl("/courses?category=safety&level=beginner#top", origin)).toBe(
        "/courses?category=safety&level=beginner#top",
      );
    });
  });

  describe("Open redirect and malicious evasion attempts", () => {
    it("rejects absolute external URLs", () => {
      expect(sanitizeRedirectUrl("https://evil.com", origin)).toBe("/");
      expect(sanitizeRedirectUrl("http://evil.com/login", origin)).toBe("/");
      expect(sanitizeRedirectUrl("https://subdomain.swimnigeria.org.evil.com", origin)).toBe("/");
    });

    it("rejects protocol-relative URLs", () => {
      expect(sanitizeRedirectUrl("//evil.com", origin)).toBe("/");
      expect(sanitizeRedirectUrl("///evil.com", origin)).toBe("/");
      expect(sanitizeRedirectUrl("//swimnigeria.org", origin)).toBe("/");
    });

    it("rejects backslash evasion techniques", () => {
      expect(sanitizeRedirectUrl("\\evil.com", origin)).toBe("/");
      expect(sanitizeRedirectUrl("/\\evil.com", origin)).toBe("/");
      expect(sanitizeRedirectUrl("/path\\with\\backslash", origin)).toBe("/");
      expect(sanitizeRedirectUrl("\\/evil.com", origin)).toBe("/");
    });

    it("rejects URL-encoded backslash evasion", () => {
      expect(sanitizeRedirectUrl("/%5Cevil.com", origin)).toBe("/");
      expect(sanitizeRedirectUrl("/%2f%2fevil.com", origin)).toBe("/");
    });

    it("rejects dangerous URI schemes", () => {
      expect(sanitizeRedirectUrl("javascript:alert(1)", origin)).toBe("/");
      expect(sanitizeRedirectUrl("data:text/html,<script>alert(1)</script>", origin)).toBe("/");
      expect(sanitizeRedirectUrl("vbscript:msgbox(1)", origin)).toBe("/");
    });

    it("rejects CRLF / header injection control characters", () => {
      expect(sanitizeRedirectUrl("/path\r\nSet-Cookie:evil=1", origin)).toBe("/");
      expect(sanitizeRedirectUrl("/path%0d%0aSet-Cookie:evil=1", origin)).toBe("/");
      expect(sanitizeRedirectUrl("/path\u0000evil", origin)).toBe("/");
      expect(sanitizeRedirectUrl("/path%00evil", origin)).toBe("/");
    });

    it("rejects malformed URI encodings", () => {
      expect(sanitizeRedirectUrl("/path%E0%A4%A", origin)).toBe("/");
      expect(sanitizeRedirectUrl("/path%", origin)).toBe("/");
    });
  });

  describe("Fallback behavior and edge cases", () => {
    it("falls back to default '/' for null, undefined, and empty string", () => {
      expect(sanitizeRedirectUrl(null, origin)).toBe("/");
      expect(sanitizeRedirectUrl(undefined, origin)).toBe("/");
      expect(sanitizeRedirectUrl("", origin)).toBe("/");
      expect(sanitizeRedirectUrl("   ", origin)).toBe("/");
    });

    it("supports custom fallback paths", () => {
      expect(sanitizeRedirectUrl("https://evil.com", origin, "/courses")).toBe("/courses");
      expect(sanitizeRedirectUrl(null, origin, "/account")).toBe("/account");
    });
  });
});
