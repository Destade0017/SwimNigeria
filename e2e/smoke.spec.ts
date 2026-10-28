import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test.describe("SwimNigeria Scaffold Smoke & Accessibility", () => {
  test("loads the entry page with project identity and operational status", async ({ page }) => {
    await page.goto("/");

    // Verify document title and semantic heading
    await expect(page).toHaveTitle(/SwimNigeria/);
    const heading = page.getByRole("heading", { level: 1, name: "SwimNigeria" });
    await expect(heading).toBeVisible();

    // Verify operational indicator
    await expect(page.getByText("System Operational")).toBeVisible();
  });

  test("passes automated WCAG 2.1 AA accessibility checks", async ({ page }) => {
    await page.goto("/");
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });
});
