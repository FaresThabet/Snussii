// ============================================================================
// SNUSII V2 — Admin Single User Management API
// PUT    /api/admin/users/:id → Update user (role, permissions, status)
// DELETE /api/admin/users/:id → Soft-delete user (deactivate)
// ============================================================================

import { NextRequest, NextResponse } from "next/server";
import { requireSuperAdmin } from "@/lib/admin-auth";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

// ─── PUT: Update User ──────────────────────────────────────────────────────

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireSuperAdmin();
    const { id } = await params;

    // Prevent self-modification
    if (session.user.id === id) {
      return NextResponse.json(
        { error: "Cannot modify your own account" },
        { status: 400 }
      );
    }

    const user = await db.user.findUnique({ where: { id } });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const body = await request.json();

    const updateData: Record<string, unknown> = {};

    // Update role
    if (body.role && Object.values(["SUPER_ADMIN", "DISTRIBUTOR_ADMIN", "DISTRIBUTOR_STAFF", "SALES_REP", "CONSUMER", "CORPORATE"]).includes(body.role)) {
      updateData.role = body.role;
    }

    // Update permissions (only for admin roles)
    if (body.permissions && Array.isArray(body.permissions)) {
      const validPermissions = [
        "VIEW_DASHBOARD", "MANAGE_USERS", "MANAGE_PRODUCTS", "MANAGE_ORDERS",
        "MANAGE_CONTENT", "MANAGE_MARKETING", "VIEW_REPORTS", "MANAGE_SETTINGS",
        "EXPORT_DATA", "MANAGE_PROMOTIONS",
      ];
      updateData.permissions = body.permissions.filter((p: string) => validPermissions.includes(p));
    }

    // Update active status
    if (body.isActive !== undefined) {
      updateData.isActive = body.isActive;
    }

    // Update profile fields
    if (body.name !== undefined) updateData.name = body.name;
    if (body.phone !== undefined) updateData.phone = body.phone;
    if (body.governorate !== undefined) updateData.governorate = body.governorate;
    if (body.city !== undefined) updateData.city = body.city;
    if (body.address !== undefined) updateData.address = body.address;

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { error: "No valid fields to update" },
        { status: 400 }
      );
    }

    const updated = await db.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        role: true,
        permissions: true,
        isActive: true,
        governorate: true,
        city: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({
      message: "User updated successfully",
      user: updated,
    });
  } catch (error) {
    if (error instanceof NextResponse) throw error;
    console.error("[Admin Users] Update error:", error);
    return NextResponse.json(
      { error: "Failed to update user" },
      { status: 500 }
    );
  }
}

// ─── DELETE: Deactivate User ─────────────────────────────────────────────────

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireSuperAdmin();
    const { id } = await params;

    // Prevent self-deletion
    if (session.user.id === id) {
      return NextResponse.json(
        { error: "Cannot deactivate your own account" },
        { status: 400 }
      );
    }

    const user = await db.user.findUnique({ where: { id } });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (!user.isActive) {
      return NextResponse.json(
        { error: "User is already deactivated" },
        { status: 400 }
      );
    }

    const deactivated = await db.user.update({
      where: { id },
      data: { isActive: false },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true,
      },
    });

    return NextResponse.json({
      message: "User deactivated successfully",
      user: deactivated,
    });
  } catch (error) {
    if (error instanceof NextResponse) throw error;
    console.error("[Admin Users] Delete error:", error);
    return NextResponse.json(
      { error: "Failed to deactivate user" },
      { status: 500 }
    );
  }
}
