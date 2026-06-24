// ============================================================================
// SNUSII V2 — Admin Inventory Report API
// GET /api/admin/reports/inventory
//
// Stock levels, low-stock alerts, out-of-stock products,
// inventory by brand, and stock movement summary.
// ============================================================================

import { NextRequest, NextResponse } from "next/server";
import { requirePermission } from "@/lib/admin-auth";
import { db } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    await requirePermission("VIEW_REPORTS");

    const { searchParams } = new URL(request.url);
    const lowStock = searchParams.get("lowStock") === "true"; // stock ≤ 10
    const outOfStock = searchParams.get("outOfStock") === "true"; // stock = 0

    const where: Record<string, unknown> = {};
    if (lowStock) where.stock = { lte: 10, gt: 0 };
    if (outOfStock) where.stock = 0;

    const [
      totalProducts,
      activeProducts,
      outOfStockCount,
      lowStockCount,
      totalStockValue,
      inventoryByBrand,
      stockAlerts,
    ] = await Promise.all([
      db.product.count(),
      db.product.count({ where: { isActive: true } }),
      db.product.count({ where: { stock: 0, isActive: true } }),
      db.product.count({ where: { stock: { lte: 10, gt: 0 }, isActive: true } }),
      // Total inventory value (stock × price)
      db.product.aggregate({
        where: { isActive: true },
        _sum: true, // We'll calculate manually below
      }),
      // Inventory count by brand
      db.product.groupBy({
        by: ["brandId"],
        where: { isActive: true },
        _sum: { stock: true },
        _count: true,
      }),
      // Get actual stock alert products
      db.product.findMany({
        where: {
          isActive: true,
          stock: { lte: 10 },
        },
        select: {
          id: true,
          name: true,
          sku: true,
          stock: true,
          price: true,
          brand: { select: { name: true } },
        },
        orderBy: { stock: "asc" },
        take: 20,
      }),
    ]);

    // Calculate total inventory value
    const allActiveProducts = await db.product.findMany({
      where: { isActive: true },
      select: { stock: true, price: true },
    });
    const totalValue = allActiveProducts.reduce(
      (sum, p) => sum + p.stock * p.price,
      0
    );

    // Get brand names for inventory by brand
    const brandIds = inventoryByBrand.map((b) => b.brandId);
    const brands = await db.brand.findMany({
      where: { id: { in: brandIds } },
      select: { id: true, name: true },
    });
    const brandMap = Object.fromEntries(brands.map((b) => [b.id, b.name]));

    return NextResponse.json({
      summary: {
        totalProducts,
        activeProducts,
        outOfStock: outOfStockCount,
        lowStock: lowStockCount,
        totalStockValue: Math.round(totalValue),
      },
      stockAlerts,
      byBrand: inventoryByBrand.map((b) => ({
        brand: brandMap[b.brandId] || "Unknown",
        totalStock: b._sum.stock || 0,
        productCount: b._count,
      })),
    });
  } catch (error) {
    if (error instanceof NextResponse) throw error;
    console.error("[Admin Reports] Inventory error:", error);
    return NextResponse.json(
      { error: "Failed to fetch inventory report" },
      { status: 500 }
    );
  }
}
