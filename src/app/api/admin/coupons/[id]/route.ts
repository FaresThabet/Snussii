// ============================================================================
// SNUSII V2 — Admin Single Coupon API
// PUT    /api/admin/coupons/:id → Update coupon
// DELETE /api/admin/coupons/:id → Delete coupon (hard delete)
// ============================================================================

import { NextRequest, NextResponse } from "next/server";
import { requirePermission } from "@/lib/admin-auth";
import { db } from "@/lib/db";
import { revalidateTag } from "next/cache";

export const dynamic = "force-dynamic";

// ─── PUT: Update Coupon ─────────────────────────────────────────────────────

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requirePermission("MANAGE_PROMOTIONS");
    const { id } = await params;

    const existing = await db.coupon.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Coupon not found" }, { status: 404 });
    }

    const body = await request.json();

    // Validate code uniqueness if changed
    if (body.code && body.code.toUpperCase() !== existing.code) {
      const codeTaken = await db.coupon.findFirst({
        where: { code: { equals: body.code, mode: "insensitive" }, id: { not: id } },
      });
      if (codeTaken) {
        return NextResponse.json({ error: "Coupon code already taken" }, { status: 409 });
      }
    }

    // Validate type
    if (body.type && !["PERCENTAGE", "FIXED"].includes(body.type)) {
      return NextResponse.json(
        { error: 'type must be "PERCENTAGE" or "FIXED"' },
        { status: 400 }
      );
    }

    // Validate value ranges
    const type = body.type || existing.type;
    const value = body.value !== undefined ? body.value : existing.value;
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

    // Validate dates
    const startsAt = body.startsAt ? new Date(body.startsAt) : existing.startsAt;
    const expiresAt = body.expiresAt ? new Date(body.expiresAt) : existing.expiresAt;
    if (startsAt && expiresAt && startsAt >= expiresAt) {
      return NextResponse.json(
        { error: "startsAt must be before expiresAt" },
        { status: 400 }
      );
    }

    const updated = await db.coupon.update({
      where: { id },
      data: {
        ...(body.code !== undefined && { code: body.code.toUpperCase() }),
        ...(body.type !== undefined && { type: body.type }),
        ...(body.value !== undefined && { value: body.value }),
        ...(body.minOrder !== undefined && { minOrder: body.minOrder || null }),
        ...(body.maxDiscount !== undefined && { maxDiscount: body.maxDiscount || null }),
        ...(body.usageLimit !== undefined && { usageLimit: body.usageLimit || null }),
        ...(body.startsAt !== undefined && { startsAt: body.startsAt ? new Date(body.startsAt) : null }),
        ...(body.expiresAt !== undefined && { expiresAt: body.expiresAt ? new Date(body.expiresAt) : null }),
        ...(body.isActive !== undefined && { isActive: body.isActive }),
      },
      include: {
        _count: { select: { usages: true } },
      },
    });

    revalidateTag("coupons");

    return NextResponse.json(updated);
  } catch (error) {
    if (error instanceof NextResponse) throw error;
    console.error("[Admin Coupons] Update error:", error);
    return NextResponse.json(
      { error: "Failed to update coupon" },
      { status: 500 }
    );
  }
}

// ─── DELETE: Delete Coupon ───────────────────────────────────────────────────

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requirePermission("MANAGE_PROMOTIONS");
    const { id } = await params;

    const existing = await db.coupon.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Coupon not found" }, { status: 404 });
    }

    // Prevent deleting coupons with active usages
    if (existing.usageCount > 0) {
      return NextResponse.json(
        { error: `Cannot delete coupon with ${existing.usageCount} active usages. Deactivate it instead.` },
        { status: 400 }
      );
    }

    await db.coupon.delete({ where: { id } });

    revalidateTag("coupons");

    return NextResponse.json({
      message: "Coupon deleted successfully",
      coupon: { id: existing.id, code: existing.code },
    });
  } catch (error) {
    if (error instanceof NextResponse) throw error;
    console.error("[Admin Coupons] Delete error:", error);
    return NextResponse.json(
      { error: "Failed to delete coupon" },
      { status: 500 }
    );
  }
}
