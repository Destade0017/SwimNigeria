import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test.describe("Learner Login Page (/login)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/login");
  });

  test("loads login page with SEO metadata and semantic heading structure", async ({ page }) => {
    // Document title
    await expect(page).toHaveTitle(/Learner Sign In \| SwimNigeria/);

    // Meta description
    const metaDesc = page.locator('meta[name="description"]');
    await expect(metaDesc).toHaveAttribute(
      "content",
      /Sign in to your SwimNigeria learner account/,
    );

    // Primary H1 heading
    const h1 = page.getByRole("heading", {
      level: 1,
      name: /welcome back to swimnigeria/i,
    });
    await expect(h1).toBeVisible();

    // Secondary card heading
    const h2 = page.getByRole("heading", {
      level: 2,
      name: /sign in to swimnigeria/i,
    });
    await expect(h2).toBeVisible();
  });

  test("renders all login fields with accessible labels and autocomplete attributes", async ({
    page,
  }) => {
    // Email
    const emailInput = page.getByLabel(/email address/i);
    await expect(emailInput).toBeVisible();
    await expect(emailInput).toHaveAttribute("autocomplete", "email");
    await expect(emailInput).toHaveAttribute("type", "email");
    await expect(emailInput).toHaveAttribute("required", "");

    // Password
    const passwordInput = page.locator("#login-password");
    await expect(passwordInput).toBeVisible();
    await expect(passwordInput).toHaveAttribute("autocomplete", "current-password");
    await expect(passwordInput).toHaveAttribute("type", "password");
    await expect(passwordInput).toHaveAttribute("required", "");

    // Submit button
    const submitBtn = page.getByRole("button", { name: /^sign in$/i });
    await expect(submitBtn).toBeVisible();
    await expect(submitBtn).toBeEnabled();

    // Link to Register
    const registerLink = page.getByRole("link", { name: /register as a learner/i });
    await expect(registerLink).toBeVisible();
    await expect(registerLink).toHaveAttribute("href", "/register");
  });

  test("toggles password visibility interactively and updates aria-pressed", async ({ page }) => {
    const passwordInput = page.locator("#login-password");
    const toggleBtn = page.getByRole("button", { name: /^show password$/i });

    await expect(passwordInput).toHaveAttribute("type", "password");
    await expect(toggleBtn).toHaveAttribute("aria-pressed", "false");

    // Click to show password
    await toggleBtn.click();
    await expect(passwordInput).toHaveAttribute("type", "text");

    const hideBtn = page.getByRole("button", { name: /^hide password$/i });
    await expect(hideBtn).toHaveAttribute("aria-pressed", "true");

    // Click to hide password
    await hideBtn.click();
    await expect(passwordInput).toHaveAttribute("type", "password");
  });

  test("passes automated WCAG 2.1 AA accessibility checks on desktop", async ({ page }) => {
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test("renders cleanly on mobile viewport without horizontal overflow", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });

    const h1 = page.getByRole("heading", {
      level: 1,
      name: /welcome back to swimnigeria/i,
    });
    await expect(h1).toBeVisible();

    const emailInput = page.getByLabel(/email address/i);
    await expect(emailInput).toBeVisible();

    // Verify touch target size meets minimum 44px
    const box = await emailInput.boundingBox();
    expect(box?.height).toBeGreaterThanOrEqual(44);

    // Check no horizontal scrollbar / overflow
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth);
  });
});
