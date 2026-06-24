"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

// ─── Shadcn UI Components ───────────────────────────────────────────────────
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";

// ─── Icons ───────────────────────────────────────────────────────────────────
import {
  Search,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Filter,
  X,
  User,
  Users,
  UserCog,
  Phone,
  Mail,
  MapPin,
  CalendarDays,
  Star,
  Shield,
  Eye,
  MoreHorizontal,
  Loader2,
  Pencil,
  Ban,
  CheckCircle2,
  XCircle,
  Crown,
  Gem,
  Award,
  TrendingUp,
  Package,
  MessageSquare,
  Copy,
  ShieldCheck,
  ShieldAlert,
} from "lucide-react";

// ─── Constants ───────────────────────────────────────────────────────────────

const GOVERNORATES = [
  "Cairo",
  "Alexandria",
  "Giza",
  "Sharqia",
  "Dakahlia",
  "Beheira",
  "Qalyubia",
  "Menoufia",
  "Gharbia",
  "Kafr El Sheikh",
  "Dumyat",
  "Ismailia",
  "Port Said",
  "Suez",
  "North Sinai",
  "South Sinai",
  "Faiyum",
  "Beni Suef",
  "Minya",
  "Asyut",
  "Sohag",
  "Qena",
  "Luxor",
  "Aswan",
  "Red Sea",
  "New Valley",
  "Matrouh",
];

const CUSTOMER_ROLES = ["CONSUMER", "CORPORATE", "SALES_REP"];

const ALL_PERMISSIONS = [
  "VIEW_DASHBOARD",
  "MANAGE_USERS",
  "MANAGE_PRODUCTS",
  "MANAGE_ORDERS",
  "MANAGE_CONTENT",
  "MANAGE_MARKETING",
  "VIEW_REPORTS",
  "MANAGE_SETTINGS",
  "EXPORT_DATA",
  "MANAGE_PROMOTIONS",
];

const PERMISSION_LABELS: Record<string, string> = {
  VIEW_DASHBOARD: "Dashboard",
  MANAGE_USERS: "Users",
  MANAGE_PRODUCTS: "Products",
  MANAGE_ORDERS: "Orders",
  MANAGE_CONTENT: "Content",
  MANAGE_MARKETING: "Marketing",
  VIEW_REPORTS: "Reports",
  MANAGE_SETTINGS: "Settings",
  EXPORT_DATA: "Export",
  MANAGE_PROMOTIONS: "Promotions",
};

// ─── Helper Functions ────────────────────────────────────────────────────────

function formatEGP(value: number) {
  return value.toLocaleString("en-EG") + " EGP";
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
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

function getTierIcon(tier: string) {
  switch (tier) {
    case "BRONZE":
      return <Award className="h-3 w-3" />;
    case "SILVER":
      return <Shield className="h-3 w-3" />;
    case "GOLD":
      return <Crown className="h-3 w-3" />;
    case "PLATINUM":
      return <Gem className="h-3 w-3" />;
    default:
      return null;
  }
}

function getRoleBadge(role: string) {
  const map: Record<string, { label: string; color: string }> = {
    CONSUMER: {
      label: "Consumer",
      color: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    },
    CORPORATE: {
      label: "Corporate",
      color: "bg-purple-500/10 text-purple-500 border-purple-500/20",
    },
    SALES_REP: {
      label: "Sales Rep",
      color: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    },
    DISTRIBUTOR_ADMIN: {
      label: "Dist. Admin",
      color: "bg-amber-500/10 text-amber-500 border-amber-500/20",
    },
    DISTRIBUTOR_STAFF: {
      label: "Dist. Staff",
      color: "bg-amber-500/10 text-amber-400 border-amber-400/20",
    },
  };
  return map[role] || { label: role, color: "bg-gray-500/10 text-gray-500" };
}

function formatPermissions(permissions: string[] | null) {
  if (!permissions || permissions.length === 0) return [];
  return permissions.map((p) => PERMISSION_LABELS[p] || p);
}

// ─── Types ───────────────────────────────────────────────────────────────────

interface LoyaltyProfile {
  points: number;
  tier: string;
  totalSpent: number;
}

interface Customer {
  id: string;
  email: string;
  name: string | null;
  phone: string | null;
  role: string;
  isActive: boolean;
  governorate: string | null;
  city: string | null;
  createdAt: string;
  _count: {
    orders: number;
    reviews: number;
  };
  loyaltyProfile: LoyaltyProfile | null;
}

interface Distributor {
  id: string;
  email: string;
  name: string | null;
  phone: string | null;
  role: string;
  permissions: string[] | null;
  isActive: boolean;
  governorate: string | null;
  city: string | null;
  createdAt: string;
  _count: {
    orders: number;
  };
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

// ─── Animation Variants ──────────────────────────────────────────────────────

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.03,
      duration: 0.4,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  }),
};

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, transition: { duration: 0.15 } },
};

const dialogVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 10 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] },
  },
  exit: {
    opacity: 0,
    scale: 0.97,
    y: 5,
    transition: { duration: 0.15 },
  },
};

// ─── Skeleton Loader ─────────────────────────────────────────────────────────

