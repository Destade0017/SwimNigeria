import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

// Mock @supabase/ssr server client factory
const mockExchangeCodeForSession = vi.fn();
const mockCreateClient = vi.fn();

vi.mock("@/lib/supabase/server", () => ({
  createClient: () => mockCreateClient(),
}));

describe("PKCE Auth Callback Handler (/auth/callback/route.ts)", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.clearAllMocks();
    process.env = {
      ...originalEnv,
      NEXT_PUBLIC_APP_URL: "https://swimnigeria.org",
      NEXT_PUBLIC_SUPABASE_URL: "https://test-project.supabase.co",
      NEXT_PUBLIC_SUPABASE_ANON_KEY: "ey-test-anon-key-12345",
    };

    mockCreateClient.mockResolvedValue({
      auth: {
        exchangeCodeForSession: mockExchangeCodeForSession,
      },
    });
    mockExchangeCodeForSession.mockResolvedValue({ error: null });
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it("redirects to safe error fallback when authorization code is missing", async () => {
    const { GET } = await import("@/app/auth/callback/route");
    const req = new Request("https://swimnigeria.org/auth/callback");

    const res = await GET(req);
    expect(res.status).toBe(307);
    expect(res.headers.get("location")).toBe("https://swimnigeria.org/?auth_error=missing_code");
    expect(mockExchangeCodeForSession).not.toHaveBeenCalled();
  });

  it("exchanges code for session and redirects to default '/' when valid code provided with no next param", async () => {
    const { GET } = await import("@/app/auth/callback/route");
    const req = new Request("https://swimnigeria.org/auth/callback?code=valid-auth-code-123");

    const res = await GET(req);
    expect(res.status).toBe(307);
    expect(mockExchangeCodeForSession).toHaveBeenCalledWith("valid-auth-code-123");
    expect(res.headers.get("location")).toBe("https://swimnigeria.org/");
  });

  it("exchanges code for session and preserves legitimate internal destination", async () => {
    const { GET } = await import("@/app/auth/callback/route");
    const req = new Request(
      "https://swimnigeria.org/auth/callback?code=valid-auth-code-123&next=/courses/water-safety-overcoming-fear",
    );

    const res = await GET(req);
    expect(res.status).toBe(307);
    expect(mockExchangeCodeForSession).toHaveBeenCalledWith("valid-auth-code-123");
    expect(res.headers.get("location")).toBe(
      "https://swimnigeria.org/courses/water-safety-overcoming-fear",
    );
  });

  it("sanitizes malicious open-redirect targets to safe fallback '/'", async () => {
    const { GET } = await import("@/app/auth/callback/route");
    const req = new Request(
      "https://swimnigeria.org/auth/callback?code=valid-auth-code-123&next=https://evil.com/phishing",
    );

    const res = await GET(req);
    expect(res.status).toBe(307);
    expect(res.headers.get("location")).toBe("https://swimnigeria.org/");
  });

  it("sanitizes protocol-relative redirect targets to safe fallback '/'", async () => {
    const { GET } = await import("@/app/auth/callback/route");
    const req = new Request(
      "https://swimnigeria.org/auth/callback?code=valid-auth-code-123&next=//attacker.com",
    );

    const res = await GET(req);
    expect(res.status).toBe(307);
    expect(res.headers.get("location")).toBe("https://swimnigeria.org/");
  });

  it("handles password recovery redirectType cleanly by routing to /reset-password if next is default", async () => {
    const { GET } = await import("@/app/auth/callback/route");
    mockExchangeCodeForSession.mockResolvedValue({
      data: { redirectType: "recovery" },
      error: null,
    });

    const req = new Request("https://swimnigeria.org/auth/callback?code=recovery-code-123");

    const res = await GET(req);
    expect(res.status).toBe(307);
    expect(res.headers.get("location")).toBe("https://swimnigeria.org/reset-password");
  });

  it("handles unexpected runtime exceptions safely", async () => {
    const { GET } = await import("@/app/auth/callback/route");
    mockExchangeCodeForSession.mockRejectedValue(new Error("Network connection dropped"));

    const req = new Request("https://swimnigeria.org/auth/callback?code=some-code");

    const res = await GET(req);
    expect(res.status).toBe(307);
    expect(res.headers.get("location")).toBe("https://swimnigeria.org/?auth_error=callback_error");
  });
});
