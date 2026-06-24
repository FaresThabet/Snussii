// ============================================================================
// SNUSII V2 — Admin Coupons API
// GET  /api/admin/coupons → List all coupons (paginated, filtered)
// POST /api/admin/coupons → Create a new coupon code
// ============================================================================

import { NextRequest, NextResponse } from "next/server";
import { requirePermission } from "@/lib/admin-auth";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

// ─── GET: List Coupons (Admin) ─────────────────────────────────────────────

export async function GET(request: NextRequest) {
  try {
    await requirePermission("MANAGE_PROMOTIONS");

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "20", 10);
    const search = searchParams.get("search") || undefined;
    const type = searchParams.get("type") || undefined;
    const active = searchParams.get("active");
    const sortBy = searchParams.get("sort") || "createdAt";
    const sortOrder = searchParams.get("order") || "desc";

    const where: Record<string, unknown> = {};
    if (search) {
      where.code = { contains: search, mode: "insensitive" };
    }
    if (type && ["PERCENTAGE", "FIXED"].includes(type)) {
      where.type = type;
    }
    if (active !== null && active !== undefined) {
      where.isActive = active === "true";
    }

    // Filter out expired coupons unless explicitly requested
    const includeExpired = searchParams.get("includeExpired") === "true";
    if (!includeExpired) {
      (where as Record<string, unknown>).OR = [
        { expiresAt: null },
        { expiresAt: { gte: new Date() } },
      ];
    }

    type OrderBy = Record<string, string>;
    const orderBy: OrderBy = {};
    orderBy[sortBy] = sortOrder;

    const [coupons, total] = await Promise.all([
      db.coupon.findMany({
        where,
        include: {
          _count: { select: { usages: true } },
        },
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
      }),
      db.coupon.count({ where }),
    ]);

    // Calculate redemption rate for each coupon
    const enrichedCoupons = coupons.map((c) => ({
      ...c,
      redemptionRate: c.usageLimit
        ? Math.round((c.usageCount / c.usageLimit) * 1000) / 10
        : null,
      isExpired: c.expiresAt ? new Date() > c.expiresAt : false,
      isScheduled: c.startsAt ? new Date() < c.startsAt : false,
    }));

    return NextResponse.json({
      coupons: enrichedCoupons,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    if (error instanceof NextResponse) throw error;
    console.error("[Admin Coupons] List error:", error);
    return NextResponse.json(
      { error: "Failed to fetch coupons" },
      { status: 500 }
    );
  }
}

// ─── POST: Create Coupon ────────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  try {
    await requirePermission("MANAGE_PROMOTIONS");

    const body = await request.json();
    const {
      code,
      type,       // "PERCENTAGE" | "FIXED"
      value,
      minOrder,
      maxDiscount,
      usageLimit,
      startsAt,
      expiresAt,
    } = body;

    // Validate required fields
    if (!code || !type || value === undefined) {
      return NextResponse.json(
        { error: "code, type, and value are required" },
        { status: 400 }
      );
    }

    // Validate type
    if (!["PERCENTAGE", "FIXED"].includes(type)) {
      return NextResponse.json(
        { error: 'type must be "PERCENTAGE" or "FIXED"' },
        { status: 400 }
      );
    }

    // Validate value
    if (type === "PERCENTAGE" && (value < 1 || value > 100)) {
      return NextResponse.json(
        { error: "Percentage value must be between 1 and 100" },
        { status: 400 }
      );
    }

    if (type === "FIXED" && value <= 0) {
      return NextResponse.json(
        { error: "Fixed value must be greater than 0" },
        { status: 400 }
      );
    }

    // Check code uniqueness (case-insensitive)
    const existing = await db.coupon.findFirst({
      where: { code: { equals: code, mode: "insensitive" } },
    });
    if (existing) {
      return NextResponse.json(
        { error: "Coupon code already exists" },
        { status: 409 }
      );
    }

    // Validate dates
    if (startsAt && expiresAt && new Date(startsAt) >= new Date(expiresAt)) {
      return NextResponse.json(
        { error: "startsAt must be before expiresAt" },
        { status: 400 }
      );
    }

    const coupon = await db.coupon.create({
      data: {
        code: code.toUpperCase(),
        type,
        value,
        minOrder: minOrder || null,
        maxDiscount: maxDiscount || null,
        usageLimit: usageLimit || null,
        startsAt: startsAt ? new Date(startsAt) : null,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
        isActive: true,
      },
    });

    return NextResponse.json(coupon, { status: 201 });
  } catch (error) {
    if (error instanceof NextResponse) throw error;
    console.error("[Admin Coupons] Create error:", error);
    return NextResponse.json(
      { error: "Failed to create coupon" },
      { status: 500 }
    );
  }
}
