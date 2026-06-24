// ============================================================================
// SNUSII V2 — Admin Dashboard Metrics API
// GET /api/admin/dashboard/metrics
//
// Real-time KPIs: revenue, orders, customers, AOV, growth rates,
// order status breakdowns, low-stock alerts, loyalty stats.
// ============================================================================

import { NextResponse } from "next/server";
import { requirePermission } from "@/lib/admin-auth";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const session = await requirePermission("VIEW_DASHBOARD");

    // ── Aggregation queries ──────────────────────────────────────
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const startOfYear = new Date(now.getFullYear(), 0, 1);

    const [
      currentMonth,
      lastMonth,
      thisYear,
      pendingCount,
      shippedCount,
      deliveredTodayCount,
      lowStockCount,
      totalCustomers,
      totalPoints,
    ] = await Promise.all([
      // Current month revenue + orders
      db.order.aggregate({
        where: {
          createdAt: { gte: startOfMonth },
          paymentStatus: "PAID",
        },
        _sum: { total: true },
        _count: true,
      }),
      // Last month revenue + orders (for growth calc)
      db.order.aggregate({
        where: {
          createdAt: { gte: startOfLastMonth, lt: startOfMonth },
          paymentStatus: "PAID",
        },
        _sum: { total: true },
        _count: true,
      }),
      // Year-to-date revenue
      db.order.aggregate({
        where: {
          createdAt: { gte: startOfYear },
          paymentStatus: "PAID",
        },
        _sum: { total: true },
        _count: true,
      }),
      // Pending orders
      db.order.count({ where: { status: "PENDING" } }),
      // Shipped orders
      db.order.count({ where: { status: "SHIPPED" } }),
      // Delivered today
      db.order.count({
        where: {
          status: "DELIVERED",
          deliveredAt: {
            gte: new Date(now.getFullYear(), now.getMonth(), now.getDate()),
          },
        },
      }),
      // Low stock products (≤ 5 units)
      db.product.count({ where: { stock: { lte: 5 }, isActive: true } }),
      // Total customers (CONSUMER + CORPORATE roles)
      db.user.count({
        where: { role: { in: ["CONSUMER", "CORPORATE"] }, isActive: true },
      }),
      // Total loyalty points awarded
      db.loyaltyTransaction.aggregate({
        where: { type: "earn" },
        _sum: { points: true },
      }),
    ]);

    // Calculate growth rates
    const revenueGrowth =
      lastMonth._sum.total && lastMonth._sum.total > 0
        ? (((currentMonth._sum.total || 0) - lastMonth._sum.total) /
            lastMonth._sum.total) *
          100
        : 0;

    const ordersGrowth =
      lastMonth._count && lastMonth._count > 0
        ? (((currentMonth._count || 0) - lastMonth._count) / lastMonth._count) * 100
        : 0;

    const avgOrderValue =
      currentMonth._count && currentMonth._count > 0
        ? (currentMonth._sum.total || 0) / currentMonth._count
        : 0;

    return NextResponse.json({
      period: {
        from: startOfMonth.toISOString(),
        to: now.toISOString(),
      },
      metrics: {
        totalRevenue: currentMonth._sum.total || 0,
        totalOrders: currentMonth._count || 0,
        totalCustomers,
        avgOrderValue: Math.round(avgOrderValue),
        revenueGrowth: Math.round(revenueGrowth * 10) / 10,
        ordersGrowth: Math.round(ordersGrowth * 10) / 10,
        yearToDateRevenue: thisYear._sum.total || 0,
        yearToDateOrders: thisYear._count || 0,
      },
      statusBreakdown: {
        pending: pendingCount,
        shipped: shippedCount,
        deliveredToday: deliveredTodayCount,
      },
      alerts: {
        lowStockProducts: lowStockCount,
      },
      loyalty: {
        totalPointsAwarded: totalPoints._sum.points || 0,
      },
    });
  } catch (error) {
    // Guard already threw NextResponse, re-throw it
    if (error instanceof NextResponse) throw error;

    console.error("[Admin Dashboard] Metrics error:", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard metrics" },
      { status: 500 }
    );
  }
}
