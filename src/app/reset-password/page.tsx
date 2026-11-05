import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/layout/container";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { verifyRecoveryAuthorization } from "@/app/forgot-password/actions";
import { ResetPasswordForm } from "./reset-password-form";

export const metadata: Metadata = {
  title: "Set New Password | SwimNigeria",
  description: "Set a new secure password for your SwimNigeria learner account.",
};

export default async function ResetPasswordPage() {
  const { isAuthorized, error } = await verifyRecoveryAuthorization();

  return (
    <main className="min-h-[calc(100vh-64px)] bg-neutral-50/50 py-10 sm:py-16">
      <Container size="narrow" className="max-w-xl">
        {/* Header Section */}
        <div className="mb-8 text-center space-y-3">
          <Badge variant="aquatic" className="mx-auto">
            Account Security
          </Badge>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-neutral-900">
            Reset Your Password
          </h1>
          <p className="text-base text-neutral-600 max-w-lg mx-auto">
            Choose a strong, memorable password to protect your learning progress and certificates.
          </p>
        </div>

        {/* If session is not authorized or expired */}
        {!isAuthorized ? (
          <Card className="border-neutral-200 bg-neutral-white shadow-sm">
            <CardHeader className="text-center pb-3">
              <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-red-100 text-brand-red-700">
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
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <CardTitle as="h2" className="text-xl sm:text-2xl font-bold text-neutral-900">
                Invalid or Expired Reset Link
              </CardTitle>
              <CardDescription className="text-sm text-neutral-600 max-w-md mx-auto pt-1">
                {error ||
                  "This password recovery session is no longer valid. For security purposes, recovery links expire after a limited duration and cannot be reused."}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-2 text-center">
              <p className="text-xs text-neutral-500">
                Please request a new password recovery link to proceed.
              </p>
            </CardContent>
            <CardFooter className="flex flex-col sm:flex-row gap-3 pt-2">
              <Link href="/forgot-password" className="w-full sm:w-auto flex-1">
                <Button variant="primary" size="lg" className="w-full">
                  Request New Reset Link
                </Button>
              </Link>
              <Link href="/login" className="w-full sm:w-auto">
                <Button variant="outline" size="lg" className="w-full">
                  Return to Sign In
                </Button>
              </Link>
            </CardFooter>
          </Card>
        ) : (
          <ResetPasswordForm />
        )}
      </Container>
    </main>
  );
}
