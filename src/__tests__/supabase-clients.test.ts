import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

// Mock @supabase/ssr
const mockCreateBrowserClient = vi.fn();
const mockCreateServerClient = vi.fn();

vi.mock("@supabase/ssr", () => ({
  createBrowserClient: (...args: unknown[]) => mockCreateBrowserClient(...args),
  createServerClient: (...args: unknown[]) => mockCreateServerClient(...args),
}));

// Mock next/headers
const mockCookieStore = {
  getAll: vi.fn(),
  set: vi.fn(),
};

vi.mock("next/headers", () => ({
  cookies: vi.fn(async () => mockCookieStore),
}));

describe("Supabase Client Factories", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.clearAllMocks();
    process.env = {
      ...originalEnv,
      NEXT_PUBLIC_SUPABASE_URL: "https://test-project.supabase.co",
      NEXT_PUBLIC_SUPABASE_ANON_KEY: "ey-test-anon-key-12345",
    };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  describe("Browser Client (client.ts)", () => {
    it("initializes createBrowserClient with public URL and anon key", async () => {
      const { createClient } = await import("@/lib/supabase/client");
      mockCreateBrowserClient.mockReturnValue({ auth: {} });

      const client = createClient();
      expect(client).toBeDefined();
      expect(mockCreateBrowserClient).toHaveBeenCalledWith(
        "https://test-project.supabase.co",
        "ey-test-anon-key-12345",
      );
    });

    it("does not pass service role key to browser client", async () => {
      process.env.SUPABASE_SERVICE_ROLE_KEY = "high-secret-service-role-key";
      const { createClient } = await import("@/lib/supabase/client");

      createClient();
      expect(mockCreateBrowserClient).not.toHaveBeenCalledWith(
        expect.anything(),
        "high-secret-service-role-key",
      );
    });
  });

  describe("Server Client (server.ts)", () => {
    it("initializes createServerClient with public URL, anon key, and cookie adapter", async () => {
      const { createClient } = await import("@/lib/supabase/server");
      mockCreateServerClient.mockReturnValue({ auth: {} });

      const client = await createClient();
      expect(client).toBeDefined();
      expect(mockCreateServerClient).toHaveBeenCalledWith(
        "https://test-project.supabase.co",
        "ey-test-anon-key-12345",
        expect.objectContaining({
          cookies: expect.objectContaining({
            getAll: expect.any(Function),
            setAll: expect.any(Function),
          }),
        }),
      );
    });

    it("cookie adapter getAll delegates to cookieStore.getAll()", async () => {
      const { createClient } = await import("@/lib/supabase/server");
      mockCookieStore.getAll.mockReturnValue([{ name: "test-cookie", value: "123" }]);

      await createClient();

      const options = mockCreateServerClient.mock.calls[0][2];
      const result = options.cookies.getAll();

      expect(mockCookieStore.getAll).toHaveBeenCalled();
      expect(result).toEqual([{ name: "test-cookie", value: "123" }]);
    });

    it("cookie adapter setAll delegates to cookieStore.set()", async () => {
      const { createClient } = await import("@/lib/supabase/server");
      await createClient();

      const options = mockCreateServerClient.mock.calls[0][2];
      options.cookies.setAll([
        {
          name: "sb-auth-token",
          value: "jwt-token",
          options: { httpOnly: true, secure: true, sameSite: "lax" },
        },
      ]);

      expect(mockCookieStore.set).toHaveBeenCalledWith("sb-auth-token", "jwt-token", {
        httpOnly: true,
        secure: true,
        sameSite: "lax",
      });
    });

    it("safely catches and ignores ReadonlyRequestCookiesError in Server Component contexts", async () => {
      const { createClient } = await import("@/lib/supabase/server");
      mockCookieStore.set.mockImplementation(() => {
        const err = new Error(
          "Cookies can only be modified in a Server Action or Route Handler. Read more: https://nextjs.org/docs/app/api-reference/functions/cookies#options",
        );
        err.name = "ReadonlyRequestCookiesError";
        throw err;
      });

      await createClient();

      const options = mockCreateServerClient.mock.calls[0][2];

      // Should not throw
      expect(() => {
        options.cookies.setAll([
          {
            name: "sb-auth-token",
            value: "jwt-token",
            options: {},
          },
        ]);
      }).not.toThrow();
    });

    it("re-throws unexpected or unrelated cookie errors", async () => {
      const { createClient } = await import("@/lib/supabase/server");
      mockCookieStore.set.mockImplementation(() => {
        throw new Error("Unexpected database disk error");
      });

      await createClient();

      const options = mockCreateServerClient.mock.calls[0][2];

      // Must re-throw unexpected errors
      expect(() => {
        options.cookies.setAll([
          {
            name: "sb-auth-token",
            value: "jwt-token",
            options: {},
          },
        ]);
      }).toThrow("Unexpected database disk error");
    });
  });
});
