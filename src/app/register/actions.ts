"use server";

/**
 * SwimNigeria — Learner Registration Server Action
 *
 * Responsibilities:
 * - Validates learner registration payloads server-side using Zod.
 * - Invokes Supabase Auth `signUp` with email confirmation enabled.
 * - Passes full name strictly as non-authoritative profile metadata in user_metadata.
 * - Constructs safe, same-origin email confirmation redirect URLs through /auth/callback.
 * - Sanitizes post-confirmation return targets using `sanitizeRedirectUrl`.
 * - Employs account-enumeration resistant responses for duplicate sign-ups.
 * - Protects against sensitive data leakage: never logs passwords, codes, or tokens.
 *
 * Architectural & Security Constraints (Phase 5.2):
 * - Zero Service-Role Key usage: strictly anon public key through `createClient()`.
 * - Non-Authoritative Metadata: `full_name` stored in `user_metadata` is temporary profile
 *   storage pending the dedicated `profiles` table in Phase 5.5. It must NEVER be used
 *   for authorization decisions or RLS policies.
 * - No Privilege Escalation: incoming payloads cannot set roles, permissions, or admin claims.
 * - Mandatory Email Verification: accounts remain unverified until the PKCE code exchange
 *   succeeds via /auth/callback. No automatic course enrolment or dashboard access.
 */

import { createClient } from "@/lib/supabase/server";
import { getTrustedAppOrigin, SupabaseConfigurationError } from "@/lib/supabase/env";
import { sanitizeRedirectUrl } from "@/lib/supabase/redirect";
import { registerSchema, type RegisterFieldErrors } from "@/lib/validation/auth";

export interface RegisterActionResult {
  success: boolean;
  email?: string;
  fullName?: string;
  errors?: RegisterFieldErrors;
}

export const INITIAL_REGISTER_STATE: RegisterActionResult = {
  success: false,
};

/**
 * Core registration business logic.
 * Callable directly by programmatic callers, tests, or the Form Server Action.
 */
export async function registerLearner(
  rawInput: Record<string, unknown>,
  candidateNext?: string | null,
): Promise<RegisterActionResult> {
  // 1. Strict server-side Zod validation
  const validation = registerSchema.safeParse(rawInput);

  if (!validation.success) {
    const flattened = validation.error.flatten();
    const fieldErrors: RegisterFieldErrors = {};

    if (flattened.fieldErrors.fullName?.[0]) {
      fieldErrors.fullName = flattened.fieldErrors.fullName[0];
    }
    if (flattened.fieldErrors.email?.[0]) {
      fieldErrors.email = flattened.fieldErrors.email[0];
    }
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

  const { fullName, email, password } = validation.data;

  // 2. Resolve trusted origin & sanitize post-confirmation redirect target
  const origin = getTrustedAppOrigin();
  const safeNext = sanitizeRedirectUrl(candidateNext, origin, "/courses");

  // Construct PKCE email redirect URL: /auth/callback?next=<safeNext>
  const callbackUrl = new URL("/auth/callback", origin);
  callbackUrl.searchParams.set("next", safeNext);
  const emailRedirectTo = callbackUrl.toString();

  // 3. Initialize Supabase Server Client
  let supabase;
  try {
    supabase = await createClient();
  } catch (err) {
    if (err instanceof SupabaseConfigurationError) {
      // Diagnostic server-side log with zero secret leakage
      console.error(
        "[RegisterAction] Registration temporarily unavailable: Supabase public environment is unconfigured or placeholder.",
      );
      return {
        success: false,
        errors: {
          form: "Registration service is temporarily unavailable. Please try again later or contact support.",
        },
      };
    }

    console.error(
      "[RegisterAction] Unexpected initialization error:",
      err instanceof Error ? err.message : "Unknown",
    );
    return {
      success: false,
      errors: {
        form: "Registration service is temporarily unavailable. Please try again later.",
      },
    };
  }

  // 4. Call Supabase Auth signUp
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          // Non-authoritative metadata: temporary storage pending Phase 5.5 profiles table
          full_name: fullName,
        },
        emailRedirectTo,
      },
    });

    if (error) {
      // Account enumeration resistance:
      // If the email is already registered, Supabase may return user_already_exists or 422.
      // We treat this consistently by presenting the email confirmation state, preventing
      // unauthenticated attackers from verifying whether an email exists in the platform.
      if (
        error.message?.toLowerCase().includes("already registered") ||
        error.message?.toLowerCase().includes("user already exists") ||
        error.code === "user_already_exists"
      ) {
        return {
          success: true,
          email,
          fullName,
        };
      }

      // Rate limit protection feedback
      if (
        error.status === 429 ||
        error.code === "over_email_send_rate_limit" ||
        error.message?.toLowerCase().includes("rate limit")
      ) {
        return {
          success: false,
          errors: {
            form: "Too many registration attempts. Please wait a few minutes before trying again.",
          },
        };
      }

      // Sanitized server diagnostic log (never log passwords or sensitive tokens)
      console.error(
        `[RegisterAction] Supabase registration failure: ${error.message} (status: ${error.status})`,
      );

      return {
        success: false,
        errors: {
          form: "Unable to complete registration at this time. Please check your information and try again.",
        },
      };
    }

    // When email confirmation is enabled, Supabase returns user with pending confirmation.
    // If user already exists and enumeration protection is enabled, Supabase returns identities: [].
    // Both return success: true to maintain enumeration resistance and prompt inbox check.
    if (data.user) {
      return {
        success: true,
        email,
        fullName,
      };
    }

    return {
      success: false,
      errors: {
        form: "Registration request could not be processed. Please try again.",
      },
    };
  } catch (err) {
    // Catch network / unexpected runtime errors
    console.error(
      "[RegisterAction] Unexpected registration exception:",
      err instanceof Error ? err.message : "Unknown",
    );
    return {
      success: false,
      errors: {
        form: "An unexpected error occurred during registration. Please try again later.",
      },
    };
  }
}

/**
 * Next.js React 19 Server Action for form submission.
 */
export async function registerLearnerAction(
  _prevState: RegisterActionResult,
  formData: FormData,
): Promise<RegisterActionResult> {
  const rawInput = {
    fullName: formData.get("fullName"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  };

  const candidateNext = formData.get("next") as string | null;

  return registerLearner(rawInput, candidateNext);
}
