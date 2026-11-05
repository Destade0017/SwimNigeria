/**
 * SwimNigeria — Shared Authentication Action Result Contracts
 *
 * Responsibilities:
 * - Defines the structured result shapes returned by every authentication Server Action.
 * - Provides the initial `useActionState` snapshots consumed by the login, registration,
 *   and password recovery forms on both the server and the client.
 *
 * Why this is an ordinary module (no `"use server"` directive):
 * - Next.js requires `"use server"` modules to export async functions exclusively. Exporting
 *   a plain object from such a module is rejected by the server references transform and
 *   surfaces to users as an HTTP 500. Keeping result types and initial-state snapshots in a
 *   plain TypeScript module keeps each `actions.ts` module exporting async functions only.
 */

import type {
  ForgotPasswordFieldErrors,
  LoginFieldErrors,
  RegisterFieldErrors,
  ResetPasswordFieldErrors,
} from "@/lib/validation/auth";

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

export interface LogoutActionResult {
  success: boolean;
  error?: string;
}

export interface RegisterActionResult {
  success: boolean;
  email?: string;
  fullName?: string;
  errors?: RegisterFieldErrors;
}

export const INITIAL_REGISTER_STATE: RegisterActionResult = {
  success: false,
};

export interface ForgotPasswordActionResult {
  success: boolean;
  message?: string;
  errors?: ForgotPasswordFieldErrors;
}

export const INITIAL_FORGOT_PASSWORD_STATE: ForgotPasswordActionResult = {
  success: false,
};

export interface ResetPasswordActionResult {
  success: boolean;
  message?: string;
  errors?: ResetPasswordFieldErrors;
}

export const INITIAL_RESET_PASSWORD_STATE: ResetPasswordActionResult = {
  success: false,
};
