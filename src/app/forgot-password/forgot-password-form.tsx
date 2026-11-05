"use client";

/**
 * SwimNigeria — Forgot Password Form Component
 *
 * Responsibilities:
 * - Collects learner's email address to initiate password recovery.
 * - Submits securely to `forgotPasswordAction` using React 19 `useActionState`.
 * - Shows accessible success confirmation without disclosing account existence.
 * - Links back to `/login`.
 */

import React, { useActionState } from "react";
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
import { Badge } from "@/components/ui/badge";
import { forgotPasswordAction, INITIAL_FORGOT_PASSWORD_STATE } from "./actions";

export function ForgotPasswordForm() {
  const [state, formAction, isPending] = useActionState(
    forgotPasswordAction,
    INITIAL_FORGOT_PASSWORD_STATE,
  );

  return (
    <Card className="border-neutral-200 bg-neutral-white shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle as="h2" className="text-xl sm:text-2xl font-bold text-neutral-900">
          Reset Your Password
        </CardTitle>
        <CardDescription className="text-sm text-neutral-600">
          Enter the email address registered with your SwimNigeria learner account.
        </CardDescription>
      </CardHeader>

      <CardContent>
        {/* Success State */}
        {state.success && (
          <div
            role="status"
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
              <span className="font-semibold text-water-blue-900">Recovery Instructions Dispatched</span>
            </div>
            <p className="text-xs sm:text-sm text-neutral-700 leading-relaxed">
              {state.message}
            </p>
            <p className="text-xs text-neutral-500 pt-1">
              If you don&apos;t see the email within 2–3 minutes, please check your spam or junk folder.
            </p>
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
            <div>
              <Input
                id="forgot-email"
                name="email"
                type="email"
                label="Email Address"
                required
                autoComplete="email"
                placeholder="e.g., amina@example.com"
                helperText="We will send a secure password reset link to this address."
                error={state.errors?.email}
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full mt-2"
              isLoading={isPending}
              loadingText="Sending reset link..."
            >
              Send Recovery Email
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
