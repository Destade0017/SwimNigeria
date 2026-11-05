import React from "react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import axe from "axe-core";
import { ForgotPasswordForm } from "@/app/forgot-password/forgot-password-form";
import ForgotPasswordPage from "@/app/forgot-password/page";
import { ResetPasswordForm } from "@/app/reset-password/reset-password-form";
import ResetPasswordPage from "@/app/reset-password/page";
import {
  requestPasswordRecovery,
  forgotPasswordAction,
  resetPassword,
  resetPasswordAction,
  verifyRecoveryAuthorization,
} from "@/app/forgot-password/actions";
import { SupabaseConfigurationError } from "@/lib/supabase/env";

const mockResetPasswordForEmail = vi.fn();
const mockUpdateUser = vi.fn();
const mockGetUser = vi.fn();
const mockGetAuthenticatorAssuranceLevel = vi.fn();
const mockCreateClient = vi.fn();

vi.mock("@/lib/supabase/server", () => ({
  createClient: () => mockCreateClient(),
}));

describe("Password Recovery & Reset (Phase 5.4)", () => {
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
        resetPasswordForEmail: mockResetPasswordForEmail,
        updateUser: mockUpdateUser,
        getUser: mockGetUser,
        mfa: {
          getAuthenticatorAssuranceLevel: mockGetAuthenticatorAssuranceLevel,
        },
      },
    });

    mockResetPasswordForEmail.mockResolvedValue({ error: null });
    mockUpdateUser.mockResolvedValue({ data: { user: { id: "user-123" } }, error: null });
    mockGetUser.mockResolvedValue({
      data: { user: { id: "user-123", email: "learner@example.com" } },
      error: null,
    });
    mockGetAuthenticatorAssuranceLevel.mockResolvedValue({
      data: { currentLevel: "aal1", currentAuthenticationMethods: ["recovery"] },
      error: null,
    });
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  describe("Server Action: requestPasswordRecovery()", () => {
    it("calls resetPasswordForEmail with safe redirect url and returns enumeration-resistant message", async () => {
      const result = await requestPasswordRecovery({ email: "learner@example.com" });

      expect(result.success).toBe(true);
      expect(result.message).toMatch(/if an account exists for this email address/i);
      expect(mockResetPasswordForEmail).toHaveBeenCalledWith(
        "learner@example.com",
        expect.objectContaining({
          redirectTo: "https://swimnigeria.org/auth/callback?next=%2Freset-password",
        }),
      );
    });

    it("returns enumeration-resistant success message even when Supabase reports user not found", async () => {
      mockResetPasswordForEmail.mockResolvedValue({
        error: { message: "User not found", status: 400 },
      });

      const result = await requestPasswordRecovery({ email: "unknown@example.com" });
      expect(result.success).toBe(true);
      expect(result.message).toMatch(/if an account exists for this email address/i);
    });

    it("rejects invalid email without invoking Supabase", async () => {
      const result = await requestPasswordRecovery({ email: "not-an-email" });

      expect(result.success).toBe(false);
      expect(result.errors?.email).toBeDefined();
      expect(mockResetPasswordForEmail).not.toHaveBeenCalled();
    });

    it("handles rate limiting safely", async () => {
      mockResetPasswordForEmail.mockResolvedValue({
        error: {
          name: "AuthApiError",
          status: 429,
          code: "over_email_send_rate_limit",
          message: "Rate limit exceeded",
        },
      });

      const result = await requestPasswordRecovery({ email: "learner@example.com" });
      expect(result.success).toBe(false);
      expect(result.errors?.form).toMatch(/too many password recovery attempts/i);
    });

    it("handles unconfigured Supabase environment gracefully", async () => {
      mockCreateClient.mockRejectedValueOnce(
        new SupabaseConfigurationError("Missing Supabase URL"),
      );

      const result = await requestPasswordRecovery({ email: "learner@example.com" });
      expect(result.success).toBe(false);
      expect(result.errors?.form).toMatch(/temporarily unavailable/i);
    });
  });

  describe("Form Server Action: forgotPasswordAction()", () => {
    it("processes form submission", async () => {
      const formData = new FormData();
      formData.set("email", "amina@example.com");

      const result = await forgotPasswordAction({ success: false }, formData);
      expect(result.success).toBe(true);
    });
  });

  describe("Recovery Authorization: verifyRecoveryAuthorization()", () => {
    it("authorizes session when valid user exists", async () => {
      const res = await verifyRecoveryAuthorization();
      expect(res.isAuthorized).toBe(true);
    });

    it("rejects when no authenticated user exists", async () => {
      mockGetUser.mockResolvedValue({ data: { user: null }, error: new Error("Unauthorized") });

      const res = await verifyRecoveryAuthorization();
      expect(res.isAuthorized).toBe(false);
      expect(res.error).toMatch(/invalid, expired, or has already been used/i);
    });
  });

  describe("Server Action: resetPassword()", () => {
    it("successfully updates password with valid input and authorized session", async () => {
      const result = await resetPassword({
        password: "NewStrongPassword123",
        confirmPassword: "NewStrongPassword123",
      });

      expect(result.success).toBe(true);
      expect(result.message).toMatch(/successfully reset/i);
      expect(mockUpdateUser).toHaveBeenCalledWith({
        password: "NewStrongPassword123",
      });
    });

    it("rejects submission when password validation fails", async () => {
      const result = await resetPassword({
        password: "short",
        confirmPassword: "short",
      });

      expect(result.success).toBe(false);
      expect(result.errors?.password).toBeDefined();
      expect(mockUpdateUser).not.toHaveBeenCalled();
    });

    it("rejects submission when passwords mismatch", async () => {
      const result = await resetPassword({
        password: "Password123",
        confirmPassword: "DifferentPassword123",
      });

      expect(result.success).toBe(false);
      expect(result.errors?.confirmPassword).toBeDefined();
      expect(mockUpdateUser).not.toHaveBeenCalled();
    });

    it("rejects password update if user session has expired", async () => {
      mockGetUser.mockResolvedValue({ data: { user: null }, error: new Error("Session expired") });

      const result = await resetPassword({
        password: "NewStrongPassword123",
        confirmPassword: "NewStrongPassword123",
      });

      expect(result.success).toBe(false);
      expect(result.errors?.form).toMatch(/invalid or has expired/i);
      expect(mockUpdateUser).not.toHaveBeenCalled();
    });

    it("handles update rate limiting safely", async () => {
      mockUpdateUser.mockResolvedValue({
        error: {
          name: "AuthApiError",
          status: 429,
          code: "over_request_rate_limit",
          message: "Rate limit",
        },
      });

      const result = await resetPassword({
        password: "NewStrongPassword123",
        confirmPassword: "NewStrongPassword123",
      });

      expect(result.success).toBe(false);
      expect(result.errors?.form).toMatch(/too many attempts/i);
    });
  });

  describe("Form Server Action: resetPasswordAction()", () => {
    it("processes reset password form data", async () => {
      const formData = new FormData();
      formData.set("password", "NewPassword99");
      formData.set("confirmPassword", "NewPassword99");

      const result = await resetPasswordAction({ success: false }, formData);
      expect(result.success).toBe(true);
    });
  });

  describe("UI Components & Accessibility", () => {
    it("renders ForgotPasswordPage with semantic heading structure", () => {
      render(<ForgotPasswordPage />);

      expect(
        screen.getByRole("heading", { level: 1, name: /forgot your password\?/i }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("heading", { level: 2, name: /reset your password/i }),
      ).toBeInTheDocument();
      expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /send recovery email/i })).toBeInTheDocument();
    });

    it("renders ResetPasswordPage with authorized form", async () => {
      const pageJsx = await ResetPasswordPage();
      render(pageJsx);

      expect(
        screen.getByRole("heading", { level: 1, name: /reset your password/i }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("heading", { level: 2, name: /create new password/i }),
      ).toBeInTheDocument();
      expect(screen.getByLabelText(/new password/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/confirm new password/i)).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /update password/i })).toBeInTheDocument();
    });

    it("renders unauthorized state on ResetPasswordPage when link is expired", async () => {
      mockGetUser.mockResolvedValue({ data: { user: null }, error: new Error("Expired") });

      const pageJsx = await ResetPasswordPage();
      render(pageJsx);

      expect(
        screen.getByRole("heading", { level: 2, name: /invalid or expired reset link/i }),
      ).toBeInTheDocument();
      expect(screen.getByRole("link", { name: /request new reset link/i })).toBeInTheDocument();
    });

    it("toggles password visibility on ResetPasswordForm", () => {
      render(<ResetPasswordForm />);

      const passwordInput = screen.getByLabelText(/^new password/i);
      const toggleBtn = screen.getByRole("button", { name: /^show password$/i });

      expect(passwordInput).toHaveAttribute("type", "password");
      fireEvent.click(toggleBtn);
      expect(passwordInput).toHaveAttribute("type", "text");
    });

    it("satisfies axe-core accessibility standards on ForgotPasswordForm", async () => {
      const { container } = render(<ForgotPasswordForm />);
      const results = await axe.run(container);
      expect(results.violations).toEqual([]);
    });

    it("satisfies axe-core accessibility standards on ResetPasswordForm", async () => {
      const { container } = render(<ResetPasswordForm />);
      const results = await axe.run(container);
      expect(results.violations).toEqual([]);
    });
  });
});
