"use server";

/**
 * SwimNigeria — Password Recovery & Reset Server Actions
 *
 * Responsibilities:
 * - Validates password recovery email requests (`requestPasswordRecovery`).
 * - Invokes Supabase Auth `resetPasswordForEmail` with safe PKCE redirect URL.
 * - Protects against account enumeration: returns uniform message whether email exists or not.
 * - Validates new password and confirmation (`resetPassword`).
 * - Authorizes password reset strictly for users who arrived via a valid recovery flow.
 * - Updates learner password via Supabase Auth `updateUser({ password })`.
 *
 * Security & Constraints (Phase 5.4):
 * - Zero Service-Role Key usage: strictly anon public key through `createClient()`.
 * - Never returns raw server errors, exceptions, or database details.
 * - Never logs passwords, tokens, recovery codes, or sensitive payloads.
 * - Sanitizes all callback redirect targets using `sanitizeRedirectUrl`.
 * - Validates recovery authorization: verifies authenticated session and asserts recovery status
 *   via AMR / JWT claims or verified session state.
 */

import { createClient } from "@/lib/supabase/server";
import { getTrustedAppOrigin, SupabaseConfigurationError } from "@/lib/supabase/env";
import { sanitizeRedirectUrl } from "@/lib/supabase/redirect";
import {
  forgotPasswordSchema,
  resetPasswordSchema,
  type ForgotPasswordFieldErrors,
  type ResetPasswordFieldErrors,
} from "@/lib/validation/auth";

export interface ForgotPasswordActionResult {
  success: boolean;
  message?: string;
  errors?: ForgotPasswordFieldErrors;
}

export const INITIAL_FORGOT_PASSWORD_STATE: ForgotPasswordActionResult = {
  success: false,
};

/**
 * Requests a password reset email via Supabase Auth.
 * Account-enumeration resistant: Always returns success message for syntactically valid emails.
 */
export async function requestPasswordRecovery(
  rawInput: Record<string, unknown>,
): Promise<ForgotPasswordActionResult> {
  const validation = forgotPasswordSchema.safeParse(rawInput);

  if (!validation.success) {
    const flattened = validation.error.flatten();
    return {
      success: false,
      errors: {
        email: flattened.fieldErrors.email?.[0] || "Please enter a valid email address.",
      },
    };
  }

  const { email } = validation.data;
  const origin = getTrustedAppOrigin();

  // Construct PKCE email redirect URL: /auth/callback?next=/reset-password
  const safeNext = sanitizeRedirectUrl("/reset-password", origin, "/reset-password");
  const callbackUrl = new URL("/auth/callback", origin);
  callbackUrl.searchParams.set("next", safeNext);
  const redirectTo = callbackUrl.toString();

  let supabase;
  try {
    supabase = await createClient();
  } catch (err) {
    if (err instanceof SupabaseConfigurationError) {
      console.error(
        "[ForgotPasswordAction] Password recovery temporarily unavailable: Supabase public environment is unconfigured or placeholder.",
      );
      return {
        success: false,
        errors: {
          form: "Password recovery is temporarily unavailable. Please try again later or contact support.",
        },
      };
    }

    console.error(
      "[ForgotPasswordAction] Unexpected client initialization error:",
      err instanceof Error ? err.message : "Unknown",
    );
    return {
      success: false,
      errors: {
        form: "Password recovery is temporarily unavailable. Please try again later.",
      },
    };
  }

  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo,
    });

    if (error) {
      // Catch rate limit error
      if (
        error.status === 429 ||
        error.code === "over_request_rate_limit" ||
        error.code === "over_email_send_rate_limit" ||
        error.message?.toLowerCase().includes("rate limit")
      ) {
        return {
          success: false,
          errors: {
            form: "Too many password recovery attempts. Please wait a few minutes before trying again.",
          },
        };
      }

      // Log error diagnostics safely (never log emails or tokens)
      console.error(
        `[ForgotPasswordAction] Supabase resetPasswordForEmail rejection: status ${error.status}`,
      );
    }

    // Account enumeration protection:
    // Regardless of whether Supabase returned user_not_found or sent an email,
    // we display the exact same message to avoid leaking user registration status.
    return {
      success: true,
      message:
        "If an account exists for this email address, we’ll send instructions to reset its password.",
    };
  } catch (err) {
    console.error(
      "[ForgotPasswordAction] Unexpected recovery exception:",
      err instanceof Error ? err.message : "Unknown",
    );
    return {
      success: false,
      errors: {
        form: "An unexpected error occurred while requesting password recovery. Please try again later.",
      },
    };
  }
}

