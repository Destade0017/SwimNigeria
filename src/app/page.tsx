import React from "react";
import Link from "next/link";
import { Container } from "@/components/layout/container";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { getPublishedArticles } from "@/lib/articles";

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* 1. Hero Section */}
      <section
        aria-labelledby="hero-heading"
        className="relative overflow-hidden bg-gradient-to-b from-neutral-50/80 via-neutral-white to-neutral-white py-16 sm:py-24 lg:py-32"
      >
        <Container>
          <div className="max-w-3xl">
            <Badge variant="brand" className="mb-4">
              Swimming Education &amp; Water Safety
            </Badge>

            <h1
              id="hero-heading"
              className="text-3xl font-extrabold tracking-tight text-neutral-900 sm:text-5xl lg:text-6xl leading-[1.12]"
            >
              SwimNigeria — Structured Swimming Education &amp; Water Safety
            </h1>

            <p className="mt-6 text-base sm:text-lg lg:text-xl text-neutral-700 leading-relaxed">
              SwimNigeria is an online educational initiative dedicated to teaching foundational
              swimming mechanics, water safety principles, and structured learning pathways for
              beginners, families, and communities across Nigeria.
            </p>

            {/* CTAs */}
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                href="#courses"
                className="inline-flex min-h-[48px] items-center justify-center rounded-lg bg-brand-red-600 px-6 py-3 text-base font-semibold text-neutral-white shadow-xs transition-colors hover:bg-brand-red-700 active:bg-brand-red-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red-600 focus-visible:ring-offset-2"
              >
                Explore Learning Pathway
              </Link>
              <Link
                href="#safety"
                className="inline-flex min-h-[48px] items-center justify-center rounded-lg border border-neutral-300 bg-neutral-white px-6 py-3 text-base font-semibold text-neutral-900 transition-colors hover:bg-neutral-50 hover:border-neutral-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-700 focus-visible:ring-offset-2"
              >
                Water Safety Principles
              </Link>
            </div>

            {/* Truthful Educational Highlights */}
            <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-3 pt-8 border-t border-neutral-200">
              <div className="flex flex-col">
                <span className="text-sm font-bold text-neutral-900">Structured Curriculum</span>
                <span className="text-xs text-neutral-600 mt-0.5">
                  Beginner-friendly step-by-step lesson sequences.
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-neutral-900">Drowning Prevention</span>
                <span className="text-xs text-neutral-600 mt-0.5">
                  Crucial aquatic hazard and bystander rescue knowledge.
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-neutral-900">
                  Self-Paced Digital Access
                </span>
                <span className="text-xs text-neutral-600 mt-0.5">
                  Optimized for mobile connections across Nigeria.
                </span>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 2. Educational Value Proposition */}
      <section
        id="about"
        aria-labelledby="value-heading"
        className="py-16 sm:py-24 border-t border-neutral-200 bg-neutral-white"
      >
        <Container>
          <div className="max-w-2xl">
            <Badge variant="aquatic" className="mb-3">
              Educational Approach
            </Badge>
            <h2
              id="value-heading"
              className="text-2xl font-bold tracking-tight text-neutral-900 sm:text-3xl lg:text-4xl"
            >
              Why Structured Aquatic Education Matters
            </h2>
            <p className="mt-3 text-base text-neutral-700 leading-relaxed">
              Drowning remains a persistent, preventable hazard. SwimNigeria provides the
              theoretical knowledge and step-by-step technical comprehension that prepares learners
              to approach practical water sessions safely.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-red-50 text-brand-red-700 mb-2">
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
                      d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <CardTitle as="h3">Overcoming Water Apprehension</CardTitle>
                <CardDescription>
                  Transforming panic into buoyancy and calm breathing.
                </CardDescription>
              </CardHeader>
              <CardContent>
                Fear of water often stems from unfamiliarity with buoyancy. We break down breath
                control, horizontal relaxation, and face immersion into calm, manageable steps.
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-water-blue-50 text-water-blue-700 mb-2">
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
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                </div>
                <CardTitle as="h3">Drowning Prevention Rules</CardTitle>
                <CardDescription>
                  Essential protocols for pools, open water, and riverine environments.
                </CardDescription>
              </CardHeader>
              <CardContent>
                Clear, memorable safety guidelines covering silent drowning signs, never swimming
                alone, recognizing dangerous currents, and safe non-swimmer rescue principles.
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-neutral-100 text-neutral-800 mb-2">
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
                <CardTitle as="h3">Self-Paced Digital Curricula</CardTitle>
                <CardDescription>
                  Comprehensive written guides and bandwidth-efficient demonstrations.
                </CardDescription>
              </CardHeader>
              <CardContent>
                Structured for low-data mobile devices. Every lesson provides detailed written
                instructions and diagrams that allow learners to study at their own pace.
              </CardContent>
            </Card>
          </div>
        </Container>
      </section>

      {/* 3. Structured Learning Pathway */}
      <section
        id="courses"
        aria-labelledby="pathway-heading"
        className="py-16 sm:py-24 border-t border-neutral-200 bg-neutral-50"
      >
        <Container>
          <div className="max-w-2xl">
            <Badge variant="brand" className="mb-3">
              Curriculum Roadmap
            </Badge>
            <h2
              id="pathway-heading"
              className="text-2xl font-bold tracking-tight text-neutral-900 sm:text-3xl lg:text-4xl"
            >
              Structured Learning Pathway
            </h2>
            <p className="mt-3 text-base text-neutral-700 leading-relaxed">
              SwimNigeria is preparing a sequential beginner curriculum. Each level focuses on a
              specific stage of comfort, balance, and stroke mechanics.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {/* Level 1 */}
            <Card className="flex flex-col justify-between">
              <CardHeader>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-xs font-bold text-brand-red-700 uppercase tracking-wider">
                    Stage 01
                  </span>
                  <Badge variant="brand" size="sm">
                    Foundational
                  </Badge>
                </div>
                <CardTitle as="h3">Water Safety &amp; Acclimatization</CardTitle>
                <CardDescription>
                  Initial comfort, breath control, and safety awareness.
                </CardDescription>
              </CardHeader>
              <CardContent className="text-sm">
                <ul className="space-y-1.5 text-neutral-600">
                  <li className="flex items-start gap-1.5">
                    <span className="text-brand-red-600 font-bold">•</span>
                    <span>Water properties &amp; buoyancy</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-brand-red-600 font-bold">•</span>
                    <span>Face immersion &amp; bubbles</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-brand-red-600 font-bold">•</span>
                    <span>Safe pool entry &amp; exit</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter className="border-t border-neutral-100 text-xs text-neutral-600">
                Course Module • Launch Curriculum
              </CardFooter>
            </Card>

            {/* Level 2 */}
            <Card className="flex flex-col justify-between">
              <CardHeader>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-xs font-bold text-water-blue-700 uppercase tracking-wider">
                    Stage 02
                  </span>
                  <Badge variant="aquatic" size="sm">
                    Beginner
                  </Badge>
                </div>
                <CardTitle as="h3">Buoyancy &amp; Floating Mechanics</CardTitle>
                <CardDescription>Front and back floating without tension or panic.</CardDescription>
              </CardHeader>
              <CardContent className="text-sm">
                <ul className="space-y-1.5 text-neutral-600">
                  <li className="flex items-start gap-1.5">
                    <span className="text-water-blue-700 font-bold">•</span>
                    <span>Prone (front) horizontal float</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-water-blue-700 font-bold">•</span>
                    <span>Supine (back) relaxed float</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-water-blue-700 font-bold">•</span>
                    <span>Recovery to standing position</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter className="border-t border-neutral-100 text-xs text-neutral-600">
                Course Module • Launch Curriculum
              </CardFooter>
            </Card>

            {/* Level 3 */}
            <Card className="flex flex-col justify-between">
              <CardHeader>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-xs font-bold text-neutral-700 uppercase tracking-wider">
                    Stage 03
                  </span>
                  <Badge variant="default" size="sm">
                    Technique
                  </Badge>
                </div>
                <CardTitle as="h3">Propulsion &amp; Freestyle Basics</CardTitle>
                <CardDescription>
                  Forward propulsion and streamlined body alignment.
                </CardDescription>
              </CardHeader>
              <CardContent className="text-sm">
                <ul className="space-y-1.5 text-neutral-600">
                  <li className="flex items-start gap-1.5">
                    <span className="text-neutral-700 font-bold">•</span>
                    <span>Streamline push and glide</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-neutral-700 font-bold">•</span>
                    <span>Relaxed flutter kick mechanics</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-neutral-700 font-bold">•</span>
                    <span>Rhythmic side breathing intro</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter className="border-t border-neutral-100 text-xs text-neutral-600">
                Course Module • Launch Curriculum
              </CardFooter>
            </Card>

            {/* Level 4 */}
            <Card className="flex flex-col justify-between">
              <CardHeader>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
                    Stage 04
                  </span>
                  <Badge variant="success" size="sm">
                    Safety Core
                  </Badge>
                </div>
                <CardTitle as="h3">Hazard Awareness &amp; Self-Rescue</CardTitle>
                <CardDescription>
                  Open water awareness, currents, and emergency protocols.
                </CardDescription>
              </CardHeader>
              <CardContent className="text-sm">
                <ul className="space-y-1.5 text-neutral-600">
                  <li className="flex items-start gap-1.5">
                    <span className="text-emerald-800 font-bold">•</span>
                    <span>Currents &amp; depth drop-offs</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-emerald-800 font-bold">•</span>
                    <span>Float-to-live survival tactic</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-emerald-800 font-bold">•</span>
                    <span>Bystander rescue protocols</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter className="border-t border-neutral-100 text-xs text-neutral-600">
                Course Module • Launch Curriculum
              </CardFooter>
            </Card>
          </div>

          <div className="mt-8 rounded-lg border border-neutral-200 bg-neutral-white p-4 text-xs text-neutral-600 text-center sm:text-left">
            <span className="font-semibold text-neutral-900">Curriculum Note: </span>
            The pathway above outlines SwimNigeria&apos;s planned beginner curriculum. Lesson
            enrollment, interactive quizzes, and verifiable certificates will activate sequentially
            as course development milestones are completed.
          </div>
        </Container>
      </section>

      {/* 4. Critical Water Safety Principles */}
      <section
        id="safety"
        aria-labelledby="safety-heading"
        className="py-16 sm:py-24 border-t border-neutral-200 bg-neutral-white"
      >
        <Container>
          <div className="max-w-2xl">
            <Badge variant="aquatic" className="mb-3">
              Essential Safety
            </Badge>
            <h2
              id="safety-heading"
              className="text-2xl font-bold tracking-tight text-neutral-900 sm:text-3xl lg:text-4xl"
            >
              Critical Water Safety Knowledge
            </h2>
            <p className="mt-3 text-base text-neutral-700 leading-relaxed">
              Theoretical safety awareness saves lives before emergencies arise. Keep these core
              principles front-and-centre whenever you or your loved ones are around water.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-6 flex flex-col justify-between">
              <div>
                <span className="text-2xl font-extrabold text-brand-red-600">01</span>
                <h3 className="mt-2 text-base font-bold text-neutral-900">
                  Drowning is Often Silent
                </h3>
                <p className="mt-2 text-sm text-neutral-600 leading-relaxed">
                  Real drowning does not resemble theatrical flailing or shouting. Victims typically
                  struggle quietly at the surface without the breath needed to call for help.
                </p>
              </div>
            </div>

            <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-6 flex flex-col justify-between">
              <div>
                <span className="text-2xl font-extrabold text-brand-red-600">02</span>
                <h3 className="mt-2 text-base font-bold text-neutral-900">Never Swim Alone</h3>
                <p className="mt-2 text-sm text-neutral-600 leading-relaxed">
                  Always ensure competent supervision or a swimming companion is present. Sudden
                  cramps, exhaustion, or panic can incapacitate even seasoned swimmers.
                </p>
              </div>
            </div>

            <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-6 flex flex-col justify-between">
              <div>
                <span className="text-2xl font-extrabold text-brand-red-600">03</span>
                <h3 className="mt-2 text-base font-bold text-neutral-900">
                  Reach or Throw, Don&apos;t Go
                </h3>
                <p className="mt-2 text-sm text-neutral-600 leading-relaxed">
                  Untrained rescuers frequently drown attempting in-water rescues. Use poles,
                  branches, life buoys, or ropes from safety on the bank or pool edge.
                </p>
              </div>
            </div>

            <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-6 flex flex-col justify-between">
              <div>
                <span className="text-2xl font-extrabold text-brand-red-600">04</span>
                <h3 className="mt-2 text-base font-bold text-neutral-900">Float to Live</h3>
                <p className="mt-2 text-sm text-neutral-600 leading-relaxed">
                  If caught unexpectedly in deep water or currents, fight the panic instinct. Tilt
                  your head back, spread your limbs, float on your back, and regulate your
                  breathing.
                </p>
              </div>
            </div>
          </div>

          {/* Educational Scope Notice */}
          <div className="mt-10 rounded-xl border border-brand-red-600/20 bg-brand-red-50 p-5 text-sm text-neutral-800 leading-relaxed">
            <p className="font-bold text-brand-red-700">Important Safety Notice:</p>
            <p className="mt-1">
              Online educational lessons teach theoretical comprehension, hazard recognition, and
              safety protocols. They provide vital knowledge but do not replace supervised,
              in-person practice with certified aquatic instructors in safe water environments.
            </p>
          </div>
        </Container>
      </section>

      {/* 5. Educational Resources Entry Point */}
      <section
        id="articles"
        aria-labelledby="articles-heading"
        className="py-16 sm:py-24 border-t border-neutral-200 bg-neutral-50"
      >
        <Container>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 max-w-2xl sm:max-w-none">
            <div className="max-w-2xl">
              <Badge variant="outline" className="mb-3">
                Resource Hub
              </Badge>
              <h2
                id="articles-heading"
                className="text-2xl font-bold tracking-tight text-neutral-900 sm:text-3xl lg:text-4xl"
              >
                Educational Resources &amp; Articles
              </h2>
              <p className="mt-3 text-base text-neutral-700 leading-relaxed">
                Read our series of written guides covering water comfort, adult beginner tips,
                buoyancy physics, and community safety checklists.
              </p>
            </div>
            <Link
              href="/articles"
              className="inline-flex min-h-[44px] items-center justify-center rounded-lg border border-neutral-300 bg-neutral-white px-5 py-2.5 text-sm font-semibold text-neutral-900 shadow-xs hover:bg-neutral-50 hover:border-neutral-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-700 shrink-0"
            >
              Browse All Guides{" "}
              <span aria-hidden="true" className="ml-1.5">
                →
              </span>
            </Link>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {getPublishedArticles()
              .slice(0, 3)
              .map((article) => (
                <Card key={article.slug} className="flex flex-col justify-between">
                  <CardHeader>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <Badge
                        variant={article.category === "Water Safety" ? "brand" : "aquatic"}
                        size="sm"
                      >
                        {article.category}
                      </Badge>
                      <span className="text-xs text-neutral-600">
                        {article.readTimeMinutes} min read
                      </span>
                    </div>
                    <CardTitle as="h3">
                      <Link
                        href={`/articles/${article.slug}`}
                        className="hover:text-brand-red-600 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red-600 rounded"
                      >
                        {article.title}
                      </Link>
                    </CardTitle>
                    <CardDescription className="line-clamp-3 mt-2">
                      {article.summary}
                    </CardDescription>
                  </CardHeader>
                  <CardFooter className="border-t border-neutral-100 pt-4">
                    <Link
                      href={`/articles/${article.slug}`}
                      className="inline-flex min-h-[44px] items-center text-sm font-bold text-brand-red-600 hover:text-brand-red-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red-600 rounded"
                    >
                      Read Full Guide{" "}
                      <span aria-hidden="true" className="ml-1">
                        →
                      </span>
                    </Link>
                  </CardFooter>
                </Card>
              ))}
          </div>
        </Container>
      </section>

      {/* 6. Community & Contact Entry Point */}
      <section
        id="contact"
        aria-labelledby="contact-heading"
        className="py-16 sm:py-24 border-t border-neutral-200 bg-neutral-white"
      >
        <Container>
          <div className="max-w-2xl">
            <Badge variant="brand" className="mb-3">
              Get in Touch
            </Badge>
            <h2
              id="contact-heading"
              className="text-2xl font-bold tracking-tight text-neutral-900 sm:text-3xl lg:text-4xl"
            >
              Community &amp; Inquiries
            </h2>
            <p className="mt-3 text-base text-neutral-700 leading-relaxed">
              SwimNigeria is actively preparing for launch. We welcome inquiries from swimming
              educators, community organizers, and learners committed to aquatic safety.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle as="h3">Educational Questions</CardTitle>
                <CardDescription>
                  General questions regarding curriculum and safety.
                </CardDescription>
              </CardHeader>
              <CardContent className="text-sm">
                For questions about our instructional content or suggestions for topics that address
                unique community hazards across Nigeria.
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle as="h3">Instructor Collaboration</CardTitle>
                <CardDescription>Certified aquatic educators and coaches.</CardDescription>
              </CardHeader>
              <CardContent className="text-sm">
                We are building relationships with vetted swimming instructors across Nigeria to
                connect digital theory with practical in-pool instruction.
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle as="h3">Community Safety Channels</CardTitle>
                <CardDescription>Direct contact touchpoints.</CardDescription>
              </CardHeader>
              <CardContent className="text-sm">
                Official email and direct community channels will be activated upon launch. Platform
                updates will be announced as new features go live.
              </CardContent>
            </Card>
          </div>
        </Container>
      </section>
    </div>
  );
}
