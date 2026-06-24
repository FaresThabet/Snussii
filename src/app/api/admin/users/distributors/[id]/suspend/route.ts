// ============================================================================
// SNUSII V2 — Admin Suspend Distributor API
// POST /api/admin/users/distributors/:id/suspend
//
// Deactivates a distributor account (soft suspend — preserves data).
// ============================================================================

import { NextRequest, NextResponse } from "next/server";
import { requirePermission } from "@/lib/admin-auth";
import { db } from "@/lib/db";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requirePermission("MANAGE_USERS");
    const { id } = await params;

    const user = await db.user.findUnique({ where: { id } });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (!["DISTRIBUTOR_ADMIN", "DISTRIBUTOR_STAFF"].includes(user.role)) {
      return NextResponse.json(
        { error: "User is not a distributor" },
        { status: 400 }
      );
    }

    // Prevent suspending self
    // (self-check would need the session userId — skipped for route-level guard)

    if (!user.isActive) {
      return NextResponse.json(
        { error: "Distributor is already suspended" },
        { status: 400 }
      );
    }

    const updated = await db.user.update({
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
      message: "Distributor suspended successfully",
      user: updated,
    });
  } catch (error) {
    if (error instanceof NextResponse) throw error;
    console.error("[Admin Users] Suspend error:", error);
    return NextResponse.json(
      { error: "Failed to suspend distributor" },
      { status: 500 }
    );
  }
}
