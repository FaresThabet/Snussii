// ============================================================================
// SNUSII V3 — Rate Limiter Tests
// ============================================================================

import { describe, it, expect, beforeEach } from "vitest";
import { rateLimit, RateLimits } from "@/lib/rate-limit";

function makeRequest(ip = "1.2.3.4"): Request {
  return new Request("https://example.com/api/x", {
    headers: { "x-forwarded-for": ip },
  });
}

describe("rateLimit", () => {
  beforeEach(() => {
    // Each test gets a fresh IP namespace to avoid state bleed-through
  });

  it("allows requests under the limit", () => {
    for (let i = 0; i < RateLimits.auth.limit; i++) {
      const limited = rateLimit(makeRequest(), RateLimits.auth);
      expect(limited).toBeNull();
    }
  });

  it("blocks requests over the limit", () => {
    const ip = `5.6.7.${Math.floor(Math.random() * 255)}`;
    for (let i = 0; i < RateLimits.auth.limit; i++) {
      rateLimit(makeRequest(ip), RateLimits.auth);
    }
    const blocked = rateLimit(makeRequest(ip), RateLimits.auth);
    expect(blocked).not.toBeNull();
    expect(blocked!.status).toBe(429);
  });

  it("returns Retry-After header on block", () => {
    const ip = `9.10.11.${Math.floor(Math.random() * 255)}`;
    for (let i = 0; i < RateLimits.auth.limit; i++) {
      rateLimit(makeRequest(ip), RateLimits.auth);
    }
    const blocked = rateLimit(makeRequest(ip), RateLimits.auth);
    expect(blocked!.headers.get("Retry-After")).toBeTruthy();
  });
});
