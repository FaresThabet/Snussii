// ============================================================================
// SNUSII V2 — Admin Customers API
// GET /api/admin/users/customers → List all customer accounts
// ============================================================================

import { NextRequest, NextResponse } from "next/server";
import { requirePermission } from "@/lib/admin-auth";
import { db } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    await requirePermission("MANAGE_USERS");

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "20", 10);
    const search = searchParams.get("search") || undefined;
    const role = searchParams.get("role") || undefined;
    const status = searchParams.get("status"); // "active" | "suspended"
    const governorate = searchParams.get("governorate") || undefined;
    const sortBy = searchParams.get("sort") || "createdAt";
    const sortOrder = searchParams.get("order") || "desc";

    const where: Record<string, unknown> = {
      role: { in: ["CONSUMER", "CORPORATE", "SALES_REP"] },
    };

    if (role) where.role = role;
    if (status === "active") where.isActive = true;
    if (status === "suspended") where.isActive = false;
    if (governorate) where.governorate = governorate;

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { email: { contains: search } },
        { phone: { contains: search } },
      ];
    }

    type OrderBy = Record<string, string>;
    const orderBy: OrderBy = {};
    orderBy[sortBy] = sortOrder;

    const [customers, total] = await Promise.all([
      db.user.findMany({
        where,
        select: {
          id: true,
          email: true,
          name: true,
          phone: true,
          role: true,
          isActive: true,
          governorate: true,
          city: true,
          createdAt: true,
          _count: {
            select: {
              orders: true,
              reviews: true,
            },
          },
          loyaltyProfile: {
            select: {
              points: true,
              tier: true,
              totalSpent: true,
            },
          },
        },
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
      }),
      db.user.count({ where }),
    ]);

    return NextResponse.json({
      customers,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    if (error instanceof NextResponse) throw error;
    console.error("[Admin Customers] List error:", error);
    return NextResponse.json(
      { error: "Failed to fetch customers" },
      { status: 500 }
    );
  }
}
