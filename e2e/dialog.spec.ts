import { test, expect } from "@playwright/test";

test.describe("Native Browser Dialog Primitive Behavior", () => {
  test("opens native modal, handles Escape key, and returns focus to trigger", async ({ page }) => {
    await page.goto("/test-dialog");

    const triggerBtn = page.locator("#open-dialog-btn");
    await expect(triggerBtn).toBeVisible();

    // Focus and click the trigger button
    await triggerBtn.focus();
    await expect(triggerBtn).toBeFocused();
    await triggerBtn.click();

    // Verify dialog appears in browser top layer with open state
    const dialog = page.getByRole("dialog", { name: "Enrollment Confirmation" });
    await expect(dialog).toBeVisible();

    // Verify accessibility associations
    const title = page.getByRole("heading", {
      name: "Enrollment Confirmation",
    });
    await expect(title).toBeVisible();
    await expect(dialog).toHaveAttribute("aria-modal", "true");
    const titleId = await title.getAttribute("id");
    expect(titleId).toBeTruthy();
    await expect(dialog).toHaveAttribute("aria-labelledby", titleId!);

    // Press Escape key in real Chromium browser
    await page.keyboard.press("Escape");

    // Verify dialog closes
    await expect(dialog).not.toBeVisible();

    // Verify focus returns to the opening button in native browser
    await expect(triggerBtn).toBeFocused();

    // Open again and close using close button
    await triggerBtn.click();
    await expect(dialog).toBeVisible();
    const closeBtn = page.getByRole("button", { name: "Close dialog" });
    await closeBtn.click();
    await expect(dialog).not.toBeVisible();
    await expect(triggerBtn).toBeFocused();
  });
});
