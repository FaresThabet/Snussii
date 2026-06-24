"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

// ─── Shadcn UI Components ───────────────────────────────────────────────────
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";

// ─── Icons ───────────────────────────────────────────────────────────────────
import {
  Plus,
  Search,
  Tag,
  Percent,
  DollarSign,
  Ticket,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Pencil,
  Trash2,
  Power,
  PowerOff,
  CalendarDays,
  AlertTriangle,
  X,
  MoreHorizontal,
} from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────────────

interface Coupon {
  id: string;
  code: string;
  type: "PERCENTAGE" | "FIXED";
  value: number;
  minOrder: number | null;
  maxDiscount: number | null;
  usageLimit: number | null;
  usageCount: number;
  startsAt: string | null;
  expiresAt: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
  _count: { usages: number };
  redemptionRate: number | null;
  isExpired: boolean;
  isScheduled: boolean;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface KpiStats {
  totalCoupons: number;
  activeCoupons: number;
  totalRedemptions: number;
  avgRedemptionRate: number;
}

interface CouponFormData {
  code: string;
  type: "PERCENTAGE" | "FIXED";
  value: string;
  minOrder: string;
  maxDiscount: string;
  usageLimit: string;
  startsAt: string;
  expiresAt: string;
  isActive: boolean;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatEGP(value: number): string {
  return value.toLocaleString("en-EG") + " EGP";
}

function getTypeBadge(type: string) {
  if (type === "PERCENTAGE")
    return "bg-blue-500/10 text-blue-500 border-blue-500/20";
  return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
}

function getTypeLabel(type: string) {
  return type === "PERCENTAGE" ? "Percentage" : "Fixed";
}

function getStatusBadge(status: string) {
  const map: Record<string, string> = {
    active: "bg-green-500/10 text-green-500 border-green-500/20",
    scheduled: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    expired: "bg-gray-500/10 text-gray-500 border-gray-500/20",
    inactive: "bg-red-500/10 text-red-500 border-red-500/20",
  };
  return map[status] || "";
}

function getStatusLabel(status: string) {
  const map: Record<string, string> = {
    active: "Active",
    scheduled: "Scheduled",
    expired: "Expired",
    inactive: "Inactive",
  };
  return map[status] || status;
}

function getStatusIcon(status: string) {
  switch (status) {
    case "active":
      return <Power className="h-3 w-3" />;
    case "scheduled":
      return <CalendarDays className="h-3 w-3" />;
    case "expired":
      return <X className="h-3 w-3" />;
    case "inactive":
      return <PowerOff className="h-3 w-3" />;
    default:
      return null;
  }
}

function computeStatus(coupon: Coupon): string {
  if (coupon.isActive && !coupon.isExpired && !coupon.isScheduled) return "active";
  if (coupon.isScheduled) return "scheduled";
  if (coupon.isExpired) return "expired";
  return "inactive";
}

function getUsageColor(ratio: number) {
  if (ratio < 0.5) return "bg-green-500";
  if (ratio < 0.8) return "bg-yellow-500";
  return "bg-red-500";
}

function formatDate(date: string | null): string {
  if (!date) return "—";
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

function formatDateShort(date: string | null): string {
  if (!date) return "—";
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
  }).format(new Date(date));
}

function toDatetimeLocal(dateStr: string | null): string {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const hours = String(d.getHours()).padStart(2, "0");
  const minutes = String(d.getMinutes()).padStart(2, "0");
  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

const emptyForm: CouponFormData = {
  code: "",
  type: "PERCENTAGE",
  value: "",
  minOrder: "",
  maxDiscount: "",
  usageLimit: "",
  startsAt: "",
  expiresAt: "",
  isActive: true,
};

// ─── Animation Variants ──────────────────────────────────────────────────────

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.04, duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.1 },
  },
};

const staggerItem = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

// ─── KPI Card ─────────────────────────────────────────────────────────────────

