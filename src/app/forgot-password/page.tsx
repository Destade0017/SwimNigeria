import type { Metadata } from "next";
import { Container } from "@/components/layout/container";
import { Badge } from "@/components/ui/badge";
import { ForgotPasswordForm } from "./forgot-password-form";

export const metadata: Metadata = {
  title: "Password Recovery | SwimNigeria",
  description:
    "Request a password reset link for your SwimNigeria learner account to regain access to your water safety courses.",
};

export default function ForgotPasswordPage() {
  return (
    <main className="min-h-[calc(100vh-64px)] bg-neutral-50/50 py-10 sm:py-16">
      <Container size="narrow" className="max-w-xl">
        {/* Header Section */}
        <div className="mb-8 text-center space-y-3">
          <Badge variant="aquatic" className="mx-auto">
            Account Security
          </Badge>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-neutral-900">
            Forgot Your Password?
          </h1>
          <p className="text-base text-neutral-600 max-w-lg mx-auto">
            Provide your email address and we&apos;ll send you a secure verification link to reset your
            password and resume your aquatic safety learning.
          </p>
        </div>

        {/* Forgot Password Form */}
        <ForgotPasswordForm />

        {/* Privacy & Security Footnote */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3 text-center text-xs text-neutral-600">
          <div className="flex items-center justify-center gap-2 p-2 rounded-lg bg-neutral-white border border-neutral-200/80 shadow-2xs">
            <svg
              className="h-4 w-4 text-water-blue-600"
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
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
            <span className="font-medium text-neutral-700">Encrypted Reset</span>
          </div>

          <div className="flex items-center justify-center gap-2 p-2 rounded-lg bg-neutral-white border border-neutral-200/80 shadow-2xs">
            <svg
              className="h-4 w-4 text-water-blue-600"
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
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
              />
            </svg>
            <span className="font-medium text-neutral-700">Single-Use Link</span>
          </div>

          <div className="flex items-center justify-center gap-2 p-2 rounded-lg bg-neutral-white border border-neutral-200/80 shadow-2xs">
            <svg
              className="h-4 w-4 text-water-blue-600"
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
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="font-medium text-neutral-700">Timed Expiry</span>
          </div>
        </div>
      </Container>
    </main>
  );
}
