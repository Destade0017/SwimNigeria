"use client";

/**
 * SwimNigeria — Learner Registration Interactive Form
 *
 * Responsibilities:
 * - Collects full name, email, password, and password confirmation.
 * - Submits data securely to `registerLearnerAction` Server Action using React 19 `useActionState`.
 * - Provides accessible inline validation error feedback mapped via `aria-describedby` & `aria-invalid`.
 * - Provides accessible password visibility toggle controls.
 * - Displays a clear, accessible email-verification pending view upon successful submission.
 * - Explicitly informs the user regarding certificate name usage and email verification requirements.
 * - Avoids dead login links while the login route is deferred to Phase 5.3.
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
import { Badge } from "@/components/ui/badge";
import { registerLearnerAction, INITIAL_REGISTER_STATE } from "./actions";

interface RegisterFormProps {
  returnUrl?: string;
}

export function RegisterForm({ returnUrl = "/courses" }: RegisterFormProps) {
  const [state, formAction, isPending] = useActionState(
    registerLearnerAction,
    INITIAL_REGISTER_STATE,
  );

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isReset, setIsReset] = useState(false);

  // Email verification holding state
  if (state.success && state.email && !isReset) {
    return (
      <Card className="border-water-blue-200 bg-neutral-white shadow-md">
        <CardHeader className="text-center pb-4">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-water-blue-100 text-water-blue-700">
            {/* Accessible Mail / Verification Icon */}
            <svg
              className="h-7 w-7"
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
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          </div>
          <Badge variant="aquatic" className="mx-auto mb-2">
            Action Required: Check Your Inbox
          </Badge>
          <CardTitle as="h2" className="text-2xl font-extrabold text-neutral-900">
            Verify Your Email Address
          </CardTitle>
          <CardDescription className="text-neutral-600 text-base max-w-md mx-auto pt-1">
            We have dispatched an activation email with a secure verification link to:
          </CardDescription>
          <p className="mt-1 font-mono font-semibold text-brand-red-700 text-base break-all">
            {state.email}
          </p>
        </CardHeader>

        <CardContent className="space-y-4 pt-2">
          {state.fullName && (
            <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-3.5 text-sm">
              <span className="font-semibold text-neutral-900 block mb-0.5">
                Official Certificate Name Recorded:
              </span>
              <span className="text-neutral-700">{state.fullName}</span>
              <p className="text-xs text-neutral-500 mt-1">
                Your earned course completion certificates will be minted with this legal name.
              </p>
            </div>
          )}

          <div className="space-y-2 text-sm text-neutral-600 bg-water-blue-50/60 border border-water-blue-100 rounded-lg p-4">
            <h3 className="font-semibold text-water-blue-900 text-sm">Next steps:</h3>
            <ul className="list-disc list-inside space-y-1.5 text-xs sm:text-sm text-neutral-700">
              <li>Open the verification email and click the confirmation link.</li>
              <li>
                If you don&apos;t see the email within 2–3 minutes, please check your spam or junk
                folder.
              </li>
              <li>The verification link expires after a standard security window.</li>
            </ul>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col sm:flex-row gap-3 pt-2">
          <Link href="/courses" className="w-full sm:w-auto flex-1">
            <Button variant="primary" size="lg" className="w-full">
              Explore Course Catalogue
            </Button>
          </Link>
          <Button
            type="button"
            variant="outline"
            size="lg"
            className="w-full sm:w-auto"
            onClick={() => setIsReset(true)}
          >
            Register Another Account
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="border-neutral-200 bg-neutral-white shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle as="h2" className="text-xl sm:text-2xl font-bold text-neutral-900">
          Create Learner Account
        </CardTitle>
        <CardDescription className="text-sm text-neutral-600">
          Join SwimNigeria to enroll in swimming courses, complete safety assessments, and earn
          verifiable certificates.
        </CardDescription>
      </CardHeader>

      <CardContent>
        {/* Form-Level Error Message */}
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

        <form action={formAction} noValidate className="space-y-4">
          {/* Preserved post-confirmation return URL */}
          <input type="hidden" name="next" value={returnUrl} />

          {/* Legal Full Name Field */}
          <div>
            <Input
              id="register-fullName"
              name="fullName"
              type="text"
              label="Legal Full Name"
              required
              autoComplete="name"
              placeholder="e.g., Amina Bello"
              helperText="Important: Must match your official identification. This name will appear on all earned certificates."
              error={state.errors?.fullName}
            />
          </div>

          {/* Email Address Field */}
          <div>
            <Input
              id="register-email"
              name="email"
              type="email"
              label="Email Address"
              required
              autoComplete="email"
              placeholder="e.g., amina@example.com"
              helperText="We will send a mandatory confirmation link to verify this email address."
              error={state.errors?.email}
            />
          </div>

          {/* Password Field */}
          <div>
            <Input
              id="register-password"
              name="password"
              type={showPassword ? "text" : "password"}
              label="Password"
              required
              autoComplete="new-password"
              placeholder="At least 8 characters"
              helperText="Must contain at least 8 characters, including at least one letter and one number."
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
                    // Eye Slash Icon (Hide)
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
                    // Eye Icon (Show)
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

          {/* Confirm Password Field */}
          <div>
            <Input
              id="register-confirmPassword"
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              label="Confirm Password"
              required
              autoComplete="new-password"
              placeholder="Re-enter your password"
              helperText="Must match the password entered above."
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

          {/* Privacy and Verification Transparency Notice */}
          <div className="rounded-lg bg-neutral-50 p-3 text-xs text-neutral-600 leading-relaxed border border-neutral-200">
            <p>
              By registering, you confirm that your legal name is accurate. Your email address will
              be used exclusively for account verification, authentication, and instructional
              updates. We will never sell your information.
            </p>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full mt-2"
            isLoading={isPending}
            loadingText="Creating account..."
          >
            Create Learner Account
          </Button>
        </form>
      </CardContent>

      <CardFooter className="flex flex-col items-center justify-center border-t border-neutral-100 pt-4 text-xs sm:text-sm text-neutral-600 text-center">
        {/*
          Phase Discipline Note:
          Login route (/login) is scheduled for Phase 5.3.
          Per project directive, we do not render a misleading or broken link to /login.
        */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          <span>Already registered?</span>
          <Badge variant="outline" className="text-neutral-700 bg-neutral-50 font-normal">
            Learner Login available in Phase 5.3
          </Badge>
        </div>
      </CardFooter>
    </Card>
  );
}
