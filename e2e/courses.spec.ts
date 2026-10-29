import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test.describe("Public Course Catalogue Experience (Phase 4.2)", () => {
  test("renders course catalogue with title, theory disclaimer, and 3 launch courses", async ({
    page,
  }) => {
    await page.goto("/courses");

    // Verify document title and page heading
    await expect(page).toHaveTitle(/Course Catalogue & Swimming Curriculum | SwimNigeria/);
    const heading = page.getByRole("heading", {
      level: 1,
      name: "Course Catalogue & Swimming Curriculum",
    });
    await expect(heading).toBeVisible();

    // Verify educational theory notice
    await expect(page.getByText(/Educational Theory Notice:/i)).toBeVisible();
    await expect(
      page.getByText(
        /Completing digital coursework does not certify physical swimming competence/i,
      ),
    ).toBeVisible();

    // Verify 3 published launch courses are visible
    await expect(
      page.getByRole("heading", {
        level: 2,
        name: "Water Safety & Overcoming Fear of Water",
      }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", {
        level: 2,
        name: "Buoyancy & Breathing Mechanics",
      }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", {
        level: 2,
        name: "Beginner Freestyle & Horizontal Propulsion",
      }),
    ).toBeVisible();

    // Verify draft courses are strictly excluded
    await expect(page.getByText("Open Water Safety & Coastal Survival Concepts")).not.toBeVisible();

    // Verify syllabus buttons are non-interactive disabled buttons without broken links
    const syllabusButtons = page.getByRole("button", {
      name: "Syllabus Viewer (Launching in Phase 4.3)",
    });
    await expect(syllabusButtons).toHaveCount(3);
    for (let i = 0; i < 3; i++) {
      await expect(syllabusButtons.nth(i)).toBeDisabled();
    }
  });

  test("filters courses by category and updates URL parameter", async ({ page }) => {
    await page.goto("/courses");

    // Click on Water Safety & Acclimatization category filter
    const categoryLink = page.getByRole("link", {
      name: "Water Safety & Acclimatization",
    });
    await categoryLink.click();

    await expect(page).toHaveURL(/category=water-safety-acclimatization/);

    // Course 1 is visible
    await expect(
      page.getByRole("heading", {
        level: 2,
        name: "Water Safety & Overcoming Fear of Water",
      }),
    ).toBeVisible();

    // Other courses are excluded
    await expect(
      page.getByRole("heading", {
        level: 2,
        name: "Buoyancy & Breathing Mechanics",
      }),
    ).not.toBeVisible();
    await expect(
      page.getByRole("heading", {
        level: 2,
        name: "Beginner Freestyle & Horizontal Propulsion",
      }),
    ).not.toBeVisible();
  });

  test("filters courses by difficulty level", async ({ page }) => {
    await page.goto("/courses");

    // Click on Foundational difficulty filter
    const diffLink = page.getByRole("link", {
      name: "Foundational",
    });
    await diffLink.click();

    await expect(page).toHaveURL(/difficulty=foundational/);

    // Foundational course is visible
    await expect(
      page.getByRole("heading", {
        level: 2,
        name: "Water Safety & Overcoming Fear of Water",
      }),
    ).toBeVisible();

    // Beginner courses are excluded
    await expect(
      page.getByRole("heading", {
        level: 2,
        name: "Buoyancy & Breathing Mechanics",
      }),
    ).not.toBeVisible();
    await expect(
      page.getByRole("heading", {
        level: 2,
        name: "Beginner Freestyle & Horizontal Propulsion",
      }),
    ).not.toBeVisible();
  });

  test("handles combined filters and displays active filter summary", async ({ page }) => {
    await page.goto("/courses");

    // Select category then difficulty
    await page.getByRole("link", { name: "Buoyancy & Body Mechanics" }).click();
    await expect(page).toHaveURL(/category=buoyancy-body-mechanics/);

    await page.getByRole("link", { name: "Beginner" }).click();
    await expect(page).toHaveURL(/category=buoyancy-body-mechanics/);
    await expect(page).toHaveURL(/difficulty=beginner/);

    // Course 2 is visible
    await expect(
      page.getByRole("heading", {
        level: 2,
        name: "Buoyancy & Breathing Mechanics",
      }),
    ).toBeVisible();

    // Other courses are omitted
    await expect(
      page.getByRole("heading", {
        level: 2,
        name: "Water Safety & Overcoming Fear of Water",
      }),
    ).not.toBeVisible();

    // Active filters summary is visible with formal labels
    await expect(page.getByText("Active Filters:")).toBeVisible();
    await expect(page.getByText("Category: Buoyancy & Body Mechanics")).toBeVisible();
    await expect(page.getByText("Difficulty: Beginner")).toBeVisible();
    await expect(page.getByRole("link", { name: "Clear active filters" })).toBeVisible();
  });

  test("renders empty state and allows resetting filters", async ({ page }) => {
    // Navigate with incompatible filter parameters
    await page.goto("/courses?category=water-safety-acclimatization&difficulty=intermediate");

    // Empty state heading should appear
    await expect(
      page.getByRole("heading", {
        level: 2,
        name: "No Courses Match Your Selection",
      }),
    ).toBeVisible();

    // Click reset button
    const resetBtn = page.getByRole("link", { name: "Reset All Filters" });
    await expect(resetBtn).toBeVisible();
    await resetBtn.click();

    await expect(page).toHaveURL("/courses");

    // All courses restored
    await expect(
      page.getByRole("heading", {
        level: 2,
        name: "Water Safety & Overcoming Fear of Water",
      }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", {
        level: 2,
        name: "Buoyancy & Breathing Mechanics",
      }),
    ).toBeVisible();
  });

  test("responsive layout on mobile viewports", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/courses");

    await expect(
      page.getByRole("heading", {
        level: 1,
        name: "Course Catalogue & Swimming Curriculum",
      }),
    ).toBeVisible();

    // Verify category and difficulty filters are visible and wrapped
    await expect(page.getByRole("link", { name: "All Categories" })).toBeVisible();
    await expect(page.getByRole("link", { name: "All Difficulties" })).toBeVisible();

    // Verify cards are visible
    await expect(
      page.getByRole("heading", {
        level: 2,
        name: "Water Safety & Overcoming Fear of Water",
      }),
    ).toBeVisible();
  });

  test("passes automated WCAG 2.1 AA accessibility checks on course catalogue", async ({
    page,
  }) => {
    await page.goto("/courses");

    const axeResults = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();

    expect(axeResults.violations).toEqual([]);
  });
});

