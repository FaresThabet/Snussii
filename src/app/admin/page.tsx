"use client";

import { StatCard, QuickStat, revenueStat, ordersStat, customersStat, aovStat, pendingStat, shippedStat, deliveredStat, pointsStat } from "@/dashboard/components/stat-cards";
import { RevenueChart, DailyRevenueChart, PaymentMethodsChart } from "@/dashboard/components/charts";
import { RecentOrdersTable } from "@/dashboard/components/orders-table";
import { LoyaltyOverview } from "@/dashboard/components/loyalty-overview";
import {
  dashboardStats,
  revenueData,
  dailyRevenueData,
  paymentMethodData,
  recentOrdersData,
  loyaltyTierData,
} from "@/lib/admin-data";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function AdminDashboard() {
  const stats = dashboardStats;

  return (
    <div className="bg-muted/20 min-h-screen">
        <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8 max-w-[1400px] mx-auto">
          {/* Page header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Overview of your store performance &middot; June 2026
            </p>
          </div>

          {/* ─── KPI Stat Cards ─────────────────────────────────── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <StatCard
              title={revenueStat.title}
              value={revenueStat.getValue(stats.totalRevenue)}
              icon={revenueStat.icon}
              variant={revenueStat.variant}
              growth={stats.revenueGrowth}
            />
            <StatCard
              title={ordersStat.title}
              value={ordersStat.getValue(stats.totalOrders)}
              icon={ordersStat.icon}
              variant={ordersStat.variant}
              growth={stats.ordersGrowth}
            />
            <StatCard
              title={customersStat.title}
              value={customersStat.getValue(stats.totalCustomers)}
              icon={customersStat.icon}
              variant={customersStat.variant}
              growth={stats.customersGrowth}
            />
            <StatCard
              title={aovStat.title}
              value={aovStat.getValue(stats.avgOrderValue)}
              icon={aovStat.icon}
              variant={aovStat.variant}
              growth={stats.aovGrowth}
            />
          </div>

          {/* ─── Quick Status Cards ──────────────────────────────── */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
            <QuickStat label={pendingStat.label} count={stats.pendingOrders} icon={pendingStat.icon} color={pendingStat.color} />
            <QuickStat label={shippedStat.label} count={stats.shippedOrders} icon={shippedStat.icon} color={shippedStat.color} />
            <QuickStat label={deliveredStat.label} count={stats.deliveredToday} icon={deliveredStat.icon} color={deliveredStat.color} />
            <QuickStat label={pointsStat.label} count={stats.totalPointsAwarded.toLocaleString()} icon={pointsStat.icon} color={pointsStat.color} />
          </div>

          {/* ─── Charts Row 1: Revenue + Daily ─────────────────── */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <div className="lg:col-span-2">
              <RevenueChart data={revenueData} />
            </div>
            <div>
              <DailyRevenueChart data={dailyRevenueData} />
            </div>
          </div>

          {/* ─── Charts Row 2: Payment Methods + Loyalty ─────── */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <PaymentMethodsChart data={paymentMethodData} />
            <LoyaltyOverview
              tiers={loyaltyTierData}
              totalPointsAwarded={stats.totalPointsAwarded}
            />
          </div>

          {/* ─── Recent Orders ──────────────────────────────────── */}
          <RecentOrdersTable orders={recentOrdersData} />

          {/* View all link */}
          <div className="flex justify-center mt-6">
            <Link href="/admin/orders">
              <Button variant="outline" className="gap-2">
                View All Orders
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
  );
}
