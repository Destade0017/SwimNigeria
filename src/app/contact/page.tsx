import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/layout/container";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Contact & Community Inquiries | SwimNigeria",
  description:
    "Get in touch with SwimNigeria for educational questions, certified instructor collaboration, and community water safety partnerships across Nigeria.",
};

export default function ContactPage() {
  return (
    <div className="py-12 sm:py-16 lg:py-20">
      {/* 1. Header */}
      <section aria-labelledby="contact-heading" className="mb-12 sm:mb-16">
        <Container>
          <div className="max-w-3xl">
            <Badge variant="brand" className="mb-4">
              Get in Touch
            </Badge>
            <h1
              id="contact-heading"
              className="text-3xl font-extrabold tracking-tight text-neutral-900 sm:text-4xl lg:text-5xl leading-tight"
            >
              Contact &amp; Community Inquiries
            </h1>
            <p className="mt-4 text-lg sm:text-xl text-neutral-700 leading-relaxed font-normal">
              Connecting learners, certified swimming educators, and safety advocates committed to
              drowning prevention and structured aquatic education across Nigeria.
            </p>
          </div>
        </Container>
      </section>

      {/* 2. Operational Status Notice: Truthful Channel Architecture */}
      <section aria-labelledby="status-heading" className="mb-12 sm:mb-16">
        <Container>
          <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-6 sm:p-8 lg:p-10 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="flex h-3 w-3 rounded-full bg-water-blue-600 animate-pulse" />
                <h2 id="status-heading" className="text-lg font-bold text-neutral-900">
                  Pre-Launch Communications Notice
                </h2>
              </div>
              <Badge variant="outline" size="sm">
                Engineering Phase 3
              </Badge>
            </div>
            <p className="mt-4 text-sm sm:text-base text-neutral-700 leading-relaxed max-w-3xl">
              SwimNigeria is actively preparing for public launch. To ensure the highest standard of
              communication security and data privacy under NDPR guidelines, our direct interactive
              message dispatch, dedicated WhatsApp helpline, and official email channels are
              undergoing configuration in accordance with our roadmap.
            </p>
            <div className="mt-6 rounded-xl border border-neutral-200 bg-neutral-white p-4 sm:p-5 text-xs text-neutral-600 leading-relaxed">
              <span className="font-semibold text-neutral-900">
                Roadmap Dependency &amp; Channel Status:
              </span>{" "}
              Automated web form delivery via Resend API and verified carrier click-to-chat lines
              are scheduled for live activation in Phase 10 upon official domain registration. In
              keeping with our zero-fabrication engineering policy, no unverified contact endpoints
              or non-operational submit forms are presented.
            </div>
          </div>
        </Container>
      </section>

      {/* 3. Inquiry Channels & Collaboration Tracks */}
      <section
        aria-labelledby="channels-heading"
        className="py-16 sm:py-20 border-t border-neutral-200 bg-neutral-white"
      >
        <Container>
          <div className="max-w-2xl">
            <Badge variant="aquatic" className="mb-3">
              Collaboration Directory
            </Badge>
            <h2
              id="channels-heading"
              className="text-2xl font-bold tracking-tight text-neutral-900 sm:text-3xl"
            >
              Inquiry Tracks &amp; Collaboration Areas
            </h2>
            <p className="mt-3 text-base text-neutral-700 leading-relaxed">
              We welcome inquiries from across the aquatic safety spectrum. Review our primary
              tracks to understand how to engage with the platform:
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="flex flex-col justify-between">
              <CardHeader>
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-red-50 text-brand-red-700 mb-3">
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    />
                  </svg>
                </div>
                <CardTitle as="h3">Educational &amp; Curriculum Questions</CardTitle>
                <CardDescription>Instructional content and safety theory.</CardDescription>
              </CardHeader>
              <CardContent className="text-sm text-neutral-700 leading-relaxed">
                For questions regarding beginner swimming theory, buoyancy physics, lesson
                sequencing, or suggestions for localized water safety guides covering specific
                hazards in your region.
              </CardContent>
            </Card>

            <Card className="flex flex-col justify-between">
              <CardHeader>
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-red-50 text-brand-red-700 mb-3">
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </div>
                <CardTitle as="h3">Certified Instructor Collaboration</CardTitle>
                <CardDescription>Connecting theory with practical coaching.</CardDescription>
              </CardHeader>
              <CardContent className="text-sm text-neutral-700 leading-relaxed">
                We are building relationships with vetted, certified swimming coaches across
                Nigerian states to connect digital learners with safe, supervised practical pool
                training and survival evaluations.
              </CardContent>
            </Card>

            <Card className="flex flex-col justify-between">
              <CardHeader>
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-red-50 text-brand-red-700 mb-3">
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                    />
                  </svg>
                </div>
                <CardTitle as="h3">Community &amp; School Safety</CardTitle>
                <CardDescription>Bystander rescue and youth safety initiatives.</CardDescription>
              </CardHeader>
              <CardContent className="text-sm text-neutral-700 leading-relaxed">
                For parent-teacher associations, community organizers, youth clubs, and coastal
                advocates seeking open educational resources on drowning prevention and flood
                preparedness.
              </CardContent>
            </Card>
          </div>
        </Container>
      </section>

      {/* 4. Inquiry Preparation Checklist */}
      <section
        aria-labelledby="prep-heading"
        className="py-16 sm:py-20 border-t border-neutral-200 bg-neutral-50"
      >
        <Container>
          <div className="max-w-3xl">
            <Badge variant="brand" className="mb-3">
              Preparation Guide
            </Badge>
            <h2
              id="prep-heading"
              className="text-2xl font-bold tracking-tight text-neutral-900 sm:text-3xl"
            >
              How to Prepare Your Inquiry
            </h2>
            <p className="mt-3 text-base text-neutral-700 leading-relaxed">
              When our official contact channels open in Phase 10, having the following details
              ready will help us respond effectively:
            </p>

            <div className="mt-8 space-y-4">
              <div className="rounded-xl border border-neutral-200 bg-neutral-white p-5 shadow-2xs">
                <h3 className="font-bold text-neutral-900 text-sm">
                  1. Identify Your Engagement Category
                </h3>
                <p className="mt-1 text-sm text-neutral-600 leading-relaxed">
                  Indicate whether you are an individual learner seeking beginner advice, a
                  certified aquatic coach inquiring about practical partnerships, or a community
                  representative planning safety workshops.
                </p>
              </div>

              <div className="rounded-xl border border-neutral-200 bg-neutral-white p-5 shadow-2xs">
                <h3 className="font-bold text-neutral-900 text-sm">
                  2. Specify Regional or Environmental Context
                </h3>
                <p className="mt-1 text-sm text-neutral-600 leading-relaxed">
                  Water safety varies by geography. Noting your State, local government area, or
                  aquatic environment (riverine, urban pool, canal proximity, or coastal lagoon)
                  helps tailor safety insights.
                </p>
              </div>

              <div className="rounded-xl border border-neutral-200 bg-neutral-white p-5 shadow-2xs">
                <h3 className="font-bold text-neutral-900 text-sm">
                  3. Clear Scope of Inquiry or Collaboration
                </h3>
                <p className="mt-1 text-sm text-neutral-600 leading-relaxed">
                  Provide a concise summary of the topic or proposal so the relevant curriculum
                  designer or educator can address your request directly.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 5. Immediate Knowledge Resources */}
      <section
        aria-labelledby="resources-heading"
        className="py-16 sm:py-20 border-t border-neutral-200 bg-neutral-white"
      >
        <Container>
          <div className="max-w-2xl">
            <Badge variant="aquatic" className="mb-3">
              Instant Answers
            </Badge>
            <h2
              id="resources-heading"
              className="text-2xl font-bold tracking-tight text-neutral-900 sm:text-3xl"
            >
              Need Immediate Water Safety Answers?
            </h2>
            <p className="mt-3 text-base text-neutral-700 leading-relaxed">
              Our written guides cover common questions regarding adult water phobia, buoyancy
              mechanics, and essential family safety rules without requiring an inquiry submission.
            </p>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row items-center gap-4">
            <Link
              href="/articles"
              className="inline-flex min-h-[44px] w-full sm:w-auto items-center justify-center rounded-lg bg-brand-red-600 px-6 py-2.5 text-sm font-semibold text-neutral-white shadow-xs hover:bg-brand-red-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red-600 focus-visible:ring-offset-2"
            >
              Browse Educational Articles Directory
            </Link>
            <Link
              href="/about"
              className="inline-flex min-h-[44px] w-full sm:w-auto items-center justify-center rounded-lg border border-neutral-300 bg-neutral-white px-6 py-2.5 text-sm font-semibold text-neutral-900 shadow-xs hover:bg-neutral-50 hover:border-neutral-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-700"
            >
              Read About Our Mission
            </Link>
          </div>
        </Container>
      </section>
    </div>
  );
}
