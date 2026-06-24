// ============================================================================
// SNUSII V3 — API Response Helpers Tests
// ============================================================================

import { describe, it, expect } from "vitest";
import { ok, created, badRequest, notFound, serverError, PaginationMeta } from "@/lib/api-response";
import { NextResponse } from "next/server";

describe("api-response helpers", () => {
  it("ok() returns 200 with success: true", async () => {
    const res = ok({ foo: "bar" });
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body).toEqual({ success: true, data: { foo: "bar" } });
  });

  it("ok() includes pagination meta when provided", async () => {
    const meta: PaginationMeta = { page: 1, limit: 10, total: 25, totalPages: 3 };
    const res = ok([], meta);
    const body = await res.json();
    expect(body.meta).toEqual(meta);
  });

  it("created() returns 201", () => {
    const res = created({ id: "abc" });
    expect(res.status).toBe(201);
  });

  it("badRequest() returns 400 with error", async () => {
    const res = badRequest("Invalid", { field: "email" });
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.success).toBe(false);
    expect(body.error).toBe("Invalid");
    expect(body.details).toEqual({ field: "email" });
  });

  it("notFound() returns 404", () => {
    expect(notFound().status).toBe(404);
  });

  it("serverError() returns 500", () => {
    expect(serverError().status).toBe(500);
  });

  it("all helpers return NextResponse instances", () => {
    expect(ok({})).toBeInstanceOf(NextResponse);
    expect(created({})).toBeInstanceOf(NextResponse);
    expect(badRequest("x")).toBeInstanceOf(NextResponse);
    expect(notFound()).toBeInstanceOf(NextResponse);
    expect(serverError()).toBeInstanceOf(NextResponse);
  });
});
