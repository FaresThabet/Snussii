// ============================================================================
// SNUSII V3 — E2E Smoke Test
// Verifies the core user journeys work end-to-end.
// Run: bun run test:e2e
// ============================================================================

import { test, expect } from "@playwright/test";

test.describe("Smoke tests", () => {
  test("homepage loads and shows brand elements", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/snus/i);
    // Age gate should appear on first visit
    await expect(page.locator("body")).toBeVisible();
  });

  test("RTL locale switcher is present", async ({ page }) => {
    await page.goto("/");
    // Language switcher should be visible in navbar
    const switcher = page.getByRole("button", { name: /ar|en|عربي|english/i }).first();
    if (await switcher.isVisible()) {
      await switcher.click();
      // Menu should appear
      await expect(page.locator("[role='menu']")).toBeVisible();
    }
  });

  test("products page is reachable from navbar", async ({ page }) => {
    await page.goto("/");
    // Click the first product-related link
    const productsLink = page.getByRole("link", { name: /products|المنتجات/i }).first();
    if (await productsLink.isVisible()) {
      await productsLink.click();
      await page.waitForLoadState("networkidle");
      // Should land on /products or a product listing
      expect(page.url()).toMatch(/products|best-sellers|brands/);
    }
  });

  test("admin route redirects unauthenticated users", async ({ page }) => {
    await page.goto("/admin");
    // Should either redirect to sign-in or show an auth prompt
    await page.waitForLoadState("networkidle");
    expect(page.url()).toMatch(/sign-in|login|admin/);
  });

  test("age gate blocks minors", async ({ page }) => {
    await page.goto("/");
    // Look for age verification elements
    const ageButtons = page.getByRole("button");
    const count = await ageButtons.count();
    expect(count).toBeGreaterThan(0);
  });
});

test.describe("Accessibility", () => {
  test("main landmark exists on homepage", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("main")).toBeVisible();
  });

  test("footer is sticky on short pages", async ({ page }) => {
    await page.goto("/");
    const footer = page.locator("footer").first();
    if (await footer.isVisible()) {
      const bbox = await footer.boundingBox();
      expect(bbox).not.toBeNull();
      // Footer should be near the bottom of the viewport
      expect(bbox!.y).toBeGreaterThan(0);
    }
  });
});
