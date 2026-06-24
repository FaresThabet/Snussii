"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

// ─── Shadcn UI Components ───────────────────────────────────────────────────
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// ─── Icons ───────────────────────────────────────────────────────────────────
import {
  Users,
  Award,
  TrendingUp,
  BarChart3,
  Plus,
  Minus,
  Gift,
  Clock,
  Circle,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────────────

interface OverviewData {
  overview: {
    totalMembers: number;
    totalPointsInCirculation: number;
    totalPointsEarned: number;
    totalPointsRedeemed: number;
    totalLifetimeSpent: number;
    pointsValueInEGP: number;
  };
  tierDistribution: {
    tier: string;
    members: number;
    totalPoints: number;
    totalSpent: number;
  }[];
  topMembers: {
    name: string;
    email: string;
    governorate: string;
    tier: string;
    points: number;
    totalSpent: number;
  }[];
  recentTransactions: {
    id: string;
    type: "earn" | "redeem" | "bonus" | "expire";
    points: number;
    balance: number;
    description: string;
    createdAt: string;
    user: { name: string; email: string };
  }[];
}

interface MemberData {
  id: string;
  tier: string;
  points: number;
  totalSpent: number;
  createdAt: string;
  user: {
    id: string;
    name: string;
    email: string;
    phone: string;
    governorate: string;
    isActive: boolean;
    _count: { orders: number };
  };
  transactionCount: number;
}

interface TransactionData {
  id: string;
  type: "earn" | "redeem" | "bonus" | "expire";
  points: number;
  balance: number;
  description: string;
  createdAt: string;
  user: { name: string; email: string };
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatEGP(value: number): string {
  return value.toLocaleString("en-EG") + " EGP";
}

function getTransactionType(type: string) {
  const map: Record<
    string,
    { icon: typeof Plus; color: string; label: string }
  > = {
    earn: {
      icon: Plus,
      color: "bg-green-500/10 text-green-500 border-green-500/20",
      label: "Earned",
    },
    redeem: {
      icon: Minus,
      color: "bg-red-500/10 text-red-500 border-red-500/20",
      label: "Redeemed",
    },
    bonus: {
      icon: Gift,
      color: "bg-amber-500/10 text-amber-500 border-amber-500/20",
      label: "Bonus",
    },
    expire: {
      icon: Clock,
      color: "bg-gray-500/10 text-gray-500 border-gray-500/20",
      label: "Expired",
    },
  };
  return map[type] || { icon: Circle, color: "", label: type };
}

function getTierColor(tier: string) {
  const map: Record<string, string> = {
    BRONZE: "bg-orange-700/10 text-orange-500 border-orange-500/20",
    SILVER: "bg-gray-400/10 text-gray-300 border-gray-400/20",
    GOLD: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
    PLATINUM: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
  };
  return map[tier] || "";
}

function getTierBarColor(tier: string) {
  const map: Record<string, string> = {
    BRONZE: "bg-orange-600",
    SILVER: "bg-gray-400",
    GOLD: "bg-yellow-500",
    PLATINUM: "bg-cyan-400",
  };
  return map[tier] || "bg-muted";
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

// ─── Animation Variants ─────────────────────────────────────────────────────

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.07, duration: 0.4, ease: "easeOut" },
  }),
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
};

const tabContentVariant = {
  hidden: { opacity: 0, x: -12 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.3, ease: "easeOut" } },
  exit: { opacity: 0, x: 12, transition: { duration: 0.15 } },
};

// ─── Sub-Components ──────────────────────────────────────────────────────────

function KPICardSkeleton() {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-8 w-32" />
          </div>
          <Skeleton className="h-10 w-10 rounded-lg" />
        </div>
      </CardContent>
    </Card>
  );
}

