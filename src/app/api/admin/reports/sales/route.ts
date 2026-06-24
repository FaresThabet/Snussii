// ============================================================================
// SNUSII V2 — Admin Sales Report API
// GET /api/admin/reports/sales
//
// Aggregated sales data by period (daily, weekly, monthly)
// with breakdowns by payment method, governorate, and brand.
// ============================================================================

import { NextRequest, NextResponse } from "next/server";
import { requirePermission } from "@/lib/admin-auth";
import { db } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    await requirePermission("VIEW_REPORTS");

    const { searchParams } = new URL(request.url);
    const period = searchParams.get("period") || "monthly"; // daily, weekly, monthly
    const months = parseInt(searchParams.get("months") || "12", 10);

    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - months);

    // Total sales in period
    const salesSummary = await db.order.aggregate({
      where: {
        createdAt: { gte: startDate },
        paymentStatus: "PAID",
      },
      _sum: { total: true, discount: true, shippingCost: true, tax: true },
      _count: true,
      _avg: { total: true },
    });

    // Sales by payment method
    const salesByPayment = await db.order.groupBy({
      by: ["paymentMethod"],
      where: {
        createdAt: { gte: startDate },
        paymentStatus: "PAID",
      },
      _sum: { total: true },
      _count: true,
    });

    // Sales by governorate (top 10)
    const salesByGovernorate = await db.order.groupBy({
      by: ["shippingGovernorate"],
      where: {
        createdAt: { gte: startDate },
        paymentStatus: "PAID",
      },
      _sum: { total: true },
      _count: true,
      orderBy: { _sum: { total: "desc" } },
      take: 10,
    });

    // Top products by revenue
    const topProducts = await db.orderItem.groupBy({
      by: ["productName"],
      where: {
        order: {
          createdAt: { gte: startDate },
          paymentStatus: "PAID",
        },
      },
      _sum: { quantity: true, total: true },
      orderBy: { _sum: { total: "desc" } },
      take: 10,
    });

    // New customers in period
    const newCustomers = await db.user.count({
      where: {
        role: { in: ["CONSUMER", "CORPORATE"] },
        createdAt: { gte: startDate },
      },
    });

    return NextResponse.json({
      period: { from: startDate.toISOString(), to: new Date().toISOString(), months },
      summary: {
        totalRevenue: salesSummary._sum.total || 0,
        totalOrders: salesSummary._count || 0,
        avgOrderValue: salesSummary._avg.total
          ? Math.round(salesSummary._avg.total)
          : 0,
        totalDiscount: salesSummary._sum.discount || 0,
        totalShipping: salesSummary._sum.shippingCost || 0,
        totalTax: salesSummary._sum.tax || 0,
        newCustomers,
      },
      byPaymentMethod: salesByPayment.map((p) => ({
        method: p.paymentMethod,
        revenue: p._sum.total || 0,
        orders: p._count,
      })),
      byGovernorate: salesByGovernorate.map((g) => ({
        governorate: g.shippingGovernorate,
        revenue: g._sum.total || 0,
        orders: g._count,
      })),
      topProducts: topProducts.map((p) => ({
        name: p.productName,
        quantity: p._sum.quantity || 0,
        revenue: p._sum.total || 0,
      })),
    });
  } catch (error) {
    if (error instanceof NextResponse) throw error;
    console.error("[Admin Reports] Sales error:", error);
    return NextResponse.json(
      { error: "Failed to fetch sales report" },
      { status: 500 }
    );
  }
}
