import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { NextRequest } from "next/server";

// Mock @supabase/ssr
const mockGetUser = vi.fn();
const mockCreateServerClient = vi.fn();

vi.mock("@supabase/ssr", () => ({
  createServerClient: (...args: unknown[]) => mockCreateServerClient(...args),
}));

describe("Session Refresh Utility (proxy.ts)", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.clearAllMocks();
    process.env = {
      ...originalEnv,
      NEXT_PUBLIC_SUPABASE_URL: "https://test-project.supabase.co",
      NEXT_PUBLIC_SUPABASE_ANON_KEY: "ey-test-anon-key-12345",
    };

    mockCreateServerClient.mockReturnValue({
      auth: {
        getUser: mockGetUser,
      },
    });
    mockGetUser.mockResolvedValue({ data: { user: null }, error: null });
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it("takes the fast-path for anonymous requests without auth cookies", async () => {
    const { updateSession } = await import("@/lib/supabase/proxy");
    const request = new NextRequest("http://localhost:3000/courses");

    const response = await updateSession(request);
    expect(response).toBeDefined();
    // Should NOT initialize Supabase or call getUser() for anonymous public visitors
    expect(mockCreateServerClient).not.toHaveBeenCalled();
    expect(mockGetUser).not.toHaveBeenCalled();
  });

  it("invokes getUser() when request carries a potential auth cookie", async () => {
    const { updateSession } = await import("@/lib/supabase/proxy");
    const request = new NextRequest("http://localhost:3000/courses", {
      headers: {
        cookie: "sb-test-project-auth-token=some-session-token",
      },
    });

    const response = await updateSession(request);
    expect(response).toBeDefined();
    expect(mockCreateServerClient).toHaveBeenCalled();
    expect(mockGetUser).toHaveBeenCalled();
  });

  it("synchronizes cookies to both request and response when setAll is invoked", async () => {
    const { updateSession } = await import("@/lib/supabase/proxy");
    const request = new NextRequest("http://localhost:3000/courses", {
      headers: {
        cookie: "sb-test-auth-token=old-token",
      },
    });

    // Make getUser invoke setAll via the client options
    mockGetUser.mockImplementation(async () => {
      const options = mockCreateServerClient.mock.calls[0][2];
      options.cookies.setAll([
        {
          name: "sb-test-auth-token",
          value: "refreshed-token",
          options: { path: "/", httpOnly: true, secure: true, sameSite: "lax" },
        },
      ]);
      return { data: { user: { id: "user-123" } }, error: null };
    });

    const response = await updateSession(request);

    // Request cookie was updated
    expect(request.cookies.get("sb-test-auth-token")?.value).toBe("refreshed-token");

    // Response cookie was set
    const setCookieHeader = response.headers.get("set-cookie");
    expect(setCookieHeader).toContain("sb-test-auth-token=refreshed-token");
  });

  it("returns unmodified response when auth service encounters an error without redirect looping", async () => {
    const { updateSession } = await import("@/lib/supabase/proxy");
    const request = new NextRequest("http://localhost:3000/courses", {
      headers: {
        cookie: "sb-test-auth-token=bad-token",
      },
    });

    mockGetUser.mockRejectedValue(new Error("Supabase auth service timeout"));

    const response = await updateSession(request);
    expect(response).toBeDefined();
    // Status should be 200 (NextResponse.next()), not a 302/307 redirect loop
    expect(response.status).toBe(200);
  });
});