function KPICard({
  icon: Icon,
  label,
  value,
  subValue,
  index,
}: {
  icon: typeof Users;
  label: string;
  value: string;
  subValue?: string;
  index: number;
}) {
  return (
    <motion.div custom={index} variants={fadeInUp} initial="hidden" animate="visible">
      <Card className="relative overflow-hidden">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">{label}</p>
              <p className="text-2xl font-bold tracking-tight">{value}</p>
              {subValue && (
                <p className="text-xs text-muted-foreground">{subValue}</p>
              )}
            </div>
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Icon className="h-5 w-5" />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function TierBadge({ tier }: { tier: string }) {
  return (
    <Badge
      variant="outline"
      className={cn("text-[11px] font-semibold uppercase tracking-wider", getTierColor(tier))}
    >
      {tier}
    </Badge>
  );
}

function TransactionTypeBadge({ type }: { type: string }) {
  const { icon: Icon, color, label } = getTransactionType(type);
  return (
    <Badge variant="outline" className={cn("gap-1 text-[11px] font-medium", color)}>
      <Icon className="h-3 w-3" />
      {label}
    </Badge>
  );
}

function PaginationControls({
  pagination,
  onPageChange,
}: {
  pagination: Pagination;
  onPageChange: (page: number) => void;
}) {
  const { page, totalPages, total } = pagination;
  return (
    <div className="flex items-center justify-between pt-4">
      <p className="text-sm text-muted-foreground">
        Showing{" "}
        <span className="font-medium text-foreground">
          {(page - 1) * pagination.limit + 1}
        </span>{" "}
        to{" "}
        <span className="font-medium text-foreground">
          {Math.min(page * pagination.limit, total)}
        </span>{" "}
        of <span className="font-medium text-foreground">{total}</span> results
      </p>
      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <span className="px-3 text-sm text-muted-foreground">
          {page} / {totalPages}
        </span>
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

function TierBarSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="space-y-1">
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-16" />
          </div>
          <Skeleton className="h-3 w-full rounded-full" />
        </div>
      ))}
    </div>
  );
}

