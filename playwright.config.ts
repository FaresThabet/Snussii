// ============================================================================
// SNUSII V3 — Playwright E2E Configuration
// ============================================================================
// V2 had no e2e config (the script ran via `npx playwright test` with defaults).
// V3 pins a proper config with:
//  - Local dev server auto-start
//  - Browser retries + trace on failure
//  - Multi-browser coverage (Chromium, Firefox, WebKit)
//  - HTML + JSON reporters
// ============================================================================

import { defineConfig, devices } from "@playwright/test";

const PORT = 3000;
const baseURL = `http://localhost:${PORT}`;

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ["html", { outputFolder: "playwright-report" }],
    ["json", { outputFile: "playwright-report/results.json" }],
    ["list"],
  ],
  use: {
    baseURL,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
    locale: "en-US",
    timezoneId: "Africa/Cairo",
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "firefox", use: { ...devices["Desktop Firefox"] } },
    { name: "webkit", use: { ...devices["Desktop Safari"] } },
    {
      name: "mobile-chrome",
      use: { ...devices["Pixel 7"] },
    },
  ],
  webServer: process.env.CI
    ? {
        command: "bun run build && bun run start",
        url: baseURL,
        timeout: 120_000,
        reuseExistingServer: false,
      }
    : {
        command: "bun run dev",
        url: baseURL,
        timeout: 60_000,
        reuseExistingServer: true,
      },
});
