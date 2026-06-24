// ============================================================================
// SNUSII V3 — Vitest Configuration
// ============================================================================
// Lightweight unit-test runner. Install with:
//   bun add -d vitest @vitest/ui jsdom @testing-library/react
// Run with:
//   bun run test
//   bun run test:watch
//   bun run test:ui
// ============================================================================

import { defineConfig } from "vitest/config";
import path from "node:path";

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  test: {
    globals: true,
    environment: "node",
    setupFiles: ["./tests/setup.ts"],
    include: ["tests/**/*.{test,spec}.{ts,tsx}"],
    exclude: ["node_modules", ".next", "tests/e2e/**"],
    coverage: {
      provider: "v8",
      reporter: ["text", "html", "lcov"],
      include: ["src/lib/**", "src/services/**"],
      exclude: ["**/*.test.ts", "**/*.spec.ts"],
    },
  },
});
