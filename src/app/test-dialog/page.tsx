import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { TestDialogClient } from "./client";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Test Dialog Harness | SwimNigeria",
  robots: {
    index: false,
    follow: false,
  },
};

export default function TestDialogPage() {
  // Only accessible in non-production environments or when explicitly enabled for E2E tests
  if (process.env.NODE_ENV === "production" && process.env.ENABLE_TEST_HARNESS !== "true") {
    notFound();
  }

  return <TestDialogClient />;
}