function TableSkeleton({ columns = 8 }: { columns?: number }) {
  return (
    <div className="space-y-3 p-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="flex items-center gap-4">
          {Array.from({ length: columns }).map((_, j) => (
            <Skeleton
              key={j}
              className="h-5 flex-1"
              style={{ maxWidth: j === 0 ? "140px" : "100px" }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function AdminCustomersPage() {
  // ── Tab state ──────────────────────────────────────────────────────────────
  const [activeTab, setActiveTab] = useState<string>("customers");

  // ── Customers state ────────────────────────────────────────────────────────
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [customerPagination, setCustomerPagination] = useState<Pagination>({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  });
  const [customersLoading, setCustomersLoading] = useState(true);

  // ── Distributors state ─────────────────────────────────────────────────────
  const [distributors, setDistributors] = useState<Distributor[]>([]);
  const [distributorPagination, setDistributorPagination] = useState<Pagination>(
    { page: 1, limit: 20, total: 0, totalPages: 0 }
  );
  const [distributorsLoading, setDistributorsLoading] = useState(true);

  // ── Shared filter state ────────────────────────────────────────────────────
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [governorateFilter, setGovernorateFilter] = useState("ALL");
  const [showFilters, setShowFilters] = useState(false);

  // ── Detail dialog ──────────────────────────────────────────────────────────
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null
  );
  const [selectedDistributor, setSelectedDistributor] =
    useState<Distributor | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  // ── Edit dialog ────────────────────────────────────────────────────────────
  const [editOpen, setEditOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [editRole, setEditRole] = useState<string>("");
  const [editPermissions, setEditPermissions] = useState<string[]>([]);
  const [editSaving, setEditSaving] = useState(false);

  // ── Suspend/Activate alert ─────────────────────────────────────────────────
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState<{
    id: string;
    name: string | null;
    action: "activate" | "suspend";
  } | null>(null);
  const [confirmLoading, setConfirmLoading] = useState(false);

  // ── Ref for filter container ───────────────────────────────────────────────
  const searchInputRef = useRef<HTMLInputElement>(null);

  // ── Debounced search ───────────────────────────────────────────────────────
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  // ── Fetch customers ────────────────────────────────────────────────────────
  const fetchCustomers = useCallback(async () => {
    setCustomersLoading(true);
    try {
      const params = new URLSearchParams();
      params.set("page", customerPagination.page.toString());
      params.set("limit", customerPagination.limit.toString());
      if (debouncedSearch) params.set("search", debouncedSearch);
      if (roleFilter !== "ALL") params.set("role", roleFilter);
      if (statusFilter !== "ALL") params.set("status", statusFilter);
      if (governorateFilter !== "ALL")
        params.set("governorate", governorateFilter);
      params.set("sort", "createdAt");
      params.set("order", "desc");

      const res = await fetch(`/api/admin/users/customers?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch customers");
      const data = await res.json();
      setCustomers(data.customers || []);
      setCustomerPagination(
        data.pagination || { page: 1, limit: 20, total: 0, totalPages: 0 }
      );
    } catch {
      toast.error("Failed to load customers");
    } finally {
      setCustomersLoading(false);
    }
  }, [
    customerPagination.page,
    customerPagination.limit,
    debouncedSearch,
    roleFilter,
    statusFilter,
    governorateFilter,
  ]);

  // ── Fetch distributors ─────────────────────────────────────────────────────
  const fetchDistributors = useCallback(async () => {
    setDistributorsLoading(true);
    try {
      const params = new URLSearchParams();
      params.set("page", distributorPagination.page.toString());
      params.set("limit", distributorPagination.limit.toString());
      if (debouncedSearch) params.set("search", debouncedSearch);
      if (statusFilter !== "ALL") params.set("status", statusFilter);

      const res = await fetch(
        `/api/admin/users/distributors?${params.toString()}`
      );
      if (!res.ok) throw new Error("Failed to fetch distributors");
      const data = await res.json();
      setDistributors(data.distributors || []);
      setDistributorPagination(
        data.pagination || { page: 1, limit: 20, total: 0, totalPages: 0 }
      );
    } catch {
      toast.error("Failed to load distributors");
    } finally {
      setDistributorsLoading(false);
    }
  }, [
    distributorPagination.page,
    distributorPagination.limit,
    debouncedSearch,
    statusFilter,
  ]);

  // ── Fetch on change ────────────────────────────────────────────────────────
  useEffect(() => {
    if (activeTab === "customers") {
      fetchCustomers();
    } else {
      fetchDistributors();
    }
  }, [activeTab, fetchCustomers, fetchDistributors]);

  // ── Reset page on filter change ────────────────────────────────────────────
  useEffect(() => {
    if (activeTab === "customers") {
      setCustomerPagination((prev) => ({ ...prev, page: 1 }));
    } else {
      setDistributorPagination((prev) => ({ ...prev, page: 1 }));
    }
  }, [debouncedSearch, roleFilter, statusFilter, governorateFilter, activeTab]);

  // ── Clear all filters ──────────────────────────────────────────────────────
  const clearFilters = () => {
    setSearch("");
    setDebouncedSearch("");
    setRoleFilter("ALL");
    setStatusFilter("ALL");
    setGovernorateFilter("ALL");
  };

  const hasActiveFilters =
    debouncedSearch ||
    roleFilter !== "ALL" ||
    statusFilter !== "ALL" ||
    governorateFilter !== "ALL";

  // ── Pagination helpers ─────────────────────────────────────────────────────
  const goToCustomerPage = (page: number) => {
    setCustomerPagination((prev) => ({ ...prev, page }));
  };

  const goToDistributorPage = (page: number) => {
    setDistributorPagination((prev) => ({ ...prev, page }));
  };

  // ── Open customer detail ───────────────────────────────────────────────────
  const openCustomerDetail = (customer: Customer) => {
    setSelectedCustomer(customer);
    setSelectedDistributor(null);
    setDetailOpen(true);
  };

  // ── Open distributor detail ────────────────────────────────────────────────
  const openDistributorDetail = (distributor: Distributor) => {
    setSelectedDistributor(distributor);
    setSelectedCustomer(null);
    setDetailOpen(true);
  };

  // ── Open edit dialog ───────────────────────────────────────────────────────
  const openEditDialog = (
    userId: string,
    currentRole: string,
    currentPermissions: string[] | null
  ) => {
    setEditId(userId);
    setEditRole(currentRole);
    setEditPermissions(currentPermissions || []);
    setEditOpen(true);
  };

  // ── Save edit ──────────────────────────────────────────────────────────────
  const handleSaveEdit = async () => {
    if (!editId) return;
    setEditSaving(true);
    try {
      const body: Record<string, unknown> = { role: editRole };
      if (
        editRole === "DISTRIBUTOR_ADMIN" ||
        editRole === "DISTRIBUTOR_STAFF"
      ) {
        body.permissions = editPermissions;
      }
      const res = await fetch(`/api/admin/users/${editId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Failed to update user");
      }
      toast.success("User updated successfully");
      setEditOpen(false);
      fetchCustomers();
      fetchDistributors();
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to update user"
      );
    } finally {
      setEditSaving(false);
    }
  };

  // ── Toggle permission ──────────────────────────────────────────────────────
  const togglePermission = (perm: string) => {
    setEditPermissions((prev) =>
      prev.includes(perm)
        ? prev.filter((p) => p !== perm)
        : [...prev, perm]
    );
  };

  // ── Open confirm dialog (suspend/activate) ─────────────────────────────────
  const openConfirmDialog = (
    id: string,
    name: string | null,
    action: "activate" | "suspend"
  ) => {
    setConfirmAction({ id, name, action });
    setConfirmOpen(true);
  };

  // ── Handle suspend/activate ────────────────────────────────────────────────
  const handleToggleStatus = async () => {
    if (!confirmAction) return;
    setConfirmLoading(true);
    try {
      const res = await fetch(`/api/admin/users/${confirmAction.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          isActive: confirmAction.action === "activate",
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Failed to update status");
      }
      toast.success(
        confirmAction.action === "activate"
          ? `${confirmAction.name || "User"} has been activated`
          : `${confirmAction.name || "User"} has been suspended`
      );
      setConfirmOpen(false);
      setConfirmAction(null);
      fetchCustomers();
      fetchDistributors();
      // Close detail dialog if it was the same user
      if (
        selectedCustomer?.id === confirmAction.id ||
        selectedDistributor?.id === confirmAction.id
      ) {
        setDetailOpen(false);
      }
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to update status"
      );
    } finally {
      setConfirmLoading(false);
    }
  };

  // ── Copy email to clipboard ────────────────────────────────────────────────
  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast.success(`${label} copied to clipboard`);
    });
  };

  // ── Pagination component ───────────────────────────────────────────────────
  const PaginationControls = ({
    pagination: pag,
    onPageChange,
  }: {
    pagination: Pagination;
    onPageChange: (page: number) => void;
  }) => {
    const { page, totalPages, total, limit } = pag;
    const start = (page - 1) * limit + 1;
    const end = Math.min(page * limit, total);

    if (totalPages <= 1) {
      return (
        <div className="flex items-center justify-between px-4 py-3 border-t border-border/50">
          <p className="text-sm text-muted-foreground">
            {total} {total === 1 ? "result" : "results"}
          </p>
        </div>
      );
    }

    return (
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 border-t border-border/50">
        <p className="text-sm text-muted-foreground">
          Showing <span className="font-medium text-foreground">{start}</span>–
          <span className="font-medium text-foreground">{end}</span> of{" "}
          <span className="font-medium text-foreground">{total}</span>{" "}
          {total === 1 ? "result" : "results"}
        </p>
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => onPageChange(1)}
            disabled={page <= 1}
          >
            <ChevronsLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => onPageChange(page - 1)}
            disabled={page <= 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          {generatePageNumbers(page, totalPages).map((p, i) =>
            p === "..." ? (
              <span
                key={`dots-${i}`}
                className="px-2 text-sm text-muted-foreground"
              >
                ...
              </span>
            ) : (
              <Button
                key={p}
                variant={page === p ? "default" : "outline"}
                size="icon"
                className="h-8 w-8"
                onClick={() => onPageChange(p as number)}
              >
                {p}
              </Button>
            )
          )}
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => onPageChange(page + 1)}
            disabled={page >= totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => onPageChange(totalPages)}
            disabled={page >= totalPages}
          >
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  };

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6">
      {/* ── Page Header ─────────────────────────────────────────────────────── */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Customers</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage customer and distributor accounts
        </p>
      </div>

      {/* ── Tabs ────────────────────────────────────────────────────────────── */}
      <Tabs
        value={activeTab}
        onValueChange={(val) => setActiveTab(val)}
        className="space-y-4"
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <TabsList>
            <TabsTrigger value="customers" className="gap-2">
              <Users className="h-4 w-4" />
              Customers
              {!customersLoading && (
                <Badge
                  variant="secondary"
                  className="ml-1 h-5 px-1.5 text-xs"
                >
                  {customerPagination.total}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="distributors" className="gap-2">
              <UserCog className="h-4 w-4" />
              Distributors
              {!distributorsLoading && (
                <Badge
                  variant="secondary"
                  className="ml-1 h-5 px-1.5 text-xs"
                >
                  {distributorPagination.total}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          {/* ── Search & Filters ─────────────────────────────────────────────── */}
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                ref={searchInputRef}
                placeholder="Search by name, email, phone..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 w-[240px] sm:w-[280px] h-9"
              />
              {search && (
                <button
                  onClick={() => {
                    setSearch("");
                    searchInputRef.current?.focus();
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
            <Button
              variant={showFilters ? "secondary" : "outline"}
              size="sm"
              onClick={() => setShowFilters((v) => !v)}
              className="h-9 gap-2"
            >
              <Filter className="h-4 w-4" />
              Filters
              {hasActiveFilters && (
                <span className="flex h-2 w-2 rounded-full bg-primary" />
              )}
            </Button>
          </div>
        </div>

        {/* ── Filter Bar ────────────────────────────────────────────────────── */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <Card className="border-border/50">
                <CardContent className="p-4">
                  <div className="flex flex-wrap items-center gap-3">
                    {/* Role Filter — Customers only */}
                    <div className="flex flex-col gap-1.5">
                      <Label className="text-xs text-muted-foreground">
                        Role
                      </Label>
                      <Select
                        value={roleFilter}
                        onValueChange={setRoleFilter}
                      >
                        <SelectTrigger className="w-[150px] h-9">
                          <SelectValue placeholder="All Roles" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ALL">All Roles</SelectItem>
                          {activeTab === "customers"
                            ? CUSTOMER_ROLES.map((r) => (
                                <SelectItem key={r} value={r}>
                                  {getRoleBadge(r).label}
                                </SelectItem>
                              ))
                            : [
                                "DISTRIBUTOR_ADMIN",
                                "DISTRIBUTOR_STAFF",
                              ].map((r) => (
                                <SelectItem key={r} value={r}>
                                  {getRoleBadge(r).label}
                                </SelectItem>
                              ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Status Filter */}
                    <div className="flex flex-col gap-1.5">
                      <Label className="text-xs text-muted-foreground">
                        Status
                      </Label>
                      <Select
                        value={statusFilter}
                        onValueChange={setStatusFilter}
                      >
                        <SelectTrigger className="w-[140px] h-9">
                          <SelectValue placeholder="All Status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ALL">All Status</SelectItem>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="suspended">
                            Suspended
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Governorate Filter — Customers only */}
                    {activeTab === "customers" && (
                      <div className="flex flex-col gap-1.5">
                        <Label className="text-xs text-muted-foreground">
                          Governorate
                        </Label>
                        <Select
                          value={governorateFilter}
                          onValueChange={setGovernorateFilter}
                        >
                          <SelectTrigger className="w-[170px] h-9">
                            <SelectValue placeholder="All Governorates" />
                          </SelectTrigger>
                          <SelectContent className="max-h-64">
                            <SelectItem value="ALL">
                              All Governorates
                            </SelectItem>
                            {GOVERNORATES.map((g) => (
                              <SelectItem key={g} value={g}>
                                {g}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}

                    {hasActiveFilters && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={clearFilters}
                        className="h-9 mt-auto gap-1.5 text-muted-foreground hover:text-foreground"
                      >
                        <X className="h-3.5 w-3.5" />
                        Clear filters
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Customers Tab Content ──────────────────────────────────────────── */}
        <TabsContent value="customers">
          <Card className="border-border/50 overflow-hidden">
            <ScrollArea className="max-h-[calc(100vh-340px)]">
              {customersLoading ? (
                <TableSkeleton columns={12} />
              ) : customers.length === 0 ? (
                <EmptyState
                  icon={<Users className="h-12 w-12" />}
                  title="No customers found"
                  description={
                    hasActiveFilters
                      ? "Try adjusting your filters or search query"
                      : "Customers will appear here once they create an account"
                  }
                  onClear={hasActiveFilters ? clearFilters : undefined}
                />
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow className="border-border/50 hover:bg-transparent">
                      <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground h-10">
                        Name
                      </TableHead>
                      <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground h-10">
                        Email
                      </TableHead>
                      <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground h-10 hidden md:table-cell">
                        Phone
                      </TableHead>
                      <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground h-10">
                        Role
                      </TableHead>
                      <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground h-10 hidden lg:table-cell">
                        Governorate
                      </TableHead>
                      <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground h-10 hidden lg:table-cell">
                        Tier
                      </TableHead>
                      <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground h-10 hidden lg:table-cell text-right">
                        Points
                      </TableHead>
                      <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground h-10 hidden md:table-cell text-right">
                        Orders
                      </TableHead>
                      <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground h-10 hidden xl:table-cell text-right">
                        Total Spent
                      </TableHead>
                      <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground h-10 hidden lg:table-cell">
                        Joined
                      </TableHead>
                      <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground h-10">
                        Status
                      </TableHead>
                      <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground h-10 w-12" />
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {customers.map((customer, i) => {
                      const roleBadge = getRoleBadge(customer.role);
                      const tier = customer.loyaltyProfile?.tier;
                      return (
                        <motion.tr
                          key={customer.id}
                          custom={i}
                          initial="hidden"
                          animate="visible"
                          variants={fadeInUp}
                          className={cn(
                            "border-border/30 transition-colors cursor-pointer",
                            "hover:bg-muted/40"
                          )}
                          onClick={() => openCustomerDetail(customer)}
                        >
                          <TableCell className="py-3">
                            <div className="flex items-center gap-3">
                              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-xs font-semibold text-muted-foreground shrink-0">
                                {customer.name
                                  ?.split(" ")
                                  .map((n) => n[0])
                                  .join("")
                                  .toUpperCase()
                                  .slice(0, 2) || "?"}
                              </div>
                              <span className="font-medium text-sm truncate max-w-[140px]">
                                {customer.name || "—"}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="py-3">
                            <span className="text-sm text-muted-foreground truncate block max-w-[180px]">
                              {customer.email}
                            </span>
                          </TableCell>
                          <TableCell className="py-3 hidden md:table-cell">
                            <span className="text-sm text-muted-foreground">
                              {customer.phone || "—"}
                            </span>
                          </TableCell>
                          <TableCell className="py-3">
                            <Badge
                              variant="outline"
                              className={cn(
                                "text-xs font-medium border",
                                roleBadge.color
                              )}
                            >
                              {roleBadge.label}
                            </Badge>
                          </TableCell>
                          <TableCell className="py-3 hidden lg:table-cell">
                            <span className="text-sm text-muted-foreground">
                              {customer.governorate || "—"}
                            </span>
                          </TableCell>
                          <TableCell className="py-3 hidden lg:table-cell">
                            {tier ? (
                              <Badge
                                variant="outline"
                                className={cn(
                                  "text-xs font-medium border gap-1",
                                  getTierColor(tier)
                                )}
                              >
                                {getTierIcon(tier)}
                                {tier}
                              </Badge>
                            ) : (
                              <span className="text-xs text-muted-foreground">
                                —
                              </span>
                            )}
                          </TableCell>
                          <TableCell className="py-3 hidden lg:table-cell text-right">
                            <span className="text-sm tabular-nums">
                              {customer.loyaltyProfile?.points?.toLocaleString() ||
                                "0"}
                            </span>
                          </TableCell>
                          <TableCell className="py-3 hidden md:table-cell text-right">
                            <span className="text-sm tabular-nums">
                              {customer._count.orders}
                            </span>
                          </TableCell>
                          <TableCell className="py-3 hidden xl:table-cell text-right">
                            <span className="text-sm tabular-nums font-medium">
                              {customer.loyaltyProfile?.totalSpent
                                ? formatEGP(customer.loyaltyProfile.totalSpent)
                                : "0 EGP"}
                            </span>
                          </TableCell>
                          <TableCell className="py-3 hidden lg:table-cell">
                            <span className="text-sm text-muted-foreground">
                              {formatDate(customer.createdAt)}
                            </span>
                          </TableCell>
                          <TableCell className="py-3">
                            <StatusBadge isActive={customer.isActive} />
                          </TableCell>
                          <TableCell className="py-3">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    openCustomerDetail(customer);
                                  }}
                                >
                                  <Eye className="mr-2 h-4 w-4" />
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    openEditDialog(
                                      customer.id,
                                      customer.role,
                                      null
                                    );
                                  }}
                                >
                                  <Pencil className="mr-2 h-4 w-4" />
                                  Edit Role
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                {customer.isActive ? (
                                  <DropdownMenuItem
                                    className="text-destructive focus:text-destructive"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      openConfirmDialog(
                                        customer.id,
                                        customer.name,
                                        "suspend"
                                      );
                                    }}
                                  >
                                    <Ban className="mr-2 h-4 w-4" />
                                    Suspend Account
                                  </DropdownMenuItem>
                                ) : (
                                  <DropdownMenuItem
                                    className="text-emerald-500 focus:text-emerald-500"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      openConfirmDialog(
                                        customer.id,
                                        customer.name,
                                        "activate"
                                      );
                                    }}
                                  >
                                    <CheckCircle2 className="mr-2 h-4 w-4" />
                                    Activate Account
                                  </DropdownMenuItem>
                                )}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </motion.tr>
                      );
                    })}
                  </TableBody>
                </Table>
              )}
            </ScrollArea>
            <PaginationControls
              pagination={customerPagination}
              onPageChange={goToCustomerPage}
            />
          </Card>
        </TabsContent>

        {/* ── Distributors Tab Content ───────────────────────────────────────── */}
        <TabsContent value="distributors">
          <Card className="border-border/50 overflow-hidden">
            <ScrollArea className="max-h-[calc(100vh-340px)]">
              {distributorsLoading ? (
                <TableSkeleton columns={10} />
              ) : distributors.length === 0 ? (
                <EmptyState
                  icon={<UserCog className="h-12 w-12" />}
                  title="No distributors found"
                  description={
                    hasActiveFilters
                      ? "Try adjusting your filters or search query"
                      : "Distributor accounts will appear here once registered"
                  }
                  onClear={hasActiveFilters ? clearFilters : undefined}
                />
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow className="border-border/50 hover:bg-transparent">
                      <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground h-10">
                        Name
                      </TableHead>
                      <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground h-10">
                        Email
                      </TableHead>
                      <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground h-10 hidden md:table-cell">
                        Phone
                      </TableHead>
                      <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground h-10">
                        Role
                      </TableHead>
                      <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground h-10 hidden lg:table-cell">
                        Permissions
                      </TableHead>
                      <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground h-10 hidden lg:table-cell">
                        Governorate
                      </TableHead>
                      <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground h-10 hidden md:table-cell text-right">
                        Orders
                      </TableHead>
                      <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground h-10 hidden lg:table-cell">
                        Joined
                      </TableHead>
                      <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground h-10">
                        Status
                      </TableHead>
                      <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground h-10 w-12" />
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {distributors.map((dist, i) => {
                      const roleBadge = getRoleBadge(dist.role);
                      return (
                        <motion.tr
                          key={dist.id}
                          custom={i}
                          initial="hidden"
                          animate="visible"
                          variants={fadeInUp}
                          className={cn(
                            "border-border/30 transition-colors cursor-pointer",
                            "hover:bg-muted/40"
                          )}
                          onClick={() => openDistributorDetail(dist)}
                        >
                          <TableCell className="py-3">
                            <div className="flex items-center gap-3">
                              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-xs font-semibold text-muted-foreground shrink-0">
                                {dist.name
                                  ?.split(" ")
                                  .map((n) => n[0])
                                  .join("")
                                  .toUpperCase()
                                  .slice(0, 2) || "?"}
                              </div>
                              <span className="font-medium text-sm truncate max-w-[140px]">
                                {dist.name || "—"}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="py-3">
                            <span className="text-sm text-muted-foreground truncate block max-w-[180px]">
                              {dist.email}
                            </span>
                          </TableCell>
                          <TableCell className="py-3 hidden md:table-cell">
                            <span className="text-sm text-muted-foreground">
                              {dist.phone || "—"}
                            </span>
                          </TableCell>
                          <TableCell className="py-3">
                            <Badge
                              variant="outline"
                              className={cn(
                                "text-xs font-medium border",
                                roleBadge.color
                              )}
                            >
                              {roleBadge.label}
                            </Badge>
                          </TableCell>
                          <TableCell className="py-3 hidden lg:table-cell">
                            <div className="flex flex-wrap gap-1 max-w-[200px]">
                              {formatPermissions(dist.permissions).length > 0 ? (
                                formatPermissions(dist.permissions)
                                  .slice(0, 3)
                                  .map((p) => (
                                    <Badge
                                      key={p}
                                      variant="secondary"
                                      className="text-[10px] px-1.5 py-0 h-5 font-normal"
                                    >
                                      {p}
                                    </Badge>
                                  ))
                              ) : (
                                <span className="text-xs text-muted-foreground">
                                  None
                                </span>
                              )}
                              {formatPermissions(dist.permissions).length > 3 && (
                                <Badge
                                  variant="secondary"
                                  className="text-[10px] px-1.5 py-0 h-5 font-normal"
                                >
                                  +{formatPermissions(dist.permissions).length - 3}
                                </Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="py-3 hidden lg:table-cell">
                            <span className="text-sm text-muted-foreground">
                              {dist.governorate || "—"}
                            </span>
                          </TableCell>
                          <TableCell className="py-3 hidden md:table-cell text-right">
                            <span className="text-sm tabular-nums">
                              {dist._count.orders}
                            </span>
                          </TableCell>
                          <TableCell className="py-3 hidden lg:table-cell">
                            <span className="text-sm text-muted-foreground">
                              {formatDate(dist.createdAt)}
                            </span>
                          </TableCell>
                          <TableCell className="py-3">
                            <StatusBadge isActive={dist.isActive} />
                          </TableCell>
                          <TableCell className="py-3">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    openDistributorDetail(dist);
                                  }}
                                >
                                  <Eye className="mr-2 h-4 w-4" />
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    openEditDialog(
                                      dist.id,
                                      dist.role,
                                      dist.permissions
                                    );
                                  }}
                                >
                                  <Pencil className="mr-2 h-4 w-4" />
                                  Edit Role & Permissions
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                {dist.isActive ? (
                                  <DropdownMenuItem
                                    className="text-destructive focus:text-destructive"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      openConfirmDialog(
                                        dist.id,
                                        dist.name,
                                        "suspend"
                                      );
                                    }}
                                  >
                                    <Ban className="mr-2 h-4 w-4" />
                                    Suspend Account
                                  </DropdownMenuItem>
                                ) : (
                                  <DropdownMenuItem
                                    className="text-emerald-500 focus:text-emerald-500"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      openConfirmDialog(
                                        dist.id,
                                        dist.name,
                                        "activate"
                                      );
                                    }}
                                  >
                                    <CheckCircle2 className="mr-2 h-4 w-4" />
                                    Activate Account
                                  </DropdownMenuItem>
                                )}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </motion.tr>
                      );
                    })}
                  </TableBody>
                </Table>
              )}
            </ScrollArea>
            <PaginationControls
              pagination={distributorPagination}
              onPageChange={goToDistributorPage}
            />
          </Card>
        </TabsContent>
      </Tabs>

      {/* ── Customer Detail Dialog ──────────────────────────────────────────── */}
      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <AnimatePresence>
          {detailOpen && selectedCustomer && (
            <motion.div
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={dialogVariants}
            >
              <DialogContent className="sm:max-w-[540px] p-0 gap-0 max-h-[85vh] overflow-hidden">
                <div className="p-6 pb-4">
                  <DialogHeader>
                    <DialogTitle className="text-lg">
                      Customer Details
                    </DialogTitle>
                    <DialogDescription>
                      Full profile and account information
                    </DialogDescription>
                  </DialogHeader>
                </div>

                <Separator className="opacity-50" />

                <ScrollArea className="max-h-[calc(85vh-180px)]">
                  <div className="p-6 space-y-6">
                    {/* ── Contact Info ─────────────────────────────────────── */}
                    <section>
                      <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                        Contact Information
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <InfoItem
                          icon={<User className="h-4 w-4" />}
                          label="Full Name"
                          value={selectedCustomer.name}
                        />
                        <InfoItem
                          icon={<Mail className="h-4 w-4" />}
                          label="Email"
                          value={selectedCustomer.email}
                          copyable
                          onCopy={() =>
                            copyToClipboard(
                              selectedCustomer.email,
                              "Email"
                            )
                          }
                        />
                        <InfoItem
                          icon={<Phone className="h-4 w-4" />}
                          label="Phone"
                          value={selectedCustomer.phone}
                        />
                        <InfoItem
                          icon={<MapPin className="h-4 w-4" />}
                          label="Location"
                          value={
                            selectedCustomer.governorate
                              ? [
                                  selectedCustomer.city,
                                  selectedCustomer.governorate,
                                ]
                                  .filter(Boolean)
                                  .join(", ")
                              : undefined
                          }
                        />
                      </div>
                    </section>

                    {/* ── Account Info ─────────────────────────────────────── */}
                    <section>
                      <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                        Account Information
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="space-y-1">
                          <p className="text-xs text-muted-foreground">Role</p>
                          <Badge
                            variant="outline"
                            className={cn(
                              "text-xs font-medium border",
                              getRoleBadge(selectedCustomer.role).color
                            )}
                          >
                            {getRoleBadge(selectedCustomer.role).label}
                          </Badge>
                        </div>
                        <div className="space-y-1">
                          <p className="text-xs text-muted-foreground">
                            Status
                          </p>
                          <StatusBadge
                            isActive={selectedCustomer.isActive}
                          />
                        </div>
                        <div className="space-y-1">
                          <p className="text-xs text-muted-foreground">
                            Joined
                          </p>
                          <p className="text-sm font-medium">
                            {formatDate(selectedCustomer.createdAt)}
                          </p>
                        </div>
                      </div>
                    </section>

                    {/* ── Loyalty Info ──────────────────────────────────────── */}
                    {selectedCustomer.loyaltyProfile && (
                      <section>
                        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                          Loyalty Program
                        </h3>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                          <div className="space-y-1">
                            <p className="text-xs text-muted-foreground">
                              Tier
                            </p>
                            <Badge
                              variant="outline"
                              className={cn(
                                "text-xs font-medium border gap-1",
                                getTierColor(
                                  selectedCustomer.loyaltyProfile.tier
                                )
                              )}
                            >
                              {getTierIcon(
                                selectedCustomer.loyaltyProfile.tier
                              )}
                              {selectedCustomer.loyaltyProfile.tier}
                            </Badge>
                          </div>
                          <div className="space-y-1">
                            <p className="text-xs text-muted-foreground">
                              Points
                            </p>
                            <p className="text-sm font-semibold tabular-nums">
                              {selectedCustomer.loyaltyProfile.points.toLocaleString()}
                            </p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-xs text-muted-foreground">
                              Points Value
                            </p>
                            <p className="text-sm font-medium text-primary tabular-nums">
                              {formatEGP(
                                Math.floor(
                                  selectedCustomer.loyaltyProfile.points / 100
                                )
                              )}
                            </p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-xs text-muted-foreground">
                              Total Spent
                            </p>
                            <p className="text-sm font-semibold tabular-nums">
                              {formatEGP(
                                selectedCustomer.loyaltyProfile.totalSpent
                              )}
                            </p>
                          </div>
                        </div>
                      </section>
                    )}

                    {/* ── Activity ──────────────────────────────────────────── */}
                    <section>
                      <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                        Activity
                      </h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center gap-3 rounded-lg border border-border/50 p-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
                            <Package className="h-5 w-5 text-blue-500" />
                          </div>
                          <div>
                            <p className="text-2xl font-bold tabular-nums">
                              {selectedCustomer._count.orders}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Total Orders
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 rounded-lg border border-border/50 p-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10">
                            <MessageSquare className="h-5 w-5 text-emerald-500" />
                          </div>
                          <div>
                            <p className="text-2xl font-bold tabular-nums">
                              {selectedCustomer._count.reviews}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Reviews
                            </p>
                          </div>
                        </div>
                      </div>
                    </section>
                  </div>
                </ScrollArea>

                <Separator className="opacity-50" />

                {/* ── Dialog Actions ──────────────────────────────────────── */}
                <div className="flex items-center justify-end gap-2 p-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setDetailOpen(false);
                      openEditDialog(
                        selectedCustomer.id,
                        selectedCustomer.role,
                        null
                      );
                    }}
                    className="gap-2"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                    Edit Role
                  </Button>
                  {selectedCustomer.isActive ? (
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => {
                        setDetailOpen(false);
                        openConfirmDialog(
                          selectedCustomer.id,
                          selectedCustomer.name,
                          "suspend"
                        );
                      }}
                      className="gap-2"
                    >
                      <Ban className="h-3.5 w-3.5" />
                      Suspend
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      onClick={() => {
                        setDetailOpen(false);
                        openConfirmDialog(
                          selectedCustomer.id,
                          selectedCustomer.name,
                          "activate"
                        );
                      }}
                      className="gap-2 bg-emerald-600 hover:bg-emerald-700"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      Activate
                    </Button>
                  )}
                </div>
              </DialogContent>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Distributor Detail */}
        <AnimatePresence>
          {detailOpen && selectedDistributor && (
            <motion.div
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={dialogVariants}
            >
              <DialogContent className="sm:max-w-[540px] p-0 gap-0 max-h-[85vh] overflow-hidden">
                <div className="p-6 pb-4">
                  <DialogHeader>
                    <DialogTitle className="text-lg">
                      Distributor Details
                    </DialogTitle>
                    <DialogDescription>
                      Distributor account and permissions
                    </DialogDescription>
                  </DialogHeader>
                </div>

                <Separator className="opacity-50" />

                <ScrollArea className="max-h-[calc(85vh-180px)]">
                  <div className="p-6 space-y-6">
                    {/* Contact */}
                    <section>
                      <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                        Contact Information
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <InfoItem
                          icon={<User className="h-4 w-4" />}
                          label="Full Name"
                          value={selectedDistributor.name}
                        />
                        <InfoItem
                          icon={<Mail className="h-4 w-4" />}
                          label="Email"
                          value={selectedDistributor.email}
                          copyable
                          onCopy={() =>
                            copyToClipboard(
                              selectedDistributor.email,
                              "Email"
                            )
                          }
                        />
                        <InfoItem
                          icon={<Phone className="h-4 w-4" />}
                          label="Phone"
                          value={selectedDistributor.phone}
                        />
                        <InfoItem
                          icon={<MapPin className="h-4 w-4" />}
                          label="Location"
                          value={
                            selectedDistributor.governorate
                              ? [
                                  selectedDistributor.city,
                                  selectedDistributor.governorate,
                                ]
                                  .filter(Boolean)
                                  .join(", ")
                              : undefined
                          }
                        />
                      </div>
                    </section>

                    {/* Account */}
                    <section>
                      <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                        Account Information
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="space-y-1">
                          <p className="text-xs text-muted-foreground">Role</p>
                          <Badge
                            variant="outline"
                            className={cn(
                              "text-xs font-medium border",
                              getRoleBadge(selectedDistributor.role).color
                            )}
                          >
                            {getRoleBadge(selectedDistributor.role).label}
                          </Badge>
                        </div>
                        <div className="space-y-1">
                          <p className="text-xs text-muted-foreground">
                            Status
                          </p>
                          <StatusBadge
                            isActive={selectedDistributor.isActive}
                          />
                        </div>
                        <div className="space-y-1">
                          <p className="text-xs text-muted-foreground">
                            Joined
                          </p>
                          <p className="text-sm font-medium">
                            {formatDate(selectedDistributor.createdAt)}
                          </p>
                        </div>
                      </div>
                    </section>

                    {/* Permissions */}
                    <section>
                      <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                        Permissions
                      </h3>
                      {selectedDistributor.permissions &&
                      selectedDistributor.permissions.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {selectedDistributor.permissions.map((p) => (
                            <Badge
                              key={p}
                              variant="outline"
                              className="text-xs font-medium border-border/50"
                            >
                              <ShieldCheck className="h-3 w-3 mr-1" />
                              {PERMISSION_LABELS[p] || p}
                            </Badge>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground">
                          No permissions assigned
                        </p>
                      )}
                    </section>

                    {/* Activity */}
                    <section>
                      <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                        Activity
                      </h3>
                      <div className="grid grid-cols-1 gap-4">
                        <div className="flex items-center gap-3 rounded-lg border border-border/50 p-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10">
                            <Package className="h-5 w-5 text-amber-500" />
                          </div>
                          <div>
                            <p className="text-2xl font-bold tabular-nums">
                              {selectedDistributor._count.orders}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Total Orders
                            </p>
                          </div>
                        </div>
                      </div>
                    </section>
                  </div>
                </ScrollArea>

                <Separator className="opacity-50" />

                <div className="flex items-center justify-end gap-2 p-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setDetailOpen(false);
                      openEditDialog(
                        selectedDistributor.id,
                        selectedDistributor.role,
                        selectedDistributor.permissions
                      );
                    }}
                    className="gap-2"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                    Edit Role & Permissions
                  </Button>
                  {selectedDistributor.isActive ? (
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => {
                        setDetailOpen(false);
                        openConfirmDialog(
                          selectedDistributor.id,
                          selectedDistributor.name,
                          "suspend"
                        );
                      }}
                      className="gap-2"
                    >
                      <Ban className="h-3.5 w-3.5" />
                      Suspend
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      onClick={() => {
                        setDetailOpen(false);
                        openConfirmDialog(
                          selectedDistributor.id,
                          selectedDistributor.name,
                          "activate"
                        );
                      }}
                      className="gap-2 bg-emerald-600 hover:bg-emerald-700"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      Activate
                    </Button>
                  )}
                </div>
              </DialogContent>
            </motion.div>
          )}
        </AnimatePresence>
      </Dialog>

      {/* ── Edit Role / Permissions Dialog ──────────────────────────────────── */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader>
            <DialogTitle>Edit User Role</DialogTitle>
            <DialogDescription>
              Update the user&apos;s role and permissions. Requires SUPER_ADMIN
              privileges.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-5 py-4">
            {/* Role select */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Role</Label>
              <Select value={editRole} onValueChange={setEditRole}>
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CONSUMER">Consumer</SelectItem>
                  <SelectItem value="CORPORATE">Corporate</SelectItem>
                  <SelectItem value="SALES_REP">Sales Rep</SelectItem>
                  <SelectItem value="DISTRIBUTOR_ADMIN">
                    Distributor Admin
                  </SelectItem>
                  <SelectItem value="DISTRIBUTOR_STAFF">
                    Distributor Staff
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Permissions — only for distributor roles */}
            {(editRole === "DISTRIBUTOR_ADMIN" ||
              editRole === "DISTRIBUTOR_STAFF") && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-3"
              >
                <Label className="text-sm font-medium">Permissions</Label>
                <div className="grid grid-cols-2 gap-2">
                  {ALL_PERMISSIONS.map((perm) => (
                    <label
                      key={perm}
                      className={cn(
                        "flex items-center gap-2 rounded-lg border p-2.5 cursor-pointer transition-colors",
                        editPermissions.includes(perm)
                          ? "border-primary/50 bg-primary/5"
                          : "border-border/50 hover:border-border"
                      )}
                    >
                      <input
                        type="checkbox"
                        checked={editPermissions.includes(perm)}
                        onChange={() => togglePermission(perm)}
                        className="sr-only"
                      />
                      <div
                        className={cn(
                          "flex h-4 w-4 items-center justify-center rounded border transition-colors shrink-0",
                          editPermissions.includes(perm)
                            ? "bg-primary border-primary text-primary-foreground"
                            : "border-muted-foreground/40"
                        )}
                      >
                        {editPermissions.includes(perm) && (
                          <svg
                            className="h-3 w-3"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={3}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        )}
                      </div>
                      <span className="text-sm">{PERMISSION_LABELS[perm]}</span>
                    </label>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setEditOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveEdit} disabled={editSaving}>
              {editSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* ── Suspend / Activate Confirm Dialog ──────────────────────────────── */}
      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              {confirmAction?.action === "suspend" ? (
                <ShieldAlert className="h-5 w-5 text-destructive" />
              ) : (
                <ShieldCheck className="h-5 w-5 text-emerald-500" />
              )}
              {confirmAction?.action === "suspend"
                ? "Suspend Account"
                : "Activate Account"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {confirmAction?.action === "suspend"
                ? `Are you sure you want to suspend ${confirmAction?.name || "this user"}'s account? They will no longer be able to sign in.`
                : `Are you sure you want to activate ${confirmAction?.name || "this user"}'s account? They will regain full access.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={confirmLoading}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleToggleStatus}
              disabled={confirmLoading}
              className={
                confirmAction?.action === "suspend"
                  ? "bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  : "bg-emerald-600 text-white hover:bg-emerald-700"
              }
            >
              {confirmLoading && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {confirmAction?.action === "suspend" ? "Suspend" : "Activate"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function StatusBadge({ isActive }: { isActive: boolean }) {
  if (isActive) {
    return (
      <Badge
        variant="outline"
        className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 text-xs gap-1"
      >
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
        Active
      </Badge>
    );
  }
  return (
    <Badge
      variant="outline"
      className="bg-red-500/10 text-red-500 border-red-500/20 text-xs gap-1"
    >
      <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
      Suspended
    </Badge>
  );
}

function InfoItem({
  icon,
  label,
  value,
  copyable,
  onCopy,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | null | undefined;
  copyable?: boolean;
  onCopy?: () => void;
}) {
  return (
    <div className="flex items-start gap-2.5">
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted shrink-0 mt-0.5">
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs text-muted-foreground">{label}</p>
        <div className="flex items-center gap-1.5">
          <p className="text-sm font-medium truncate">
            {value || "—"}
          </p>
          {copyable && value && (
            <button
              onClick={onCopy}
              className="text-muted-foreground hover:text-foreground transition-colors shrink-0"
              title="Copy to clipboard"
            >
              <Copy className="h-3 w-3" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function EmptyState({
  icon,
  title,
  description,
  onClear,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  onClear?: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center py-16 px-4"
    >
      <div className="text-muted-foreground/30 mb-4">{icon}</div>
      <h3 className="text-sm font-semibold mb-1">{title}</h3>
      <p className="text-sm text-muted-foreground text-center max-w-sm mb-4">
        {description}
      </p>
      {onClear && (
        <Button variant="outline" size="sm" onClick={onClear} className="gap-2">
          <X className="h-3.5 w-3.5" />
          Clear filters
        </Button>
      )}
    </motion.div>
  );
}

function generatePageNumbers(
  current: number,
  total: number
): (number | "...")[] {
  if (total <= 5) return Array.from({ length: total }, (_, i) => i + 1);

  const pages: (number | "...")[] = [1];

  if (current > 3) pages.push("...");

  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);

  for (let i = start; i <= end; i++) pages.push(i);

  if (current < total - 2) pages.push("...");

  pages.push(total);

  return pages;
}