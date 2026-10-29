import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Container } from "@/components/layout/container";
import { Badge } from "@/components/ui/badge";
import {
  getCourseBySlug,
  getPublishedCourses,
  MANDATORY_CERTIFICATE_DISCLAIMER,
} from "@/lib/courses";

interface CourseSyllabusPageProps {
  params: Promise<{ courseSlug: string }>;
}

export async function generateStaticParams() {
  const publishedCourses = getPublishedCourses();
  return publishedCourses.map((course) => ({
    courseSlug: course.slug,
  }));
}

export async function generateMetadata({ params }: CourseSyllabusPageProps): Promise<Metadata> {
  const { courseSlug } = await params;
  const course = getCourseBySlug(courseSlug);

  if (!course) {
    return {
      title: "Course Not Found | SwimNigeria",
      description: "The requested swimming curriculum syllabus could not be found.",
    };
  }

  return {
    title: `${course.title} — Syllabus | SwimNigeria`,
    description: course.summary,
  };
}

export default async function CourseSyllabusPage({ params }: CourseSyllabusPageProps) {
  const { courseSlug } = await params;
  const course = getCourseBySlug(courseSlug);

  // Return a genuine Next.js 404 for missing or unpublished draft courses
  if (!course || !course.published) {
    notFound();
  }

  const difficultyLabel = course.difficulty.charAt(0).toUpperCase() + course.difficulty.slice(1);

  // Calculate total published lessons count
  const totalLessons = course.modules.reduce((count, mod) => count + mod.lessons.length, 0);

  return (
    <div className="py-12 sm:py-16 lg:py-20">
      <Container>
        {/* Navigation Breadcrumb / Back Link */}
        <nav aria-label="Breadcrumb" className="mb-6">
          <Link
            href="/courses"
            className="inline-flex min-h-[44px] items-center text-sm font-semibold text-brand-red-600 hover:text-brand-red-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red-600 rounded"
          >
            <span aria-hidden="true" className="mr-1.5">
              ←
            </span>
            Back to Course Catalogue
          </Link>
        </nav>

        {/* Course Header */}
        <header className="space-y-4 max-w-4xl">
          <div className="flex flex-wrap items-center gap-2">
            <Badge
              variant={course.category === "Water Safety & Acclimatization" ? "brand" : "aquatic"}
              size="md"
            >
              {course.category}
            </Badge>
            <Badge variant="outline" size="md">
              {difficultyLabel}
            </Badge>
            <span className="font-medium text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 text-xs">
              Free Digital Access
            </span>
          </div>

          <h1 className="text-3xl font-extrabold tracking-tight text-neutral-900 sm:text-4xl lg:text-5xl leading-tight">
            {course.title}
          </h1>

          <p className="text-lg text-neutral-700 leading-relaxed font-normal">{course.summary}</p>

          {/* Quick Curriculum Facts */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-4 border-t border-neutral-200 text-xs sm:text-sm text-neutral-700">
            <div>
              <span className="block font-semibold text-neutral-900">Estimated Duration:</span>
              <span>
                ~{course.estimatedDurationMinutes} mins (Estimate for self-paced digital learning)
              </span>
            </div>
            <div>
              <span className="block font-semibold text-neutral-900">Pedagogical Modules:</span>
              <span>{course.modules.length} Ordered Modules</span>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <span className="block font-semibold text-neutral-900">Total Lessons:</span>
              <span>{totalLessons} Structured Lessons</span>
            </div>
          </div>
        </header>

        {/* Mandatory Educational & Life-Safety Disclaimer */}
        <div className="mt-8 rounded-xl border border-brand-red-200 bg-brand-red-50/70 p-5 sm:p-6 text-brand-red-950 text-sm leading-relaxed max-w-4xl">
          <div className="flex items-start gap-3">
            <span
              className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-red-600 text-neutral-white font-bold text-xs"
              aria-hidden="true"
            >
              !
            </span>
            <div className="space-y-1">
              <strong className="font-semibold block text-brand-red-900">
                Mandatory Educational &amp; Life-Safety Disclaimer
              </strong>
              <p className="text-brand-red-900 text-xs sm:text-sm">
                {MANDATORY_CERTIFICATE_DISCLAIMER}
              </p>
            </div>
          </div>
        </div>

        {/* Main Content Layout */}
        <div className="mt-12 space-y-12 max-w-4xl">
          {/* Course Overview / Full Description */}
          <section aria-labelledby="course-overview-heading" className="space-y-4">
            <h2
              id="course-overview-heading"
              className="text-2xl font-bold tracking-tight text-neutral-900"
            >
              Course Overview
            </h2>
            <p className="text-neutral-700 text-base sm:text-lg leading-relaxed">
              {course.description}
            </p>
          </section>

          {/* Intended Audience and Prerequisites Grid */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <section
              aria-labelledby="intended-audience-heading"
              className="rounded-xl border border-neutral-200 bg-neutral-50/60 p-6"
            >
              <h2 id="intended-audience-heading" className="text-lg font-bold text-neutral-900">
                Intended Audience
              </h2>
              <p className="mt-2 text-sm text-neutral-700 leading-relaxed">
                {course.intendedAudience}
              </p>
            </section>

            <section
              aria-labelledby="prerequisites-heading"
              className="rounded-xl border border-neutral-200 bg-neutral-50/60 p-6"
            >
              <h2 id="prerequisites-heading" className="text-lg font-bold text-neutral-900">
                Course Prerequisites
              </h2>
              <ul className="mt-2 space-y-2 text-sm text-neutral-700">
                {course.prerequisites.map((prereq, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span
                      className="text-brand-red-600 font-bold shrink-0 leading-tight"
                      aria-hidden="true"
                    >
                      •
                    </span>
                    <span>{prereq}</span>
                  </li>
                ))}
              </ul>
            </section>
          </div>

          {/* Learning Outcomes */}
          <section aria-labelledby="learning-outcomes-heading" className="space-y-4">
            <h2
              id="learning-outcomes-heading"
              className="text-2xl font-bold tracking-tight text-neutral-900"
            >
              Learning Outcomes
            </h2>
            <p className="text-sm text-neutral-600">
              Upon completing this theoretical course curriculum, learners will be equipped with key
              competencies:
            </p>
            <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {course.learningOutcomes.map((outcome, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-3 rounded-lg border border-neutral-200 bg-neutral-white p-4 text-sm text-neutral-800 shadow-2xs"
                >
                  <span
                    className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-water-blue-100 text-water-blue-700 font-bold text-xs mt-0.5"
                    aria-hidden="true"
                  >
                    ✓
                  </span>
                  <span>{outcome}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Module & Lesson Breakdown (Syllabus) */}
          <section aria-labelledby="curriculum-breakdown-heading" className="space-y-6">
            <div>
              <h2
                id="curriculum-breakdown-heading"
                className="text-2xl font-bold tracking-tight text-neutral-900"
              >
                Course Syllabus &amp; Curriculum Breakdown
              </h2>
              <p className="mt-1 text-sm text-neutral-600">
                Structured into {course.modules.length} pedagogical modules and {totalLessons}{" "}
                lessons in sequential instructional order.
              </p>
            </div>

            <div className="space-y-6">
              {course.modules.map((moduleItem, modIdx) => (
                <section
                  key={moduleItem.slug}
                  aria-labelledby={`module-${moduleItem.slug}-heading`}
                  className="rounded-xl border border-neutral-200 bg-neutral-white overflow-hidden shadow-xs"
                >
                  {/* Module Header */}
                  <div className="border-b border-neutral-200 bg-neutral-50/80 px-6 py-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-water-blue-700">
                        Module {modIdx + 1}
                      </span>
                      <span className="text-xs text-neutral-500 font-medium">
                        {moduleItem.lessons.length}{" "}
                        {moduleItem.lessons.length === 1 ? "Lesson" : "Lessons"}
                      </span>
                    </div>
                    <h3
                      id={`module-${moduleItem.slug}-heading`}
                      className="text-lg font-bold text-neutral-900 sm:text-xl mt-1"
                    >
                      {moduleItem.title}
                    </h3>
                    <p className="mt-1 text-sm text-neutral-600 leading-relaxed">
                      {moduleItem.description}
                    </p>
                  </div>

                  {/* Module Lessons */}
                  <ol
                    className="divide-y divide-neutral-100"
                    aria-label={`Lessons in ${moduleItem.title}`}
                  >
                    {moduleItem.lessons.map((lesson, lessonIdx) => (
                      <li
                        key={lesson.slug}
                        className="p-4 sm:p-6 hover:bg-neutral-50/50 transition-colors"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4">
                          <div className="space-y-1.5 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="font-mono text-xs font-semibold text-neutral-500">
                                Lesson {modIdx + 1}.{lessonIdx + 1}
                              </span>
                              {lesson.isPreview ? (
                                <div className="flex flex-wrap items-center gap-2">
                                  <Badge variant="aquatic" size="sm">
                                    Preview Lesson (Reader Launching Phase 4.4)
                                  </Badge>
                                  <Link
                                    href={`/courses/${course.slug}/lessons/${lesson.slug}`}
                                    className="inline-flex items-center text-xs font-semibold text-brand-red-600 hover:text-brand-red-700 underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red-600 rounded"
                                  >
                                    Read Lesson Preview →
                                  </Link>
                                </div>
                              ) : (
                                <Badge variant="outline" size="sm" className="text-neutral-500">
                                  Full Curriculum
                                </Badge>
                              )}
                            </div>
                            <h4 className="text-base font-semibold text-neutral-900">
                              {lesson.title}
                            </h4>
                            <p className="text-sm text-neutral-600 leading-relaxed">
                              {lesson.summary}
                            </p>
                          </div>
                          <div className="shrink-0 text-xs text-neutral-500 font-medium pt-1">
                            ~{lesson.durationMinutes} min
                          </div>
                        </div>
                      </li>
                    ))}
                  </ol>
                </section>
              ))}
            </div>
          </section>

          {/* Launch Status & Enrollment Callout */}
          <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-6 sm:p-8">
            <div className="max-w-2xl">
              <Badge variant="outline" size="sm" className="mb-3">
                Curriculum Roadmap &amp; Launch Status
              </Badge>
              <h2 className="text-xl font-bold text-neutral-900 sm:text-2xl">
                Ready to Study This Course?
              </h2>
              <p className="mt-2 text-sm text-neutral-600 leading-relaxed">
                SwimNigeria is rolling out its curriculum incrementally. Public syllabus exploration
                is currently live. Full interactive student enrollment, lesson progress tracking,
                and certificate assessment will open in upcoming phases. In Phase 4.4, designated
                preview lessons will become readable directly on the platform.
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-4">
                <Link
                  href="/courses"
                  className="inline-flex min-h-[44px] items-center justify-center rounded-lg bg-brand-red-600 px-5 py-2.5 text-sm font-semibold text-neutral-white shadow-xs hover:bg-brand-red-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red-600"
                >
                  Explore Other Courses
                </Link>
                <Link
                  href="/articles"
                  className="inline-flex min-h-[44px] items-center justify-center rounded-lg border border-neutral-300 bg-neutral-white px-5 py-2.5 text-sm font-semibold text-neutral-800 hover:bg-neutral-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900"
                >
                  Read Water Safety Articles
                </Link>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
