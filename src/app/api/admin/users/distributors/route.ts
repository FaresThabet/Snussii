// ============================================================================
// SNUSII V2 — Admin Distributor Users API
// GET /api/admin/users/distributors
//
// List all distributor accounts (DISTRIBUTOR_ADMIN + DISTRIBUTOR_STAFF)
// with filtering by status (active/suspended/pending).
// ============================================================================

import { NextRequest, NextResponse } from "next/server";
import { requirePermission } from "@/lib/admin-auth";
import { db } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    await requirePermission("MANAGE_USERS");

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status"); // "active", "suspended", "pending"
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "20", 10);

    const where: Record<string, unknown> = {
      role: { in: ["DISTRIBUTOR_ADMIN", "DISTRIBUTOR_STAFF"] },
    };

    if (status === "active") where.isActive = true;
    if (status === "suspended") where.isActive = false;
    // "pending" would need a separate field — for now just filter active/suspended

    const [distributors, total] = await Promise.all([
      db.user.findMany({
        where,
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
          _count: {
            select: {
              orders: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      db.user.count({ where }),
    ]);

    return NextResponse.json({
      distributors,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    if (error instanceof NextResponse) throw error;
    console.error("[Admin Users] Distributors list error:", error);
    return NextResponse.json(
      { error: "Failed to fetch distributors" },
      { status: 500 }
    );
  }
}
