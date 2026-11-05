import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test.describe("Password Recovery & Reset Flows (Phase 5.4)", () => {
  test.describe("Forgot Password Page (/forgot-password)", () => {
    test.beforeEach(async ({ page }) => {
      await page.goto("/forgot-password");
    });

    test("loads forgot password page with semantic structure and metadata", async ({ page }) => {
      await expect(page).toHaveTitle(/Password Recovery \| SwimNigeria/);

      const h1 = page.getByRole("heading", {
        level: 1,
        name: /forgot your password\?/i,
      });
      await expect(h1).toBeVisible();

      const h2 = page.getByRole("heading", {
        level: 2,
        name: /reset your password/i,
      });
      await expect(h2).toBeVisible();

      const emailInput = page.getByLabel(/email address/i);
      await expect(emailInput).toBeVisible();
      await expect(emailInput).toHaveAttribute("type", "email");
      await expect(emailInput).toHaveAttribute("autocomplete", "email");

      const submitBtn = page.getByRole("button", { name: /send recovery email/i });
      await expect(submitBtn).toBeVisible();
      await expect(submitBtn).toBeEnabled();

      const backLink = page.getByRole("link", { name: /return to sign in/i });
      await expect(backLink).toBeVisible();
      await expect(backLink).toHaveAttribute("href", "/login");
    });

    test("passes automated WCAG 2.1 AA accessibility checks on desktop", async ({ page }) => {
      const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
        .analyze();

      expect(accessibilityScanResults.violations).toEqual([]);
    });

    test("renders cleanly on mobile viewport without horizontal overflow", async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });

      const emailInput = page.getByLabel(/email address/i);
      await expect(emailInput).toBeVisible();

      const box = await emailInput.boundingBox();
      expect(box?.height).toBeGreaterThanOrEqual(44);

      const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
      const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
      expect(scrollWidth).toBeLessThanOrEqual(clientWidth);
    });
  });

  test.describe("Reset Password Page Unauthenticated/Unauthorized Guard (/reset-password)", () => {
    test("displays clear expired/unauthorized message when visiting without a recovery session", async ({
      page,
    }) => {
      await page.goto("/reset-password");

      const expiredHeading = page.getByRole("heading", {
        level: 2,
        name: /invalid or expired reset link/i,
      });
      await expect(expiredHeading).toBeVisible();

      const requestLink = page.getByRole("link", { name: /request new reset link/i });
      await expect(requestLink).toBeVisible();
      await expect(requestLink).toHaveAttribute("href", "/forgot-password");

      const loginLink = page.getByRole("link", { name: /return to sign in/i });
      await expect(loginLink).toBeVisible();
      await expect(loginLink).toHaveAttribute("href", "/login");
    });

    test("unauthorized state passes automated WCAG 2.1 AA accessibility checks", async ({
      page,
    }) => {
      await page.goto("/reset-password");

      const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
        .analyze();

      expect(accessibilityScanResults.violations).toEqual([]);
    });
  });

  test.describe("Login Page Integration", () => {
    test("renders working link to /forgot-password from /login", async ({ page }) => {
      await page.goto("/login");
      const forgotLink = page.getByRole("link", { name: /reset password/i });
      await expect(forgotLink).toBeVisible();
      await expect(forgotLink).toHaveAttribute("href", "/forgot-password");
    });
  });
});
