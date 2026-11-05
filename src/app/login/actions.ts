"use server";

/**
 * SwimNigeria — Learner Login & Logout Server Actions
 *
 * Responsibilities:
 * - Validates login credentials server-side using Zod (`loginSchema`).
 * - Authenticates learner via Supabase Auth `signInWithPassword`.
 * - Sets and synchronizes session cookies via `@supabase/ssr` server client.
 * - Detects unverified email status cleanly via Supabase Auth error code or status.
 * - Enforces safe, same-origin post-login and post-logout redirects using `sanitizeRedirectUrl`.
 * - Provides secure logout action via `signOut()`.
 *
 * Security & Phase Discipline (Phase 5.3):
 * - Zero Service-Role Key usage: strictly anon public key through `createClient()`.
 * - Never returns raw server errors, exceptions, or database details to the client.
 * - Never logs passwords, tokens, session cookies, or sensitive authentication payloads.
 * - Protects against open-redirect attacks by sanitizing all redirect URLs.
 * - Does not invent unbuilt dashboard routes; defaults to `/courses` (the active learning catalogue).
 * - Does not permit arbitrary role escalation or metadata modifications.
 */

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getTrustedAppOrigin, SupabaseConfigurationError } from "@/lib/supabase/env";
import { sanitizeRedirectUrl } from "@/lib/supabase/redirect";
import { loginSchema, type LoginFieldErrors } from "@/lib/validation/auth";

export interface LoginActionResult {
  success: boolean;
  redirectTo?: string;
  isUnverified?: boolean;
  email?: string;
  errors?: LoginFieldErrors;
}

export const INITIAL_LOGIN_STATE: LoginActionResult = {
  success: false,
};

/**
 * Core login business logic.
 * Callable directly by programmatic callers, tests, or the Form Server Action.
 */
export async function loginLearner(
  rawInput: Record<string, unknown>,
  candidateNext?: string | null,
): Promise<LoginActionResult> {
  // 1. Strict server-side Zod validation
  const validation = loginSchema.safeParse(rawInput);

  if (!validation.success) {
    const flattened = validation.error.flatten();
    const fieldErrors: LoginFieldErrors = {};

    if (flattened.fieldErrors.email?.[0]) {
      fieldErrors.email = flattened.fieldErrors.email[0];
    }
    if (flattened.fieldErrors.password?.[0]) {
      fieldErrors.password = flattened.fieldErrors.password[0];
    }

    return {
      success: false,
      errors: fieldErrors,
    };
  }

  const { email, password } = validation.data;

  // 2. Sanitize candidate redirect target
  const origin = getTrustedAppOrigin();
  const safeNext = sanitizeRedirectUrl(candidateNext, origin, "/courses");

  // 3. Initialize Supabase Server Client
  let supabase;
  try {
    supabase = await createClient();
  } catch (err) {
    if (err instanceof SupabaseConfigurationError) {
      console.error(
        "[LoginAction] Authentication temporarily unavailable: Supabase public environment is unconfigured or placeholder.",
      );
      return {
        success: false,
        errors: {
          form: "Login service is temporarily unavailable. Please try again later or contact support.",
        },
      };
    }

    console.error(
      "[LoginAction] Unexpected initialization error:",
      err instanceof Error ? err.message : "Unknown",
    );
    return {
      success: false,
      errors: {
        form: "Login service is temporarily unavailable. Please try again later.",
      },
    };
  }

  // 4. Authenticate using Supabase Auth signInWithPassword
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      // Check for unverified email error code or message
      const isEmailNotConfirmed =
        error.code === "email_not_confirmed" ||
        error.message?.toLowerCase().includes("email not confirmed");

      if (isEmailNotConfirmed) {
        return {
          success: false,
          isUnverified: true,
          email,
          errors: {
            form: "Email verification required. Please check your inbox and verify your email address before logging in.",
          },
        };
      }

      // Check for rate limit
      if (
        error.status === 429 ||
        error.code === "over_request_rate_limit" ||
        error.message?.toLowerCase().includes("rate limit")
      ) {
        return {
          success: false,
          errors: {
            form: "Too many login attempts. Please wait a few minutes before trying again.",
          },
        };
      }

      // Invalid credentials or generic auth rejection
      // Do not reveal whether user exists or if only the password was wrong
      if (
        error.code === "invalid_credentials" ||
        error.status === 400 ||
        error.message?.toLowerCase().includes("invalid login credentials")
      ) {
        return {
          success: false,
          errors: {
            form: "Invalid email or password. Please verify your credentials and try again.",
          },
        };
      }

      // Diagnostic server-side log (no secret or credential leakage)
      console.error(`[LoginAction] Supabase login rejection: status ${error.status}`);

      return {
        success: false,
        errors: {
          form: "Unable to complete login at this time. Please check your details and try again.",
        },
      };
    }

    // 5. Successful authentication
    if (data.session && data.user) {
      return {
        success: true,
        redirectTo: safeNext,
      };
    }

    return {
      success: false,
      errors: {
        form: "Authentication completed but no active session was established. Please try again.",
      },
    };
  } catch (err) {
    console.error(
      "[LoginAction] Unexpected login exception:",
      err instanceof Error ? err.message : "Unknown",
    );
    return {
      success: false,
      errors: {
        form: "An unexpected error occurred during login. Please try again later.",
      },
    };
  }
}

/**
 * Next.js React 19 Server Action for form submission.
 */
export async function loginLearnerAction(
  _prevState: LoginActionResult,
  formData: FormData,
): Promise<LoginActionResult> {
  const rawInput = {
    email: formData.get("email"),
    password: formData.get("password"),
  };

  const candidateNext = formData.get("next") as string | null;

  return loginLearner(rawInput, candidateNext);
}

export interface LogoutActionResult {
  success: boolean;
  error?: string;
}

/**
 * Server action to sign out a learner and redirect to the public home page.
 */
export async function logoutLearnerAction(
  candidateNext?: string | null,
): Promise<LogoutActionResult> {
  const origin = getTrustedAppOrigin();
  const safeNext = sanitizeRedirectUrl(candidateNext, origin, "/");

  try {
    const supabase = await createClient();
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error(`[LogoutAction] Supabase signOut error: status ${error.status}`);
      return {
        success: false,
        error: "Unable to sign out cleanly. Please try again.",
      };
    }
  } catch (err) {
    console.error(
      "[LogoutAction] Unexpected sign-out exception:",
      err instanceof Error ? err.message : "Unknown",
    );
    return {
      success: false,
      error: "An unexpected error occurred during sign out.",
    };
  }

  // Redirect to safe target
  redirect(safeNext);
}
