import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test.describe("Learner Registration Page (/register)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/register");
  });

  test("loads registration page with SEO metadata and semantic heading structure", async ({
    page,
  }) => {
    // Document title
    await expect(page).toHaveTitle(/Learner Registration & Account Creation \| SwimNigeria/);

    // Meta description
    const metaDesc = page.locator('meta[name="description"]');
    await expect(metaDesc).toHaveAttribute("content", /Create a SwimNigeria learner account/);

    // Primary H1 heading
    const h1 = page.getByRole("heading", {
      level: 1,
      name: /start your swimming education/i,
    });
    await expect(h1).toBeVisible();

    // Secondary card heading
    const h2 = page.getByRole("heading", {
      level: 2,
      name: /create learner account/i,
    });
    await expect(h2).toBeVisible();

    // Certificate advisory callout
    await expect(page.getByText(/certificate accuracy notice/i)).toBeVisible();
    await expect(
      page.getByText(/course completion certificates will be minted permanently/i),
    ).toBeVisible();
  });

  test("renders all registration fields with accessible labels and autocomplete attributes", async ({
    page,
  }) => {
    // Full Name
    const nameInput = page.getByLabel(/legal full name/i);
    await expect(nameInput).toBeVisible();
    await expect(nameInput).toHaveAttribute("autocomplete", "name");
    await expect(nameInput).toHaveAttribute("required", "");

    // Email
    const emailInput = page.getByLabel(/email address/i);
    await expect(emailInput).toBeVisible();
    await expect(emailInput).toHaveAttribute("autocomplete", "email");
    await expect(emailInput).toHaveAttribute("type", "email");

    // Password
    const passwordInput = page.locator("#register-password");
    await expect(passwordInput).toBeVisible();
    await expect(passwordInput).toHaveAttribute("autocomplete", "new-password");
    await expect(passwordInput).toHaveAttribute("type", "password");

    // Confirm Password
    const confirmInput = page.locator("#register-confirmPassword");
    await expect(confirmInput).toBeVisible();
    await expect(confirmInput).toHaveAttribute("autocomplete", "new-password");
    await expect(confirmInput).toHaveAttribute("type", "password");

    // Submit button
    const submitBtn = page.getByRole("button", { name: /create learner account/i });
    await expect(submitBtn).toBeVisible();
    await expect(submitBtn).toBeEnabled();
  });

  test("toggles password visibility interactively and updates aria-pressed", async ({ page }) => {
    const passwordInput = page.locator("#register-password");
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

  test("does not display a dead or broken link to /login", async ({ page }) => {
    // Verify no anchor link points to /login
    const loginLink = page.locator('a[href="/login"]');
    await expect(loginLink).toHaveCount(0);

    // Verify informational phase notice is rendered
    await expect(page.getByText(/learner login available in phase 5.3/i)).toBeVisible();
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
      name: /start your swimming education/i,
    });
    await expect(h1).toBeVisible();

    const nameInput = page.getByLabel(/legal full name/i);
    await expect(nameInput).toBeVisible();

    // Verify touch target size meets minimum 44px
    const box = await nameInput.boundingBox();
    expect(box?.height).toBeGreaterThanOrEqual(44);

    // Check no horizontal scrollbar / overflow
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth);
  });
});
