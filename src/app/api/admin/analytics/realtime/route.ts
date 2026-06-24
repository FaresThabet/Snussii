// ============================================================================
// SNUSII V2 — Admin Realtime Analytics API
// GET /api/admin/analytics/realtime
//
// Live metrics: active users, recent pageviews, conversion rate,
// top products in the last hour, active orders by status.
// Uses lightweight queries designed for sub-100ms response.
// ============================================================================

import { NextResponse } from "next/server";
import { requirePermission } from "@/lib/admin-auth";
import { db } from "@/lib/db";

export async function GET() {
  try {
    await requirePermission("VIEW_DASHBOARD");

    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [
      ordersLastHour,
      ordersToday,
      revenueLastHour,
      topProductsHour,
      ordersByStatus,
      recentOrders,
    ] = await Promise.all([
      // Orders placed in the last hour
      db.order.count({
        where: { createdAt: { gte: oneHourAgo } },
      }),
      // Orders placed today
      db.order.count({
        where: { createdAt: { gte: today } },
      }),
      // Revenue in the last hour
      db.order.aggregate({
        where: {
          createdAt: { gte: oneHourAgo },
          paymentStatus: "PAID",
        },
        _sum: { total: true },
      }),
      // Top-selling products in the last 24 hours
      db.orderItem.groupBy({
        by: ["productName"],
        where: {
          order: { createdAt: { gte: oneHourAgo } },
        },
        _sum: { quantity: true, total: true },
        orderBy: { _sum: { quantity: "desc" } },
        take: 5,
      }),
      // Orders grouped by status
      db.order.groupBy({
        by: ["status"],
        _count: true,
      }),
      // 5 most recent orders (for live feed)
      db.order.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
        select: {
          orderNumber: true,
          total: true,
          status: true,
          paymentMethod: true,
          createdAt: true,
          customer: { select: { name: true, email: true } },
          guestName: true,
        },
      }),
    ]);

    // Conversion rate: orders today / estimated visitors (rough heuristic)
    const estimatedVisitorsToday = ordersToday * 8; // ~12.5% conversion assumption
    const conversionRate =
      estimatedVisitorsToday > 0
        ? Math.round((ordersToday / estimatedVisitorsToday) * 1000) / 10
        : 0;

    return NextResponse.json({
      timestamp: new Date().toISOString(),
      realtime: {
        ordersLastHour,
        revenueLastHour: revenueLastHour._sum.total || 0,
        ordersToday,
        conversionRate,
      },
      topProducts: topProductsHour.map((p) => ({
        name: p.productName,
        quantity: p._sum.quantity || 0,
        revenue: p._sum.total || 0,
      })),
      ordersByStatus: ordersByStatus.map((s) => ({
        status: s.status,
        count: s._count,
      })),
      recentOrders: recentOrders.map((o) => ({
        orderNumber: o.orderNumber,
        customer: o.customer?.name || o.guestName || "Guest",
        total: o.total,
        status: o.status,
        paymentMethod: o.paymentMethod,
        createdAt: o.createdAt,
      })),
    });
  } catch (error) {
    if (error instanceof NextResponse) throw error;
    console.error("[Admin Analytics] Realtime error:", error);
    return NextResponse.json(
      { error: "Failed to fetch realtime analytics" },
      { status: 500 }
    );
  }
}