function TierDistributionChart({
  data,
}: {
  data: OverviewData["tierDistribution"];
}) {
  const maxMembers = Math.max(...data.map((d) => d.members), 1);

  return (
    <div className="space-y-4">
      {data.map((tier) => {
        const pct = Math.round((tier.members / maxMembers) * 100);
        return (
          <div key={tier.tier} className="space-y-1.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <TierBadge tier={tier.tier} />
                <span className="text-sm text-muted-foreground">
                  {tier.members.toLocaleString("en-EG")} members
                </span>
              </div>
              <div className="text-right">
                <span className="text-sm font-medium">
                  {tier.totalPoints.toLocaleString("en-EG")} pts
                </span>
                <span className="mx-2 text-muted-foreground">·</span>
                <span className="text-sm text-muted-foreground">
                  {formatEGP(tier.totalSpent)}
                </span>
              </div>
            </div>
            <div className="h-2.5 w-full overflow-hidden rounded-full bg-muted">
              <motion.div
                className={cn("h-full rounded-full", getTierBarColor(tier.tier))}
                initial={{ width: 0 }}
                animate={{ width: `${pct}%` }}
                transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── Table Skeletons ─────────────────────────────────────────────────────────

function TableSkeleton({ rows = 5, cols = 6 }: { rows?: number; cols?: number }) {
  return (
    <>
      {Array.from({ length: rows }).map((_, i) => (
        <TableRow key={i}>
          {Array.from({ length: cols }).map((_, j) => (
            <TableCell key={j}>
              <Skeleton className="h-4 w-full max-w-[120px]" />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  );
}

// ─── Main Page Component ─────────────────────────────────────────────────────

export default function LoyaltyProgramPage() {
  const [activeTab, setActiveTab] = useState("overview");
  const [overview, setOverview] = useState<OverviewData | null>(null);
  const [members, setMembers] = useState<MemberData[]>([]);
  const [transactions, setTransactions] = useState<TransactionData[]>([]);
  const [membersPagination, setMembersPagination] = useState<Pagination>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });
  const [transactionsPagination, setTransactionsPagination] = useState<Pagination>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });
  const [loadingOverview, setLoadingOverview] = useState(true);
  const [loadingMembers, setLoadingMembers] = useState(true);
  const [loadingTransactions, setLoadingTransactions] = useState(true);
  const [tierFilter, setTierFilter] = useState("ALL");
  const [typeFilter, setTypeFilter] = useState("ALL");

  // ─── Data Fetching ─────────────────────────────────────────────────────────

  const fetchOverview = useCallback(async () => {
    setLoadingOverview(true);
    try {
      const res = await fetch("/api/admin/loyalty?section=overview");
      if (!res.ok) throw new Error("Failed to fetch overview");
      const data = await res.json();
      setOverview(data);
    } catch {
      setOverview(null);
    } finally {
      setLoadingOverview(false);
    }
  }, []);

  const fetchMembers = useCallback(
    async (page: number = 1) => {
      setLoadingMembers(true);
      try {
        const params = new URLSearchParams({
          section: "members",
          page: String(page),
          limit: "10",
        });
        if (tierFilter !== "ALL") params.set("tier", tierFilter);
        const res = await fetch(`/api/admin/loyalty?${params.toString()}`);
        if (!res.ok) throw new Error("Failed to fetch members");
        const data = await res.json();
        setMembers(data.members);
        setMembersPagination(data.pagination);
      } catch {
        setMembers([]);
      } finally {
        setLoadingMembers(false);
      }
    },
    [tierFilter],
  );

  const fetchTransactions = useCallback(
    async (page: number = 1) => {
      setLoadingTransactions(true);
      try {
        const params = new URLSearchParams({
          section: "transactions",
          page: String(page),
          limit: "10",
        });
        if (typeFilter !== "ALL") params.set("type", typeFilter);
        const res = await fetch(`/api/admin/loyalty?${params.toString()}`);
        if (!res.ok) throw new Error("Failed to fetch transactions");
        const data = await res.json();
        setTransactions(data.transactions);
        setTransactionsPagination(data.pagination);
      } catch {
        setTransactions([]);
      } finally {
        setLoadingTransactions(false);
      }
    },
    [typeFilter],
  );

  // ─── Effects ───────────────────────────────────────────────────────────────

  useEffect(() => {
    fetchOverview();
  }, [fetchOverview]);

  useEffect(() => {
    if (activeTab === "members") fetchMembers(1);
  }, [activeTab, tierFilter, fetchMembers]);

  useEffect(() => {
    if (activeTab === "transactions") fetchTransactions(1);
  }, [activeTab, typeFilter, fetchTransactions]);

  // ─── Computed ──────────────────────────────────────────────────────────────

  const avgPointsPerMember =
    overview && overview.overview.totalMembers > 0
      ? Math.round(
          overview.overview.totalPointsInCirculation /
            overview.overview.totalMembers,
        )
      : 0;

  // ─── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen space-y-6 p-4 md:p-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="mb-6"
      >
        <h1 className="text-2xl font-bold tracking-tight">Loyalty Program</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Track points, tiers, and member engagement
        </p>
      </motion.div>

      {/* Tabs */}
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <TabsList className="h-10">
            <TabsTrigger value="overview" className="px-4">
              Overview
            </TabsTrigger>
            <TabsTrigger value="members" className="px-4">
              Members
            </TabsTrigger>
            <TabsTrigger value="transactions" className="px-4">
              Transactions
            </TabsTrigger>
          </TabsList>
        </motion.div>

        {/* ─── Overview Tab ──────────────────────────────────────────────── */}
        <AnimatePresence mode="wait">
          {activeTab === "overview" && (
            <TabsContent value="overview" forceMount>
              <motion.div
                key="overview"
                variants={tabContentVariant}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="space-y-6"
              >
                {/* KPI Cards */}
                {loadingOverview ? (
                  <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <KPICardSkeleton key={i} />
                    ))}
                  </div>
                ) : overview ? (
                  <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    <KPICard
                      icon={Users}
                      label="Total Members"
                      value={overview.overview.totalMembers.toLocaleString("en-EG")}
                      index={0}
                    />
                    <KPICard
                      icon={Award}
                      label="Points in Circulation"
                      value={`${overview.overview.totalPointsInCirculation.toLocaleString("en-EG")} pts`}
                      subValue={`≈ ${formatEGP(overview.overview.pointsValueInEGP)}`}
                      index={1}
                    />
                    <KPICard
                      icon={TrendingUp}
                      label="Lifetime Spending"
                      value={formatEGP(overview.overview.totalLifetimeSpent)}
                      subValue={`${overview.overview.totalPointsEarned.toLocaleString("en-EG")} pts earned · ${overview.overview.totalPointsRedeemed.toLocaleString("en-EG")} redeemed`}
                      index={2}
                    />
                    <KPICard
                      icon={BarChart3}
                      label="Avg. Points/Member"
                      value={avgPointsPerMember.toLocaleString("en-EG")}
                      subValue={`≈ ${formatEGP(avgPointsPerMember * 0.5)}`}
                      index={3}
                    />
                  </div>
                ) : null}

                {/* Tier Distribution */}
                <motion.div
                  custom={4}
                  variants={fadeInUp}
                  initial="hidden"
                  animate="visible"
                >
                  <Card>
                    <CardHeader className="pb-4">
                      <CardTitle className="text-base">Tier Distribution</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {loadingOverview ? (
                        <TierBarSkeleton />
                      ) : overview ? (
                        <TierDistributionChart data={overview.tierDistribution} />
                      ) : null}
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Bottom Row: Top Members + Recent Transactions */}
                <div className="grid gap-6 lg:grid-cols-2">
                  {/* Top 5 Members */}
                  <motion.div
                    custom={5}
                    variants={fadeInUp}
                    initial="hidden"
                    animate="visible"
                  >
                    <Card>
                      <CardHeader className="pb-4">
                        <CardTitle className="text-base">
                          Top 5 Members
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        {loadingOverview ? (
                          <TableSkeleton rows={5} cols={5} />
                        ) : overview && overview.topMembers.length > 0 ? (
                          <div className="max-h-96 overflow-y-auto">
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead>Name</TableHead>
                                  <TableHead>Email</TableHead>
                                  <TableHead>Governorate</TableHead>
                                  <TableHead>Tier</TableHead>
                                  <TableHead className="text-right">Points</TableHead>
                                  <TableHead className="text-right">Total Spent</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {overview.topMembers.map((member, idx) => (
                                  <TableRow key={idx}>
                                    <TableCell className="font-medium">
                                      {member.name}
                                    </TableCell>
                                    <TableCell className="text-muted-foreground">
                                      {member.email}
                                    </TableCell>
                                    <TableCell>{member.governorate}</TableCell>
                                    <TableCell>
                                      <TierBadge tier={member.tier} />
                                    </TableCell>
                                    <TableCell className="text-right font-medium">
                                      {member.points.toLocaleString("en-EG")}
                                    </TableCell>
                                    <TableCell className="text-right">
                                      {formatEGP(member.totalSpent)}
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </div>
                        ) : (
                          <p className="py-8 text-center text-sm text-muted-foreground">
                            No member data available
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>

                  {/* Recent 10 Transactions */}
                  <motion.div
                    custom={6}
                    variants={fadeInUp}
                    initial="hidden"
                    animate="visible"
                  >
                    <Card>
                      <CardHeader className="pb-4">
                        <CardTitle className="text-base">
                          Recent Transactions
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        {loadingOverview ? (
                          <TableSkeleton rows={6} cols={5} />
                        ) : overview && overview.recentTransactions.length > 0 ? (
                          <div className="max-h-96 overflow-y-auto">
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead>Type</TableHead>
                                  <TableHead>User</TableHead>
                                  <TableHead className="text-right">Points</TableHead>
                                  <TableHead className="text-right">Balance</TableHead>
                                  <TableHead className="hidden md:table-cell">Description</TableHead>
                                  <TableHead className="text-right">Date</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {overview.recentTransactions.map((tx) => (
                                  <TableRow key={tx.id}>
                                    <TableCell>
                                      <TransactionTypeBadge type={tx.type} />
                                    </TableCell>
                                    <TableCell>
                                      <div>
                                        <p className="text-sm font-medium">
                                          {tx.user.name}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                          {tx.user.email}
                                        </p>
                                      </div>
                                    </TableCell>
                                    <TableCell className="text-right font-medium">
                                      <span
                                        className={cn(
                                          tx.type === "earn" || tx.type === "bonus"
                                            ? "text-green-500"
                                            : tx.type === "redeem"
                                              ? "text-red-500"
                                              : "text-muted-foreground",
                                        )}
                                      >
                                        {tx.type === "earn" || tx.type === "bonus"
                                          ? "+"
                                          : tx.type === "redeem"
                                            ? "-"
                                            : ""}
                                        {tx.points}
                                      </span>
                                    </TableCell>
                                    <TableCell className="text-right text-muted-foreground">
                                      {tx.balance.toLocaleString("en-EG")}
                                    </TableCell>
                                    <TableCell className="hidden max-w-[180px] truncate md:table-cell">
                                      <span className="text-sm text-muted-foreground">
                                        {tx.description}
                                      </span>
                                    </TableCell>
                                    <TableCell className="text-right text-muted-foreground whitespace-nowrap">
                                      {formatDate(tx.createdAt)}
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </div>
                        ) : (
                          <p className="py-8 text-center text-sm text-muted-foreground">
                            No recent transactions
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                </div>
              </motion.div>
            </TabsContent>
          )}

          {/* ─── Members Tab ──────────────────────────────────────────────── */}
          {activeTab === "members" && (
            <TabsContent value="members" forceMount>
              <motion.div
                key="members"
                variants={tabContentVariant}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="space-y-4"
              >
                {/* Filter */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  className="flex items-center gap-3"
                >
                  <Select
                    value={tierFilter}
                    onValueChange={(v) => {
                      setTierFilter(v);
                    }}
                  >
                    <SelectTrigger className="w-[160px]">
                      <SelectValue placeholder="Filter by tier" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ALL">All Tiers</SelectItem>
                      <SelectItem value="BRONZE">Bronze</SelectItem>
                      <SelectItem value="SILVER">Silver</SelectItem>
                      <SelectItem value="GOLD">Gold</SelectItem>
                      <SelectItem value="PLATINUM">Platinum</SelectItem>
                    </SelectContent>
                  </Select>
                  {loadingMembers && (
                    <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                  )}
                </motion.div>

                {/* Table */}
                <Card>
                  <CardContent className="p-0">
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead className="hidden md:table-cell">Phone</TableHead>
                            <TableHead className="hidden sm:table-cell">Governorate</TableHead>
                            <TableHead>Tier</TableHead>
                            <TableHead className="text-right">Points</TableHead>
                            <TableHead className="text-right hidden lg:table-cell">Total Spent</TableHead>
                            <TableHead className="text-right hidden md:table-cell">Orders</TableHead>
                            <TableHead className="text-right hidden xl:table-cell">Txns</TableHead>
                            <TableHead className="text-right hidden lg:table-cell">Joined</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {loadingMembers ? (
                            <TableSkeleton rows={10} cols={10} />
                          ) : members.length > 0 ? (
                            members.map((member) => (
                              <TableRow key={member.id}>
                                <TableCell className="font-medium">
                                  {member.user.name}
                                </TableCell>
                                <TableCell className="text-muted-foreground">
                                  {member.user.email}
                                </TableCell>
                                <TableCell className="hidden md:table-cell text-muted-foreground">
                                  {member.user.phone || "—"}
                                </TableCell>
                                <TableCell className="hidden sm:table-cell">
                                  {member.user.governorate}
                                </TableCell>
                                <TableCell>
                                  <TierBadge tier={member.tier} />
                                </TableCell>
                                <TableCell className="text-right font-medium">
                                  {member.points.toLocaleString("en-EG")}
                                </TableCell>
                                <TableCell className="text-right hidden lg:table-cell">
                                  {formatEGP(member.totalSpent)}
                                </TableCell>
                                <TableCell className="text-right hidden md:table-cell">
                                  {member.user._count.orders}
                                </TableCell>
                                <TableCell className="text-right hidden xl:table-cell text-muted-foreground">
                                  {member.transactionCount}
                                </TableCell>
                                <TableCell className="text-right hidden lg:table-cell text-muted-foreground whitespace-nowrap">
                                  {formatDate(member.createdAt)}
                                </TableCell>
                              </TableRow>
                            ))
                          ) : (
                            <TableRow>
                              <TableCell
                                colSpan={10}
                                className="h-32 text-center text-muted-foreground"
                              >
                                No members found
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>

                {/* Pagination */}
                {!loadingMembers && membersPagination.total > 0 && (
                  <PaginationControls
                    pagination={membersPagination}
                    onPageChange={fetchMembers}
                  />
                )}
              </motion.div>
            </TabsContent>
          )}

          {/* ─── Transactions Tab ─────────────────────────────────────────── */}
          {activeTab === "transactions" && (
            <TabsContent value="transactions" forceMount>
              <motion.div
                key="transactions"
                variants={tabContentVariant}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="space-y-4"
              >
                {/* Filter */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  className="flex items-center gap-3"
                >
                  <Select
                    value={typeFilter}
                    onValueChange={(v) => {
                      setTypeFilter(v);
                    }}
                  >
                    <SelectTrigger className="w-[160px]">
                      <SelectValue placeholder="Filter by type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ALL">All Types</SelectItem>
                      <SelectItem value="earn">Earned</SelectItem>
                      <SelectItem value="redeem">Redeemed</SelectItem>
                      <SelectItem value="bonus">Bonus</SelectItem>
                      <SelectItem value="expire">Expired</SelectItem>
                    </SelectContent>
                  </Select>
                  {loadingTransactions && (
                    <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                  )}
                </motion.div>

                {/* Table */}
                <Card>
                  <CardContent className="p-0">
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Type</TableHead>
                            <TableHead>User</TableHead>
                            <TableHead className="text-right">Points</TableHead>
                            <TableHead className="text-right">Balance</TableHead>
                            <TableHead className="hidden md:table-cell">Description</TableHead>
                            <TableHead className="text-right">Date</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {loadingTransactions ? (
                            <TableSkeleton rows={10} cols={6} />
                          ) : transactions.length > 0 ? (
                            transactions.map((tx) => (
                              <TableRow key={tx.id}>
                                <TableCell>
                                  <TransactionTypeBadge type={tx.type} />
                                </TableCell>
                                <TableCell>
                                  <div>
                                    <p className="text-sm font-medium">
                                      {tx.user.name}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                      {tx.user.email}
                                    </p>
                                  </div>
                                </TableCell>
                                <TableCell className="text-right font-medium">
                                  <span
                                    className={cn(
                                      tx.type === "earn" || tx.type === "bonus"
                                        ? "text-green-500"
                                        : tx.type === "redeem"
                                          ? "text-red-500"
                                          : "text-muted-foreground",
                                    )}
                                  >
                                    {tx.type === "earn" || tx.type === "bonus"
                                      ? "+"
                                      : tx.type === "redeem"
                                        ? "-"
                                        : ""}
                                    {tx.points}
                                  </span>
                                </TableCell>
                                <TableCell className="text-right text-muted-foreground">
                                  {tx.balance.toLocaleString("en-EG")}
                                </TableCell>
                                <TableCell className="hidden max-w-[220px] truncate md:table-cell">
                                  <span className="text-sm text-muted-foreground">
                                    {tx.description}
                                  </span>
                                </TableCell>
                                <TableCell className="text-right text-muted-foreground whitespace-nowrap">
                                  {formatDate(tx.createdAt)}
                                </TableCell>
                              </TableRow>
                            ))
                          ) : (
                            <TableRow>
                              <TableCell
                                colSpan={6}
                                className="h-32 text-center text-muted-foreground"
                              >
                                No transactions found
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>

                {/* Pagination */}
                {!loadingTransactions && transactionsPagination.total > 0 && (
                  <PaginationControls
                    pagination={transactionsPagination}
                    onPageChange={fetchTransactions}
                  />
                )}
              </motion.div>
            </TabsContent>
          )}
        </AnimatePresence>
      </Tabs>
    </div>
  );
}