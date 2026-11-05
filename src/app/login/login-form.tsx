"use client";

/**
 * SwimNigeria — Learner Login Interactive Form
 *
 * Responsibilities:
 * - Collects email and password.
 * - Submits securely to `loginLearnerAction` Server Action using React 19 `useActionState`.
 * - Provides accessible inline validation error feedback mapped via `aria-describedby` & `aria-invalid`.
 * - Provides accessible password visibility toggle control.
 * - Displays clear feedback for unverified email accounts directing learners to verify their inbox.
 * - Handles client-side navigation on successful login.
 * - Links to `/register` and avoids dead links (e.g. no `/forgot-password` until built).
 */

import React, { useActionState, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
import { Badge } from "@/components/ui/badge";
import { loginLearnerAction, INITIAL_LOGIN_STATE } from "./actions";

interface LoginFormProps {
  returnUrl?: string;
}

export function LoginForm({ returnUrl = "/courses" }: LoginFormProps) {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(loginLearnerAction, INITIAL_LOGIN_STATE);

  const [showPassword, setShowPassword] = useState(false);

  // Navigate on successful login
  useEffect(() => {
    if (state.success && state.redirectTo) {
      router.push(state.redirectTo);
      router.refresh();
    }
  }, [state.success, state.redirectTo, router]);

  return (
    <Card className="border-neutral-200 bg-neutral-white shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle as="h2" className="text-xl sm:text-2xl font-bold text-neutral-900">
          Sign In to SwimNigeria
        </CardTitle>
        <CardDescription className="text-sm text-neutral-600">
          Access your aquatic safety lessons, track course progress, and view earned certificates.
        </CardDescription>
      </CardHeader>

      <CardContent>
        {/* Unverified Email Warning State */}
        {state.isUnverified && (
          <div
            role="alert"
            className="mb-5 p-4 rounded-xl bg-water-blue-50/80 border border-water-blue-200 text-water-blue-950 text-sm space-y-2"
          >
            <div className="flex items-center gap-2">
              <svg
                className="h-5 w-5 text-water-blue-700 shrink-0"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
              <span className="font-semibold text-water-blue-900">Email Verification Required</span>
            </div>
            <p className="text-xs sm:text-sm text-neutral-700 leading-relaxed">
              Before logging in, you must verify your email address. Please click the confirmation
              link sent to{" "}
              {state.email ? (
                <strong className="font-mono text-neutral-900 break-all">{state.email}</strong>
              ) : (
                "your inbox"
              )}
              . If you cannot find the message, check your spam or junk folder.
            </p>
          </div>
        )}

        {/* Form-Level General Error Message */}
        {state.errors?.form && !state.isUnverified && (
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

        <form action={formAction} noValidate className="space-y-4">
          {/* Preserved post-login return URL */}
          <input type="hidden" name="next" value={returnUrl} />

          {/* Email Address Field */}
          <div>
            <Input
              id="login-email"
              name="email"
              type="email"
              label="Email Address"
              required
              autoComplete="email"
              placeholder="e.g., amina@example.com"
              error={state.errors?.email}
            />
          </div>

          {/* Password Field */}
          <div>
            <Input
              id="login-password"
              name="password"
              type={showPassword ? "text" : "password"}
              label="Password"
              required
              autoComplete="current-password"
              placeholder="Enter your password"
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

          {/* Submit Button */}
          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full mt-2"
            isLoading={isPending}
            loadingText="Signing in..."
          >
            Sign In
          </Button>
        </form>
      </CardContent>

      <CardFooter className="flex flex-col items-center justify-center border-t border-neutral-100 pt-4 text-xs sm:text-sm text-neutral-600 text-center gap-2">
        <div className="flex flex-wrap items-center justify-center gap-1.5">
          <span>Don&apos;t have an account?</span>
          <Link
            href={
              returnUrl && returnUrl !== "/courses"
                ? `/register?next=${encodeURIComponent(returnUrl)}`
                : "/register"
            }
            className="font-semibold text-brand-red-600 hover:text-brand-red-700 underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red-600 rounded-sm"
          >
            Register as a learner
          </Link>
        </div>

        {/* Phase Discipline Note: /forgot-password will be implemented in Phase 5.4 */}
        <div className="flex items-center gap-1.5 text-xs text-neutral-500 pt-1">
          <span>Need help recovering password?</span>
          <Badge variant="outline" className="text-neutral-600 bg-neutral-50 font-normal text-xs">
            Password reset in Phase 5.4
          </Badge>
        </div>
      </CardFooter>
    </Card>
  );
}
