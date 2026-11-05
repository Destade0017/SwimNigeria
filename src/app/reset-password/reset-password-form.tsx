"use client";

/**
 * SwimNigeria — Reset Password Form Component
 *
 * Responsibilities:
 * - Collects new password and password confirmation.
 * - Submits securely to `resetPasswordAction` using React 19 `useActionState`.
 * - Provides accessible inline validation and password visibility toggles.
 * - Displays clear success confirmation with link to `/login`.
 */

import React, { useActionState, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { resetPasswordAction, INITIAL_RESET_PASSWORD_STATE } from "@/app/forgot-password/actions";

export function ResetPasswordForm() {
  const [state, formAction, isPending] = useActionState(
    resetPasswordAction,
    INITIAL_RESET_PASSWORD_STATE,
  );

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <Card className="border-neutral-200 bg-neutral-white shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle as="h2" className="text-xl sm:text-2xl font-bold text-neutral-900">
          Create New Password
        </CardTitle>
        <CardDescription className="text-sm text-neutral-600">
          Please enter and confirm your new secure password.
        </CardDescription>
      </CardHeader>

      <CardContent>
        {/* Success State */}
        {state.success && (
          <div
            role="status"
            className="mb-5 p-4 rounded-xl bg-water-blue-50/80 border border-water-blue-200 text-water-blue-950 text-sm space-y-3"
          >
            <div className="flex items-center gap-2">
              <svg
                className="h-5 w-5 text-water-blue-700 shrink-0"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="font-semibold text-water-blue-900">Password Successfully Reset</span>
            </div>
            <p className="text-xs sm:text-sm text-neutral-700 leading-relaxed">
              {state.message}
            </p>
            <div className="pt-2">
              <Link href="/login" className="w-full inline-block">
                <Button variant="primary" size="md" className="w-full">
                  Sign In with New Password
                </Button>
              </Link>
            </div>
          </div>
        )}

        {/* General Form Error */}
        {state.errors?.form && (
          <div
            role="alert"
            className="mb-5 p-3.5 rounded-lg bg-brand-red-50 border border-brand-red-200 text-brand-red-800 text-sm flex items-start gap-2.5"
          >
            <svg
              className="h-5 w-5 text-brand-red-600 shrink-0 mt-0.5"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            <p className="font-medium">{state.errors.form}</p>
          </div>
        )}

        {!state.success && (
          <form action={formAction} noValidate className="space-y-4">
            {/* New Password */}
            <div>
              <Input
                id="reset-password"
                name="password"
                type={showPassword ? "text" : "password"}
                label="New Password"
                required
                autoComplete="new-password"
                placeholder="At least 8 characters"
                helperText="Must be at least 8 characters in length."
                error={state.errors?.password}
                rightElement={
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    aria-pressed={showPassword}
                    className="p-1.5 text-neutral-500 hover:text-neutral-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red-600 rounded-md transition-colors"
                  >
                    {showPassword ? (
                      <svg
                        className="h-5 w-5"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="h-5 w-5"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                    )}
                  </button>
                }
              />
            </div>

            {/* Confirm New Password */}
            <div>
              <Input
                id="reset-confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                label="Confirm New Password"
                required
                autoComplete="new-password"
                placeholder="Re-enter your new password"
                error={state.errors?.confirmPassword}
                rightElement={
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    aria-label={
                      showConfirmPassword
                        ? "Hide password confirmation"
                        : "Show password confirmation"
                    }
                    aria-pressed={showConfirmPassword}
                    className="p-1.5 text-neutral-500 hover:text-neutral-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red-600 rounded-md transition-colors"
                  >
                    {showConfirmPassword ? (
                      <svg
                        className="h-5 w-5"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="h-5 w-5"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                    )}
                  </button>
                }
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full mt-2"
              isLoading={isPending}
              loadingText="Updating password..."
            >
              Update Password
            </Button>
          </form>
        )}
      </CardContent>

      <CardFooter className="flex flex-col items-center justify-center border-t border-neutral-100 pt-4 text-xs sm:text-sm text-neutral-600 text-center gap-2">
        <div className="flex flex-wrap items-center justify-center gap-1.5">
          <span>Remember your password?</span>
          <Link
            href="/login"
            className="font-semibold text-brand-red-600 hover:text-brand-red-700 underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red-600 rounded-sm"
          >
            Return to sign in
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}
