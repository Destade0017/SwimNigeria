import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test.describe("SwimNigeria Public Entry Smoke & Accessibility", () => {
  test("loads the entry page with project identity, hero heading, and primary CTA", async ({
    page,
  }) => {
    await page.goto("/");

    // Verify document title and semantic heading (H1)
    await expect(page).toHaveTitle(/SwimNigeria/);
    const heading = page.getByRole("heading", {
      level: 1,
      name: /SwimNigeria — Structured Swimming Education/i,
    });
    await expect(heading).toBeVisible();

    // Verify primary call to action
    const primaryCta = page.getByRole("link", { name: "Explore Learning Pathway" });
    await expect(primaryCta).toBeVisible();
    await expect(primaryCta).toHaveAttribute("href", "#courses");
  });

  test("passes automated WCAG 2.1 AA accessibility checks", async ({ page }) => {
    await page.goto("/");
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });
});