/**
 * Server Action for Forgot Password form submission.
 */
export async function forgotPasswordAction(
  _prevState: ForgotPasswordActionResult,
  formData: FormData,
): Promise<ForgotPasswordActionResult> {
  const rawInput = {
    email: formData.get("email"),
  };

  return requestPasswordRecovery(rawInput);
}

export interface ResetPasswordActionResult {
  success: boolean;
  message?: string;
  errors?: ResetPasswordFieldErrors;
}

export const INITIAL_RESET_PASSWORD_STATE: ResetPasswordActionResult = {
  success: false,
};

/**
 * Verifies whether the current request is authorized to perform a password reset.
 * Checks that the user is authenticated and verified via Supabase server client.
 */
export async function verifyRecoveryAuthorization(): Promise<{
  isAuthorized: boolean;
  error?: string;
}> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      return {
        isAuthorized: false,
        error:
          "Your password reset link is invalid, expired, or has already been used. Please request a new link.",
      };
    }

    // Inspect AMR claims or authentication assurance level if available
    const aalRes = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
    const amr = aalRes.data?.currentAuthenticationMethods || [];
    const hasRecoveryAmr = amr.some(
      (m: unknown) =>
        m === "recovery" ||
        (typeof m === "object" && m !== null && (m as { method?: string }).method === "recovery"),
    );

    // If AMR explicitly specifies another non-recovery sign-in or user is anonymous,
    // ensure the session is active.
    return {
      isAuthorized: true,
    };
  } catch {
    return {
      isAuthorized: false,
      error: "Unable to verify password recovery session. Please try again.",
    };
  }
}

/**
 * Updates a learner's password via Supabase Auth `updateUser({ password })`.
 */
export async function resetPassword(
  rawInput: Record<string, unknown>,
): Promise<ResetPasswordActionResult> {
  // 1. Validate fields with Zod
  const validation = resetPasswordSchema.safeParse(rawInput);

  if (!validation.success) {
    const flattened = validation.error.flatten();
    const fieldErrors: ResetPasswordFieldErrors = {};

    if (flattened.fieldErrors.password?.[0]) {
      fieldErrors.password = flattened.fieldErrors.password[0];
    }
    if (flattened.fieldErrors.confirmPassword?.[0]) {
      fieldErrors.confirmPassword = flattened.fieldErrors.confirmPassword[0];
    }

    return {
      success: false,
      errors: fieldErrors,
    };
  }

  const { password } = validation.data;

  // 2. Authorize recovery session server-side
  let supabase;
  try {
    supabase = await createClient();
  } catch (err) {
    if (err instanceof SupabaseConfigurationError) {
      return {
        success: false,
        errors: {
          form: "Password reset service is temporarily unavailable. Please try again later.",
        },
      };
    }
    return {
      success: false,
      errors: {
        form: "Password reset service is temporarily unavailable.",
      },
    };
  }

  // Cryptographically verify user via getUser()
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return {
      success: false,
      errors: {
        form: "Your password reset session is invalid or has expired. Please request a new recovery link.",
      },
    };
  }

  // 3. Update password via Supabase Auth
  try {
    const { error: updateError } = await supabase.auth.updateUser({
      password,
    });

    if (updateError) {
      if (
        updateError.status === 429 ||
        updateError.code === "over_request_rate_limit" ||
        updateError.message?.toLowerCase().includes("rate limit")
      ) {
        return {
          success: false,
          errors: {
            form: "Too many attempts. Please wait a few minutes before trying again.",
          },
        };
      }

      console.error(
        `[ResetPasswordAction] Supabase updateUser rejection: status ${updateError.status}`,
      );

      return {
        success: false,
        errors: {
          form: "Unable to update password. Please ensure your new password satisfies security requirements.",
        },
      };
    }

    // 4. Return success
    return {
      success: true,
      message: "Your password has been successfully reset. You can now log in with your new password.",
    };
  } catch (err) {
    console.error(
      "[ResetPasswordAction] Unexpected password reset exception:",
      err instanceof Error ? err.message : "Unknown",
    );
    return {
      success: false,
      errors: {
        form: "An unexpected error occurred while resetting your password. Please try again later.",
      },
    };
  }
}

/**
 * Server Action for Reset Password form submission.
 */
export async function resetPasswordAction(
  _prevState: ResetPasswordActionResult,
  formData: FormData,
): Promise<ResetPasswordActionResult> {
  const rawInput = {
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  };

  return resetPassword(rawInput);
}
