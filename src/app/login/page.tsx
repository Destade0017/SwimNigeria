import type { Metadata } from "next";
import { Container } from "@/components/layout/container";
import { Badge } from "@/components/ui/badge";
import { LoginForm } from "./login-form";

export const metadata: Metadata = {
  title: "Learner Sign In | SwimNigeria",
  description:
    "Sign in to your SwimNigeria learner account to access aquatic education courses, track your water safety progress, and review earned certificates.",
};

interface LoginPageProps {
  searchParams: Promise<{ next?: string }>;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { next } = await searchParams;

  return (
    <main className="min-h-[calc(100vh-64px)] bg-neutral-50/50 py-10 sm:py-16">
      <Container size="narrow" className="max-w-xl">
        {/* Header Section */}
        <div className="mb-8 text-center space-y-3">
          <Badge variant="aquatic" className="mx-auto">
            Aquatic Education Platform
          </Badge>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-neutral-900">
            Welcome Back to SwimNigeria
          </h1>
          <p className="text-base text-neutral-600 max-w-lg mx-auto">
            Sign in to continue your swimming education, complete assessments, and maintain your
            aquatic water safety qualifications.
          </p>
        </div>

        {/* Login Form Component */}
        <LoginForm returnUrl={next} />

        {/* Security & Data Integrity Footnote */}
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
            <span className="font-medium text-neutral-700">Encrypted Auth</span>
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
            <span className="font-medium text-neutral-700">SSR Cookie Guard</span>
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
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            <span className="font-medium text-neutral-700">Verifiable Identity</span>
          </div>
        </div>
      </Container>
    </main>
  );
}