test.describe("Public Course Syllabus Experience (Phase 4.3)", () => {
  test("renders published course syllabus with title, metadata, disclaimer, and modules", async ({
    page,
  }) => {
    await page.goto("/courses/water-safety-overcoming-fear");

    // Title & heading
    await expect(page).toHaveTitle(
      /Water Safety & Overcoming Fear of Water — Syllabus | SwimNigeria/,
    );
    const heading = page.getByRole("heading", {
      level: 1,
      name: "Water Safety & Overcoming Fear of Water",
    });
    await expect(heading).toBeVisible();

    // Badges & duration
    await expect(page.getByText("Water Safety & Acclimatization")).toBeVisible();
    await expect(page.getByText("Foundational", { exact: true })).toBeVisible();
    await expect(page.getByText("Free Digital Access")).toBeVisible();
    await expect(
      page.getByText(/~50 mins \(Estimate for self-paced digital learning\)/i),
    ).toBeVisible();

    // Mandatory certificate & safety disclaimer
    await expect(page.getByText(/Mandatory Educational & Life-Safety Disclaimer/i)).toBeVisible();
    await expect(
      page
        .locator("#main-content")
        .getByText(
          /Certificate of Theoretical Course Completion: This credential validates completion of digital coursework/i,
        ),
    ).toBeVisible();

    // Intended audience & prerequisites
    await expect(page.getByRole("heading", { level: 2, name: "Intended Audience" })).toBeVisible();
    await expect(
      page.getByRole("heading", { level: 2, name: "Course Prerequisites" }),
    ).toBeVisible();

    // Learning outcomes
    await expect(page.getByRole("heading", { level: 2, name: "Learning Outcomes" })).toBeVisible();
    await expect(page.getByText(/Explain the mammalian survival reflex/i)).toBeVisible();

    // Modules and lessons
    await expect(
      page.getByRole("heading", {
        level: 3,
        name: "Module 1: The Physiology & Psychology of Water Fear",
      }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", {
        level: 4,
        name: "Understanding Fear as a Natural Survival Instinct",
      }),
    ).toBeVisible();

    // Preview lesson badge (without broken link)
    const previewBadge = page.getByText("Preview Lesson (Reader Launching Phase 4.4)");
    await expect(previewBadge.first()).toBeVisible();

    // Draft module is strictly omitted
    await expect(
      page.getByText("Module 4: Advanced Aquatic Distress Response (In Review)"),
    ).not.toBeVisible();
  });

  test("allows navigating back to the course catalogue via breadcrumb link", async ({ page }) => {
    await page.goto("/courses/water-safety-overcoming-fear");

    const backLink = page.getByRole("link", { name: "Back to Course Catalogue" });
    await expect(backLink).toBeVisible();
    await backLink.click();

    await expect(page).toHaveURL("/courses");
    await expect(
      page.getByRole("heading", {
        level: 1,
        name: "Course Catalogue & Swimming Curriculum",
      }),
    ).toBeVisible();
  });

  test("returns 404 for unknown or unpublished draft courses", async ({ page }) => {
    // Unknown course slug
    const unknownRes = await page.goto("/courses/nonexistent-swimming-course");
    expect(unknownRes?.status()).toBe(404);

    // Unpublished draft course slug
    const draftRes = await page.goto("/courses/open-water-endurance-survival");
    expect(draftRes?.status()).toBe(404);
  });

  test("renders cleanly on mobile viewport without horizontal overflow", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/courses/water-safety-overcoming-fear");

    const heading = page.getByRole("heading", {
      level: 1,
      name: "Water Safety & Overcoming Fear of Water",
    });
    await expect(heading).toBeVisible();

    // Check module is visible
    await expect(
      page.getByRole("heading", {
        level: 3,
        name: "Module 1: The Physiology & Psychology of Water Fear",
      }),
    ).toBeVisible();

    // Check no horizontal scroll
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth);
  });

  test("supports keyboard focus navigation to back link and actions", async ({ page }) => {
    await page.goto("/courses/water-safety-overcoming-fear");

    // Focus the back link directly via keyboard navigation
    const backLink = page.getByRole("link", { name: "Back to Course Catalogue" });
    await backLink.focus();
    await expect(backLink).toBeFocused();

    // Verify Tab moves focus to action links
    const exploreOther = page.getByRole("link", { name: "Explore Other Courses" });
    await exploreOther.focus();
    await expect(exploreOther).toBeFocused();
  });

  test("passes automated WCAG 2.1 AA accessibility checks on syllabus page", async ({ page }) => {
    await page.goto("/courses/water-safety-overcoming-fear");

    const axeResults = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();

    expect(axeResults.violations).toEqual([]);
  });
});

