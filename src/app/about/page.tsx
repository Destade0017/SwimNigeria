import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/layout/container";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "About Our Mission & Educational Philosophy | SwimNigeria",
  description:
    "Learn why SwimNigeria exists, our structured theoretical curriculum, and our commitment to accessible water safety and drowning prevention across Nigeria.",
};

export default function AboutPage() {
  return (
    <div className="py-12 sm:py-16 lg:py-20">
      {/* 1. Header & Purpose */}
      <section aria-labelledby="about-heading" className="mb-16 sm:mb-20">
        <Container>
          <div className="max-w-3xl">
            <Badge variant="brand" className="mb-4">
              About SwimNigeria
            </Badge>
            <h1
              id="about-heading"
              className="text-3xl font-extrabold tracking-tight text-neutral-900 sm:text-4xl lg:text-5xl leading-tight"
            >
              Empowering Nigerians with Structured Swimming Education and Water Safety
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-neutral-700 leading-relaxed font-normal">
              SwimNigeria is an educational initiative dedicated to making structured swimming
              instruction and critical water safety principles accessible to all Nigerians. We
              bridge the gap between zero aquatic knowledge and safe, confident participation in and
              around water.
            </p>
          </div>
        </Container>
      </section>

      {/* 2. Why SwimNigeria Exists */}
      <section
        aria-labelledby="mission-heading"
        className="py-16 sm:py-20 border-t border-neutral-200 bg-neutral-50"
      >
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            <div className="lg:col-span-5">
              <Badge variant="aquatic" className="mb-3">
                The Urgent Challenge
              </Badge>
              <h2
                id="mission-heading"
                className="text-2xl font-bold tracking-tight text-neutral-900 sm:text-3xl"
              >
                Why SwimNigeria Exists
              </h2>
              <p className="mt-4 text-base text-neutral-700 leading-relaxed">
                Across Nigeria, millions of people live in proximity to rivers, coastal lagoons,
                canals, and open waters. During seasonal rains, flash flooding introduces sudden
                aquatic hazards to everyday urban and rural life.
              </p>
              <p className="mt-4 text-base text-neutral-700 leading-relaxed">
                Yet structured aquatic education has historically been treated as an elite luxury or
                overlooked entirely. Drowning remains a severe yet largely preventable tragedy.
                SwimNigeria was created to treat water safety not as a privilege, but as an
                essential life skill that belongs in every household.
              </p>
            </div>

            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
              <Card className="border-neutral-200 bg-neutral-white">
                <CardHeader>
                  <CardTitle as="h3">Demystifying Water</CardTitle>
                  <CardDescription>Overcoming historical apprehension.</CardDescription>
                </CardHeader>
                <CardContent className="text-sm text-neutral-700 leading-relaxed">
                  Many Nigerians grow up with cultural warnings to avoid water entirely rather than
                  learning how buoyancy works. We provide the conceptual foundation needed to
                  replace fear with informed caution.
                </CardContent>
              </Card>

              <Card className="border-neutral-200 bg-neutral-white">
                <CardHeader>
                  <CardTitle as="h3">Low-Bandwidth Reach</CardTitle>
                  <CardDescription>Accessible on metered mobile data.</CardDescription>
                </CardHeader>
                <CardContent className="text-sm text-neutral-700 leading-relaxed">
                  Educational equity requires digital efficiency. Our platform delivers lean,
                  bandwidth-conscious guides that load rapidly on mobile networks across all 36
                  states and the FCT.
                </CardContent>
              </Card>

              <Card className="border-neutral-200 bg-neutral-white">
                <CardHeader>
                  <CardTitle as="h3">Adult Dignity</CardTitle>
                  <CardDescription>Non-judgmental beginner spaces.</CardDescription>
                </CardHeader>
                <CardContent className="text-sm text-neutral-700 leading-relaxed">
                  Adults who never learned to swim often experience anxiety and stigma. Our
                  educational content is tailored specifically to validate adult experiences and
                  build confidence step by step.
                </CardContent>
              </Card>

              <Card className="border-neutral-200 bg-neutral-white">
                <CardHeader>
                  <CardTitle as="h3">Community Defense</CardTitle>
                  <CardDescription>Actionable bystander safety.</CardDescription>
                </CardHeader>
                <CardContent className="text-sm text-neutral-700 leading-relaxed">
                  We teach non-contact rescue doctrines like &ldquo;Reach or Throw, Never Go&rdquo;
                  to prevent bystander drownings during flood emergencies and recreational outings.
                </CardContent>
              </Card>
            </div>
          </div>
        </Container>
      </section>

      {/* 3. Educational Philosophy */}
      <section
        aria-labelledby="philosophy-heading"
        className="py-16 sm:py-20 border-t border-neutral-200 bg-neutral-white"
      >
        <Container>
          <div className="max-w-3xl">
            <Badge variant="brand" className="mb-3">
              Instructional Method
            </Badge>
            <h2
              id="philosophy-heading"
              className="text-2xl font-bold tracking-tight text-neutral-900 sm:text-3xl lg:text-4xl"
            >
              Our Educational Philosophy
            </h2>
            <p className="mt-4 text-base sm:text-lg text-neutral-700 leading-relaxed">
              We believe effective aquatic education begins in the mind before entering the pool.
              When learners understand the science of flotation, panic dissolves and natural body
              mechanics take over.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="rounded-xl border border-neutral-200 p-6 bg-neutral-50/50">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-red-700">
                Pillar 01
              </span>
              <h3 className="mt-2 text-xl font-bold text-neutral-900">Theory Demystifies Fear</h3>
              <p className="mt-3 text-sm text-neutral-700 leading-relaxed">
                Panic in water is an autonomic reflex triggered by a feeling of instability and
                respiratory threat. By teaching how human lungs act as natural buoyancy chambers and
                how Archimedes&rsquo; principle functions, learners gain cognitive control before
                physical immersion.
              </p>
            </div>

            <div className="rounded-xl border border-neutral-200 p-6 bg-neutral-50/50">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-red-700">
                Pillar 02
              </span>
              <h3 className="mt-2 text-xl font-bold text-neutral-900">
                Strict Sequential Progress
              </h3>
              <p className="mt-3 text-sm text-neutral-700 leading-relaxed">
                Swimming cannot be rushed. Our curriculum enforces an unbroken sequence: water
                acclimatization, horizontal balance, relaxed exhalation, and only then mechanical
                arm-and-leg propulsion. Skipping comfort steps guarantees panic later.
              </p>
            </div>

            <div className="rounded-xl border border-neutral-200 p-6 bg-neutral-50/50">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-red-700">
                Pillar 03
              </span>
              <h3 className="mt-2 text-xl font-bold text-neutral-900">Contextualized Safety</h3>
              <p className="mt-3 text-sm text-neutral-700 leading-relaxed">
                Swimming in a calm chlorinated pool requires different knowledge than encountering a
                swollen storm drain, river current, or beach undertow. We contextualize water safety
                directly for the environments Nigerians actually interact with.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* 4. The Critical Boundary: Theory vs. Practical Instruction */}
      <section
        aria-labelledby="boundary-heading"
        className="py-16 sm:py-20 border-t border-neutral-200 bg-water-blue-50/40"
      >
        <Container>
          <div className="rounded-2xl border border-water-blue-100 bg-neutral-white p-8 sm:p-10 lg:p-12 shadow-xs">
            <div className="max-w-3xl">
              <Badge variant="aquatic" className="mb-4">
                Safety Responsibility Standard
              </Badge>
              <h2
                id="boundary-heading"
                className="text-2xl font-bold tracking-tight text-neutral-900 sm:text-3xl"
              >
                The Critical Balance: Theoretical Learning and Practical Coaching
              </h2>
              <p className="mt-4 text-base sm:text-lg text-neutral-800 leading-relaxed">
                SwimNigeria maintains an unwavering stance on aquatic safety:{" "}
                <strong>
                  digital coursework prepares the intellect, but physical swimming requires in-water
                  practice.
                </strong>
              </p>
            </div>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-neutral-200 pt-8">
              <div>
                <h3 className="text-base font-bold text-neutral-900">
                  What Digital Education Provides
                </h3>
                <ul className="mt-3 space-y-2 text-sm text-neutral-700">
                  <li className="flex items-start gap-2">
                    <span className="text-brand-red-600 font-bold shrink-0">✓</span>
                    <span>
                      Scientific comprehension of buoyancy, body alignment, and water displacement.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-brand-red-600 font-bold shrink-0">✓</span>
                    <span>
                      Cognitive anxiety mitigation techniques and breath-control strategies.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-brand-red-600 font-bold shrink-0">✓</span>
                    <span>
                      Emergency hazard awareness, flood survival principles, and non-contact rescue
                      rules.
                    </span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-base font-bold text-neutral-900">
                  What Requires Certified In-Person Training
                </h3>
                <ul className="mt-3 space-y-2 text-sm text-neutral-700">
                  <li className="flex items-start gap-2">
                    <span className="text-brand-red-600 font-bold shrink-0">!</span>
                    <span>
                      Developing physical kinesthetic muscle memory and endurance in deep water.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-brand-red-600 font-bold shrink-0">!</span>
                    <span>
                      Real-time posture and stroke feedback from certified aquatic instructors.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-brand-red-600 font-bold shrink-0">!</span>
                    <span>Physical water survival certification and lifesaving qualification.</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="mt-8 rounded-xl border border-neutral-200 bg-neutral-50 p-4 sm:p-5 text-xs text-neutral-700 leading-relaxed">
              <p className="font-semibold text-neutral-900 mb-1">
                Official Credential Clarification:
              </p>
              <p>
                Every credential issued by SwimNigeria explicitly represents a Certificate of
                Theoretical Course Completion. It validates digital comprehension and water safety
                literacy. It does not certify physical swimming competence, water survival
                capability, or lifeguarding qualification without practical, in-person assessment by
                a certified aquatic instructor.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* 5. Accessible & Responsible Content Commitment */}
      <section
        aria-labelledby="commitment-heading"
        className="py-16 sm:py-20 border-t border-neutral-200 bg-neutral-white"
      >
        <Container>
          <div className="max-w-3xl">
            <Badge variant="brand" className="mb-3">
              Our Standards
            </Badge>
            <h2
              id="commitment-heading"
              className="text-2xl font-bold tracking-tight text-neutral-900 sm:text-3xl"
            >
              Commitment to Responsible, Accessible Content
            </h2>
            <p className="mt-4 text-base text-neutral-700 leading-relaxed">
              We hold our platform to the highest technical and ethical standards to ensure reliable
              service for every Nigerian learner:
            </p>
            <div className="mt-8 space-y-4 text-sm text-neutral-700">
              <div className="rounded-lg border border-neutral-200 p-4">
                <h3 className="font-bold text-neutral-900">Web Accessibility (WCAG 2.1 AA)</h3>
                <p className="mt-1">
                  We engineer our interface to meet rigorous contrast, semantic markup, and keyboard
                  navigation requirements so individuals using assistive technologies have equal
                  access to safety education.
                </p>
              </div>
              <div className="rounded-lg border border-neutral-200 p-4">
                <h3 className="font-bold text-neutral-900">Evidence-Based Aquatic Science</h3>
                <p className="mt-1">
                  All educational recommendations are derived from proven hydrodynamics, human
                  physiology, and internationally recognized drowning prevention practices.
                </p>
              </div>
              <div className="rounded-lg border border-neutral-200 p-4">
                <h3 className="font-bold text-neutral-900">Zero Unverified Claims</h3>
                <p className="mt-1">
                  We present factual, transparent curriculum materials without sensationalism,
                  unsupported claims, or manufactured endorsements.
                </p>
              </div>
            </div>
          </div>

          {/* Navigation CTA Bar */}
          <div className="mt-12 flex flex-col sm:flex-row items-center gap-4 border-t border-neutral-200 pt-8">
            <Link
              href="/articles"
              className="inline-flex min-h-[44px] w-full sm:w-auto items-center justify-center rounded-lg bg-brand-red-600 px-6 py-2.5 text-sm font-semibold text-neutral-white shadow-xs hover:bg-brand-red-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red-600 focus-visible:ring-offset-2"
            >
              Explore Educational Articles
            </Link>
            <Link
              href="/contact"
              className="inline-flex min-h-[44px] w-full sm:w-auto items-center justify-center rounded-lg border border-neutral-300 bg-neutral-white px-6 py-2.5 text-sm font-semibold text-neutral-900 shadow-xs hover:bg-neutral-50 hover:border-neutral-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-700"
            >
              Contact &amp; Community Inquiries
            </Link>
          </div>
        </Container>
      </section>
    </div>
  );
}
