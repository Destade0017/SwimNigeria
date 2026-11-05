/**
 * SwimNigeria — Authentication Validation Schemas
 *
 * Responsibilities:
 * - Provides explicit, runtime schema validation for user registration using Zod.
 * - Enforces minimum password strength requirements per PRD §3.4 and Security §2.1.
 * - Validates and normalizes user input (trimming names, lowercasing emails).
 * - Enforces equality between password and confirmation.
 * - Used both server-side in Server Actions and client-side for rapid user feedback.
 */

import { z } from "zod";

/**
 * Registration Input Schema
 *
 * Password complexity justification:
 * PRD §3.4 and Security §2.1 require a minimum of 8 characters, with at least
 * one letter and at least one number, to prevent weak or easily dictionary-attacked passwords.
 * Max length of 72 characters aligns with standard bcrypt / hashing limits.
 */
export const registerSchema = z
  .object({
    fullName: z
      .string("Full name is required.")
      .trim()
      .min(2, "Full name must be at least 2 characters long.")
      .max(100, "Full name cannot exceed 100 characters.")
      .refine((val) => val.trim().length > 0, {
        message: "Full name cannot be blank.",
      }),
    email: z
      .string("Email address is required.")
      .trim()
      .toLowerCase()
      .email("Please enter a valid email address.")
      .max(255, "Email address cannot exceed 255 characters."),
    password: z
      .string("Password is required.")
      .min(8, "Password must be at least 8 characters long.")
      .max(72, "Password cannot exceed 72 characters.")
      .regex(/[A-Za-z]/, "Password must contain at least one letter.")
      .regex(/\d/, "Password must contain at least one number."),
    confirmPassword: z.string("Please confirm your password."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

export type RegisterInput = z.infer<typeof registerSchema>;

export type RegisterFieldErrors = {
  fullName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  form?: string;
};

/**
 * Login Input Schema
 *
 * Responsibilities:
 * - Validates email and password format before invoking authentication.
 * - Enforces required fields, string trimming, and email formatting.
 */
export const loginSchema = z.object({
  email: z
    .string("Email address is required.")
    .trim()
    .toLowerCase()
    .email("Please enter a valid email address.")
    .max(255, "Email address cannot exceed 255 characters."),
  password: z
    .string("Password is required.")
    .min(1, "Password is required.")
    .max(72, "Password cannot exceed 72 characters."),
});

export type LoginInput = z.infer<typeof loginSchema>;

export type LoginFieldErrors = {
  email?: string;
  password?: string;
  form?: string;
};

/**
 * Forgot Password Input Schema
 *
 * Responsibilities:
 * - Validates email format for password recovery requests.
 * - Normalizes email (trim, lowercase).
 */
export const forgotPasswordSchema = z.object({
  email: z
    .string("Email address is required.")
    .trim()
    .toLowerCase()
    .email("Please enter a valid email address.")
    .max(255, "Email address cannot exceed 255 characters."),
});

export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;

export type ForgotPasswordFieldErrors = {
  email?: string;
  form?: string;
};

/**
 * Reset Password Input Schema
 *
 * Requirements:
 * - Validates new password and password confirmation.
 * - Minimum length: 8 characters, maximum 72 characters.
 * - Confirms password matching without arbitrary complexity restrictions.
 */
export const resetPasswordSchema = z
  .object({
    password: z
      .string("Password is required.")
      .min(8, "Password must be at least 8 characters long.")
      .max(72, "Password cannot exceed 72 characters."),
    confirmPassword: z.string("Please confirm your password."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;

export type ResetPasswordFieldErrors = {
  password?: string;
  confirmPassword?: string;
  form?: string;
};
