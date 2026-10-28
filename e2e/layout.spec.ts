import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test.describe("Responsive Layout & Navigation (Phase 2B)", () => {
  test("renders desktop layout with header, footer, and desktop nav", async ({ page }) => {
    // Set desktop viewport
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/");

    // Verify header and brand logo
    const header = page.getByRole("banner");
    await expect(header).toBeVisible();

    const homeLink = header.getByRole("link", { name: /swimnigeria/i });
    await expect(homeLink).toBeVisible();

    // Verify desktop navigation items
    const mainNav = page.getByRole("navigation", { name: "Main Navigation" });
    await expect(mainNav).toBeVisible();

    const desktopCoursesLink = mainNav.getByRole("link", { name: "Courses" });
    await expect(desktopCoursesLink).toBeVisible();

    // Hamburger button should be hidden on desktop
    const menuButton = page.getByRole("button", {
      name: "Open mobile navigation menu",
    });
    await expect(menuButton).toBeHidden();

    // Verify footer and mandatory disclaimer
    const footer = page.getByRole("contentinfo");
    await expect(footer).toBeVisible();

    await expect(
      page.getByText(
        "Certificate of Theoretical Course Completion: This credential validates completion of digital coursework and water safety knowledge.",
      ),
    ).toBeVisible();
  });

  test("supports mobile viewport with responsive drawer navigation and focus management", async ({
    page,
  }) => {
    // Set mobile viewport (375px)
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/");

    // Desktop nav should be hidden
    const mainNav = page.getByRole("navigation", { name: "Main Navigation" });
    await expect(mainNav).toBeHidden();

    // Hamburger button should be visible
    const menuButton = page.getByRole("button", {
      name: "Open mobile navigation menu",
    });
    await expect(menuButton).toBeVisible();
    await expect(menuButton).toHaveAttribute("aria-expanded", "false");

    // Click hamburger button to open mobile drawer
    await menuButton.click();
    await expect(menuButton).toHaveAttribute("aria-expanded", "true");

    // Dialog should be visible in top-layer
    const dialog = page.getByRole("dialog", { name: "Menu" });
    await expect(dialog).toBeVisible();

    const mobileNav = page.getByRole("navigation", {
      name: "Mobile Navigation",
    });
    await expect(mobileNav).toBeVisible();

    // Press Escape to dismiss drawer
    await page.keyboard.press("Escape");
    await expect(dialog).not.toBeVisible();

    // Focus must return to the mobile menu trigger button
    await expect(menuButton).toBeFocused();
    await expect(menuButton).toHaveAttribute("aria-expanded", "false");

    // Open again and click a navigation link
    await menuButton.click();
    await expect(dialog).toBeVisible();

    const coursesLink = mobileNav.getByRole("link", { name: "Courses", exact: true });
    await coursesLink.click();

    // Drawer closes after navigation
    await expect(dialog).not.toBeVisible();
  });

  test("layout passes automated WCAG 2.1 AA accessibility checks across viewports", async ({
    page,
  }) => {
    await page.goto("/");

    const desktopAxeResults = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();

    expect(desktopAxeResults.violations).toEqual([]);

    // Check mobile viewport accessibility
    await page.setViewportSize({ width: 375, height: 667 });
    const mobileAxeResults = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();

    expect(mobileAxeResults.violations).toEqual([]);
  });
});
