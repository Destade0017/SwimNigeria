import React from "react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import axe from "axe-core";
import { RegisterForm } from "@/app/register/register-form";
import RegisterPage from "@/app/register/page";
import { registerLearner, registerLearnerAction } from "@/app/register/actions";
import { SupabaseConfigurationError } from "@/lib/supabase/env";

// Mock Supabase server client
const mockSignUp = vi.fn();
const mockCreateClient = vi.fn();

vi.mock("@/lib/supabase/server", () => ({
  createClient: () => mockCreateClient(),
}));

describe("Learner Registration Flow & UI (Phase 5.2)", () => {
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
        signUp: mockSignUp,
      },
    });

    mockSignUp.mockResolvedValue({
      data: {
        user: {
          id: "mock-user-123",
          email: "amina.bello@example.com",
          user_metadata: { full_name: "Amina Bello" },
        },
        session: null,
      },
      error: null,
    });
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  describe("Server Action: registerLearner()", () => {
    it("successfully calls supabase.auth.signUp with valid payload and sanitized redirect", async () => {
      const result = await registerLearner({
        fullName: "  Amina Bello  ",
        email: "AMINA@EXAMPLE.COM",
        password: "Password123",
        confirmPassword: "Password123",
      });

      expect(result.success).toBe(true);
      expect(result.email).toBe("amina@example.com");
      expect(result.fullName).toBe("Amina Bello");
      expect(mockSignUp).toHaveBeenCalledWith({
        email: "amina@example.com",
        password: "Password123",
        options: {
          data: {
            full_name: "Amina Bello",
          },
          emailRedirectTo: "https://swimnigeria.org/auth/callback?next=%2Fcourses",
        },
      });
    });

    it("sanitizes candidate return path against open redirect vulnerabilities", async () => {
      await registerLearner(
        {
          fullName: "Emeka Obi",
          email: "emeka@example.com",
          password: "SecurePassword9",
          confirmPassword: "SecurePassword9",
        },
        "//evil.com/phishing",
      );

      expect(mockSignUp).toHaveBeenCalledWith(
        expect.objectContaining({
          options: expect.objectContaining({
            // Fallback applied because //evil.com is unsafe
            emailRedirectTo: "https://swimnigeria.org/auth/callback?next=%2Fcourses",
          }),
        }),
      );
    });

    it("preserves safe internal post-confirmation return targets", async () => {
      await registerLearner(
        {
          fullName: "Emeka Obi",
          email: "emeka@example.com",
          password: "SecurePassword9",
          confirmPassword: "SecurePassword9",
        },
        "/courses/buoyancy-breathing-mechanics",
      );

      expect(mockSignUp).toHaveBeenCalledWith(
        expect.objectContaining({
          options: expect.objectContaining({
            emailRedirectTo:
              "https://swimnigeria.org/auth/callback?next=%2Fcourses%2Fbuoyancy-breathing-mechanics",
          }),
        }),
      );
    });

    it("rejects invalid input without calling Supabase Auth", async () => {
      const result = await registerLearner({
        fullName: "",
        email: "not-an-email",
        password: "short",
        confirmPassword: "mismatch",
      });

      expect(result.success).toBe(false);
      expect(result.errors?.fullName).toBeDefined();
      expect(result.errors?.email).toBeDefined();
      expect(result.errors?.password).toBeDefined();
      expect(result.errors?.confirmPassword).toBeDefined();
      expect(mockCreateClient).not.toHaveBeenCalled();
      expect(mockSignUp).not.toHaveBeenCalled();
    });

    it("handles duplicate email in an account-enumeration resistant manner", async () => {
      mockSignUp.mockResolvedValueOnce({
        data: { user: null, session: null },
        error: {
          message: "User already registered",
          status: 422,
          code: "user_already_exists",
        },
      });

      const result = await registerLearner({
        fullName: "Existing Learner",
        email: "existing@example.com",
        password: "ValidPassword1",
        confirmPassword: "ValidPassword1",
      });

      // Does not reveal that the account exists; presents standard confirmation state
      expect(result.success).toBe(true);
      expect(result.email).toBe("existing@example.com");
      expect(result.errors).toBeUndefined();
    });

    it("handles rate limiting errors with a friendly user-facing message", async () => {
      mockSignUp.mockResolvedValueOnce({
        data: { user: null, session: null },
        error: {
          message: "Email rate limit exceeded",
          status: 429,
          code: "over_email_send_rate_limit",
        },
      });

      const result = await registerLearner({
        fullName: "Fast User",
        email: "fast@example.com",
        password: "ValidPassword1",
        confirmPassword: "ValidPassword1",
      });

      expect(result.success).toBe(false);
      expect(result.errors?.form).toMatch(/too many registration attempts/i);
    });

    it("handles unconfigured Supabase environment gracefully without leaking internals", async () => {
      mockCreateClient.mockRejectedValueOnce(
        new SupabaseConfigurationError("Missing NEXT_PUBLIC_SUPABASE_URL"),
      );

      const result = await registerLearner({
        fullName: "Amara Okeke",
        email: "amara@example.com",
        password: "ValidPassword1",
        confirmPassword: "ValidPassword1",
      });

      expect(result.success).toBe(false);
      expect(result.errors?.form).toMatch(/registration service is temporarily unavailable/i);
      expect(result.errors?.form).not.toContain("NEXT_PUBLIC_SUPABASE_URL");
    });
  });

  describe("Server Action: registerLearnerAction(prevState, formData)", () => {
    it("extracts and validates FormData fields correctly", async () => {
      const formData = new FormData();
      formData.set("fullName", "Zainab Ahmed");
      formData.set("email", "zainab@example.com");
      formData.set("password", "Pass4Zainab");
      formData.set("confirmPassword", "Pass4Zainab");
      formData.set("next", "/courses");

      const result = await registerLearnerAction({ success: false }, formData);
      expect(result.success).toBe(true);
      expect(result.email).toBe("zainab@example.com");
      expect(result.fullName).toBe("Zainab Ahmed");
    });
  });

  describe("UI Component: RegisterForm", () => {
    it("renders all required input fields, labels, and autocomplete attributes", () => {
      render(<RegisterForm />);

      const nameInput = screen.getByLabelText(/legal full name/i);
      expect(nameInput).toBeInTheDocument();
      expect(nameInput).toHaveAttribute("autocomplete", "name");
      expect(nameInput).toBeRequired();

      const emailInput = screen.getByLabelText(/email address/i);
      expect(emailInput).toBeInTheDocument();
      expect(emailInput).toHaveAttribute("autocomplete", "email");
      expect(emailInput).toHaveAttribute("type", "email");
      expect(emailInput).toBeRequired();

      const passwordInput = screen.getByLabelText(/^password/i);
      expect(passwordInput).toBeInTheDocument();
      expect(passwordInput).toHaveAttribute("autocomplete", "new-password");
      expect(passwordInput).toHaveAttribute("type", "password");
      expect(passwordInput).toBeRequired();

      const confirmInput = screen.getByLabelText(/confirm password/i);
      expect(confirmInput).toBeInTheDocument();
      expect(confirmInput).toHaveAttribute("autocomplete", "new-password");
      expect(confirmInput).toHaveAttribute("type", "password");
      expect(confirmInput).toBeRequired();

      const submitButton = screen.getByRole("button", { name: /create learner account/i });
      expect(submitButton).toBeInTheDocument();
    });

    it("toggles password visibility when the show/hide button is clicked", () => {
      render(<RegisterForm />);

      const passwordInput = screen.getByLabelText(/^password/i);
      const toggleButton = screen.getByRole("button", { name: /^show password$/i });

      expect(passwordInput).toHaveAttribute("type", "password");
      expect(toggleButton).toHaveAttribute("aria-pressed", "false");

      // Click to reveal password
      fireEvent.click(toggleButton);
      expect(passwordInput).toHaveAttribute("type", "text");
      expect(screen.getByRole("button", { name: /^hide password$/i })).toHaveAttribute(
        "aria-pressed",
        "true",
      );

      // Click to hide password again
      fireEvent.click(screen.getByRole("button", { name: /^hide password$/i }));
      expect(passwordInput).toHaveAttribute("type", "password");
    });

    it("displays certificate legal name warning and privacy policy notice", () => {
      render(<RegisterForm />);

      expect(screen.getByText(/must match your official identification/i)).toBeInTheDocument();
      expect(
        screen.getByText(/your email address will be used exclusively for account verification/i),
      ).toBeInTheDocument();
    });

    it("does not render a dead or broken link to /login", () => {
      render(<RegisterForm />);

      const links = screen.queryAllByRole("link");
      const loginLink = links.find((l) => l.getAttribute("href") === "/login");
      expect(loginLink).toBeUndefined();

      expect(screen.getByText(/learner login available in phase 5.3/i)).toBeInTheDocument();
    });

    it("meets automated accessibility standards (axe-core zero violations)", async () => {
      const { container } = render(<RegisterForm />);
      const results = await axe.run(container);
      expect(results.violations).toEqual([]);
    });
  });

  describe("Server Component: RegisterPage (/register)", () => {
    it("renders page title, intro text, and certificate advisory banner", async () => {
      const pageJsx = await RegisterPage({ searchParams: Promise.resolve({}) });
      render(pageJsx);

      expect(
        screen.getByRole("heading", { level: 1, name: /start your swimming education/i }),
      ).toBeInTheDocument();
      expect(screen.getByText(/certificate accuracy notice/i)).toBeInTheDocument();
      expect(
        screen.getByText(/course completion certificates will be minted permanently/i),
      ).toBeInTheDocument();
    });
  });
});
