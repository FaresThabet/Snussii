// ============================================================================
// SNUSII V3 — Password Utility Tests
// ============================================================================

import { describe, it, expect } from "vitest";
import { hashPassword, verifyPassword, needsRehash } from "@/lib/password";

describe("password utility", () => {
  it("hashes a password and verifies it correctly", async () => {
    const password = "Correct$Horse9";
    const hash = await hashPassword(password);
    expect(hash).not.toBe(password);
    expect(hash.startsWith("scrypt$")).toBe(true);
    const isValid = await verifyPassword(password, hash);
    expect(isValid).toBe(true);
  });

  it("rejects an incorrect password", async () => {
    const hash = await hashPassword("Correct$Horse9");
    const isValid = await verifyPassword("wrong-password", hash);
    expect(isValid).toBe(false);
  });

  it("produces a unique salt per hash", async () => {
    const password = "Correct$Horse9";
    const h1 = await hashPassword(password);
    const h2 = await hashPassword(password);
    expect(h1).not.toBe(h2);
  });

  it("detects legacy plaintext hashes that need rehashing", () => {
    expect(needsRehash("plaintextpassword")).toBe(true);
    expect(needsRehash("$2b$10$abc")).toBe(true);
    expect(needsRehash("scrypt$16384$8$1$salt$hash")).toBe(false);
  });

  it("rejects short passwords during hashing", async () => {
    await expect(hashPassword("short")).rejects.toThrow(/at least 8 characters/);
  });
});
