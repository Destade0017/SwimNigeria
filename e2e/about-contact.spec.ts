import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test.describe("Public About & Contact Experience (Phase 3)", () => {
  test("renders About page with mission, philosophy, and passes accessibility checks", async ({
    page,
  }) => {
    await page.goto("/about");

    // Verify document title and page heading
    await expect(page).toHaveTitle(/About Our Mission & Educational Philosophy/);
    const heading = page.getByRole("heading", {
      level: 1,
      name: "Empowering Nigerians with Structured Swimming Education and Water Safety",
    });
    await expect(heading).toBeVisible();

    // Verify mission and educational philosophy sections
    await expect(
      page.getByRole("heading", { level: 2, name: "Why SwimNigeria Exists" }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { level: 2, name: "Our Educational Philosophy" }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", {
        level: 2,
        name: "The Critical Balance: Theoretical Learning and Practical Coaching",
      }),
    ).toBeVisible();

    // Verify calls to action
    const articlesCta = page.getByRole("link", { name: "Explore Educational Articles" });
    await expect(articlesCta).toBeVisible();
    await expect(articlesCta).toHaveAttribute("href", "/articles");

    // Automated accessibility scan
    const axeResults = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();
    expect(axeResults.violations).toEqual([]);
  });

  test("renders Contact page with truthful channel structure and passes accessibility checks", async ({
    page,
  }) => {
    await page.goto("/contact");

    // Verify document title and heading
    await expect(page).toHaveTitle(/Contact & Community Inquiries/);
    const heading = page.getByRole("heading", {
      level: 1,
      name: "Contact & Community Inquiries",
    });
    await expect(heading).toBeVisible();

    // Verify pre-launch notice and lack of non-operational forms
    await expect(
      page.getByRole("heading", { level: 2, name: "Pre-Launch Communications Notice" }),
    ).toBeVisible();
    await expect(page.getByText("scheduled for live activation in Phase 10")).toBeVisible();
    await expect(page.getByRole("button", { name: /submit|send/i })).toBeHidden();

    // Verify collaboration directory
    await expect(
      page.getByRole("heading", { level: 2, name: "Inquiry Tracks & Collaboration Areas" }),
    ).toBeVisible();

    // Automated accessibility scan
    const axeResults = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();
    expect(axeResults.violations).toEqual([]);
  });

  test("navigates seamlessly between Home, About, Contact, and Articles via desktop navigation", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/");

    const mainNav = page.getByRole("navigation", { name: "Main Navigation" });

    // Click About in header
    await mainNav.getByRole("link", { name: "About" }).click();
    await expect(page).toHaveURL("/about");
    await expect(
      page.getByRole("heading", {
        level: 1,
        name: /Empowering Nigerians with Structured Swimming Education/i,
      }),
    ).toBeVisible();

    // Click Contact in header
    await mainNav.getByRole("link", { name: "Contact" }).click();
    await expect(page).toHaveURL("/contact");
    await expect(
      page.getByRole("heading", {
        level: 1,
        name: "Contact & Community Inquiries",
      }),
    ).toBeVisible();

    // Click Safety Articles in header
    await mainNav.getByRole("link", { name: "Safety Articles" }).click();
    await expect(page).toHaveURL("/articles");
    await expect(
      page.getByRole("heading", {
        level: 1,
        name: "Educational Articles & Water Safety Guides",
      }),
    ).toBeVisible();
  });

  test("supports mobile navigation drawer linking to About and Contact pages", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/");

    const menuButton = page.getByRole("button", {
      name: "Open mobile navigation menu",
    });
    await menuButton.click();

    const mobileNav = page.getByRole("navigation", {
      name: "Mobile Navigation",
    });

    // Navigate to About
    await mobileNav.getByRole("link", { name: "About" }).click();
    await expect(page).toHaveURL("/about");

    // Open drawer on About page and navigate to Contact
    await menuButton.click();
    await mobileNav.getByRole("link", { name: "Contact" }).click();
    await expect(page).toHaveURL("/contact");
  });
});
