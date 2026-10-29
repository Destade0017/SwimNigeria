import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Container } from "@/components/layout/container";
import { Badge } from "@/components/ui/badge";
import {
  getPreviewLesson,
  getAdjacentPreviewLessons,
  getPreviewLessons,
  getSafeVideoEmbed,
  MANDATORY_CERTIFICATE_DISCLAIMER,
} from "@/lib/courses";

interface PreviewLessonPageProps {
  params: Promise<{
    courseSlug: string;
    lessonSlug: string;
  }>;
}

export async function generateStaticParams() {
  const previewLessons = getPreviewLessons();
  return previewLessons.map((item) => ({
    courseSlug: item.courseSlug,
    lessonSlug: item.lesson.slug,
  }));
}

export async function generateMetadata({ params }: PreviewLessonPageProps): Promise<Metadata> {
  const { courseSlug, lessonSlug } = await params;
  const resolved = getPreviewLesson(courseSlug, lessonSlug);

  if (!resolved) {
    return {
      title: "Lesson Not Found | SwimNigeria",
      description:
        "The requested preview lesson could not be found or is not available for public preview.",
    };
  }

  return {
    title: `${resolved.lesson.title} — Preview Lesson | SwimNigeria`,
    description: resolved.lesson.summary,
  };
}

export default async function PreviewLessonPage({ params }: PreviewLessonPageProps) {
  const { courseSlug, lessonSlug } = await params;
  const resolved = getPreviewLesson(courseSlug, lessonSlug);

  // Return a genuine Next.js 404 for missing, unpublished, or non-preview lessons
  if (!resolved) {
    notFound();
  }

  const { course, module: moduleItem, lesson } = resolved;
  const safeVideo = getSafeVideoEmbed(lesson.videoReference);
  const adjacent = getAdjacentPreviewLessons(course.slug, lesson.slug);

  return (
    <div className="py-12 sm:py-16 lg:py-20">
      <Container size="prose">
        {/* Semantic Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-neutral-600">
            <li>
              <Link
                href="/courses"
                className="font-medium text-brand-red-600 hover:text-brand-red-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red-600 rounded"
              >
                Course Catalogue
              </Link>
            </li>
            <li aria-hidden="true" className="text-neutral-400">
              /
            </li>
            <li>
              <Link
                href={`/courses/${course.slug}`}
                className="font-medium text-brand-red-600 hover:text-brand-red-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red-600 rounded"
              >
                {course.title}
              </Link>
            </li>
            <li aria-hidden="true" className="text-neutral-400">
              /
            </li>
            <li
              aria-current="page"
              className="font-semibold text-neutral-900 truncate max-w-[200px] sm:max-w-xs"
            >
              {lesson.title}
            </li>
          </ol>
        </nav>

        {/* Lesson Header */}
        <header className="space-y-4 border-b border-neutral-200 pb-8">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="aquatic" size="md">
              Public Preview Lesson
            </Badge>
            <span className="font-medium text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 text-xs">
              Free Access
            </span>
            <span className="text-xs text-neutral-600 font-medium">
              ~{lesson.durationMinutes} min reading
            </span>
          </div>

          <div className="text-xs font-bold uppercase tracking-wider text-water-blue-700">
            {moduleItem.title}
          </div>

          <h1 className="text-3xl font-extrabold tracking-tight text-neutral-900 sm:text-4xl lg:text-5xl leading-tight">
            {lesson.title}
          </h1>

          <p className="text-lg sm:text-xl text-neutral-700 leading-relaxed font-normal">
            {lesson.summary}
          </p>

          <div className="pt-2">
            <Link
              href={`/courses/${course.slug}`}
              className="inline-flex min-h-[44px] items-center text-sm font-semibold text-brand-red-600 hover:text-brand-red-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red-600 rounded"
            >
              <span aria-hidden="true" className="mr-1.5">
                ←
              </span>
              View Full Course Syllabus
            </Link>
          </div>
        </header>

        {/* Mandatory Educational & Life-Safety Disclaimer */}
        <div className="mt-8 rounded-xl border border-brand-red-200 bg-brand-red-50/70 p-5 sm:p-6 text-brand-red-950 text-sm leading-relaxed">
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

        {/* Optional Safe Video Embed Section */}
        {safeVideo && (
          <section aria-labelledby="video-demonstration-heading" className="mt-10 space-y-3">
            <h2
              id="video-demonstration-heading"
              className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900"
            >
              Instructional Video Demonstration
            </h2>
            <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-neutral-200 bg-neutral-900 shadow-xs">
              <iframe
                src={safeVideo.embedUrl}
                title={safeVideo.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                loading="lazy"
                className="w-full h-full border-0"
              />
            </div>
            <p className="text-xs text-neutral-600">
              Having trouble loading this video?{" "}
              <a
                href={safeVideo.watchUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-brand-red-600 hover:text-brand-red-700 underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red-600 rounded"
              >
                Watch directly on {safeVideo.provider === "youtube" ? "YouTube" : "Vimeo"} (opens in
                new tab)
              </a>
            </p>
          </section>
        )}

        {/* Ordered Lesson Sections */}
        <div className="mt-10 space-y-10 text-neutral-800 leading-relaxed text-base sm:text-lg">
          <h2 className="sr-only">Lesson Content</h2>
          {lesson.sections.map((section, idx) => (
            <section key={idx} aria-labelledby={`section-heading-${idx}`} className="space-y-4">
              <h2
                id={`section-heading-${idx}`}
                className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900 mt-6 pt-4 border-t border-neutral-100 first:border-t-0 first:pt-0"
              >
                {section.heading}
              </h2>

              {section.paragraphs.map((paragraph, pIdx) => (
                <p key={pIdx} className="leading-relaxed text-neutral-700">
                  {paragraph}
                </p>
              ))}

              {section.callout && (
                <div
                  role="note"
                  aria-label={section.callout.title}
                  className={`rounded-xl p-5 my-6 border ${
                    section.callout.type === "safety"
                      ? "bg-brand-red-50 border-brand-red-600/30 text-brand-red-950"
                      : section.callout.type === "technique"
                        ? "bg-water-blue-50 border-water-blue-600/30 text-water-blue-950"
                        : "bg-neutral-50 border-neutral-200 text-neutral-900"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span
                      className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full font-bold text-xs ${
                        section.callout.type === "safety"
                          ? "bg-brand-red-600 text-neutral-white"
                          : section.callout.type === "technique"
                            ? "bg-water-blue-600 text-neutral-white"
                            : "bg-neutral-700 text-neutral-white"
                      }`}
                      aria-hidden="true"
                    >
                      {section.callout.type === "safety"
                        ? "!"
                        : section.callout.type === "technique"
                          ? "✦"
                          : "i"}
                    </span>
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`text-[11px] font-bold uppercase tracking-wider ${
                            section.callout.type === "safety"
                              ? "text-brand-red-800"
                              : section.callout.type === "technique"
                                ? "text-water-blue-800"
                                : "text-neutral-700"
                          }`}
                        >
                          {section.callout.type === "safety"
                            ? "Safety Directive"
                            : section.callout.type === "technique"
                              ? "Technique Focus"
                              : "Key Concept"}
                        </span>
                      </div>
                      <p className="font-bold text-sm text-neutral-900">{section.callout.title}</p>
                      <p className="text-sm text-neutral-700 leading-relaxed">
                        {section.callout.message}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </section>
          ))}
        </div>

        {/* Previous / Next Preview Navigation & Course Syllabus Link */}
        <nav
          aria-label="Preview Lesson Navigation"
          className="mt-12 pt-8 border-t border-neutral-200 space-y-6"
        >
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            {adjacent.prev ? (
              <Link
                href={`/courses/${adjacent.prev.courseSlug}/lessons/${adjacent.prev.lesson.slug}`}
                className="inline-flex min-h-[44px] items-center text-sm font-semibold text-brand-red-600 hover:text-brand-red-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red-600 rounded"
              >
                <span aria-hidden="true" className="mr-1.5">
                  ←
                </span>
                <span>
                  <span className="block text-xs font-normal text-neutral-500">
                    Previous Preview Lesson
                  </span>
                  {adjacent.prev.lesson.title}
                </span>
              </Link>
            ) : (
              <div />
            )}

            {adjacent.next ? (
              <Link
                href={`/courses/${adjacent.next.courseSlug}/lessons/${adjacent.next.lesson.slug}`}
                className="inline-flex min-h-[44px] items-center text-right text-sm font-semibold text-brand-red-600 hover:text-brand-red-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red-600 rounded ml-auto"
              >
                <span>
                  <span className="block text-xs font-normal text-neutral-500">
                    Next Preview Lesson
                  </span>
                  {adjacent.next.lesson.title}
                </span>
                <span aria-hidden="true" className="ml-1.5">
                  →
                </span>
              </Link>
            ) : (
              <div />
            )}
          </div>

          <div className="text-center pt-2">
            <Link
              href={`/courses/${course.slug}`}
              className="inline-flex min-h-[44px] items-center justify-center text-sm font-semibold text-neutral-700 hover:text-neutral-900 underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 rounded"
            >
              Return to Course Syllabus ({course.title})
            </Link>
          </div>
        </nav>

        {/* Enrollment & Curriculum Roadmap Notice */}
        <div className="mt-12 rounded-xl border border-neutral-200 bg-neutral-50 p-6 sm:p-8">
          <Badge variant="outline" size="sm" className="mb-3">
            Preview Access Notice
          </Badge>
          <h2 className="text-lg sm:text-xl font-bold text-neutral-900">
            Continue Studying {course.title}
          </h2>
          <p className="mt-2 text-sm text-neutral-600 leading-relaxed">
            This preview lesson introduces key foundational concepts. The remaining lessons in this
            course require enrolled access, which will launch in Phase 6 with progress tracking and
            knowledge assessments.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-4">
            <Link
              href={`/courses/${course.slug}`}
              className="inline-flex min-h-[44px] items-center justify-center rounded-lg bg-brand-red-600 px-5 py-2.5 text-sm font-semibold text-neutral-white shadow-xs hover:bg-brand-red-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red-600"
            >
              Explore Course Syllabus
            </Link>
            <Link
              href="/courses"
              className="inline-flex min-h-[44px] items-center justify-center rounded-lg border border-neutral-300 bg-neutral-white px-5 py-2.5 text-sm font-semibold text-neutral-800 hover:bg-neutral-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900"
            >
              Browse All Courses
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
}
