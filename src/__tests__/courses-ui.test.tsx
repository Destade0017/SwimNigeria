import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import CoursesPage, { metadata } from "@/app/courses/page";
import { getPublishedCourses } from "@/lib/courses";

describe("Course Catalogue UI & Filtering (Phase 4.2)", () => {
  it("provides correct SEO metadata", () => {
    expect(metadata.title).toBe("Course Catalogue & Swimming Curriculum | SwimNigeria");
    expect(metadata.description).toContain("Explore foundational water safety");
  });

  it("renders page header, badge, and educational theory notice", async () => {
    const pageJsx = await CoursesPage({ searchParams: Promise.resolve({}) });
    render(pageJsx);

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: "Course Catalogue & Swimming Curriculum",
      }),
    ).toBeInTheDocument();

    expect(screen.getByText("Curriculum Showcase")).toBeInTheDocument();

    // Educational theory notice must be prominent
    expect(screen.getByText(/Educational Theory Notice:/i)).toBeInTheDocument();
    expect(
      screen.getByText(
        /Completing digital coursework does not certify physical swimming competence/i,
      ),
    ).toBeInTheDocument();
  });

  it("renders all three published launch courses in default view", async () => {
    const pageJsx = await CoursesPage({ searchParams: Promise.resolve({}) });
    render(pageJsx);

    const publishedCourses = getPublishedCourses();
    expect(publishedCourses).toHaveLength(3);

    for (const course of publishedCourses) {
      expect(screen.getByRole("heading", { level: 2, name: course.title })).toBeInTheDocument();
      expect(screen.getByText(course.summary)).toBeInTheDocument();
    }
  });

  it("strictly excludes unpublished draft courses from the catalogue", async () => {
    const pageJsx = await CoursesPage({ searchParams: Promise.resolve({}) });
    render(pageJsx);

    expect(
      screen.queryByText("Open Water Safety & Coastal Survival Concepts"),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByTestId("course-card-open-water-endurance-survival"),
    ).not.toBeInTheDocument();
  });

  it("calculates curriculum metrics such as module count strictly from published content", async () => {
    const pageJsx = await CoursesPage({ searchParams: Promise.resolve({}) });
    render(pageJsx);

    // Course 1 has 4 modules in raw data, but 4th module is draft.
    // The public card MUST display 3 Pedagogical Modules and omit draft module.
    expect(screen.getAllByText("3 Pedagogical Modules")).toHaveLength(3);
    expect(screen.queryByText("4 Pedagogical Modules")).not.toBeInTheDocument();
  });

  it("filters courses accurately by category", async () => {
    const pageJsx = await CoursesPage({
      searchParams: Promise.resolve({ category: "water-safety-acclimatization" }),
    });
    render(pageJsx);

    // Should include Course 1
    expect(
      screen.getByRole("heading", {
        level: 2,
        name: "Water Safety & Overcoming Fear of Water",
      }),
    ).toBeInTheDocument();

    // Should exclude Course 2 and 3
    expect(
      screen.queryByRole("heading", {
        level: 2,
        name: "Buoyancy & Breathing Mechanics",
      }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("heading", {
        level: 2,
        name: "Beginner Freestyle & Horizontal Propulsion",
      }),
    ).not.toBeInTheDocument();
  });

  it("filters courses accurately by difficulty", async () => {
    const pageJsx = await CoursesPage({
      searchParams: Promise.resolve({ difficulty: "foundational" }),
    });
    render(pageJsx);

    // Foundational course
    expect(
      screen.getByRole("heading", {
        level: 2,
        name: "Water Safety & Overcoming Fear of Water",
      }),
    ).toBeInTheDocument();

    // Beginner courses must be omitted
    expect(
      screen.queryByRole("heading", {
        level: 2,
        name: "Buoyancy & Breathing Mechanics",
      }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("heading", {
        level: 2,
        name: "Beginner Freestyle & Horizontal Propulsion",
      }),
    ).not.toBeInTheDocument();
  });

  it("handles combined category and difficulty filters", async () => {
    const pageJsx = await CoursesPage({
      searchParams: Promise.resolve({
        category: "buoyancy-body-mechanics",
        difficulty: "beginner",
      }),
    });
    render(pageJsx);

    expect(
      screen.getByRole("heading", {
        level: 2,
        name: "Buoyancy & Breathing Mechanics",
      }),
    ).toBeInTheDocument();

    expect(
      screen.queryByRole("heading", {
        level: 2,
        name: "Water Safety & Overcoming Fear of Water",
      }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("heading", {
        level: 2,
        name: "Beginner Freestyle & Horizontal Propulsion",
      }),
    ).not.toBeInTheDocument();
  });

  it("renders informative empty state and reset button when no courses match", async () => {
    const pageJsx = await CoursesPage({
      searchParams: Promise.resolve({
        category: "water-safety-acclimatization",
        difficulty: "intermediate", // No course has this combination
      }),
    });
    render(pageJsx);

    expect(
      screen.getByRole("heading", {
        level: 2,
        name: "No Courses Match Your Selection",
      }),
    ).toBeInTheDocument();

    expect(screen.getByRole("link", { name: "Reset All Filters" })).toHaveAttribute(
      "href",
      "/courses",
    );
  });

  it("handles unknown or invalid filter query values safely without error", async () => {
    const pageJsx = await CoursesPage({
      searchParams: Promise.resolve({
        category: "malicious-unknown-category",
        difficulty: "nonexistent-level",
      }),
    });
    render(pageJsx);

    expect(
      screen.getByRole("heading", {
        level: 2,
        name: "No Courses Match Your Selection",
      }),
    ).toBeInTheDocument();
  });

  it("renders active filter summary bar with reset link when filtered", async () => {
    const pageJsx = await CoursesPage({
      searchParams: Promise.resolve({ difficulty: "foundational" }),
    });
    render(pageJsx);

    expect(screen.getByText("Active Filters:")).toBeInTheDocument();
    expect(screen.getByText("Difficulty: Foundational")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Clear active filters" })).toHaveAttribute(
      "href",
      "/courses",
    );
  });

  it("does not render clickable broken links to unbuilt syllabus detail routes", async () => {
    const pageJsx = await CoursesPage({ searchParams: Promise.resolve({}) });
    render(pageJsx);

    // Verify buttons are non-interactive and disabled
    const syllabusButtons = screen.getAllByRole("button", {
      name: "Syllabus Viewer (Launching in Phase 4.3)",
    });
    expect(syllabusButtons).toHaveLength(3);

    for (const btn of syllabusButtons) {
      expect(btn).toBeDisabled();
      expect(btn).toHaveAttribute("aria-disabled", "true");
    }

    // Verify upcoming release notice is present
    const notices = screen.getAllByText(
      /Full interactive syllabus exploration and preview lessons will open in the next milestone\./i,
    );
    expect(notices).toHaveLength(3);
  });

  it("truthful presentation: does not display fabricated ratings, reviews, or enrollment statistics", async () => {
    const pageJsx = await CoursesPage({ searchParams: Promise.resolve({}) });
    render(pageJsx);

    // Must NOT contain fake star ratings, student review counts, or false claims
    expect(screen.queryByText(/★/)).not.toBeInTheDocument();
    expect(screen.queryByText(/5\.0/)).not.toBeInTheDocument();
    expect(screen.queryByText(/students enrolled/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/reviews/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/certified instructor endorsed/i)).not.toBeInTheDocument();
  });

  it("provides accessible labels and aria attributes across filter navigation", async () => {
    const pageJsx = await CoursesPage({ searchParams: Promise.resolve({}) });
    render(pageJsx);

    expect(screen.getByRole("region", { name: "Course Filters" })).toBeInTheDocument();

    const allCategoriesLink = screen.getByRole("link", { name: "All Categories" });
    expect(allCategoriesLink).toHaveAttribute("aria-current", "page");

    const allDiffLink = screen.getByRole("link", { name: "All Difficulties" });
    expect(allDiffLink).toHaveAttribute("aria-current", "page");
  });
});