function KpiCard({
  title,
  value,
  icon,
  colorClass,
  delay,
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
  colorClass: string;
  delay: number;
}) {
  return (
    <motion.div custom={delay} variants={fadeInUp} initial="hidden" animate="visible">
      <Card className="relative overflow-hidden border-border/40 bg-card/60 backdrop-blur-sm">
        <CardContent className="p-5">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                {title}
              </p>
              <p className="text-2xl font-bold tracking-tight">{value}</p>
            </div>
            <div
              className={cn(
                "flex h-11 w-11 items-center justify-center rounded-xl border",
                colorClass
              )}
            >
              {icon}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// ─── Usage Bar ───────────────────────────────────────────────────────────────

function UsageBar({ count, limit }: { count: number; limit: number | null }) {
  const ratio = limit ? Math.min(count / limit, 1) : 0;

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>{count} used</span>
        <span>{limit ?? "∞"}</span>
      </div>
      <div className="h-1.5 w-full rounded-full bg-muted/60">
        <motion.div
          className={cn("h-full rounded-full", limit ? getUsageColor(ratio) : "bg-muted-foreground/40")}
          initial={{ width: 0 }}
          animate={{ width: limit ? `${ratio * 100}%` : "0%" }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
        />
      </div>
    </div>
  );
}

// ─── Main Component ─────────────────────────────────────────────────────────

export default function AdminCouponsPage() {
  // ── State ───────────────────────────────────────────────────────────────────
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [stats, setStats] = useState<KpiStats>({
    totalCoupons: 0,
    activeCoupons: 0,
    totalRedemptions: 0,
    avgRedemptionRate: 0,
  });
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  // Dialogs
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingCoupon, setDeletingCoupon] = useState<Coupon | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Form
  const [formData, setFormData] = useState<CouponFormData>(emptyForm);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const searchInputRef = useRef<HTMLInputElement>(null);

  // ── Debounced search ───────────────────────────────────────────────────────
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  // ── Build API params ───────────────────────────────────────────────────────
  const buildParams = useCallback(
    (page: number, limit: number, includeExpired = true) => {
      const params = new URLSearchParams();
      params.set("page", page.toString());
      params.set("limit", limit.toString());
      if (debouncedSearch) params.set("search", debouncedSearch);
      if (typeFilter !== "all") params.set("type", typeFilter);
      if (statusFilter === "active") params.set("active", "true");
      if (statusFilter === "inactive") params.set("active", "false");
      params.set("includeExpired", includeExpired.toString());
      params.set("sort", "createdAt");
      params.set("order", "desc");
      return params;
    },
    [debouncedSearch, typeFilter, statusFilter]
  );

  // ── Fetch KPI stats (all coupons) ───────────────────────────────────────────
  const fetchStats = useCallback(async () => {
    setStatsLoading(true);
    try {
      const params = buildParams(1, 9999, true);
      const res = await fetch(`/api/admin/coupons?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch stats");
      const data = await res.json();
      const allCoupons: Coupon[] = data.coupons || [];

      const totalCoupons = allCoupons.length;
      const activeCoupons = allCoupons.filter(
        (c) => computeStatus(c) === "active"
      ).length;
      const totalRedemptions = allCoupons.reduce(
        (sum, c) => sum + c.usageCount,
        0
      );
      const rates = allCoupons
        .filter((c) => c.redemptionRate !== null)
        .map((c) => c.redemptionRate as number);
      const avgRedemptionRate =
        rates.length > 0
          ? Math.round((rates.reduce((a, b) => a + b, 0) / rates.length) * 10) / 10
          : 0;

      setStats({
        totalCoupons,
        activeCoupons,
        totalRedemptions,
        avgRedemptionRate,
      });
    } catch {
      // Silent fail for stats
    } finally {
      setStatsLoading(false);
    }
  }, [buildParams]);

  // ── Fetch coupons (paginated) ─────────────────────────────────────────────
  const fetchCoupons = useCallback(async () => {
    setLoading(true);
    try {
      const params = buildParams(pagination.page, pagination.limit);
      const res = await fetch(`/api/admin/coupons?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch coupons");
      const data = await res.json();
      setCoupons(data.coupons || []);
      setPagination(data.pagination || { page: 1, limit: 10, total: 0, totalPages: 0 });
    } catch {
      toast.error("Failed to load coupons");
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.limit, buildParams]);

  useEffect(() => {
    fetchCoupons();
  }, [fetchCoupons]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  // ── Reset page on filter change ────────────────────────────────────────────
  useEffect(() => {
    setPagination((prev) => ({ ...prev, page: 1 }));
  }, [debouncedSearch, typeFilter, statusFilter]);

  // ── Pagination ──────────────────────────────────────────────────────────────
  const goToPage = (page: number) => {
    if (page < 1 || page > pagination.totalPages) return;
    setPagination((prev) => ({ ...prev, page }));
  };

  const pageNumbers: number[] = [];
  const maxVisiblePages = 5;
  let startPage = Math.max(1, pagination.page - Math.floor(maxVisiblePages / 2));
  const endPage = Math.min(
    pagination.totalPages,
    startPage + maxVisiblePages - 1
  );
  if (endPage - startPage + 1 < maxVisiblePages) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1);
  }
  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  // ── Client-side status filter ──────────────────────────────────────────────
  const filteredCoupons = coupons.filter((coupon) => {
    if (statusFilter === "expired") return computeStatus(coupon) === "expired";
    if (statusFilter === "active") return computeStatus(coupon) === "active";
    if (statusFilter === "inactive") return computeStatus(coupon) === "inactive";
    return true;
  });

  // ── Open create dialog ───────────────────────────────────────────────────────
  const openCreateDialog = () => {
    setEditingCoupon(null);
    setFormData(emptyForm);
    setFormErrors({});
    setIsDialogOpen(true);
  };

  // ── Open edit dialog ────────────────────────────────────────────────────────
  const openEditDialog = (coupon: Coupon) => {
    setEditingCoupon(coupon);
    setFormData({
      code: coupon.code,
      type: coupon.type,
      value: coupon.value.toString(),
      minOrder: coupon.minOrder ? coupon.minOrder.toString() : "",
      maxDiscount: coupon.maxDiscount ? coupon.maxDiscount.toString() : "",
      usageLimit: coupon.usageLimit ? coupon.usageLimit.toString() : "",
      startsAt: toDatetimeLocal(coupon.startsAt),
      expiresAt: toDatetimeLocal(coupon.expiresAt),
      isActive: coupon.isActive,
    });
    setFormErrors({});
    setIsDialogOpen(true);
  };

  // ── Validate form ───────────────────────────────────────────────────────────
  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.code.trim()) {
      errors.code = "Coupon code is required";
    } else if (formData.code.trim().length < 3) {
      errors.code = "Code must be at least 3 characters";
    }

    const val = parseFloat(formData.value);
    if (!formData.value || isNaN(val)) {
      errors.value = "Value is required";
    } else if (formData.type === "PERCENTAGE" && (val < 1 || val > 100)) {
      errors.value = "Must be between 1 and 100";
    } else if (formData.type === "FIXED" && val <= 0) {
      errors.value = "Must be greater than 0";
    }

    if (formData.minOrder) {
      const min = parseFloat(formData.minOrder);
      if (isNaN(min) || min < 0) errors.minOrder = "Invalid amount";
    }

    if (formData.type === "PERCENTAGE" && formData.maxDiscount) {
      const max = parseFloat(formData.maxDiscount);
      if (isNaN(max) || max < 0) errors.maxDiscount = "Invalid amount";
    }

    if (formData.usageLimit) {
      const lim = parseInt(formData.usageLimit, 10);
      if (isNaN(lim) || lim < 1) errors.usageLimit = "Must be at least 1";
    }

    if (formData.startsAt && formData.expiresAt) {
      if (new Date(formData.startsAt) >= new Date(formData.expiresAt)) {
        errors.expiresAt = "Must be after start date";
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // ── Submit form ─────────────────────────────────────────────────────────────
  const handleSubmit = async () => {
    if (!validateForm()) return;
    setIsSubmitting(true);

    try {
      const payload: Record<string, unknown> = {
        code: formData.code.toUpperCase().trim(),
        type: formData.type,
        value: parseFloat(formData.value),
        minOrder: formData.minOrder ? parseFloat(formData.minOrder) : undefined,
        maxDiscount:
          formData.type === "PERCENTAGE" && formData.maxDiscount
            ? parseFloat(formData.maxDiscount)
            : undefined,
        usageLimit: formData.usageLimit
          ? parseInt(formData.usageLimit, 10)
          : undefined,
        startsAt: formData.startsAt || undefined,
        expiresAt: formData.expiresAt || undefined,
      };

      const url = editingCoupon
        ? `/api/admin/coupons/${editingCoupon.id}`
        : "/api/admin/coupons";
      const method = editingCoupon ? "PUT" : "POST";

      if (editingCoupon) {
        payload.isActive = formData.isActive;
      }

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || `Failed to ${editingCoupon ? "update" : "create"} coupon`);
      }

      toast.success(
        editingCoupon
          ? `Coupon "${payload.code}" updated successfully`
          : `Coupon "${payload.code}" created successfully`
      );
      setIsDialogOpen(false);
      fetchCoupons();
      fetchStats();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── Toggle active ──────────────────────────────────────────────────────────
  const handleToggleActive = async (coupon: Coupon) => {
    try {
      const res = await fetch(`/api/admin/coupons/${coupon.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !coupon.isActive }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Failed to update coupon");
      }
      toast.success(
        `Coupon "${coupon.code}" ${!coupon.isActive ? "activated" : "deactivated"}`
      );
      fetchCoupons();
      fetchStats();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to toggle coupon");
    }
  };

  // ── Delete coupon ───────────────────────────────────────────────────────────
  const openDeleteDialog = (coupon: Coupon) => {
    setDeletingCoupon(coupon);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!deletingCoupon) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/admin/coupons/${deletingCoupon.id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Failed to delete coupon");
      }
      toast.success(`Coupon "${deletingCoupon.code}" deleted`);
      setDeleteDialogOpen(false);
      setDeletingCoupon(null);
      fetchCoupons();
      fetchStats();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete coupon");
    } finally {
      setIsDeleting(false);
    }
  };

  // ── Clear all filters ──────────────────────────────────────────────────────
  const clearFilters = () => {
    setSearch("");
    setDebouncedSearch("");
    setTypeFilter("all");
    setStatusFilter("all");
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const hasActiveFilters = debouncedSearch || typeFilter !== "all" || statusFilter !== "all";

  // ─── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="bg-muted/20 min-h-screen">
      <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8 max-w-[1400px] mx-auto">
        {/* ─── Page Header ─────────────────────────────────────────────── */}
        <motion.div
          custom={0}
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          className="flex items-center justify-between mb-6"
        >
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Coupons</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Manage promotional coupon codes
            </p>
          </div>
          <Button onClick={openCreateDialog}>
            <Plus className="h-4 w-4 mr-2" />
            Create Coupon
          </Button>
        </motion.div>

        {/* ─── KPI Cards ────────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {statsLoading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <Card key={i} className="border-border/40 bg-card/60">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      <Skeleton className="h-3 w-24" />
                      <Skeleton className="h-8 w-16" />
                    </div>
                    <Skeleton className="h-11 w-11 rounded-xl" />
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <>
              <KpiCard
                title="Total Coupons"
                value={stats.totalCoupons.toLocaleString()}
                icon={<Tag className="h-5 w-5 text-blue-500" />}
                colorClass="bg-blue-500/10 text-blue-500 border-blue-500/20"
                delay={0}
              />
              <KpiCard
                title="Active Coupons"
                value={stats.activeCoupons.toLocaleString()}
                icon={<Ticket className="h-5 w-5 text-green-500" />}
                colorClass="bg-green-500/10 text-green-500 border-green-500/20"
                delay={1}
              />
              <KpiCard
                title="Total Redemptions"
                value={stats.totalRedemptions.toLocaleString()}
                icon={<Percent className="h-5 w-5 text-purple-500" />}
                colorClass="bg-purple-500/10 text-purple-500 border-purple-500/20"
                delay={2}
              />
              <KpiCard
                title="Avg. Redemption Rate"
                value={`${stats.avgRedemptionRate}%`}
                icon={<TrendingUp className="h-5 w-5 text-amber-500" />}
                colorClass="bg-amber-500/10 text-amber-500 border-amber-500/20"
                delay={3}
              />
            </>
          )}
        </div>

        {/* ─── Filters Bar ─────────────────────────────────────────────── */}
        <motion.div
          custom={4}
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
        >
          <Card className="border-border/40 bg-card/60 backdrop-blur-sm mb-6">
            <CardContent className="p-4">
              <div className="flex flex-col lg:flex-row items-start lg:items-center gap-3">
                {/* Search */}
                <div className="relative flex-1 w-full lg:max-w-xs">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    ref={searchInputRef}
                    placeholder="Search by code..."
                    value={search}
                    onChange={(e) => {
                      setSearch(e.target.value.toUpperCase());
                    }}
                    className="pl-9 h-9 bg-background/50"
                  />
                  {search && (
                    <button
                      onClick={() => setSearch("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>

                {/* Type Filter */}
                <Select
                  value={typeFilter}
                  onValueChange={setTypeFilter}
                >
                  <SelectTrigger className="w-full lg:w-[150px] h-9 bg-background/50">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="PERCENTAGE">Percentage</SelectItem>
                    <SelectItem value="FIXED">Fixed</SelectItem>
                  </SelectContent>
                </Select>

                {/* Status Filter */}
                <Select
                  value={statusFilter}
                  onValueChange={setStatusFilter}
                >
                  <SelectTrigger className="w-full lg:w-[150px] h-9 bg-background/50">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="expired">Expired</SelectItem>
                  </SelectContent>
                </Select>

                {/* Clear Filters */}
                {hasActiveFilters && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearFilters}
                    className="h-9 text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-4 w-4 mr-1.5" />
                    Clear
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* ─── Coupons Table ───────────────────────────────────────────── */}
        <motion.div
          custom={5}
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
        >
          <Card className="border-border/40 bg-card/60 backdrop-blur-sm overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-border/40 hover:bg-transparent">
                    <TableHead className="w-[160px]">Code</TableHead>
                    <TableHead className="w-[110px]">Type</TableHead>
                    <TableHead className="w-[100px]">Value</TableHead>
                    <TableHead className="w-[110px]">Min Order</TableHead>
                    <TableHead className="w-[180px]">Usage</TableHead>
                    <TableHead className="w-[110px]">Redemption</TableHead>
                    <TableHead className="w-[100px]">Status</TableHead>
                    <TableHead className="w-[220px]">Valid Period</TableHead>
                    <TableHead className="w-[120px] text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    Array.from({ length: 5 }).map((_, i) => (
                      <TableRow key={i} className="border-border/40">
                        <TableCell>
                          <Skeleton className="h-5 w-24 rounded" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-6 w-20 rounded-full" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-5 w-14 rounded" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-5 w-16 rounded" />
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <Skeleton className="h-3 w-24 rounded" />
                            <Skeleton className="h-1.5 w-full rounded-full" />
                          </div>
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-5 w-12 rounded" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-6 w-16 rounded-full" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-5 w-36 rounded" />
                        </TableCell>
                        <TableCell className="text-right">
                          <Skeleton className="h-8 w-20 rounded ml-auto" />
                        </TableCell>
                      </TableRow>
                    ))
                  ) : filteredCoupons.length === 0 ? (
                    <TableRow className="border-border/40">
                      <TableCell colSpan={9} className="h-48 text-center">
                        <div className="flex flex-col items-center gap-2 text-muted-foreground">
                          <Ticket className="h-10 w-10 opacity-30" />
                          <p className="text-sm font-medium">No coupons found</p>
                          <p className="text-xs">
                            {hasActiveFilters
                              ? "Try adjusting your filters"
                              : "Create your first coupon to get started"}
                          </p>
                          {!hasActiveFilters && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={openCreateDialog}
                              className="mt-2"
                            >
                              <Plus className="h-3.5 w-3.5 mr-1.5" />
                              Create Coupon
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    <AnimatePresence mode="popLayout">
                      {filteredCoupons.map((coupon, index) => {
                        const status = computeStatus(coupon);
                        return (
                          <motion.tr
                            key={coupon.id}
                            initial={{ opacity: 0, x: -8 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 8 }}
                            transition={{ duration: 0.25, delay: index * 0.03 }}
                            className="border-border/40 hover:bg-muted/30 transition-colors"
                          >
                            <TableCell>
                              <span className="font-mono font-semibold text-sm tracking-wide uppercase">
                                {coupon.code}
                              </span>
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant="outline"
                                className={cn(
                                  "text-[11px] font-medium px-2 py-0.5",
                                  getTypeBadge(coupon.type)
                                )}
                              >
                                {getTypeLabel(coupon.type)}
                              </Badge>
                            </TableCell>
                            <TableCell className="font-medium text-sm">
                              {coupon.type === "PERCENTAGE"
                                ? `${coupon.value}%`
                                : formatEGP(coupon.value)}
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground">
                              {coupon.minOrder ? formatEGP(coupon.minOrder) : "—"}
                            </TableCell>
                            <TableCell>
                              <UsageBar
                                count={coupon.usageCount}
                                limit={coupon.usageLimit}
                              />
                            </TableCell>
                            <TableCell className="text-sm">
                              {coupon.redemptionRate !== null ? (
                                <span
                                  className={cn(
                                    coupon.redemptionRate >= 70
                                      ? "text-green-500"
                                      : coupon.redemptionRate >= 40
                                        ? "text-yellow-500"
                                        : "text-muted-foreground"
                                  )}
                                >
                                  {coupon.redemptionRate}%
                                </span>
                              ) : (
                                <span className="text-muted-foreground text-xs">
                                  N/A
                                </span>
                              )}
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant="outline"
                                className={cn(
                                  "text-[11px] font-medium px-2 py-0.5 gap-1",
                                  getStatusBadge(status)
                                )}
                              >
                                {getStatusIcon(status)}
                                {getStatusLabel(status)}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="text-xs text-muted-foreground space-y-0.5">
                                <div className="flex items-center gap-1">
                                  <span className="text-[10px]">From:</span>
                                  <span>
                                    {formatDateShort(coupon.startsAt)}
                                  </span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <span className="text-[10px]">To:</span>
                                  <span>
                                    {formatDateShort(coupon.expiresAt)}
                                  </span>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end gap-1">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={() => openEditDialog(coupon)}
                                  title="Edit coupon"
                                >
                                  <Pencil className="h-3.5 w-3.5" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className={cn(
                                    "h-8 w-8",
                                    coupon.isActive
                                      ? "text-amber-500 hover:text-amber-400 hover:bg-amber-500/10"
                                      : "text-green-500 hover:text-green-400 hover:bg-green-500/10"
                                  )}
                                  onClick={() => handleToggleActive(coupon)}
                                  title={
                                    coupon.isActive
                                      ? "Deactivate coupon"
                                      : "Activate coupon"
                                  }
                                >
                                  {coupon.isActive ? (
                                    <PowerOff className="h-3.5 w-3.5" />
                                  ) : (
                                    <Power className="h-3.5 w-3.5" />
                                  )}
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-red-500 hover:text-red-400 hover:bg-red-500/10"
                                  onClick={() => openDeleteDialog(coupon)}
                                  title="Delete coupon"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </Button>
                              </div>
                            </TableCell>
                          </motion.tr>
                        );
                      })}
                    </AnimatePresence>
                  )}
                </TableBody>
              </Table>
            </div>

            {/* ─── Pagination ──────────────────────────────────────────── */}
            {pagination.totalPages > 1 && (
              <div className="flex items-center justify-between px-4 py-3 border-t border-border/40">
                <p className="text-xs text-muted-foreground">
                  Showing{" "}
                  <span className="font-medium text-foreground">
                    {(pagination.page - 1) * pagination.limit + 1}
                  </span>{" "}
                  to{" "}
                  <span className="font-medium text-foreground">
                    {Math.min(
                      pagination.page * pagination.limit,
                      pagination.total
                    )}
                  </span>{" "}
                  of{" "}
                  <span className="font-medium text-foreground">
                    {pagination.total}
                  </span>{" "}
                  coupons
                </p>
                <div className="flex items-center gap-1">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    disabled={pagination.page <= 1}
                    onClick={() => goToPage(pagination.page - 1)}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  {startPage > 1 && (
                    <>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => goToPage(1)}
                      >
                        1
                      </Button>
                      {startPage > 2 && (
                        <span className="px-1 text-muted-foreground text-xs">
                          ...
                        </span>
                      )}
                    </>
                  )}
                  {pageNumbers.map((num) => (
                    <Button
                      key={num}
                      variant={num === pagination.page ? "default" : "ghost"}
                      size="icon"
                      className={cn(
                        "h-8 w-8 text-xs",
                        num === pagination.page &&
                          "pointer-events-none"
                      )}
                      onClick={() => goToPage(num)}
                    >
                      {num}
                    </Button>
                  ))}
                  {endPage < pagination.totalPages && (
                    <>
                      {endPage < pagination.totalPages - 1 && (
                        <span className="px-1 text-muted-foreground text-xs">
                          ...
                        </span>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => goToPage(pagination.totalPages)}
                      >
                        {pagination.totalPages}
                      </Button>
                    </>
                  )}
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    disabled={pagination.page >= pagination.totalPages}
                    onClick={() => goToPage(pagination.page + 1)}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </Card>
        </motion.div>
      </div>

      {/* ─── Create / Edit Dialog ─────────────────────────────────────── */}
      <Dialog
        open={isDialogOpen}
        onOpenChange={(open) => {
          if (!open && !isSubmitting) setIsDialogOpen(false);
        }}
      >
        <DialogContent className="sm:max-w-[520px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingCoupon ? "Edit Coupon" : "Create Coupon"}
            </DialogTitle>
            <DialogDescription>
              {editingCoupon
                ? "Update coupon details and settings"
                : "Configure a new promotional coupon code"}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-5 py-2">
            {/* Code */}
            <div className="space-y-2">
              <Label htmlFor="coupon-code">
                Coupon Code <span className="text-red-500">*</span>
              </Label>
              <Input
                id="coupon-code"
                placeholder="SUMMER2026"
                value={formData.code}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    code: e.target.value.toUpperCase(),
                  }))
                }
                className={cn(
                  "font-mono tracking-wider uppercase",
                  formErrors.code && "border-red-500/60"
                )}
                disabled={isSubmitting}
              />
              {formErrors.code && (
                <p className="text-xs text-red-500">{formErrors.code}</p>
              )}
            </div>

            {/* Type + Value row */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="coupon-type">
                  Type <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.type}
                  onValueChange={(val: "PERCENTAGE" | "FIXED") =>
                    setFormData((prev) => ({
                      ...prev,
                      type: val,
                      maxDiscount: "",
                    }))
                  }
                  disabled={isSubmitting}
                >
                  <SelectTrigger id="coupon-type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PERCENTAGE">Percentage (%)</SelectItem>
                    <SelectItem value="FIXED">Fixed (EGP)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="coupon-value">
                  Value{" "}
                  <span className="text-xs text-muted-foreground font-normal">
                    {formData.type === "PERCENTAGE" ? "(%)" : "(EGP)"}
                  </span>
                  <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Input
                    id="coupon-value"
                    type="number"
                    placeholder={
                      formData.type === "PERCENTAGE" ? "15" : "500"
                    }
                    value={formData.value}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        value: e.target.value,
                      }))
                    }
                    className={cn(
                      formErrors.value && "border-red-500/60"
                    )}
                    disabled={isSubmitting}
                    min={formData.type === "PERCENTAGE" ? 1 : 0.01}
                    max={formData.type === "PERCENTAGE" ? 100 : undefined}
                    step={formData.type === "PERCENTAGE" ? 1 : 0.01}
                  />
                </div>
                {formErrors.value && (
                  <p className="text-xs text-red-500">{formErrors.value}</p>
                )}
              </div>
            </div>

            {/* Min Order */}
            <div className="space-y-2">
              <Label htmlFor="coupon-minorder">
                Min Order{" "}
                <span className="text-xs text-muted-foreground font-normal">
                  (EGP, optional)
                </span>
              </Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="coupon-minorder"
                  type="number"
                  placeholder="500"
                  value={formData.minOrder}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      minOrder: e.target.value,
                    }))
                  }
                  className={cn(
                    "pl-9",
                    formErrors.minOrder && "border-red-500/60"
                  )}
                  disabled={isSubmitting}
                  min={0}
                  step={0.01}
                />
              </div>
              {formErrors.minOrder && (
                <p className="text-xs text-red-500">{formErrors.minOrder}</p>
              )}
            </div>

            {/* Max Discount (percentage only) */}
            {formData.type === "PERCENTAGE" && (
              <div className="space-y-2">
                <Label htmlFor="coupon-maxdiscount">
                  Max Discount{" "}
                  <span className="text-xs text-muted-foreground font-normal">
                    (EGP, optional)
                  </span>
                </Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="coupon-maxdiscount"
                    type="number"
                    placeholder="2000"
                    value={formData.maxDiscount}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        maxDiscount: e.target.value,
                      }))
                    }
                    className={cn(
                      "pl-9",
                      formErrors.maxDiscount && "border-red-500/60"
                    )}
                    disabled={isSubmitting}
                    min={0}
                    step={0.01}
                  />
                </div>
                {formErrors.maxDiscount && (
                  <p className="text-xs text-red-500">
                    {formErrors.maxDiscount}
                  </p>
                )}
              </div>
            )}

            {/* Usage Limit */}
            <div className="space-y-2">
              <Label htmlFor="coupon-usagelimit">
                Usage Limit{" "}
                <span className="text-xs text-muted-foreground font-normal">
                  (optional, blank = unlimited)
                </span>
              </Label>
              <Input
                id="coupon-usagelimit"
                type="number"
                placeholder="100"
                value={formData.usageLimit}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    usageLimit: e.target.value,
                  }))
                }
                className={cn(
                  formErrors.usageLimit && "border-red-500/60"
                )}
                disabled={isSubmitting}
                min={1}
              />
              {formErrors.usageLimit && (
                <p className="text-xs text-red-500">{formErrors.usageLimit}</p>
              )}
            </div>

            {/* Date Range */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="coupon-starts">
                  Starts At{" "}
                  <span className="text-xs text-muted-foreground font-normal">
                    (optional)
                  </span>
                </Label>
                <Input
                  id="coupon-starts"
                  type="datetime-local"
                  value={formData.startsAt}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      startsAt: e.target.value,
                    }))
                  }
                  className="text-sm"
                  disabled={isSubmitting}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="coupon-expires">
                  Expires At{" "}
                  <span className="text-xs text-muted-foreground font-normal">
                    (optional)
                  </span>
                </Label>
                <Input
                  id="coupon-expires"
                  type="datetime-local"
                  value={formData.expiresAt}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      expiresAt: e.target.value,
                    }))
                  }
                  className={cn(
                    "text-sm",
                    formErrors.expiresAt && "border-red-500/60"
                  )}
                  disabled={isSubmitting}
                />
                {formErrors.expiresAt && (
                  <p className="text-xs text-red-500">
                    {formErrors.expiresAt}
                  </p>
                )}
              </div>
            </div>

            {/* Active Toggle (edit only) */}
            {editingCoupon && (
              <div className="flex items-center justify-between rounded-lg border border-border/40 p-3 bg-muted/20">
                <div className="space-y-0.5">
                  <Label className="text-sm font-medium">Active</Label>
                  <p className="text-xs text-muted-foreground">
                    Inactive coupons cannot be used by customers
                  </p>
                </div>
                <Switch
                  checked={formData.isActive}
                  onCheckedChange={(checked) =>
                    setFormData((prev) => ({
                      ...prev,
                      isActive: checked,
                    }))
                  }
                  disabled={isSubmitting}
                />
              </div>
            )}
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  {editingCoupon ? "Updating..." : "Creating..."}
                </>
              ) : editingCoupon ? (
                "Update Coupon"
              ) : (
                "Create Coupon"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ─── Delete Confirmation ──────────────────────────────────────── */}
      <AlertDialog
        open={deleteDialogOpen}
        onOpenChange={(open) => {
          if (!open && !isDeleting) {
            setDeleteDialogOpen(false);
            setDeletingCoupon(null);
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              Delete Coupon
            </AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="space-y-3">
                <p>
                  Are you sure you want to delete the coupon{" "}
                  <span className="font-mono font-semibold">
                    {deletingCoupon?.code}
                  </span>
                  ? This action cannot be undone.
                </p>
                {deletingCoupon && deletingCoupon.usageCount > 0 && (
                  <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-3">
                    <p className="text-sm text-red-400 font-medium flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4" />
                      Warning: This coupon has been used{" "}
                      {deletingCoupon.usageCount} time
                      {deletingCoupon.usageCount !== 1 ? "s" : ""} and cannot be
                      deleted. Deactivate it instead.
                    </p>
                  </div>
                )}
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting || (deletingCoupon ? deletingCoupon.usageCount > 0 : false)}
              className="bg-red-600 hover:bg-red-700 text-white focus:ring-red-600"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete Coupon"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
