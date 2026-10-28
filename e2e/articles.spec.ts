import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test.describe("Public Educational Articles Experience (Phase 3B)", () => {
  test("renders articles directory with category navigation and article cards", async ({
    page,
  }) => {
    await page.goto("/articles");

    // Verify document title and page heading
    await expect(page).toHaveTitle(/Educational Articles & Water Safety Guides/);
    const heading = page.getByRole("heading", {
      level: 1,
      name: "Educational Articles & Water Safety Guides",
    });
    await expect(heading).toBeVisible();

    // Verify category filter links
    const categoryNav = page.getByRole("navigation", { name: "Article Categories" });
    await expect(categoryNav).toBeVisible();
    await expect(categoryNav.getByRole("link", { name: "All Guides" })).toBeVisible();
    await expect(categoryNav.getByRole("link", { name: "Water Safety" })).toBeVisible();

    // Verify published article cards
    await expect(
      page.getByText("Overcoming Water Apprehension: An Adult Beginner's Guide"),
    ).toBeVisible();
    await expect(
      page.getByText("Essential Water Safety Principles for Nigerian Families"),
    ).toBeVisible();
    await expect(
      page.getByText("The Mechanics of Buoyancy: Why the Human Body Floats"),
    ).toBeVisible();

    // Filter by Water Safety
    await categoryNav.getByRole("link", { name: "Water Safety" }).click();
    await expect(page).toHaveURL(/category=water-safety/);
    await expect(
      page.getByText("Essential Water Safety Principles for Nigerian Families"),
    ).toBeVisible();
  });

  test("allows clicking an article card to navigate to full reader view and back", async ({
    page,
  }) => {
    await page.goto("/articles");

    // Click on first guide
    const articleLink = page.getByRole("link", {
      name: "Overcoming Water Apprehension: An Adult Beginner's Guide",
    });
    await articleLink.click();

    // Verify URL and article title
    await expect(page).toHaveURL("/articles/overcoming-fear-of-water-adult-beginners");
    await expect(page).toHaveTitle(/Overcoming Water Apprehension.*SwimNigeria/);

    const articleH1 = page.getByRole("heading", {
      level: 1,
      name: "Overcoming Water Apprehension: An Adult Beginner's Guide",
    });
    await expect(articleH1).toBeVisible();

    // Verify article sections and callouts
    await expect(
      page.getByText("1. Understanding That Water Fear is a Normal Survival Instinct"),
    ).toBeVisible();
    await expect(page.getByText("Calm Mindset Principle")).toBeVisible();
    await expect(page.getByText("Educational Scope & Safety Disclaimer:")).toBeVisible();

    // Verify back navigation
    const backLink = page.getByRole("link", { name: /back to all guides/i });
    await backLink.click();
    await expect(page).toHaveURL("/articles");
  });

  test("returns 404 Not Found for unpublished draft articles", async ({ page }) => {
    const response = await page.goto("/articles/advanced-freestyle-bilateral-breathing");
    // Verify 404 response
    expect(response?.status()).toBe(404);
  });

  test("passes automated WCAG 2.1 AA accessibility checks on directory and reader view", async ({
    page,
  }) => {
    // 1. Check directory
    await page.goto("/articles");
    const directoryAxeResults = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();
    expect(directoryAxeResults.violations).toEqual([]);

    // 2. Check individual article view
    await page.goto("/articles/overcoming-fear-of-water-adult-beginners");
    const readerAxeResults = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();
    expect(readerAxeResults.violations).toEqual([]);
  });
});
