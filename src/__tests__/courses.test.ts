import { describe, expect, it } from "vitest";
import {
  COURSES_DATA,
  MANDATORY_CERTIFICATE_DISCLAIMER,
  getPublishedCourses,
  getCourseBySlug,
  getPreviewLessons,
  getCourseSyllabus,
  getLessonBySlug,
  isLessonPreviewEligible,
  getCoursesByCategory,
  getCourseCategories,
  getPreviewLesson,
  getAdjacentPreviewLessons,
  getSafeVideoEmbed,
} from "@/lib/courses";

describe("Course Registry & Data Model Integrity", () => {
  it("contains all three intended launch courses and one draft course", () => {
    expect(COURSES_DATA.length).toBe(4);

    const published = COURSES_DATA.filter((c) => c.published);
    expect(published).toHaveLength(3);

    const expectedLaunchSlugs = [
      "water-safety-overcoming-fear",
      "buoyancy-breathing-mechanics",
      "beginner-freestyle-propulsion",
    ];

    for (const slug of expectedLaunchSlugs) {
      const match = published.find((c) => c.slug === slug);
      expect(match).toBeDefined();
      expect(match?.published).toBe(true);
    }

    // Verify draft course exists for isolation testing
    const draftCourse = COURSES_DATA.find((c) => !c.published);
    expect(draftCourse).toBeDefined();
    expect(draftCourse?.slug).toBe("open-water-endurance-survival");
  });

  it("ensures each course strictly adheres to schema standards", () => {
    for (const course of COURSES_DATA) {
      expect(course.slug).toMatch(/^[a-z0-9-]+$/);
      expect(course.title.trim().length).toBeGreaterThan(10);
      expect(course.summary.trim().length).toBeGreaterThan(30);
      expect(course.description.trim().length).toBeGreaterThan(50);
      expect(["foundational", "beginner", "intermediate"]).toContain(course.difficulty);
      expect(course.prerequisites.length).toBeGreaterThan(0);
      expect(course.learningOutcomes.length).toBeGreaterThanOrEqual(3);
      expect(course.estimatedDurationMinutes).toBeGreaterThan(0);
      expect(course.displayOrder).toBeGreaterThan(0);
      expect(typeof course.isFree).toBe("boolean");
      expect(course.publishedAt).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    }
  });

  it("enforces curriculum depth requirements: at least 3 modules per course and at least 2 lessons per module", () => {
    const launchCourses = COURSES_DATA.filter((c) => c.published);

    for (const course of launchCourses) {
      // Must contain at least 3 modules
      expect(course.modules.length).toBeGreaterThanOrEqual(3);

      for (const moduleItem of course.modules) {
        expect(moduleItem.slug).toMatch(/^[a-z0-9-]+$/);
        expect(moduleItem.title.trim().length).toBeGreaterThan(5);
        expect(moduleItem.description.trim().length).toBeGreaterThan(10);
        expect(moduleItem.orderIndex).toBeGreaterThan(0);

        // Every published module must have at least 2 lessons
        if (moduleItem.published) {
          expect(moduleItem.lessons.length).toBeGreaterThanOrEqual(2);
        }

        for (const lesson of moduleItem.lessons) {
          expect(lesson.slug).toMatch(/^[a-z0-9-]+$/);
          expect(lesson.title.trim().length).toBeGreaterThan(5);
          expect(lesson.summary.trim().length).toBeGreaterThan(15);
          expect(lesson.durationMinutes).toBeGreaterThan(0);
          expect(lesson.orderIndex).toBeGreaterThan(0);
          expect(lesson.sections.length).toBeGreaterThan(0);

          for (const section of lesson.sections) {
            expect(section.heading.trim().length).toBeGreaterThan(3);
            expect(section.paragraphs.length).toBeGreaterThan(0);
            if (section.callout) {
              expect(["safety", "technique", "info"]).toContain(section.callout.type);
              expect(section.callout.title.trim().length).toBeGreaterThan(3);
              expect(section.callout.message.trim().length).toBeGreaterThan(10);
            }
          }
        }
      }
    }
  });

  it("contains the verbatim mandatory certificate disclaimer", () => {
    expect(MANDATORY_CERTIFICATE_DISCLAIMER).toContain(
      "Certificate of Theoretical Course Completion: This credential validates completion of digital coursework and water safety knowledge.",
    );
    expect(MANDATORY_CERTIFICATE_DISCLAIMER).toContain(
      "It does not certify physical swimming competence, water survival capability, or lifeguarding qualification without practical, in-person assessment by a certified aquatic instructor.",
    );
  });
});

