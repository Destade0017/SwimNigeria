import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import axe from "axe-core";
import CourseSyllabusPage, {
  generateMetadata,
  generateStaticParams,
} from "@/app/courses/[courseSlug]/page";
import { getPublishedCourses, MANDATORY_CERTIFICATE_DISCLAIMER } from "@/lib/courses";

// Mock next/navigation notFound
const notFoundMock = vi.fn();
vi.mock("next/navigation", () => ({
  notFound: () => {
    notFoundMock();
    throw new Error("NEXT_NOT_FOUND");
  },
}));

describe("Public Course Syllabus UI & Routing (Phase 4.3)", () => {
  it("renders correct course information for each published launch course", async () => {
    const publishedCourses = getPublishedCourses();
    expect(publishedCourses).toHaveLength(3);

    for (const course of publishedCourses) {
      const pageJsx = await CourseSyllabusPage({
        params: Promise.resolve({ courseSlug: course.slug }),
      });
      const { unmount } = render(pageJsx);

      // Verify H1 title
      const h1 = screen.getByRole("heading", { level: 1, name: course.title });
      expect(h1).toBeInTheDocument();

      // Verify category and difficulty badges
      expect(screen.getByText(course.category)).toBeInTheDocument();
      const diffLabel = course.difficulty.charAt(0).toUpperCase() + course.difficulty.slice(1);
      expect(screen.getByText(diffLabel)).toBeInTheDocument();

      // Verify summary and full description
      expect(screen.getByText(course.summary)).toBeInTheDocument();
      expect(screen.getByText(course.description)).toBeInTheDocument();

      // Clean up DOM before next iteration
      unmount();
    }
  });

  it("clearly labels estimated duration for self-paced digital learning", async () => {
    const pageJsx = await CourseSyllabusPage({
      params: Promise.resolve({ courseSlug: "water-safety-overcoming-fear" }),
    });
    render(pageJsx);

    expect(
      screen.getByText(/~50 mins \(Estimate for self-paced digital learning\)/i),
    ).toBeInTheDocument();
  });

  it("displays intended audience and prerequisites correctly", async () => {
    const pageJsx = await CourseSyllabusPage({
      params: Promise.resolve({ courseSlug: "water-safety-overcoming-fear" }),
    });
    render(pageJsx);

    // Intended audience section
    expect(
      screen.getByRole("heading", { level: 2, name: "Intended Audience" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        /Adults, adolescents, parents, and educators who feel apprehension or anxiety around water/i,
      ),
    ).toBeInTheDocument();

    // Prerequisites section
    expect(
      screen.getByRole("heading", { level: 2, name: "Course Prerequisites" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/No prior swimming experience or athletic background required/i),
    ).toBeInTheDocument();
  });

  it("presents all published learning outcomes in an accessible list", async () => {
    const pageJsx = await CourseSyllabusPage({
      params: Promise.resolve({ courseSlug: "water-safety-overcoming-fear" }),
    });
    render(pageJsx);

    expect(
      screen.getByRole("heading", { level: 2, name: "Learning Outcomes" }),
    ).toBeInTheDocument();

    const outcomes = [
      "Explain the mammalian survival reflex and understand why physical tension causes sinking.",
      "Distinguish between calm rhythmic breathing and panic-induced hyperventilation.",
      "Execute safe shallow-water standing recovery from buoyant positions without distress.",
      "Recognize the signs of silent drowning and distinguish active supervision from passive presence.",
      "Apply the bystander rescue rule ('Reach or Throw, Never Go') to avoid double-drowning emergencies.",
    ];

    for (const outcome of outcomes) {
      expect(screen.getByText(outcome)).toBeInTheDocument();
    }
  });

  it("renders published modules and lessons in their configured display order", async () => {
    const pageJsx = await CourseSyllabusPage({
      params: Promise.resolve({ courseSlug: "water-safety-overcoming-fear" }),
    });
    render(pageJsx);

    // Module headings in Course 1
    expect(
      screen.getByRole("heading", {
        level: 3,
        name: "Module 1: The Physiology & Psychology of Water Fear",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        level: 3,
        name: "Module 2: Shallow-Water Acclimatization & Standing Recovery",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        level: 3,
        name: "Module 3: Hazard Awareness & Non-Contact Bystander Rescue",
      }),
    ).toBeInTheDocument();

    // Lessons in Module 1
    expect(
      screen.getByRole("heading", {
        level: 4,
        name: "Understanding Fear as a Natural Survival Instinct",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        level: 4,
        name: "Calm Rhythmic Breathing Versus Panic Hyperventilation",
      }),
    ).toBeInTheDocument();

    // Lesson summaries must be displayed
    expect(
      screen.getByText(
        /Reframe water apprehension as a healthy protective reflex rather than a personal weakness\./i,
      ),
    ).toBeInTheDocument();
  });

  it("clearly identifies published lessons marked as eligible for public preview", async () => {
    const pageJsx = await CourseSyllabusPage({
      params: Promise.resolve({ courseSlug: "water-safety-overcoming-fear" }),
    });
    render(pageJsx);

    // Lesson 1 is marked as isPreview: true
    const previewBadges = screen.getAllByText("Preview Lesson (Reader Launching Phase 4.4)");
    expect(previewBadges.length).toBeGreaterThan(0);

    // Other lessons are designated for full curriculum
    const fullBadges = screen.getAllByText("Full Curriculum");
    expect(fullBadges.length).toBeGreaterThan(0);
  });

  it("strictly isolates unpublished draft modules and draft lessons from public view", async () => {
    const pageJsx = await CourseSyllabusPage({
      params: Promise.resolve({ courseSlug: "water-safety-overcoming-fear" }),
    });
    render(pageJsx);

    // Module 4 of Course 1 is unpublished (published: false in COURSES_DATA)
    expect(
      screen.queryByText("Module 4: Advanced Aquatic Distress Response (In Review)"),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText("Facility Emergency Incident Reporting Protocols"),
    ).not.toBeInTheDocument();

    // Module count must accurately reflect 3 published modules, not 4
    expect(screen.getByText("3 Ordered Modules")).toBeInTheDocument();
    expect(screen.queryByText("4 Ordered Modules")).not.toBeInTheDocument();

    // Lessons count must accurately reflect 6 published lessons
    expect(screen.getByText("6 Structured Lessons")).toBeInTheDocument();
  });

  it("invokes notFound() for unknown course slugs", async () => {
    notFoundMock.mockClear();

    await expect(
      CourseSyllabusPage({
        params: Promise.resolve({ courseSlug: "completely-unknown-course" }),
      }),
    ).rejects.toThrow("NEXT_NOT_FOUND");

    expect(notFoundMock).toHaveBeenCalledTimes(1);
  });

  it("invokes notFound() for unpublished draft course slugs", async () => {
    notFoundMock.mockClear();

    // open-water-endurance-survival is published: false
    await expect(
      CourseSyllabusPage({
        params: Promise.resolve({
          courseSlug: "open-water-endurance-survival",
        }),
      }),
    ).rejects.toThrow("NEXT_NOT_FOUND");

    expect(notFoundMock).toHaveBeenCalledTimes(1);
  });

  it("generates correct page-specific SEO metadata for valid published courses", async () => {
    const meta = await generateMetadata({
      params: Promise.resolve({ courseSlug: "water-safety-overcoming-fear" }),
    });

    expect(meta.title).toBe("Water Safety & Overcoming Fear of Water — Syllabus | SwimNigeria");
    expect(meta.description).toContain("A compassionate, evidence-based guide");
  });

  it("provides not-found metadata for unknown or unpublished courses without leaking draft data", async () => {
    const unknownMeta = await generateMetadata({
      params: Promise.resolve({ courseSlug: "nonexistent-course-slug" }),
    });
    expect(unknownMeta.title).toBe("Course Not Found | SwimNigeria");

    const draftMeta = await generateMetadata({
      params: Promise.resolve({ courseSlug: "open-water-endurance-survival" }),
    });
    expect(draftMeta.title).toBe("Course Not Found | SwimNigeria");
    expect(draftMeta.description).not.toContain("Open Water Safety & Coastal Survival");
  });

  it("includes an accessible navigation link back to /courses", async () => {
    const pageJsx = await CourseSyllabusPage({
      params: Promise.resolve({ courseSlug: "buoyancy-breathing-mechanics" }),
    });
    render(pageJsx);

    const backLink = screen.getByRole("link", {
      name: /back to course catalogue/i,
    });
    expect(backLink).toBeInTheDocument();
    expect(backLink).toHaveAttribute("href", "/courses");
  });

  it("displays the exact mandatory certificate and educational safety disclaimer verbatim", async () => {
    const pageJsx = await CourseSyllabusPage({
      params: Promise.resolve({
        courseSlug: "beginner-freestyle-propulsion",
      }),
    });
    render(pageJsx);

    expect(screen.getByText("Mandatory Educational & Life-Safety Disclaimer")).toBeInTheDocument();
    expect(screen.getByText(MANDATORY_CERTIFICATE_DISCLAIMER)).toBeInTheDocument();
  });

  it("generates static params for all published courses", async () => {
    const params = await generateStaticParams();
    const published = getPublishedCourses();

    expect(params).toHaveLength(3);
    expect(params.map((p) => p.courseSlug)).toEqual(published.map((c) => c.slug));
  });

  it("renders with zero automated accessibility violations (axe-core)", async () => {
    const pageJsx = await CourseSyllabusPage({
      params: Promise.resolve({ courseSlug: "water-safety-overcoming-fear" }),
    });
    const { container } = render(pageJsx);

    const results = await axe.run(container);
    expect(results.violations).toEqual([]);
  });
});
