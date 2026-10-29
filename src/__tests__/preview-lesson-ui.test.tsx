import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import axe from "axe-core";
import PreviewLessonPage, {
  generateMetadata,
  generateStaticParams,
} from "@/app/courses/[courseSlug]/lessons/[lessonSlug]/page";
import { getPreviewLessons, MANDATORY_CERTIFICATE_DISCLAIMER } from "@/lib/courses";

// Mock next/navigation notFound
const notFoundMock = vi.fn();
vi.mock("next/navigation", () => ({
  notFound: () => {
    notFoundMock();
    throw new Error("NEXT_NOT_FOUND");
  },
}));

describe("Public Preview Lesson Reader UI & Routing (Phase 4.4)", () => {
  it("renders all published preview lessons with full content, metadata, and breadcrumbs", async () => {
    const previewLessons = getPreviewLessons();
    expect(previewLessons).toHaveLength(3);

    for (const item of previewLessons) {
      const pageJsx = await PreviewLessonPage({
        params: Promise.resolve({
          courseSlug: item.courseSlug,
          lessonSlug: item.lesson.slug,
        }),
      });
      const { unmount } = render(pageJsx);

      // Verify H1 matches lesson title
      expect(
        screen.getByRole("heading", { level: 1, name: item.lesson.title }),
      ).toBeInTheDocument();

      // Verify module title and preview badge
      expect(screen.getByText(item.moduleTitle)).toBeInTheDocument();
      expect(screen.getByText("Public Preview Lesson")).toBeInTheDocument();

      // Verify summary
      expect(screen.getByText(item.lesson.summary)).toBeInTheDocument();

      // Verify breadcrumb navigation links
      const catalogueLink = screen.getByRole("link", { name: "Course Catalogue" });
      expect(catalogueLink).toHaveAttribute("href", "/courses");

      const courseBreadcrumb = screen.getByRole("link", { name: item.courseTitle });
      expect(courseBreadcrumb).toHaveAttribute("href", `/courses/${item.courseSlug}`);

      unmount();
    }
  });

  it("renders lesson sections in the configured sequential order", async () => {
    const pageJsx = await PreviewLessonPage({
      params: Promise.resolve({
        courseSlug: "water-safety-overcoming-fear",
        lessonSlug: "fear-as-a-survival-instinct",
      }),
    });
    render(pageJsx);

    // Section headings for lesson 1
    expect(
      screen.getByRole("heading", {
        level: 2,
        name: "The Evolutionary Basis of Aquatic Anxiety",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        level: 2,
        name: "Why Tension Sinks the Human Body",
      }),
    ).toBeInTheDocument();

    // Verify section paragraphs are displayed
    expect(
      screen.getByText(/Water fear is not a personal failure, a character defect/i),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/The human body's average density with air in the lungs is slightly lower/i),
    ).toBeInTheDocument();
  });

  it("renders safety, technique, and informational callouts with accessible roles and labels", async () => {
    const pageJsx = await PreviewLessonPage({
      params: Promise.resolve({
        courseSlug: "water-safety-overcoming-fear",
        lessonSlug: "fear-as-a-survival-instinct",
      }),
    });
    render(pageJsx);

    // Info callout
    expect(screen.getByText("Educational Mindset Principle")).toBeInTheDocument();
    expect(
      screen.getByText(
        /You cannot force relaxation through willpower\. Relaxation in water begins with intellectual understanding/i,
      ),
    ).toBeInTheDocument();

    // Safety callout
    expect(screen.getByText("Crucial Safety Rule")).toBeInTheDocument();
    expect(
      screen.getByText(
        /Never attempt to overcome water apprehension by forcing yourself into deep water/i,
      ),
    ).toBeInTheDocument();
  });

  it("renders lessons without video references cleanly without errors or empty players", async () => {
    const pageJsx = await PreviewLessonPage({
      params: Promise.resolve({
        courseSlug: "water-safety-overcoming-fear",
        lessonSlug: "fear-as-a-survival-instinct",
      }),
    });
    render(pageJsx);

    // Should not render video demonstration section when no video is present
    expect(
      screen.queryByRole("heading", { name: "Instructional Video Demonstration" }),
    ).not.toBeInTheDocument();
    expect(screen.queryByTitle(/Video Demonstration/i)).not.toBeInTheDocument();
  });

  it("displays the exact mandatory certificate disclaimer verbatim", async () => {
    const pageJsx = await PreviewLessonPage({
      params: Promise.resolve({
        courseSlug: "buoyancy-breathing-mechanics",
        lessonSlug: "archimedes-principle-and-lung-volume",
      }),
    });
    render(pageJsx);

    expect(screen.getByText("Mandatory Educational & Life-Safety Disclaimer")).toBeInTheDocument();
    expect(screen.getByText(MANDATORY_CERTIFICATE_DISCLAIMER)).toBeInTheDocument();
  });

  it("navigates back to the course syllabus via header and footer links", async () => {
    const pageJsx = await PreviewLessonPage({
      params: Promise.resolve({
        courseSlug: "beginner-freestyle-propulsion",
        lessonSlug: "hydrodynamic-drag-and-body-line",
      }),
    });
    render(pageJsx);

    const syllabusLinks = screen.getAllByRole("link", {
      name: /view full course syllabus|return to course syllabus/i,
    });
    expect(syllabusLinks.length).toBeGreaterThanOrEqual(1);

    for (const link of syllabusLinks) {
      expect(link).toHaveAttribute("href", "/courses/beginner-freestyle-propulsion");
    }
  });

  it("targets only eligible preview lessons in previous/next preview navigation", async () => {
    // 1. First preview lesson: previous is null, next points to Course 2 preview
    const firstJsx = await PreviewLessonPage({
      params: Promise.resolve({
        courseSlug: "water-safety-overcoming-fear",
        lessonSlug: "fear-as-a-survival-instinct",
      }),
    });
    const { unmount: unmountFirst } = render(firstJsx);

    expect(
      screen.queryByRole("link", { name: /previous preview lesson/i }),
    ).not.toBeInTheDocument();

    const nextLink = screen.getByRole("link", { name: /next preview lesson/i });
    expect(nextLink).toBeInTheDocument();
    expect(nextLink).toHaveAttribute(
      "href",
      "/courses/buoyancy-breathing-mechanics/lessons/archimedes-principle-and-lung-volume",
    );
    unmountFirst();

    // 2. Middle preview lesson: both previous and next exist
    const middleJsx = await PreviewLessonPage({
      params: Promise.resolve({
        courseSlug: "buoyancy-breathing-mechanics",
        lessonSlug: "archimedes-principle-and-lung-volume",
      }),
    });
    const { unmount: unmountMiddle } = render(middleJsx);

    const prevMiddle = screen.getByRole("link", { name: /previous preview lesson/i });
    expect(prevMiddle).toHaveAttribute(
      "href",
      "/courses/water-safety-overcoming-fear/lessons/fear-as-a-survival-instinct",
    );

    const nextMiddle = screen.getByRole("link", { name: /next preview lesson/i });
    expect(nextMiddle).toHaveAttribute(
      "href",
      "/courses/beginner-freestyle-propulsion/lessons/hydrodynamic-drag-and-body-line",
    );
    unmountMiddle();

    // 3. Last preview lesson: next is null
    const lastJsx = await PreviewLessonPage({
      params: Promise.resolve({
        courseSlug: "beginner-freestyle-propulsion",
        lessonSlug: "hydrodynamic-drag-and-body-line",
      }),
    });
    render(lastJsx);

    expect(screen.queryByRole("link", { name: /next preview lesson/i })).not.toBeInTheDocument();
    const prevLast = screen.getByRole("link", { name: /previous preview lesson/i });
    expect(prevLast).toHaveAttribute(
      "href",
      "/courses/buoyancy-breathing-mechanics/lessons/archimedes-principle-and-lung-volume",
    );
  });

  describe("Server-Side Access Control & Draft Isolation", () => {
    it("invokes notFound() for published lessons that are NOT designated for preview", async () => {
      notFoundMock.mockClear();

      // calm-breathing-vs-panic-hyperventilation is published: true, isPreview: false
      await expect(
        PreviewLessonPage({
          params: Promise.resolve({
            courseSlug: "water-safety-overcoming-fear",
            lessonSlug: "calm-breathing-vs-panic-hyperventilation",
          }),
        }),
      ).rejects.toThrow("NEXT_NOT_FOUND");

      expect(notFoundMock).toHaveBeenCalledTimes(1);
    });

    it("invokes notFound() for unpublished draft lessons even if isPreview is true", async () => {
      notFoundMock.mockClear();

      // deep-water-vertical-treading-preview is published: false
      await expect(
        PreviewLessonPage({
          params: Promise.resolve({
            courseSlug: "buoyancy-breathing-mechanics",
            lessonSlug: "deep-water-vertical-treading-preview",
          }),
        }),
      ).rejects.toThrow("NEXT_NOT_FOUND");

      expect(notFoundMock).toHaveBeenCalledTimes(1);
    });

    it("invokes notFound() for preview lessons residing in unpublished draft modules", async () => {
      notFoundMock.mockClear();

      // incident-reporting-protocols is in Module 4 (published: false)
      await expect(
        PreviewLessonPage({
          params: Promise.resolve({
            courseSlug: "water-safety-overcoming-fear",
            lessonSlug: "incident-reporting-protocols",
          }),
        }),
      ).rejects.toThrow("NEXT_NOT_FOUND");

      expect(notFoundMock).toHaveBeenCalledTimes(1);
    });

    it("invokes notFound() for preview lessons residing in unpublished draft courses", async () => {
      notFoundMock.mockClear();

      // open-water-endurance-survival is a draft course (published: false)
      await expect(
        PreviewLessonPage({
          params: Promise.resolve({
            courseSlug: "open-water-endurance-survival",
            lessonSlug: "rip-current-recognition-and-escape-physics",
          }),
        }),
      ).rejects.toThrow("NEXT_NOT_FOUND");

      expect(notFoundMock).toHaveBeenCalledTimes(1);
    });

    it("invokes notFound() for nonexistent course or lesson slugs", async () => {
      notFoundMock.mockClear();

      await expect(
        PreviewLessonPage({
          params: Promise.resolve({
            courseSlug: "nonexistent-course",
            lessonSlug: "fear-as-a-survival-instinct",
          }),
        }),
      ).rejects.toThrow("NEXT_NOT_FOUND");

      await expect(
        PreviewLessonPage({
          params: Promise.resolve({
            courseSlug: "water-safety-overcoming-fear",
            lessonSlug: "nonexistent-lesson",
          }),
        }),
      ).rejects.toThrow("NEXT_NOT_FOUND");

      expect(notFoundMock).toHaveBeenCalledTimes(2);
    });
  });

  describe("Metadata & Static Generation Boundaries", () => {
    it("generates correct SEO metadata for valid published preview lessons", async () => {
      const meta = await generateMetadata({
        params: Promise.resolve({
          courseSlug: "water-safety-overcoming-fear",
          lessonSlug: "fear-as-a-survival-instinct",
        }),
      });

      expect(meta.title).toBe(
        "Understanding Fear as a Natural Survival Instinct — Preview Lesson | SwimNigeria",
      );
      expect(meta.description).toContain(
        "Reframe water apprehension as a healthy protective reflex",
      );
    });

    it("does not leak restricted, draft, or non-preview lesson data through metadata", async () => {
      // Non-preview published lesson
      const nonPreviewMeta = await generateMetadata({
        params: Promise.resolve({
          courseSlug: "water-safety-overcoming-fear",
          lessonSlug: "calm-breathing-vs-panic-hyperventilation",
        }),
      });
      expect(nonPreviewMeta.title).toBe("Lesson Not Found | SwimNigeria");
      expect(nonPreviewMeta.description).not.toContain("Calm Rhythmic Breathing");

      // Draft lesson
      const draftLessonMeta = await generateMetadata({
        params: Promise.resolve({
          courseSlug: "buoyancy-breathing-mechanics",
          lessonSlug: "deep-water-vertical-treading-preview",
        }),
      });
      expect(draftLessonMeta.title).toBe("Lesson Not Found | SwimNigeria");

      // Draft course
      const draftCourseMeta = await generateMetadata({
        params: Promise.resolve({
          courseSlug: "open-water-endurance-survival",
          lessonSlug: "rip-current-recognition-and-escape-physics",
        }),
      });
      expect(draftCourseMeta.title).toBe("Lesson Not Found | SwimNigeria");
    });

    it("generates static params strictly for published preview lessons", async () => {
      const params = await generateStaticParams();
      expect(params).toHaveLength(3);

      expect(params).toEqual([
        {
          courseSlug: "water-safety-overcoming-fear",
          lessonSlug: "fear-as-a-survival-instinct",
        },
        {
          courseSlug: "buoyancy-breathing-mechanics",
          lessonSlug: "archimedes-principle-and-lung-volume",
        },
        {
          courseSlug: "beginner-freestyle-propulsion",
          lessonSlug: "hydrodynamic-drag-and-body-line",
        },
      ]);
    });
  });

  it("renders with zero automated accessibility violations (axe-core)", async () => {
    const pageJsx = await PreviewLessonPage({
      params: Promise.resolve({
        courseSlug: "water-safety-overcoming-fear",
        lessonSlug: "fear-as-a-survival-instinct",
      }),
    });
    const { container } = render(pageJsx);

    const results = await axe.run(container);
    expect(results.violations).toEqual([]);
  });
});