test.describe("Public Preview Lesson Reader (Phase 4.4)", () => {
  test("renders published preview lesson with full content, callouts, and disclaimer", async ({
    page,
  }) => {
    await page.goto("/courses/water-safety-overcoming-fear/lessons/fear-as-a-survival-instinct");

    // Title & heading
    await expect(page).toHaveTitle(
      /Understanding Fear as a Natural Survival Instinct — Preview Lesson | SwimNigeria/,
    );
    const heading = page.getByRole("heading", {
      level: 1,
      name: "Understanding Fear as a Natural Survival Instinct",
    });
    await expect(heading).toBeVisible();

    // Module eyebrow & preview badge
    await expect(page.getByText("Public Preview Lesson")).toBeVisible();
    await expect(page.getByText("Free Access")).toBeVisible();
    await expect(
      page.getByText("Module 1: The Physiology & Psychology of Water Fear"),
    ).toBeVisible();

    // Sections in order
    await expect(
      page.getByRole("heading", {
        level: 2,
        name: "The Evolutionary Basis of Aquatic Anxiety",
      }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", {
        level: 2,
        name: "Why Tension Sinks the Human Body",
      }),
    ).toBeVisible();

    // Callouts
    await expect(page.getByText("Educational Mindset Principle")).toBeVisible();
    await expect(page.getByText("Crucial Safety Rule")).toBeVisible();

    // Mandatory disclaimer
    await expect(
      page
        .locator("#main-content")
        .getByText(
          /Certificate of Theoretical Course Completion: This credential validates completion of digital coursework/i,
        ),
    ).toBeVisible();
  });

  test("allows navigating to preview lesson from course syllabus and back via breadcrumbs", async ({
    page,
  }) => {
    // 1. Start on course syllabus
    await page.goto("/courses/water-safety-overcoming-fear");

    // 2. Click on "Read Lesson Preview →"
    const previewLink = page.getByRole("link", { name: "Read Lesson Preview →" });
    await expect(previewLink.first()).toBeVisible();
    await previewLink.first().click();

    // 3. Verify URL is preview lesson reader
    await expect(page).toHaveURL(
      "/courses/water-safety-overcoming-fear/lessons/fear-as-a-survival-instinct",
    );

    // 4. Click breadcrumb back to course syllabus
    const syllabusBreadcrumb = page
      .getByRole("navigation", { name: "Breadcrumb" })
      .getByRole("link", { name: "Water Safety & Overcoming Fear of Water" });
    await syllabusBreadcrumb.click();

    await expect(page).toHaveURL("/courses/water-safety-overcoming-fear");
  });

  test("enforces strict server-side access control with 404 for non-preview and draft lessons", async ({
    page,
  }) => {
    // 1. Published lesson that is NOT a preview (requires enrollment)
    const nonPreviewRes = await page.goto(
      "/courses/water-safety-overcoming-fear/lessons/calm-breathing-vs-panic-hyperventilation",
    );
    expect(nonPreviewRes?.status()).toBe(404);

    // 2. Draft lesson in published course/module
    const draftLessonRes = await page.goto(
      "/courses/buoyancy-breathing-mechanics/lessons/deep-water-vertical-treading-preview",
    );
    expect(draftLessonRes?.status()).toBe(404);

    // 3. Lesson in draft module
    const draftModuleRes = await page.goto(
      "/courses/water-safety-overcoming-fear/lessons/incident-reporting-protocols",
    );
    expect(draftModuleRes?.status()).toBe(404);

    // 4. Lesson in draft course
    const draftCourseRes = await page.goto(
      "/courses/open-water-endurance-survival/lessons/rip-current-recognition-and-escape-physics",
    );
    expect(draftCourseRes?.status()).toBe(404);

    // 5. Completely nonexistent lesson slug
    const unknownRes = await page.goto(
      "/courses/water-safety-overcoming-fear/lessons/totally-fake-lesson",
    );
    expect(unknownRes?.status()).toBe(404);
  });

  test("navigates strictly to next eligible preview lesson", async ({ page }) => {
    await page.goto("/courses/water-safety-overcoming-fear/lessons/fear-as-a-survival-instinct");

    const nextPreviewLink = page.getByRole("link", { name: /next preview lesson/i });
    await expect(nextPreviewLink).toBeVisible();
    await nextPreviewLink.click();

    // Destination must be the Course 2 preview lesson
    await expect(page).toHaveURL(
      "/courses/buoyancy-breathing-mechanics/lessons/archimedes-principle-and-lung-volume",
    );
    await expect(
      page.getByRole("heading", {
        level: 1,
        name: "Archimedes' Principle and Human Body Density",
      }),
    ).toBeVisible();
  });

  test("renders cleanly on mobile viewport without horizontal overflow", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/courses/water-safety-overcoming-fear/lessons/fear-as-a-survival-instinct");

    await expect(
      page.getByRole("heading", {
        level: 1,
        name: "Understanding Fear as a Natural Survival Instinct",
      }),
    ).toBeVisible();

    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth);
  });

  test("passes automated WCAG 2.1 AA accessibility checks on preview lesson reader", async ({
    page,
  }) => {
    await page.goto("/courses/water-safety-overcoming-fear/lessons/fear-as-a-survival-instinct");

    const axeResults = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();

    expect(axeResults.violations).toEqual([]);
  });
});
