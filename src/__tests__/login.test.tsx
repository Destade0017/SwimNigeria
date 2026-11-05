import React from "react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import axe from "axe-core";
import { LoginForm } from "@/app/login/login-form";
import LoginPage from "@/app/login/page";
import { loginLearner, loginLearnerAction, logoutLearnerAction } from "@/app/login/actions";
import { LogoutButton } from "@/components/auth/logout-button";
import { AuthApiError } from "@supabase/supabase-js";
import { SupabaseConfigurationError } from "@/lib/supabase/env";

// Mock Supabase server client
const mockSignInWithPassword = vi.fn();
const mockSignOut = vi.fn();
const mockCreateClient = vi.fn();
const mockRedirect = vi.fn();

vi.mock("@/lib/supabase/server", () => ({
  createClient: () => mockCreateClient(),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    refresh: vi.fn(),
  }),
  redirect: (url: string) => mockRedirect(url),
}));

describe("Learner Login & Session Management (Phase 5.3)", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.clearAllMocks();
    process.env = {
      ...originalEnv,
      NEXT_PUBLIC_APP_URL: "https://swimnigeria.org",
      NEXT_PUBLIC_SUPABASE_URL: "https://mock-project.supabase.co",
      NEXT_PUBLIC_SUPABASE_ANON_KEY: "ey-mock-anon-key-12345",
    };

    mockCreateClient.mockResolvedValue({
      auth: {
        signInWithPassword: mockSignInWithPassword,
        signOut: mockSignOut,
      },
    });

    mockSignInWithPassword.mockResolvedValue({
      data: {
        user: {
          id: "mock-user-123",
          email: "amina.bello@example.com",
        },
        session: {
          access_token: "mock-access-token",
          refresh_token: "mock-refresh-token",
        },
      },
      error: null,
    });

    mockSignOut.mockResolvedValue({
      error: null,
    });
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  describe("Server Action: loginLearner()", () => {
    it("successfully authenticates valid credentials and returns sanitized redirect", async () => {
      const result = await loginLearner(
        {
          email: "  AMINA@EXAMPLE.COM  ",
          password: "Password123",
        },
        "/courses/water-safety-fundamentals",
      );

      expect(result.success).toBe(true);
      expect(result.redirectTo).toBe("/courses/water-safety-fundamentals");
      expect(mockSignInWithPassword).toHaveBeenCalledWith({
        email: "amina@example.com",
        password: "Password123",
      });
    });

    it("defaults to /courses if no return path or an empty return path is supplied", async () => {
      const result = await loginLearner({
        email: "amina@example.com",
        password: "Password123",
      });

      expect(result.success).toBe(true);
      expect(result.redirectTo).toBe("/courses");
    });

    it("sanitizes candidate return path against open redirect vulnerabilities", async () => {
      const result = await loginLearner(
        {
          email: "amina@example.com",
          password: "Password123",
        },
        "//evil.com/phishing",
      );

      expect(result.success).toBe(true);
      expect(result.redirectTo).toBe("/courses");
    });

    it("rejects invalid input without invoking Supabase", async () => {
      const result = await loginLearner({
        email: "not-an-email",
        password: "",
      });

      expect(result.success).toBe(false);
      expect(result.errors?.email).toBeDefined();
      expect(result.errors?.password).toBeDefined();
      expect(mockSignInWithPassword).not.toHaveBeenCalled();
    });

    it("handles invalid credentials error cleanly and safely", async () => {
      const invalidAuthError = new AuthApiError(
        "Invalid login credentials",
        400,
        "invalid_credentials",
      );
      mockSignInWithPassword.mockResolvedValue({
        data: { user: null, session: null },
        error: invalidAuthError,
      });

      const result = await loginLearner({
        email: "amina@example.com",
        password: "WrongPassword123",
      });

      expect(result.success).toBe(false);
      expect(result.errors?.form).toMatch(/invalid email or password/i);
    });

    it("handles unverified email account and returns unverified status", async () => {
      const unconfirmedError = new AuthApiError("Email not confirmed", 400, "email_not_confirmed");
      mockSignInWithPassword.mockResolvedValue({
        data: { user: null, session: null },
        error: unconfirmedError,
      });

      const result = await loginLearner({
        email: "unverified@example.com",
        password: "Password123",
      });

      expect(result.success).toBe(false);
      expect(result.isUnverified).toBe(true);
      expect(result.email).toBe("unverified@example.com");
      expect(result.errors?.form).toMatch(/email verification required/i);
    });

    it("handles rate limiting safely", async () => {
      mockSignInWithPassword.mockResolvedValue({
        data: { user: null, session: null },
        error: {
          name: "AuthApiError",
          status: 429,
          code: "over_request_rate_limit",
          message: "Rate limit exceeded",
        },
      });

      const result = await loginLearner({
        email: "amina@example.com",
        password: "Password123",
      });

      expect(result.success).toBe(false);
      expect(result.errors?.form).toMatch(/too many login attempts/i);
    });

    it("handles unconfigured Supabase environment gracefully", async () => {
      mockCreateClient.mockRejectedValueOnce(
        new SupabaseConfigurationError("Missing NEXT_PUBLIC_SUPABASE_URL"),
      );

      const result = await loginLearner({
        email: "amina@example.com",
        password: "Password123",
      });

      expect(result.success).toBe(false);
      expect(result.errors?.form).toMatch(/temporarily unavailable/i);
    });
  });

  describe("Form Server Action: loginLearnerAction()", () => {
    it("extracts formData and processes valid submission", async () => {
      const formData = new FormData();
      formData.set("email", "amina@example.com");
      formData.set("password", "Password123");
      formData.set("next", "/courses/intro");

      const result = await loginLearnerAction({ success: false }, formData);
      expect(result.success).toBe(true);
      expect(result.redirectTo).toBe("/courses/intro");
    });
  });

  describe("Server Action: logoutLearnerAction()", () => {
    it("calls supabase.auth.signOut and redirects to safe fallback destination", async () => {
      await logoutLearnerAction();

      expect(mockSignOut).toHaveBeenCalled();
      expect(mockRedirect).toHaveBeenCalledWith("/");
    });

    it("redirects to sanitized target path", async () => {
      await logoutLearnerAction("/about");

      expect(mockSignOut).toHaveBeenCalled();
      expect(mockRedirect).toHaveBeenCalledWith("/about");
    });

    it("falls back to / if logout target is malicious", async () => {
      await logoutLearnerAction("//phishing.com");

      expect(mockSignOut).toHaveBeenCalled();
      expect(mockRedirect).toHaveBeenCalledWith("/");
    });
  });

  describe("UI Components & Accessibility", () => {
    it("renders the LoginPage with semantic structure and accessible elements", async () => {
      const pageJsx = await LoginPage({ searchParams: Promise.resolve({}) });
      render(pageJsx);

      expect(
        screen.getByRole("heading", { level: 1, name: /welcome back to swimnigeria/i }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("heading", { level: 2, name: /sign in to swimnigeria/i }),
      ).toBeInTheDocument();
      expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/^password/i)).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /sign in/i })).toBeInTheDocument();
      expect(screen.getByRole("link", { name: /register as a learner/i })).toBeInTheDocument();
    });

    it("toggles password visibility with accessible button and attributes", () => {
      render(<LoginForm />);

      const passwordInput = screen.getByLabelText(/^password/i);
      const toggleBtn = screen.getByRole("button", { name: /^show password$/i });

      expect(passwordInput).toHaveAttribute("type", "password");
      expect(toggleBtn).toHaveAttribute("aria-pressed", "false");

      fireEvent.click(toggleBtn);

      expect(passwordInput).toHaveAttribute("type", "text");
      const hideBtn = screen.getByRole("button", { name: /^hide password$/i });
      expect(hideBtn).toHaveAttribute("aria-pressed", "true");

      fireEvent.click(hideBtn);
      expect(passwordInput).toHaveAttribute("type", "password");
    });

    it("renders LogoutButton and handles click transition", () => {
      render(<LogoutButton>Log Out</LogoutButton>);

      const btn = screen.getByRole("button", { name: /log out/i });
      expect(btn).toBeInTheDocument();

      fireEvent.click(btn);
    });

    it("satisfies axe-core accessibility standards", async () => {
      const { container } = render(<LoginForm />);
      const results = await axe.run(container);
      expect(results.violations).toEqual([]);
    });
  });
});