describe("Public Query Helpers & Draft Isolation Guarantees", () => {
  it("getPublishedCourses returns only published courses in deterministic displayOrder", () => {
    const published = getPublishedCourses();
    expect(published).toHaveLength(3);

    // Verify ordering by displayOrder
    for (let i = 0; i < published.length - 1; i++) {
      expect(published[i].displayOrder).toBeLessThanOrEqual(published[i + 1].displayOrder);
    }

    // Verify draft courses are excluded
    const hasDraft = published.some((c) => !c.published);
    expect(hasDraft).toBe(false);
  });

  it("getPublishedCourses strips unpublished modules and unpublished lessons from returned courses", () => {
    const published = getPublishedCourses();
    const course1 = published.find((c) => c.slug === "water-safety-overcoming-fear");
    expect(course1).toBeDefined();

    // In raw COURSES_DATA, course 1 has a 4th module that is unpublished
    const rawCourse1 = COURSES_DATA.find((c) => c.slug === "water-safety-overcoming-fear");
    expect(rawCourse1?.modules.some((m) => !m.published)).toBe(true);

    // In public query results, the unpublished module MUST be omitted
    expect(course1?.modules.some((m) => !m.published)).toBe(false);

    // In course 2, raw data contains an unpublished lesson inside module 3
    const course2 = published.find((c) => c.slug === "buoyancy-breathing-mechanics");
    const mod3 = course2?.modules.find((m) => m.slug === "floating-drills-and-recovery");
    expect(mod3).toBeDefined();
    expect(mod3?.lessons.some((l) => !l.published)).toBe(false);
  });

  it("getCourseBySlug resolves published course and strips draft sub-content", () => {
    const course = getCourseBySlug("water-safety-overcoming-fear");
    expect(course).not.toBeNull();
    expect(course?.slug).toBe("water-safety-overcoming-fear");
    expect(course?.modules.every((m) => m.published)).toBe(true);
    expect(course?.modules.flatMap((m) => m.lessons).every((l) => l.published)).toBe(true);
  });

  it("getCourseBySlug returns null for empty or non-existent slugs", () => {
    expect(getCourseBySlug("")).toBeNull();
    expect(getCourseBySlug("non-existent-course-slug")).toBeNull();
    expect(getCourseBySlug("random-injection-test")).toBeNull();
  });

  it("getCourseBySlug returns null for unpublished draft courses (draft isolation)", () => {
    const draftCourse = COURSES_DATA.find((c) => !c.published);
    expect(draftCourse).toBeDefined();

    const result = getCourseBySlug(draftCourse!.slug);
    expect(result).toBeNull();
  });

  it("getPreviewLessons returns only explicitly designated published preview lessons from published parents", () => {
    const previews = getPreviewLessons();
    expect(previews.length).toBeGreaterThan(0);

    for (const item of previews) {
      // Must have preview flag true
      expect(item.lesson.isPreview).toBe(true);
      // Must be published
      expect(item.lesson.published).toBe(true);

      // Verify that parent course and module are published
      const parentCourse = COURSES_DATA.find((c) => c.slug === item.courseSlug);
      expect(parentCourse).toBeDefined();
      expect(parentCourse?.published).toBe(true);

      const parentModule = parentCourse?.modules.find((m) => m.slug === item.moduleSlug);
      expect(parentModule).toBeDefined();
      expect(parentModule?.published).toBe(true);
    }
  });

  it("excludes preview lessons that reside within unpublished modules", () => {
    // In raw COURSES_DATA, course 1 module 4 has a lesson with isPreview: true but published: false / module published: false
    const previews = getPreviewLessons();
    const leakedFromDraftModule = previews.some(
      (p) => p.moduleSlug === "advanced-distress-response-concepts",
    );
    expect(leakedFromDraftModule).toBe(false);
  });

  it("excludes preview lessons that reside within unpublished draft courses", () => {
    // In raw COURSES_DATA, course 4 (draft) has a lesson with isPreview: true
    const previews = getPreviewLessons();
    const leakedFromDraftCourse = previews.some(
      (p) => p.courseSlug === "open-water-endurance-survival",
    );
    expect(leakedFromDraftCourse).toBe(false);
  });

  it("excludes preview lessons that are marked isPreview: true but have published: false", () => {
    // In Course 2, Module 3, lesson 'deep-water-vertical-treading-preview' is unpublished but has isPreview: true
    const previews = getPreviewLessons();
    const leakedUnpublishedLesson = previews.some(
      (p) => p.lesson.slug === "deep-water-vertical-treading-preview",
    );
    expect(leakedUnpublishedLesson).toBe(false);
  });

  it("getCourseSyllabus returns sanitized syllabus structure and preserves order", () => {
    const syllabus = getCourseSyllabus("water-safety-overcoming-fear");
    expect(syllabus).not.toBeNull();
    expect(syllabus?.courseSlug).toBe("water-safety-overcoming-fear");
    expect(syllabus?.modules.length).toBeGreaterThanOrEqual(3);

    // Check orderIndex preservation
    const moduleOrders = syllabus!.modules.map((m) => m.orderIndex);
    expect(moduleOrders).toEqual([...moduleOrders].sort((a, b) => a - b));

    for (const mod of syllabus!.modules) {
      const lessonOrders = mod.lessons.map((l) => l.orderIndex);
      expect(lessonOrders).toEqual([...lessonOrders].sort((a, b) => a - b));
    }
  });

  it("getCourseSyllabus returns null for missing or draft courses", () => {
    expect(getCourseSyllabus("unknown-course")).toBeNull();
    expect(getCourseSyllabus("open-water-endurance-survival")).toBeNull();
  });

  it("getLessonBySlug resolves lesson when course, module, and lesson are all published", () => {
    const result = getLessonBySlug("water-safety-overcoming-fear", "fear-as-a-survival-instinct");
    expect(result).not.toBeNull();
    expect(result?.lesson.slug).toBe("fear-as-a-survival-instinct");
    expect(result?.module.slug).toBe("understanding-aquatic-fear");
    expect(result?.course.slug).toBe("water-safety-overcoming-fear");
  });

  it("getLessonBySlug returns null for invalid slugs or unpublished lessons", () => {
    expect(getLessonBySlug("water-safety-overcoming-fear", "unknown-lesson")).toBeNull();
    expect(getLessonBySlug("unknown-course", "fear-as-a-survival-instinct")).toBeNull();
    // Unpublished lesson in published course
    expect(
      getLessonBySlug("buoyancy-breathing-mechanics", "deep-water-vertical-treading-preview"),
    ).toBeNull();
    // Lesson in unpublished course
    expect(
      getLessonBySlug("open-water-endurance-survival", "identifying-rip-currents-from-shore"),
    ).toBeNull();
  });

  it("isLessonPreviewEligible returns true only for valid published preview lessons", () => {
    // Valid preview lesson
    expect(
      isLessonPreviewEligible("water-safety-overcoming-fear", "fear-as-a-survival-instinct"),
    ).toBe(true);

    // Published lesson but NOT preview
    expect(
      isLessonPreviewEligible(
        "water-safety-overcoming-fear",
        "calm-breathing-vs-panic-hyperventilation",
      ),
    ).toBe(false);

    // Unpublished lesson even if isPreview is true
    expect(
      isLessonPreviewEligible(
        "buoyancy-breathing-mechanics",
        "deep-water-vertical-treading-preview",
      ),
    ).toBe(false);

    // Lesson in draft course
    expect(
      isLessonPreviewEligible(
        "open-water-endurance-survival",
        "identifying-rip-currents-from-shore",
      ),
    ).toBe(false);

    // Non-existent lesson
    expect(isLessonPreviewEligible("water-safety-overcoming-fear", "random-slug")).toBe(false);
  });

  it("getCoursesByCategory filters published courses with normalized lookup", () => {
    const waterSafety = getCoursesByCategory("Water Safety & Acclimatization");
    expect(waterSafety.length).toBe(1);
    expect(waterSafety[0].slug).toBe("water-safety-overcoming-fear");

    // Case-insensitive / slugified query
    const slugQuery = getCoursesByCategory("water-safety-acclimatization");
    expect(slugQuery.length).toBe(waterSafety.length);

    // All courses when empty or 'all'
    expect(getCoursesByCategory("").length).toBe(3);
    expect(getCoursesByCategory("all").length).toBe(3);

    // Unknown category returns empty array
    expect(getCoursesByCategory("Non-existent Category")).toEqual([]);
  });

  it("getCourseCategories returns distinct categories from published courses", () => {
    const categories = getCourseCategories();
    expect(categories.length).toBe(3);
    expect(new Set(categories).size).toBe(categories.length);
    expect(categories).toContain("Water Safety & Acclimatization");
    expect(categories).toContain("Buoyancy & Body Mechanics");
    expect(categories).toContain("Stroke Technique & Propulsion");
  });

  describe("Phase 4.4 Preview Lesson Helpers & Video Safety", () => {
    it("getPreviewLesson resolves only published preview lessons within published modules and courses", () => {
      // 1. Valid published preview lesson
      const valid = getPreviewLesson("water-safety-overcoming-fear", "fear-as-a-survival-instinct");
      expect(valid).not.toBeNull();
      expect(valid?.course.slug).toBe("water-safety-overcoming-fear");
      expect(valid?.module.slug).toBe("understanding-aquatic-fear");
      expect(valid?.lesson.slug).toBe("fear-as-a-survival-instinct");
      expect(valid?.lesson.isPreview).toBe(true);

      // 2. Published lesson that is NOT preview
      expect(
        getPreviewLesson(
          "water-safety-overcoming-fear",
          "calm-breathing-vs-panic-hyperventilation",
        ),
      ).toBeNull();

      // 3. Unpublished lesson with isPreview: true
      expect(
        getPreviewLesson("buoyancy-breathing-mechanics", "deep-water-vertical-treading-preview"),
      ).toBeNull();

      // 4. Lesson in unpublished module with isPreview: true
      expect(
        getPreviewLesson("water-safety-overcoming-fear", "incident-reporting-protocols"),
      ).toBeNull();

      // 5. Lesson in unpublished draft course with isPreview: true
      expect(
        getPreviewLesson(
          "open-water-endurance-survival",
          "rip-current-recognition-and-escape-physics",
        ),
      ).toBeNull();

      // 6. Unknown slugs
      expect(getPreviewLesson("unknown-course", "fear-as-a-survival-instinct")).toBeNull();
      expect(getPreviewLesson("water-safety-overcoming-fear", "nonexistent-lesson")).toBeNull();
    });

    it("getAdjacentPreviewLessons guarantees all previous/next destinations are valid published previews", () => {
      // First preview: fear-as-a-survival-instinct
      const first = getAdjacentPreviewLessons(
        "water-safety-overcoming-fear",
        "fear-as-a-survival-instinct",
      );
      expect(first.prev).toBeNull();
      expect(first.next).not.toBeNull();
      expect(first.next?.lesson.slug).toBe("archimedes-principle-and-lung-volume");
      expect(first.next?.lesson.isPreview).toBe(true);

      // Middle preview: archimedes-principle-and-lung-volume
      const middle = getAdjacentPreviewLessons(
        "buoyancy-breathing-mechanics",
        "archimedes-principle-and-lung-volume",
      );
      expect(middle.prev?.lesson.slug).toBe("fear-as-a-survival-instinct");
      expect(middle.next?.lesson.slug).toBe("hydrodynamic-drag-and-body-line");

      // Last preview: hydrodynamic-drag-and-body-line
      const last = getAdjacentPreviewLessons(
        "beginner-freestyle-propulsion",
        "hydrodynamic-drag-and-body-line",
      );
      expect(last.prev?.lesson.slug).toBe("archimedes-principle-and-lung-volume");
      expect(last.next).toBeNull();

      // Non-preview lesson returns null for both
      const nonPreview = getAdjacentPreviewLessons(
        "water-safety-overcoming-fear",
        "calm-breathing-vs-panic-hyperventilation",
      );
      expect(nonPreview.prev).toBeNull();
      expect(nonPreview.next).toBeNull();
    });

    it("getSafeVideoEmbed safely validates YouTube and Vimeo providers and identifiers", () => {
      // Valid YouTube video
      const validYt = getSafeVideoEmbed({
        provider: "youtube",
        videoId: "dQw4w9WgXcQ",
        title: "Breath Control Demonstration",
      });
      expect(validYt).not.toBeNull();
      expect(validYt?.embedUrl).toBe("https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ");
      expect(validYt?.watchUrl).toBe("https://www.youtube.com/watch?v=dQw4w9WgXcQ");
      expect(validYt?.title).toBe("Breath Control Demonstration");

      // Valid Vimeo video
      const validVimeo = getSafeVideoEmbed({
        provider: "vimeo",
        videoId: "123456789",
        title: "Buoyancy Float Guide",
      });
      expect(validVimeo).not.toBeNull();
      expect(validVimeo?.embedUrl).toBe("https://player.vimeo.com/video/123456789?dnt=1");
      expect(validVimeo?.watchUrl).toBe("https://vimeo.com/123456789");

      // Invalid YouTube identifier format (rejects malicious injection)
      expect(
        getSafeVideoEmbed({
          provider: "youtube",
          videoId: "invalid<script>",
          title: "Bad ID",
        }),
      ).toBeNull();

      // Invalid Vimeo identifier format (non-numeric)
      expect(
        getSafeVideoEmbed({
          provider: "vimeo",
          videoId: "not-a-number",
          title: "Bad Vimeo ID",
        }),
      ).toBeNull();

      // Missing video reference
      expect(getSafeVideoEmbed(undefined)).toBeNull();

      // Unsupported provider
      expect(
        getSafeVideoEmbed({
          // @ts-expect-error testing invalid provider
          provider: "dailymotion",
          videoId: "123456",
          title: "Unsupported Provider",
        }),
      ).toBeNull();
    });
  });
});
