import { describe, it, expect, beforeEach, afterEach } from "vitest";
import {
  validateSupabasePublicEnv,
  getSupabasePublicEnv,
  getTrustedAppOrigin,
  SupabaseConfigurationError,
} from "@/lib/supabase/env";

describe("Supabase Environment Configuration (env.ts)", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  describe("validateSupabasePublicEnv", () => {
    it("returns typed configuration when both URL and anon key are valid", () => {
      const config = validateSupabasePublicEnv(
        "https://valid-project.supabase.co",
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.valid-token",
      );

      expect(config).toEqual({
        url: "https://valid-project.supabase.co",
        anonKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.valid-token",
      });
    });

    it("throws SupabaseConfigurationError when URL is missing or empty", () => {
      expect(() => validateSupabasePublicEnv("", "valid-key")).toThrow(SupabaseConfigurationError);
      expect(() => validateSupabasePublicEnv(undefined, "valid-key")).toThrow(
        /Missing NEXT_PUBLIC_SUPABASE_URL/,
      );
    });

    it("throws SupabaseConfigurationError when URL contains a placeholder", () => {
      expect(() =>
        validateSupabasePublicEnv("https://your-project-ref.supabase.co", "valid-key"),
      ).toThrow(/placeholder value/);

      expect(() => validateSupabasePublicEnv("https://example.com/project", "valid-key")).toThrow(
        /placeholder value/,
      );
    });

    it("throws SupabaseConfigurationError when URL is malformed", () => {
      expect(() => validateSupabasePublicEnv("not-a-valid-url", "valid-key")).toThrow(/malformed/);
      expect(() => validateSupabasePublicEnv("ftp://project.supabase.co", "valid-key")).toThrow(
        /malformed/,
      );
    });

    it("throws SupabaseConfigurationError when anon key is missing or empty", () => {
      expect(() => validateSupabasePublicEnv("https://valid-project.supabase.co", "")).toThrow(
        /Missing NEXT_PUBLIC_SUPABASE_ANON_KEY/,
      );
      expect(() =>
        validateSupabasePublicEnv("https://valid-project.supabase.co", undefined),
      ).toThrow(/Missing NEXT_PUBLIC_SUPABASE_ANON_KEY/);
    });

    it("throws SupabaseConfigurationError when anon key is a placeholder", () => {
      expect(() =>
        validateSupabasePublicEnv(
          "https://valid-project.supabase.co",
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.your-anon-key-placeholder",
        ),
      ).toThrow(/placeholder value/);
    });

    it("does not leak secret values in error messages", () => {
      try {
        validateSupabasePublicEnv("https://your-project-ref.supabase.co", "secret-token-12345");
      } catch (err) {
        expect(err).toBeInstanceOf(SupabaseConfigurationError);
        expect((err as Error).message).not.toContain("secret-token-12345");
      }
    });
  });

  describe("getSupabasePublicEnv", () => {
    it("reads from process.env successfully when variables are set", () => {
      process.env.NEXT_PUBLIC_SUPABASE_URL = "https://app-env-project.supabase.co";
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "ey-valid-app-token";

      const config = getSupabasePublicEnv();
      expect(config.url).toBe("https://app-env-project.supabase.co");
      expect(config.anonKey).toBe("ey-valid-app-token");
    });
  });

  describe("getTrustedAppOrigin", () => {
    it("uses NEXT_PUBLIC_APP_URL when valid", () => {
      process.env.NEXT_PUBLIC_APP_URL = "https://swimnigeria.org";
      expect(getTrustedAppOrigin()).toBe("https://swimnigeria.org");
    });

    it("falls back to request URL origin when NEXT_PUBLIC_APP_URL is not set", () => {
      delete process.env.NEXT_PUBLIC_APP_URL;
      const req = new Request("https://preview.swimnigeria.org/auth/callback");
      expect(getTrustedAppOrigin(req)).toBe("https://preview.swimnigeria.org");
    });

    it("falls back to default localhost:3000 when no valid URL is found", () => {
      delete process.env.NEXT_PUBLIC_APP_URL;
      expect(getTrustedAppOrigin()).toBe("http://localhost:3000");
    });

    it("ignores placeholder NEXT_PUBLIC_APP_URL", () => {
      process.env.NEXT_PUBLIC_APP_URL = "https://your-project-ref.placeholder.com";
      expect(getTrustedAppOrigin()).toBe("http://localhost:3000");
    });
  });
});
