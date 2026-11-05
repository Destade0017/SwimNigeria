import type { Metadata } from "next";
import { Container } from "@/components/layout/container";
import { Badge } from "@/components/ui/badge";
import { RegisterForm } from "./register-form";

export const metadata: Metadata = {
  title: "Learner Registration & Account Creation | SwimNigeria",
  description:
    "Create a SwimNigeria learner account to access aquatic education courses, track your water safety progress, and earn verifiable certificates.",
};

interface RegisterPageProps {
  searchParams: Promise<{ next?: string }>;
}

export default async function RegisterPage({ searchParams }: RegisterPageProps) {
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
            Start Your Swimming Education
          </h1>
          <p className="text-base text-neutral-600 max-w-lg mx-auto">
            Create your free learner account to study water safety lessons, master buoyancy and
            stroke mechanics, and earn verifiable completion certificates.
          </p>
        </div>

        {/* Certificate Advisory Callout */}
        <div className="mb-6 rounded-xl border border-brand-red-200 bg-brand-red-50/70 p-4 text-xs sm:text-sm text-brand-red-900 flex items-start gap-3">
          <svg
            className="h-5 w-5 text-brand-red-600 shrink-0 mt-0.5"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clipRule="evenodd"
            />
          </svg>
          <div className="space-y-1">
            <p className="font-semibold text-brand-red-950">Certificate Accuracy Notice</p>
            <p className="text-brand-red-900 leading-relaxed">
              Please enter your legal full name as shown on official identification. Course
              completion certificates will be minted permanently with the exact name provided during
              registration.
            </p>
          </div>
        </div>

        {/* Registration Form Component */}
        <RegisterForm returnUrl={next} />

        {/* Platform Integrity Badges */}
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
            <span className="font-medium text-neutral-700">Verifiable Certificates</span>
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
                d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9"
              />
            </svg>
            <span className="font-medium text-neutral-700">Nigerian Water Safety</span>
          </div>
        </div>
      </Container>
    </main>
  );
}
