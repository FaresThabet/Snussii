// Vitest global setup — runs before every test file.
import { vi } from "vitest";

// Stub env vars required by lib/env.ts
process.env.DATABASE_URL ??= "file:./test.db";
process.env.NEXTAUTH_SECRET ??= "dev-secret-not-for-production";
process.env.NODE_ENV ??= "test";

// Mock Next.js headers/cookies where needed by tests
vi.mock("next/headers", () => ({
  headers: () => new Headers(),
  cookies: () => ({ get: () => undefined, set: () => undefined }),
}));
