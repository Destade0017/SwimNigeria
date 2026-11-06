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

  test("inverts navigation text while the dark hero sits behind the transparent pill", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/");

    const homeLink = page
      .getByRole("navigation", { name: "Main Navigation" })
      .getByRole("link", { name: "Home", exact: true });

    // The hero photography extends behind the pill from the first pixel: light labels at rest.
    await expect(homeLink).toHaveCSS("color", "rgb(226, 232, 240)");

    // Scrolled past the hero: white page content is behind the glass, labels revert to slate.
    await page.evaluate(() => {
      const hero = document.getElementById("hero-band");
      const bottom = hero ? hero.offsetTop + hero.offsetHeight : 0;
      window.scrollTo(0, bottom + 150);
    });
    await expect(homeLink).toHaveCSS("color", "rgb(51, 65, 85)");

    // Back at the top: light labels restored.
    await page.evaluate(() => window.scrollTo(0, 0));
    await expect(homeLink).toHaveCSS("color", "rgb(226, 232, 240)");
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

    // Background scroll must be locked while the drawer is open
    await expect(page.evaluate(() => document.body.style.overflow)).resolves.toBe("hidden");

    // Current route is marked; anchor links are not
    await expect(mobileNav.getByRole("link", { name: "Home", exact: true })).toHaveAttribute(
      "aria-current",
      "page",
    );
    await expect(mobileNav.getByRole("link", { name: "Courses", exact: true })).not.toHaveAttribute(
      "aria-current",
    );

    // Press Escape to dismiss drawer
    await page.keyboard.press("Escape");
    await expect(dialog).not.toBeVisible();

    // Scroll lock is released on close
    await expect(page.evaluate(() => document.body.style.overflow)).resolves.toBe("");

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
