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
import {
  getFilteredCourses,
  getCourseCategories,
  getCourseDifficulties,
  type CourseCategory,
  type DifficultyLevel,
} from "@/lib/courses";

export const metadata: Metadata = {
  title: "Course Catalogue & Swimming Curriculum | SwimNigeria",
  description:
    "Explore foundational water safety, natural buoyancy mechanics, and beginner freestyle swimming courses designed for Nigerian adult learners and families.",
};

interface CoursesPageProps {
  searchParams: Promise<{ category?: string; difficulty?: string }>;
}

export default async function CoursesPage({ searchParams }: CoursesPageProps) {
  const { category: queryCategory, difficulty: queryDifficulty } = await searchParams;

  const activeCategory = queryCategory || "all";
  const activeDifficulty = queryDifficulty || "all";

  const courses = getFilteredCourses({
    category: activeCategory,
    difficulty: activeDifficulty,
  });

  const allCategories = getCourseCategories();
  const allDifficulties = getCourseDifficulties();

  function slugifyCategory(cat: string): string {
    return cat
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  }

  // Helper to generate preserved filter URLs
  function createFilterUrl(newCat?: string, newDiff?: string): string {
    const targetCat = newCat !== undefined ? newCat : activeCategory;
    const targetDiff = newDiff !== undefined ? newDiff : activeDifficulty;

    const params = new URLSearchParams();
    if (targetCat && targetCat !== "all") {
      params.set("category", slugifyCategory(targetCat));
    }
    if (targetDiff && targetDiff !== "all") {
      params.set("difficulty", targetDiff.toLowerCase());
    }

    const queryString = params.toString();
    return queryString ? `/courses?${queryString}` : "/courses";
  }

  const isFiltered = activeCategory !== "all" || activeDifficulty !== "all";

  // Resolve matching category title for active filter badge display
  const matchedCategory = allCategories.find(
    (c) =>
      activeCategory.toLowerCase().replace(/[^a-z0-9]/g, "") ===
      c.toLowerCase().replace(/[^a-z0-9]/g, ""),
  );
  const displayCategoryName = matchedCategory || activeCategory;
  const displayDifficultyName =
    activeDifficulty.charAt(0).toUpperCase() + activeDifficulty.slice(1);

  return (
    <div className="py-12 sm:py-16 lg:py-20">
      <Container>
        {/* Page Header */}
        <div className="max-w-3xl">
          <Badge variant="brand" className="mb-4">
            Curriculum Showcase
          </Badge>
          <h1 className="text-3xl font-extrabold tracking-tight text-neutral-900 sm:text-4xl lg:text-5xl leading-tight">
            Course Catalogue &amp; Swimming Curriculum
          </h1>
          <p className="mt-4 text-base sm:text-lg text-neutral-700 leading-relaxed">
            Structured, evidence-based swimming courses covering fear reduction, natural buoyancy
            mechanics, and beginner stroke propulsion for Nigerian adult learners and families.
          </p>

          {/* Educational Safety & Theory Notice */}
          <div className="mt-6 rounded-xl border border-water-blue-200 bg-water-blue-50/70 p-4 sm:p-5 text-water-blue-900 text-sm leading-relaxed">
            <div className="flex items-start gap-3">
              <span
                className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-water-blue-600 text-neutral-white font-bold text-xs"
                aria-hidden="true"
              >
                i
              </span>
              <div>
                <strong className="font-semibold block sm:inline">
                  Educational Theory Notice:{" "}
                </strong>
                <span>
                  SwimNigeria&apos;s digital courses deliver theoretical water safety concepts,
                  biomechanical principles, and hazard recognition. Completing digital coursework
                  does not certify physical swimming competence, water survival capability, or
                  lifeguarding qualification without practical, in-person assessment by a certified
                  aquatic instructor in controlled aquatic facilities.
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Course Filters Section */}
        <section aria-label="Course Filters" className="mt-10 space-y-4">
          {/* Category Filter Navigation */}
          <div>
            <span
              id="category-filter-label"
              className="text-xs font-bold uppercase tracking-wider text-neutral-500 block mb-2"
            >
              Filter by Category
            </span>
            <nav
              aria-labelledby="category-filter-label"
              className="flex flex-wrap items-center gap-2"
            >
              <Link
                href={createFilterUrl("all", undefined)}
                className={`min-h-[44px] inline-flex items-center rounded-lg px-4 py-2 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red-600 ${
                  activeCategory === "all"
                    ? "bg-brand-red-600 text-neutral-white shadow-xs"
                    : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200 hover:text-neutral-900"
                }`}
                aria-current={activeCategory === "all" ? "page" : undefined}
              >
                All Categories
              </Link>

              {allCategories.map((category: CourseCategory) => {
                const slugified = slugifyCategory(category);
                const isActive =
                  activeCategory.toLowerCase().replace(/[^a-z0-9]/g, "") ===
                  category.toLowerCase().replace(/[^a-z0-9]/g, "");

                return (
                  <Link
                    key={category}
                    href={createFilterUrl(slugified, undefined)}
                    className={`min-h-[44px] inline-flex items-center rounded-lg px-4 py-2 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red-600 ${
                      isActive
                        ? "bg-brand-red-600 text-neutral-white shadow-xs"
                        : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200 hover:text-neutral-900"
                    }`}
                    aria-current={isActive ? "page" : undefined}
                  >
                    {category}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Difficulty Filter Navigation */}
          <div>
            <span
              id="difficulty-filter-label"
              className="text-xs font-bold uppercase tracking-wider text-neutral-500 block mb-2"
            >
              Filter by Difficulty
            </span>
            <nav
              aria-labelledby="difficulty-filter-label"
              className="flex flex-wrap items-center gap-2"
            >
              <Link
                href={createFilterUrl(undefined, "all")}
                className={`min-h-[44px] inline-flex items-center rounded-lg px-4 py-2 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red-600 ${
                  activeDifficulty === "all"
                    ? "bg-neutral-900 text-neutral-white shadow-xs"
                    : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200 hover:text-neutral-900"
                }`}
                aria-current={activeDifficulty === "all" ? "page" : undefined}
              >
                All Difficulties
              </Link>

              {allDifficulties.map((diff: DifficultyLevel) => {
                const isActive = activeDifficulty.toLowerCase() === diff.toLowerCase();
                const displayLabel = diff.charAt(0).toUpperCase() + diff.slice(1);

                return (
                  <Link
                    key={diff}
                    href={createFilterUrl(undefined, diff.toLowerCase())}
                    className={`min-h-[44px] inline-flex items-center rounded-lg px-4 py-2 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red-600 ${
                      isActive
                        ? "bg-neutral-900 text-neutral-white shadow-xs"
                        : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200 hover:text-neutral-900"
                    }`}
                    aria-current={isActive ? "page" : undefined}
                  >
                    {displayLabel}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Active Filter Summary & Reset Bar */}
          {isFiltered && (
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-2.5 text-xs text-neutral-700">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-neutral-900">Active Filters:</span>
                {activeCategory !== "all" && (
                  <span className="inline-flex items-center rounded bg-brand-red-100 px-2 py-0.5 font-medium text-brand-red-800">
                    Category: {displayCategoryName}
                  </span>
                )}
                {activeDifficulty !== "all" && (
                  <span className="inline-flex items-center rounded bg-neutral-200 px-2 py-0.5 font-medium text-neutral-800">
                    Difficulty: {displayDifficultyName}
                  </span>
                )}
              </div>
              <Link
                href="/courses"
                className="font-bold text-brand-red-600 hover:text-brand-red-700 underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red-600 rounded"
                aria-label="Clear active filters"
              >
                Clear Filters
              </Link>
            </div>
          )}
        </section>

        {/* Course Cards Grid or Empty State */}
        {courses.length > 0 ? (
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {courses.map((course) => {
              const diffLabel =
                course.difficulty.charAt(0).toUpperCase() + course.difficulty.slice(1);

              return (
                <Card
                  key={course.slug}
                  className="flex flex-col justify-between"
                  data-testid={`course-card-${course.slug}`}
                >
                  <CardHeader>
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                      <Badge
                        variant={
                          course.category === "Water Safety & Acclimatization" ? "brand" : "aquatic"
                        }
                        size="sm"
                      >
                        {course.category}
                      </Badge>
                      <Badge variant="outline" size="sm">
                        {diffLabel}
                      </Badge>
                    </div>

                    <CardTitle as="h2" className="text-xl">
                      {course.title}
                    </CardTitle>

                    <CardDescription className="line-clamp-3 mt-2">
                      {course.summary}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="pt-0 space-y-4">
                    {/* Estimated Duration */}
                    <div className="flex items-center gap-1.5 text-xs text-neutral-600">
                      <span className="font-semibold text-neutral-700">Estimated Duration:</span>
                      <span>~{course.estimatedDurationMinutes} minutes (Self-paced)</span>
                    </div>

                    {/* Key Learning Outcomes Preview */}
                    <div>
                      <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-2">
                        Key Outcomes Preview
                      </h3>
                      <ul className="space-y-1.5 text-xs text-neutral-700">
                        {course.learningOutcomes.slice(0, 3).map((outcome, idx) => (
                          <li key={idx} className="flex items-start gap-1.5">
                            <span
                              className="text-brand-red-600 font-bold shrink-0 leading-tight"
                              aria-hidden="true"
                            >
                              •
                            </span>
                            <span>{outcome}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Module Count & Free Tag */}
                    <div className="pt-3 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-600">
                      <span>{course.modules.length} Pedagogical Modules</span>
                      <span className="font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        Free Digital Access
                      </span>
                    </div>
                  </CardContent>

                  <CardFooter className="border-t border-neutral-100 pt-4 flex flex-col items-stretch gap-2.5">
                    {/* Transparent Intended Route Indicator */}
                    <div className="flex items-center justify-between text-[11px] text-neutral-500">
                      <span>Intended syllabus route:</span>
                      <code className="text-neutral-700 bg-neutral-100 px-1.5 py-0.5 rounded font-mono">
                        /courses/{course.slug}
                      </code>
                    </div>

                    {/* Honest Interim Non-Interactive Action */}
                    <Button
                      variant="secondary"
                      disabled
                      aria-disabled="true"
                      className="w-full justify-center opacity-85 cursor-not-allowed text-xs font-semibold"
                    >
                      Syllabus Viewer (Launching in Phase 4.3)
                    </Button>
                    <p className="text-[11px] text-neutral-500 text-center leading-normal">
                      Full interactive syllabus exploration and preview lessons will open in the
                      next milestone.
                    </p>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        ) : (
          <div className="mt-12 rounded-2xl border border-neutral-200 bg-neutral-50 p-8 text-center sm:p-12">
            <h2 className="text-lg font-bold text-neutral-900">No Courses Match Your Selection</h2>
            <p className="mt-2 text-sm text-neutral-600 max-w-md mx-auto">
              There are currently no published courses matching your chosen category or difficulty
              criteria. Try resetting or adjusting your filters.
            </p>
            <div className="mt-6">
              <Link
                href="/courses"
                className="inline-flex min-h-[44px] items-center justify-center rounded-lg bg-brand-red-600 px-5 py-2.5 text-sm font-semibold text-neutral-white shadow-xs hover:bg-brand-red-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red-600"
              >
                Reset All Filters
              </Link>
            </div>
          </div>
        )}
      </Container>
    </div>
  );
}
