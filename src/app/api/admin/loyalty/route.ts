// ============================================================================
// SNUSII V2 — Admin Loyalty Program API
// GET /api/admin/loyalty → Loyalty program overview & management
//
// Returns: tier distribution, points economics, top members,
// recent point transactions, and program settings.
// ============================================================================

import { NextRequest, NextResponse } from "next/server";
import { requirePermission } from "@/lib/admin-auth";
import { db } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    await requirePermission("VIEW_REPORTS");

    const { searchParams } = new URL(request.url);
    const section = searchParams.get("section") || "overview"; // overview | members | transactions
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "20", 10);
    const tier = searchParams.get("tier") || undefined;

    if (section === "members") {
      // ── Loyalty Members List ──────────────────────────────────
      const where: Record<string, unknown> = {};
      if (tier) where.tier = tier;

      const [members, total] = await Promise.all([
        db.loyaltyProfile.findMany({
          where,
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                governorate: true,
                isActive: true,
                _count: { select: { orders: true } },
              },
            },
            _count: { select: { transactions: true } },
          },
          orderBy: { totalSpent: "desc" },
          skip: (page - 1) * limit,
          take: limit,
        }),
        db.loyaltyProfile.count({ where }),
      ]);

      return NextResponse.json({
        members: members.map((m) => ({
          id: m.id,
          tier: m.tier,
          points: m.points,
          totalSpent: m.totalSpent,
          createdAt: m.createdAt,
          user: m.user,
          transactionCount: m._count.transactions,
        })),
        pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
      });
    }

    if (section === "transactions") {
      // ── Recent Point Transactions ──────────────────────────────
      const typeFilter = searchParams.get("type") || undefined;
      const where: Record<string, unknown> = {};
      if (typeFilter) where.type = typeFilter;

      const [transactions, total] = await Promise.all([
        db.loyaltyTransaction.findMany({
          where,
          include: {
            profile: {
              select: {
                user: {
                  select: { name: true, email: true },
                },
              },
            },
          },
          orderBy: { createdAt: "desc" },
          skip: (page - 1) * limit,
          take: limit,
        }),
        db.loyaltyTransaction.count({ where }),
      ]);

      return NextResponse.json({
        transactions: transactions.map((t) => ({
          id: t.id,
          type: t.type,
          points: t.points,
          balance: t.balance,
          description: t.description,
          createdAt: t.createdAt,
          user: t.profile.user,
        })),
        pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
      });
    }

    // ── Overview (default) ───────────────────────────────────────
    const [
      tierDistribution,
      totalPointsInCirculation,
      totalPointsEarned,
      totalPointsRedeemed,
      totalLifetimeSpent,
      topMembers,
      recentTransactions,
    ] = await Promise.all([
      // Tier distribution
      db.loyaltyProfile.groupBy({
        by: ["tier"],
        _count: true,
        _sum: { points: true, totalSpent: true },
      }),
      // Points in circulation
      db.loyaltyProfile.aggregate({
        _sum: { points: true },
      }),
      // Points earned
      db.loyaltyTransaction.aggregate({
        where: { type: "earn" },
        _sum: { points: true },
      }),
      // Points redeemed
      db.loyaltyTransaction.aggregate({
        where: { type: "redeem" },
        _sum: { points: true },
      }),
      // Lifetime customer spending
      db.loyaltyProfile.aggregate({
        _sum: { totalSpent: true },
      }),
      // Top 5 members by spending
      db.loyaltyProfile.findMany({
        include: {
          user: { select: { name: true, email: true, governorate: true } },
        },
        orderBy: { totalSpent: "desc" },
        take: 5,
      }),
      // 10 most recent transactions
      db.loyaltyTransaction.findMany({
        include: {
          profile: {
            select: { user: { select: { name: true, email: true } } },
          },
        },
        orderBy: { createdAt: "desc" },
        take: 10,
      }),
    ]);

    return NextResponse.json({
      overview: {
        totalMembers: tierDistribution.reduce((sum, t) => sum + t._count, 0),
        totalPointsInCirculation: totalPointsInCirculation._sum.points || 0,
        totalPointsEarned: totalPointsEarned._sum.points || 0,
        totalPointsRedeemed: totalPointsRedeemed._sum.points || 0,
        totalLifetimeSpent: totalLifetimeSpent._sum.totalSpent || 0,
        pointsValueInEGP: Math.round((totalPointsInCirculation._sum.points || 0) * 0.5), // 1pt = 0.5 EGP
      },
      tierDistribution: tierDistribution.map((t) => ({
        tier: t.tier,
        members: t._count,
        totalPoints: t._sum.points || 0,
        totalSpent: t._sum.totalSpent || 0,
      })),
      topMembers: topMembers.map((m) => ({
        name: m.user.name,
        email: m.user.email,
        governorate: m.user.governorate,
        tier: m.tier,
        points: m.points,
        totalSpent: m.totalSpent,
      })),
      recentTransactions: recentTransactions.map((t) => ({
        id: t.id,
        type: t.type,
        points: t.points,
        balance: t.balance,
        description: t.description,
        createdAt: t.createdAt,
        user: t.profile.user,
      })),
    });
  } catch (error) {
    if (error instanceof NextResponse) throw error;
    console.error("[Admin Loyalty] Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch loyalty data" },
      { status: 500 }
    );
  }
}
