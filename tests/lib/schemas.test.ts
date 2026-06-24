// ============================================================================
// SNUSII V3 — Schema Validation Tests
// ============================================================================

import { describe, it, expect } from "vitest";
import {
  SignInSchema,
  SignUpSchema,
  ProductSchemas,
  OrderSchemas,
  CouponSchemas,
} from "@/lib/schemas";

describe("SignInSchema", () => {
  it("accepts valid input", () => {
    const r = SignInSchema.safeParse({
      email: "user@example.com",
      password: "secret123",
    });
    expect(r.success).toBe(true);
  });

  it("rejects invalid email", () => {
    const r = SignInSchema.safeParse({
      email: "not-an-email",
      password: "secret123",
    });
    expect(r.success).toBe(false);
  });
});

describe("SignUpSchema", () => {
  const valid = {
    name: "Ahmed",
    email: "ahmed@example.com",
    password: "StrongPass1",
    confirmPassword: "StrongPass1",
  };

  it("accepts valid input", () => {
    expect(SignUpSchema.safeParse(valid).success).toBe(true);
  });

  it("rejects passwords without uppercase", () => {
    expect(
      SignUpSchema.safeParse({
        ...valid,
        password: "weakpass1",
        confirmPassword: "weakpass1",
      }).success
    ).toBe(false);
  });

  it("rejects when passwords do not match", () => {
    expect(
      SignUpSchema.safeParse({ ...valid, confirmPassword: "different" }).success
    ).toBe(false);
  });
});

describe("ProductSchemas.create", () => {
  const valid = {
    name: "White Fox Double Mint",
    slug: "white-fox-double-mint",
    strength: 16,
    price: 250,
    sku: "WF-DM-16",
    brandId: "ck1234567890abcdef",
    categoryId: "ck1234567890abcdef",
  };

  it("accepts valid input", () => {
    expect(ProductSchemas.create.safeParse(valid).success).toBe(true);
  });

  it("rejects uppercase slugs", () => {
    expect(
      ProductSchemas.create.safeParse({ ...valid, slug: "White-Fox" }).success
    ).toBe(false);
  });

  it("rejects negative prices", () => {
    expect(
      ProductSchemas.create.safeParse({ ...valid, price: -10 }).success
    ).toBe(false);
  });
});

describe("OrderSchemas.create", () => {
  const valid = {
    items: [{ productId: "ck1234567890abcdef", quantity: 2 }],
    shippingName: "Ahmed Ali",
    shippingPhone: "+201234567890",
    shippingGovernorate: "Cairo",
    shippingCity: "Cairo",
    shippingAddress: "123 Tahrir Street",
    paymentMethod: "COD",
  };

  it("accepts valid input", () => {
    expect(OrderSchemas.create.safeParse(valid).success).toBe(true);
  });

  it("rejects empty items array", () => {
    expect(OrderSchemas.create.safeParse({ ...valid, items: [] }).success).toBe(
      false
    );
  });
});

describe("CouponSchemas.create", () => {
  it("rejects lowercase codes", () => {
    expect(
      CouponSchemas.create.safeParse({
        code: "save10",
        type: "PERCENTAGE",
        value: 10,
      }).success
    ).toBe(false);
  });

  it("accepts uppercase code with digits", () => {
    expect(
      CouponSchemas.create.safeParse({
        code: "SAVE10",
        type: "PERCENTAGE",
        value: 10,
      }).success
    ).toBe(true);
  });
});
