// ============================================================================
// SNUSII V2 — Admin Approve Distributor API
// POST /api/admin/users/distributors/:id/approve
//
// Activates a distributor account and assigns default permissions.
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

    if (user.isActive) {
      return NextResponse.json(
        { error: "Distributor is already active" },
        { status: 400 }
      );
    }

    const updated = await db.user.update({
      where: { id },
      data: {
        isActive: true,
        permissions:
          user.role === "DISTRIBUTOR_ADMIN"
            ? ["VIEW_DASHBOARD", "MANAGE_ORDERS", "VIEW_REPORTS"]
            : ["VIEW_DASHBOARD", "MANAGE_ORDERS"],
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true,
        permissions: true,
      },
    });

    return NextResponse.json({
      message: "Distributor approved successfully",
      user: updated,
    });
  } catch (error) {
    if (error instanceof NextResponse) throw error;
    console.error("[Admin Users] Approve error:", error);
    return NextResponse.json(
      { error: "Failed to approve distributor" },
      { status: 500 }
    );
  }
}
