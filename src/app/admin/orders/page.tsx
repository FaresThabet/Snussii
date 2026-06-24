"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

// ─── Shadcn UI Components ───────────────────────────────────────────────────
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
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
  ChevronLeft,
  ChevronRight,
  Search,
  Package,
  Clock,
  CreditCard,
  MapPin,
  User,
  FileText,
  ArrowRight,
  Loader2,
  Filter,
  X,
  Check,
  Truck,
  CircleCheck,
  CircleX,
  RotateCcw,
  Eye,
  Phone,
  Mail,
  CalendarDays,
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
  "Damietta",
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

const ORDER_STATUSES = [
  "PENDING",
  "CONFIRMED",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
  "REFUNDED",
];

const PAYMENT_STATUSES = ["PENDING", "PAID", "FAILED", "REFUNDED"];

const VALID_TRANSITIONS: Record<string, string[]> = {
  PENDING: ["CONFIRMED", "CANCELLED"],
  CONFIRMED: ["PROCESSING", "CANCELLED"],
  PROCESSING: ["SHIPPED"],
  SHIPPED: ["DELIVERED"],
  DELIVERED: ["REFUNDED"],
  CANCELLED: [],
  REFUNDED: [],
};

const STATUS_LABELS: Record<string, string> = {
  PENDING: "Pending",
  CONFIRMED: "Confirmed",
  PROCESSING: "Processing",
  SHIPPED: "Shipped",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
  REFUNDED: "Refunded",
};

const PAYMENT_STATUS_LABELS: Record<string, string> = {
  PENDING: "Pending",
  PAID: "Paid",
  FAILED: "Failed",
  REFUNDED: "Refunded",
};

const PAYMENT_METHOD_LABELS: Record<string, string> = {
  COD: "Cash on Delivery",
  PAYMOB: "Paymob",
  FAWRY: "Fawry",
  VODAFONE_CASH: "Vodafone Cash",
  INSTAPAY: "InstaPay",
};

// ─── Helper Functions ────────────────────────────────────────────────────────

function getStatusColor(status: string) {
  const map: Record<string, string> = {
    PENDING: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
    CONFIRMED: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    PROCESSING: "bg-indigo-500/10 text-indigo-500 border-indigo-500/20",
    SHIPPED: "bg-purple-500/10 text-purple-500 border-purple-500/20",
    DELIVERED: "bg-green-500/10 text-green-500 border-green-500/20",
    CANCELLED: "bg-red-500/10 text-red-500 border-red-500/20",
    REFUNDED: "bg-gray-500/10 text-gray-500 border-gray-500/20",
  };
  return map[status] || "bg-gray-500/10 text-gray-500 border-gray-500/20";
}

function getPaymentColor(status: string) {
  const map: Record<string, string> = {
    PENDING: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
    PAID: "bg-green-500/10 text-green-500 border-green-500/20",
    FAILED: "bg-red-500/10 text-red-500 border-red-500/20",
    REFUNDED: "bg-orange-500/10 text-orange-500 border-orange-500/20",
  };
  return map[status] || "bg-gray-500/10 text-gray-500 border-gray-500/20";
}

function formatEGP(amount: number) {
  return new Intl.NumberFormat("en-EG", {
    style: "currency",
    currency: "EGP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}

function formatDateShort(date: string) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
  }).format(new Date(date));
}

function getStatusIcon(status: string) {
  switch (status) {
    case "PENDING":
      return <Clock className="h-3.5 w-3.5" />;
    case "CONFIRMED":
      return <Check className="h-3.5 w-3.5" />;
    case "PROCESSING":
      return <Package className="h-3.5 w-3.5" />;
    case "SHIPPED":
      return <Truck className="h-3.5 w-3.5" />;
    case "DELIVERED":
      return <CircleCheck className="h-3.5 w-3.5" />;
    case "CANCELLED":
      return <CircleX className="h-3.5 w-3.5" />;
    case "REFUNDED":
      return <RotateCcw className="h-3.5 w-3.5" />;
    default:
      return null;
  }
}

// ─── Types ───────────────────────────────────────────────────────────────────

interface OrderItem {
  productName: string;
  quantity: number;
  unitPrice: number;
  total: number;
  product: {
    name: string;
    image: string;
    strength: number;
  } | null;
}

interface Payment {
  method: string;
  status: string;
  amount: number;
}

interface OrderCustomer {
  id: string;
  name: string | null;
  email: string;
  phone: string | null;
}

interface Order {
  id: string;
  orderNumber: string;
  status: string;
  paymentStatus: string;
  paymentMethod: string | null;
  total: number;
  discount: number;
  tax: number;
  subtotal: number;
  shippingCost: number;
  shippingGovernorate: string;
  shippingCity: string;
  shippingAddress: string;
  shippingPhone: string;
  shippingName: string;
  notes: string | null;
  createdAt: string;
  confirmedAt: string | null;
  shippedAt: string | null;
  deliveredAt: string | null;
  cancelledAt: string | null;
  customer: OrderCustomer | null;
  items: OrderItem[];
  payments: Payment[];
  guestName?: string | null;
  guestPhone?: string | null;
  guestEmail?: string | null;
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
    transition: { delay: i * 0.04, duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

// ─── Component ───────────────────────────────────────────────────────────────

export default function AdminOrdersPage() {
  // ── State ─────────────────────────────────────────────────────────────────
  const [orders, setOrders] = useState<Order[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  });
  const [loading, setLoading] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);

  // Filters
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [paymentFilter, setPaymentFilter] = useState("ALL");
  const [governorateFilter, setGovernorateFilter] = useState("ALL");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  // Detail dialog
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  // ── Debounced search ──────────────────────────────────────────────────────
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  // ── Fetch orders ──────────────────────────────────────────────────────────
  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set("page", pagination.page.toString());
      params.set("limit", pagination.limit.toString());
      if (debouncedSearch) params.set("search", debouncedSearch);
      if (statusFilter !== "ALL") params.set("status", statusFilter);
      if (paymentFilter !== "ALL") params.set("paymentStatus", paymentFilter);
      if (governorateFilter !== "ALL") params.set("governorate", governorateFilter);
      if (dateFrom) params.set("from", dateFrom);
      if (dateTo) params.set("to", dateTo);

      const res = await fetch(`/api/admin/orders?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch orders");
      const data = await res.json();
      setOrders(data.orders || []);
      setPagination(data.pagination || { page: 1, limit: 20, total: 0, totalPages: 0 });
    } catch {
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.limit, debouncedSearch, statusFilter, paymentFilter, governorateFilter, dateFrom, dateTo]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // ── Status update ─────────────────────────────────────────────────────────
  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    setUpdatingStatus(orderId);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Failed to update status");
      }
      toast.success(`Order updated to ${STATUS_LABELS[newStatus]}`);
      fetchOrders();
      // Update selected order if dialog is open
      if (selectedOrder?.id === orderId) {
        setSelectedOrder((prev) =>
          prev ? { ...prev, status: newStatus } : null
        );
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update status");
    } finally {
      setUpdatingStatus(null);
    }
  };

  // ── Open detail dialog ────────────────────────────────────────────────────
  const openDetail = (order: Order) => {
    setSelectedOrder(order);
    setDetailOpen(true);
  };

  // ── Clear all filters ─────────────────────────────────────────────────────
  const clearFilters = () => {
    setSearch("");
    setDebouncedSearch("");
    setStatusFilter("ALL");
    setPaymentFilter("ALL");
    setGovernorateFilter("ALL");
    setDateFrom("");
    setDateTo("");
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const hasActiveFilters =
    debouncedSearch ||
    statusFilter !== "ALL" ||
    paymentFilter !== "ALL" ||
    governorateFilter !== "ALL" ||
    dateFrom ||
    dateTo;

  // ── Page change ───────────────────────────────────────────────────────────
  const goToPage = (page: number) => {
    setPagination((prev) => ({ ...prev, page }));
  };

  // ── Status timeline steps ─────────────────────────────────────────────────
  const getTimelineSteps = (order: Order) => {
    const steps: {
      label: string;
      date: string | null;
      status: "completed" | "current" | "upcoming" | "cancelled";
      icon: React.ReactNode;
    }[] = [
      {
        label: "Order Placed",
        date: order.createdAt,
        status: "completed",
        icon: <Package className="h-4 w-4" />,
      },
      {
        label: "Confirmed",
        date: order.confirmedAt,
        status: order.confirmedAt
          ? "completed"
          : ["CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED"].includes(order.status)
            ? "current"
            : order.status === "CANCELLED" || order.status === "REFUNDED"
              ? "cancelled"
              : "upcoming",
        icon: <Check className="h-4 w-4" />,
      },
      {
        label: "Processing",
        date: null,
        status: ["PROCESSING", "SHIPPED", "DELIVERED"].includes(order.status)
          ? order.status === "PROCESSING"
            ? "current"
            : "completed"
          : order.status === "CANCELLED" || order.status === "REFUNDED"
            ? "cancelled"
            : "upcoming",
        icon: <Package className="h-4 w-4" />,
      },
      {
        label: "Shipped",
        date: order.shippedAt,
        status: order.shippedAt
          ? "completed"
          : ["SHIPPED", "DELIVERED"].includes(order.status)
            ? order.status === "SHIPPED"
              ? "current"
              : "upcoming"
            : order.status === "CANCELLED" || order.status === "REFUNDED"
              ? "cancelled"
              : "upcoming",
        icon: <Truck className="h-4 w-4" />,
      },
      {
        label: "Delivered",
        date: order.deliveredAt,
        status: order.deliveredAt
          ? "completed"
          : order.status === "DELIVERED"
            ? "current"
            : order.status === "CANCELLED" || order.status === "REFUNDED"
              ? "cancelled"
              : "upcoming",
        icon: <CircleCheck className="h-4 w-4" />,
      },
    ];

    // If cancelled or refunded, show that as the final step
    if (order.status === "CANCELLED" || order.status === "REFUNDED") {
      steps.push({
        label: order.status === "CANCELLED" ? "Cancelled" : "Refunded",
        date: order.cancelledAt,
        status: "completed",
        icon:
          order.status === "CANCELLED" ? (
            <CircleX className="h-4 w-4" />
          ) : (
            <RotateCcw className="h-4 w-4" />
          ),
      });
    }

    return steps;
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="bg-muted/20 min-h-screen">
      <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8 max-w-[1600px] mx-auto">
        {/* ── Page Header ───────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-6"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Orders</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Manage and track all customer orders
              </p>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Package className="h-4 w-4" />
              <span>
                {loading
                  ? "Loading..."
                  : `${pagination.total} order${pagination.total !== 1 ? "s" : ""} total`}
              </span>
            </div>
          </div>
        </motion.div>

        {/* ── Search & Filter Bar ───────────────────────────────────────── */}
        <motion.div
          initial="hidden"
          animate="visible"
          custom={0}
          variants={fadeInUp}
          className="mb-4"
        >
          <Card className="border-border/40 bg-card/60 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex flex-col lg:flex-row gap-3">
                {/* Search input */}
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by order #, customer name, email, or phone..."
                    value={search}
                    onChange={(e) => {
                      setSearch(e.target.value);
                      setPagination((prev) => ({ ...prev, page: 1 }));
                    }}
                    className="pl-9 h-10 bg-background/50"
                  />
                  {search && (
                    <button
                      onClick={() => setSearch("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>

                {/* Status filter */}
                <Select
                  value={statusFilter}
                  onValueChange={(v) => {
                    setStatusFilter(v);
                    setPagination((prev) => ({ ...prev, page: 1 }));
                  }}
                >
                  <SelectTrigger className="w-full lg:w-[160px] h-10 bg-background/50">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">All Statuses</SelectItem>
                    {ORDER_STATUSES.map((s) => (
                      <SelectItem key={s} value={s}>
                        <span className="flex items-center gap-2">
                          <span
                            className={cn(
                              "inline-block h-2 w-2 rounded-full",
                              s === "PENDING" && "bg-yellow-500",
                              s === "CONFIRMED" && "bg-blue-500",
                              s === "PROCESSING" && "bg-indigo-500",
                              s === "SHIPPED" && "bg-purple-500",
                              s === "DELIVERED" && "bg-green-500",
                              s === "CANCELLED" && "bg-red-500",
                              s === "REFUNDED" && "bg-gray-500"
                            )}
                          />
                          {STATUS_LABELS[s]}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Payment filter */}
                <Select
                  value={paymentFilter}
                  onValueChange={(v) => {
                    setPaymentFilter(v);
                    setPagination((prev) => ({ ...prev, page: 1 }));
                  }}
                >
                  <SelectTrigger className="w-full lg:w-[160px] h-10 bg-background/50">
                    <SelectValue placeholder="Payment" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">All Payments</SelectItem>
                    {PAYMENT_STATUSES.map((s) => (
                      <SelectItem key={s} value={s}>
                        {PAYMENT_STATUS_LABELS[s]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Filter toggle button for mobile / additional filters */}
                <Button
                  variant={showFilters ? "default" : "outline"}
                  size="sm"
                  className="h-10 gap-2 shrink-0"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <Filter className="h-4 w-4" />
                  <span className="hidden sm:inline">More Filters</span>
                  {hasActiveFilters && (
                    <span className="h-2 w-2 rounded-full bg-primary-foreground bg-orange-500" />
                  )}
                </Button>

                {hasActiveFilters && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-10 text-muted-foreground hover:text-foreground"
                    onClick={clearFilters}
                  >
                    <X className="h-4 w-4 mr-1" />
                    Clear
                  </Button>
                )}
              </div>

              {/* Extended filters row */}
              {showFilters && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="mt-3 pt-3 border-t border-border/40"
                >
                  <div className="flex flex-col sm:flex-row gap-3">
                    {/* Governorate filter */}
                    <Select
                      value={governorateFilter}
                      onValueChange={(v) => {
                        setGovernorateFilter(v);
                        setPagination((prev) => ({ ...prev, page: 1 }));
                      }}
                    >
                      <SelectTrigger className="w-full sm:w-[200px] h-10 bg-background/50">
                        <SelectValue placeholder="Governorate" />
                      </SelectTrigger>
                      <SelectContent className="max-h-64">
                        <SelectItem value="ALL">All Governorates</SelectItem>
                        {GOVERNORATES.map((g) => (
                          <SelectItem key={g} value={g}>
                            {g}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    {/* Date from */}
                    <div className="flex items-center gap-2">
                      <CalendarDays className="h-4 w-4 text-muted-foreground shrink-0" />
                      <Input
                        type="date"
                        value={dateFrom}
                        onChange={(e) => {
                          setDateFrom(e.target.value);
                          setPagination((prev) => ({ ...prev, page: 1 }));
                        }}
                        className="h-10 bg-background/50 w-full sm:w-[160px]"
                        placeholder="From"
                      />
                    </div>

                    {/* Date to */}
                    <div className="flex items-center gap-2">
                      <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0" />
                      <Input
                        type="date"
                        value={dateTo}
                        onChange={(e) => {
                          setDateTo(e.target.value);
                          setPagination((prev) => ({ ...prev, page: 1 }));
                        }}
                        className="h-10 bg-background/50 w-full sm:w-[160px]"
                        placeholder="To"
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* ── Order Count Summary ───────────────────────────────────────── */}
        <motion.div
          initial="hidden"
          animate="visible"
          custom={1}
          variants={fadeInUp}
          className="mb-4"
        >
          <div className="flex flex-wrap gap-2">
            {[
              { label: "All", value: pagination.total, active: statusFilter === "ALL", color: "text-foreground" },
              { label: "Pending", value: null, active: statusFilter === "PENDING", color: "text-yellow-500", status: "PENDING" },
              { label: "Confirmed", value: null, active: statusFilter === "CONFIRMED", color: "text-blue-500", status: "CONFIRMED" },
              { label: "Shipped", value: null, active: statusFilter === "SHIPPED", color: "text-purple-500", status: "SHIPPED" },
              { label: "Delivered", value: null, active: statusFilter === "DELIVERED", color: "text-green-500", status: "DELIVERED" },
              { label: "Cancelled", value: null, active: statusFilter === "CANCELLED", color: "text-red-500", status: "CANCELLED" },
            ].map((tab) => (
              <button
                key={tab.label}
                onClick={() => {
                  if (tab.status) {
                    setStatusFilter(statusFilter === tab.status ? "ALL" : tab.status);
                  } else {
                    setStatusFilter("ALL");
                  }
                  setPagination((prev) => ({ ...prev, page: 1 }));
                }}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors",
                  tab.active
                    ? "bg-primary/10 border border-primary/20"
                    : "bg-card/40 border border-border/30 hover:bg-card/60"
                )}
              >
                <span className={tab.active ? tab.color : "text-muted-foreground"}>
                  {tab.label}
                </span>
                {tab.value !== null && (
                  <span className="text-muted-foreground">({tab.value})</span>
                )}
              </button>
            ))}
          </div>
        </motion.div>

        {/* ── Orders Table ──────────────────────────────────────────────── */}
        <motion.div
          initial="hidden"
          animate="visible"
          custom={2}
          variants={fadeInUp}
        >
          <Card className="border-border/40 bg-card/60 backdrop-blur-sm overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-border/40 hover:bg-transparent">
                    <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground h-11">
                      Order #
                    </TableHead>
                    <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground h-11">
                      Customer
                    </TableHead>
                    <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground h-11 text-center">
                      Items
                    </TableHead>
                    <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground h-11 text-right">
                      Total (EGP)
                    </TableHead>
                    <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground h-11">
                      Payment
                    </TableHead>
                    <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground h-11">
                      Status
                    </TableHead>
                    <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground h-11">
                      Pay Status
                    </TableHead>
                    <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground h-11 hidden xl:table-cell">
                      Governorate
                    </TableHead>
                    <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground h-11 hidden lg:table-cell">
                      Created
                    </TableHead>
                    <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground h-11 text-right">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    // Loading skeleton
                    Array.from({ length: 8 }).map((_, i) => (
                      <TableRow
                        key={`skeleton-${i}`}
                        className="border-border/30 hover:bg-transparent"
                      >
                        {Array.from({ length: 10 }).map((_, j) => (
                          <TableCell key={j} className="h-14 p-3">
                            <div className="h-4 w-20 bg-muted/50 rounded animate-pulse" />
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  ) : orders.length === 0 ? (
                    <TableRow className="hover:bg-transparent">
                      <TableCell
                        colSpan={10}
                        className="h-48 text-center text-muted-foreground"
                      >
                        <div className="flex flex-col items-center gap-2">
                          <Package className="h-10 w-10 text-muted-foreground/40" />
                          <p className="text-sm font-medium">No orders found</p>
                          <p className="text-xs text-muted-foreground/70">
                            {hasActiveFilters
                              ? "Try adjusting your filters"
                              : "Orders will appear here once placed"}
                          </p>
                          {hasActiveFilters && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="mt-2"
                              onClick={clearFilters}
                            >
                              Clear Filters
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    orders.map((order, index) => (
                      <TableRow
                        key={order.id}
                        className="border-border/30 cursor-pointer group transition-colors hover:bg-muted/30"
                        onClick={() => openDetail(order)}
                      >
                        {/* Order # */}
                        <TableCell className="p-3">
                          <span className="font-mono text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                            {order.orderNumber}
                          </span>
                        </TableCell>

                        {/* Customer */}
                        <TableCell className="p-3">
                          <div className="flex items-center gap-2.5">
                            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                              <User className="h-4 w-4 text-primary" />
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-medium truncate max-w-[140px]">
                                {order.shippingName}
                              </p>
                              <p className="text-xs text-muted-foreground truncate max-w-[140px]">
                                {order.customer?.email ||
                                  order.guestEmail ||
                                  order.shippingPhone}
                              </p>
                            </div>
                          </div>
                        </TableCell>

                        {/* Items count */}
                        <TableCell className="p-3 text-center">
                          <span className="inline-flex items-center justify-center h-7 w-7 rounded-md bg-muted/60 text-xs font-medium">
                            {order.items.length}
                          </span>
                        </TableCell>

                        {/* Total */}
                        <TableCell className="p-3 text-right">
                          <span className="text-sm font-semibold tabular-nums">
                            {formatEGP(order.total)}
                          </span>
                        </TableCell>

                        {/* Payment Method */}
                        <TableCell className="p-3">
                          <div className="flex items-center gap-1.5">
                            <CreditCard className="h-3.5 w-3.5 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">
                              {PAYMENT_METHOD_LABELS[order.paymentMethod || "COD"] ||
                                order.paymentMethod}
                            </span>
                          </div>
                        </TableCell>

                        {/* Status */}
                        <TableCell className="p-3">
                          <Badge
                            variant="outline"
                            className={cn(
                              "gap-1 text-[11px] font-medium",
                              getStatusColor(order.status)
                            )}
                          >
                            {getStatusIcon(order.status)}
                            {STATUS_LABELS[order.status]}
                          </Badge>
                        </TableCell>

                        {/* Payment Status */}
                        <TableCell className="p-3">
                          <Badge
                            variant="outline"
                            className={cn(
                              "text-[11px] font-medium",
                              getPaymentColor(order.paymentStatus)
                            )}
                          >
                            {PAYMENT_STATUS_LABELS[order.paymentStatus]}
                          </Badge>
                        </TableCell>

                        {/* Governorate */}
                        <TableCell className="p-3 hidden xl:table-cell">
                          <div className="flex items-center gap-1.5">
                            <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">
                              {order.shippingGovernorate}
                            </span>
                          </div>
                        </TableCell>

                        {/* Created */}
                        <TableCell className="p-3 hidden lg:table-cell">
                          <span className="text-xs text-muted-foreground">
                            {formatDate(order.createdAt)}
                          </span>
                        </TableCell>

                        {/* Actions */}
                        <TableCell className="p-3 text-right">
                          <div className="flex items-center justify-end gap-1">
                            {VALID_TRANSITIONS[order.status]?.[0] && (
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-7 px-2 text-xs"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleStatusUpdate(
                                    order.id,
                                    VALID_TRANSITIONS[order.status][0]
                                  );
                                }}
                                disabled={updatingStatus === order.id}
                              >
                                {updatingStatus === order.id ? (
                                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                ) : (
                                  <ArrowRight className="h-3.5 w-3.5" />
                                )}
                                <span className="hidden sm:inline ml-1">
                                  {STATUS_LABELS[VALID_TRANSITIONS[order.status][0]]}
                                </span>
                              </Button>
                            )}
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-7 px-2 text-xs"
                              onClick={(e) => {
                                e.stopPropagation();
                                openDetail(order);
                              }}
                            >
                              <Eye className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            {/* ── Pagination ─────────────────────────────────────────────── */}
            {!loading && orders.length > 0 && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 border-t border-border/30">
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
                  orders
                </p>
                <div className="flex items-center gap-1">
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-8 px-2"
                    disabled={pagination.page <= 1}
                    onClick={() => goToPage(pagination.page - 1)}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>

                  {/* Page numbers */}
                  {Array.from(
                    { length: Math.min(pagination.totalPages, 5) },
                    (_, i) => {
                      let pageNum: number;
                      if (pagination.totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (pagination.page <= 3) {
                        pageNum = i + 1;
                      } else if (pagination.page >= pagination.totalPages - 2) {
                        pageNum = pagination.totalPages - 4 + i;
                      } else {
                        pageNum = pagination.page - 2 + i;
                      }
                      return (
                        <Button
                          key={pageNum}
                          size="sm"
                          variant={
                            pagination.page === pageNum ? "default" : "outline"
                          }
                          className="h-8 w-8 p-0 text-xs"
                          onClick={() => goToPage(pageNum)}
                        >
                          {pageNum}
                        </Button>
                      );
                    }
                  )}

                  {pagination.totalPages > 5 && pagination.page < pagination.totalPages - 2 && (
                    <>
                      <span className="px-1 text-xs text-muted-foreground">
                        ...
                      </span>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 w-8 p-0 text-xs"
                        onClick={() => goToPage(pagination.totalPages)}
                      >
                        {pagination.totalPages}
                      </Button>
                    </>
                  )}

                  <Button
                    size="sm"
                    variant="outline"
                    className="h-8 px-2"
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

        {/* ── Order Detail Dialog ───────────────────────────────────────── */}
        <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto p-0">
            {selectedOrder && (
              <>
                {/* Dialog header */}
                <div className="sticky top-0 z-10 bg-card border-b border-border/40 px-6 py-4">
                  <DialogHeader>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <div>
                        <DialogTitle className="text-lg font-bold flex items-center gap-2">
                          <Package className="h-5 w-5 text-primary" />
                          {selectedOrder.orderNumber}
                        </DialogTitle>
                        <p className="text-sm text-muted-foreground mt-0.5">
                          Placed on {formatDate(selectedOrder.createdAt)}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant="outline"
                          className={cn(
                            "gap-1 text-xs font-medium",
                            getStatusColor(selectedOrder.status)
                          )}
                        >
                          {getStatusIcon(selectedOrder.status)}
                          {STATUS_LABELS[selectedOrder.status]}
                        </Badge>
                        <Badge
                          variant="outline"
                          className={cn(
                            "text-xs font-medium",
                            getPaymentColor(selectedOrder.paymentStatus)
                          )}
                        >
                          <CreditCard className="h-3 w-3 mr-1" />
                          {PAYMENT_STATUS_LABELS[selectedOrder.paymentStatus]}
                        </Badge>
                      </div>
                    </div>
                  </DialogHeader>
                </div>

                <div className="px-6 py-4 space-y-6">
                  {/* ── Customer & Shipping Info ─────────────────────────── */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Customer info */}
                    <Card className="border-border/40 bg-background/50">
                      <CardHeader className="pb-3 pt-4 px-4">
                        <CardTitle className="text-sm font-semibold flex items-center gap-2">
                          <User className="h-4 w-4 text-primary" />
                          Customer
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="px-4 pb-4 space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <span className="text-muted-foreground w-16">Name</span>
                          <span className="font-medium">
                            {selectedOrder.shippingName}
                          </span>
                        </div>
                        {selectedOrder.customer?.email && (
                          <div className="flex items-center gap-2 text-sm">
                            <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                            <span className="text-muted-foreground">
                              {selectedOrder.customer.email}
                            </span>
                          </div>
                        )}
                        {selectedOrder.customer?.phone && (
                          <div className="flex items-center gap-2 text-sm">
                            <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                            <span className="text-muted-foreground">
                              {selectedOrder.customer.phone}
                            </span>
                          </div>
                        )}
                        {selectedOrder.guestEmail && !selectedOrder.customer?.email && (
                          <div className="flex items-center gap-2 text-sm">
                            <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                            <span className="text-muted-foreground">
                              {selectedOrder.guestEmail}
                            </span>
                          </div>
                        )}
                      </CardContent>
                    </Card>

                    {/* Shipping info */}
                    <Card className="border-border/40 bg-background/50">
                      <CardHeader className="pb-3 pt-4 px-4">
                        <CardTitle className="text-sm font-semibold flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-primary" />
                          Shipping Address
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="px-4 pb-4 space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <span className="text-muted-foreground w-16">Phone</span>
                          <span className="font-medium">
                            {selectedOrder.shippingPhone}
                          </span>
                        </div>
                        <div className="flex items-start gap-2 text-sm">
                          <span className="text-muted-foreground w-16 shrink-0">
                            Address
                          </span>
                          <span>
                            {selectedOrder.shippingAddress},{" "}
                            {selectedOrder.shippingCity},{" "}
                            {selectedOrder.shippingGovernorate}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* ── Order Items ─────────────────────────────────────── */}
                  <Card className="border-border/40 bg-background/50">
                    <CardHeader className="pb-3 pt-4 px-4">
                      <CardTitle className="text-sm font-semibold flex items-center gap-2">
                        <Package className="h-4 w-4 text-primary" />
                        Order Items
                        <Badge variant="secondary" className="ml-auto text-xs">
                          {selectedOrder.items.length} item
                          {selectedOrder.items.length !== 1 ? "s" : ""}
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="px-4 pb-4">
                      <div className="rounded-lg border border-border/40 overflow-hidden">
                        <Table>
                          <TableHeader>
                            <TableRow className="border-border/30 hover:bg-transparent">
                              <TableHead className="h-9 text-xs">Product</TableHead>
                              <TableHead className="h-9 text-xs text-center">
                                Qty
                              </TableHead>
                              <TableHead className="h-9 text-xs text-right">
                                Price
                              </TableHead>
                              <TableHead className="h-9 text-xs text-right">
                                Total
                              </TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {selectedOrder.items.map((item) => (
                              <TableRow
                                key={item.productName}
                                className="border-border/30 hover:bg-muted/30"
                              >
                                <TableCell className="py-2.5">
                                  <div className="flex items-center gap-3">
                                    {item.product?.image ? (
                                      <div className="h-10 w-10 rounded-md overflow-hidden bg-muted/50 shrink-0">
                                        <Image
                                          src={item.product.image}
                                          alt={item.productName}
                                          width={40}
                                          height={40}
                                          className="h-full w-full object-cover"
                                        />
                                      </div>
                                    ) : (
                                      <div className="h-10 w-10 rounded-md bg-muted/50 flex items-center justify-center shrink-0">
                                        <Package className="h-4 w-4 text-muted-foreground/50" />
                                      </div>
                                    )}
                                    <div className="min-w-0">
                                      <p className="text-sm font-medium truncate max-w-[200px]">
                                        {item.product?.name || item.productName}
                                      </p>
                                      {item.product?.strength && (
                                        <p className="text-[11px] text-muted-foreground">
                                          {item.product.strength}mg
                                        </p>
                                      )}
                                    </div>
                                  </div>
                                </TableCell>
                                <TableCell className="py-2.5 text-center text-sm">
                                  {item.quantity}
                                </TableCell>
                                <TableCell className="py-2.5 text-right text-sm tabular-nums text-muted-foreground">
                                  {formatEGP(item.unitPrice)}
                                </TableCell>
                                <TableCell className="py-2.5 text-right text-sm font-medium tabular-nums">
                                  {formatEGP(item.total)}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>

                      {/* Order totals */}
                      <Separator className="my-3 bg-border/40" />
                      <div className="space-y-1.5 text-sm">
                        <div className="flex justify-between text-muted-foreground">
                          <span>Subtotal</span>
                          <span className="tabular-nums">
                            {formatEGP(selectedOrder.subtotal)}
                          </span>
                        </div>
                        {selectedOrder.discount > 0 && (
                          <div className="flex justify-between text-green-500">
                            <span>Discount</span>
                            <span className="tabular-nums">
                              -{formatEGP(selectedOrder.discount)}
                            </span>
                          </div>
                        )}
                        <div className="flex justify-between text-muted-foreground">
                          <span>Shipping</span>
                          <span className="tabular-nums">
                            {selectedOrder.shippingCost > 0
                              ? formatEGP(selectedOrder.shippingCost)
                              : "Free"}
                          </span>
                        </div>
                        {selectedOrder.tax > 0 && (
                          <div className="flex justify-between text-muted-foreground">
                            <span>VAT (14%)</span>
                            <span className="tabular-nums">
                              {formatEGP(selectedOrder.tax)}
                            </span>
                          </div>
                        )}
                        <Separator className="bg-border/40" />
                        <div className="flex justify-between font-bold text-base">
                          <span>Total</span>
                          <span className="tabular-nums text-primary">
                            {formatEGP(selectedOrder.total)}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* ── Payment Info ─────────────────────────────────────── */}
                  <Card className="border-border/40 bg-background/50">
                    <CardHeader className="pb-3 pt-4 px-4">
                      <CardTitle className="text-sm font-semibold flex items-center gap-2">
                        <CreditCard className="h-4 w-4 text-primary" />
                        Payment
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="px-4 pb-4">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="space-y-1">
                          <p className="text-xs text-muted-foreground">Method</p>
                          <p className="text-sm font-medium">
                            {PAYMENT_METHOD_LABELS[
                              selectedOrder.paymentMethod || "COD"
                            ] || selectedOrder.paymentMethod}
                          </p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-xs text-muted-foreground">Status</p>
                          <Badge
                            variant="outline"
                            className={cn(
                              "text-[11px] font-medium",
                              getPaymentColor(selectedOrder.paymentStatus)
                            )}
                          >
                            {PAYMENT_STATUS_LABELS[selectedOrder.paymentStatus]}
                          </Badge>
                        </div>
                        <div className="space-y-1">
                          <p className="text-xs text-muted-foreground">Amount</p>
                          <p className="text-sm font-semibold tabular-nums">
                            {formatEGP(selectedOrder.total)}
                          </p>
                        </div>
                      </div>
                      {selectedOrder.payments.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-border/40">
                          <p className="text-xs text-muted-foreground mb-2">
                            Payment Transactions
                          </p>
                          <div className="space-y-2">
                            {selectedOrder.payments.map((payment, idx) => (
                              <div
                                key={idx}
                                className="flex items-center justify-between text-sm py-1"
                              >
                                <div className="flex items-center gap-2">
                                  <CreditCard className="h-3.5 w-3.5 text-muted-foreground" />
                                  <span>
                                    {PAYMENT_METHOD_LABELS[payment.method] ||
                                      payment.method}
                                  </span>
                                </div>
                                <div className="flex items-center gap-3">
                                  <Badge
                                    variant="outline"
                                    className={cn(
                                      "text-[10px] font-medium",
                                      getPaymentColor(payment.status)
                                    )}
                                  >
                                    {PAYMENT_STATUS_LABELS[payment.status]}
                                  </Badge>
                                  <span className="font-medium tabular-nums">
                                    {formatEGP(payment.amount)}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* ── Status Timeline ──────────────────────────────────── */}
                  <Card className="border-border/40 bg-background/50">
                    <CardHeader className="pb-3 pt-4 px-4">
                      <CardTitle className="text-sm font-semibold flex items-center gap-2">
                        <Clock className="h-4 w-4 text-primary" />
                        Status Timeline
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="px-4 pb-4">
                      <div className="relative">
                        {getTimelineSteps(selectedOrder).map(
                          (step, idx, arr) => {
                            const isLast = idx === arr.length - 1;
                            return (
                              <div
                                key={step.label}
                                className="flex gap-3 relative"
                              >
                                {/* Vertical line */}
                                {!isLast && (
                                  <div
                                    className={cn(
                                      "absolute left-[15px] top-8 w-px h-[calc(100%-8px)]",
                                      step.status === "completed"
                                        ? "bg-primary/30"
                                        : step.status === "cancelled"
                                          ? "bg-red-500/20"
                                          : "bg-border/40"
                                    )}
                                  />
                                )}
                                {/* Icon circle */}
                                <div
                                  className={cn(
                                    "relative z-10 h-8 w-8 rounded-full flex items-center justify-center shrink-0 border-2 transition-colors",
                                    step.status === "completed" &&
                                      step.label !== "Cancelled" &&
                                      step.label !== "Refunded"
                                      ? "bg-primary/20 border-primary/50 text-primary"
                                      : step.status === "completed" &&
                                          (step.label === "Cancelled" ||
                                            step.label === "Refunded")
                                        ? "bg-red-500/20 border-red-500/50 text-red-500"
                                        : step.status === "current"
                                          ? "bg-primary border-primary text-primary-foreground"
                                          : step.status === "cancelled"
                                            ? "bg-muted/30 border-border/40 text-muted-foreground/40"
                                            : "bg-muted/30 border-border/40 text-muted-foreground/40"
                                  )}
                                >
                                  {step.status === "completed" &&
                                  step.label !== "Cancelled" &&
                                  step.label !== "Refunded" ? (
                                    <Check className="h-3.5 w-3.5" />
                                  ) : step.status === "completed" ? (
                                    step.icon
                                  ) : step.status === "current" ? (
                                    step.icon
                                  ) : (
                                    step.icon
                                  )}
                                </div>
                                {/* Content */}
                                <div className="flex-1 pb-4">
                                  <p
                                    className={cn(
                                      "text-sm font-medium",
                                      step.status === "upcoming" ||
                                        step.status === "cancelled"
                                        ? "text-muted-foreground/60"
                                        : ""
                                    )}
                                  >
                                    {step.label}
                                  </p>
                                  {step.date && (
                                    <p className="text-xs text-muted-foreground mt-0.5">
                                      {formatDate(step.date)}
                                    </p>
                                  )}
                                </div>
                              </div>
                            );
                          }
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  {/* ── Notes ────────────────────────────────────────────── */}
                  {selectedOrder.notes && (
                    <Card className="border-border/40 bg-background/50">
                      <CardHeader className="pb-3 pt-4 px-4">
                        <CardTitle className="text-sm font-semibold flex items-center gap-2">
                          <FileText className="h-4 w-4 text-primary" />
                          Notes
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="px-4 pb-4">
                        <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                          {selectedOrder.notes}
                        </p>
                      </CardContent>
                    </Card>
                  )}

                  {/* ── Action Buttons ───────────────────────────────────── */}
                  {VALID_TRANSITIONS[selectedOrder.status]?.length > 0 && (
                    <Card className="border-border/40 bg-background/50">
                      <CardHeader className="pb-3 pt-4 px-4">
                        <CardTitle className="text-sm font-semibold flex items-center gap-2">
                          <ArrowRight className="h-4 w-4 text-primary" />
                          Update Status
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="px-4 pb-4">
                        <div className="flex flex-wrap gap-2">
                          {VALID_TRANSITIONS[selectedOrder.status].map(
                            (nextStatus) => (
                              <Button
                                key={nextStatus}
                                variant="outline"
                                size="sm"
                                className={cn(
                                  "gap-2",
                                  nextStatus === "CANCELLED" &&
                                    "border-red-500/30 text-red-500 hover:bg-red-500/10 hover:text-red-500",
                                  nextStatus === "CONFIRMED" &&
                                    "border-blue-500/30 text-blue-500 hover:bg-blue-500/10 hover:text-blue-500",
                                  nextStatus === "PROCESSING" &&
                                    "border-indigo-500/30 text-indigo-500 hover:bg-indigo-500/10 hover:text-indigo-500",
                                  nextStatus === "SHIPPED" &&
                                    "border-purple-500/30 text-purple-500 hover:bg-purple-500/10 hover:text-purple-500",
                                  nextStatus === "DELIVERED" &&
                                    "border-green-500/30 text-green-500 hover:bg-green-500/10 hover:text-green-500",
                                  nextStatus === "REFUNDED" &&
                                    "border-gray-500/30 text-gray-500 hover:bg-gray-500/10 hover:text-gray-500"
                                )}
                                onClick={() =>
                                  handleStatusUpdate(
                                    selectedOrder.id,
                                    nextStatus
                                  )
                                }
                                disabled={updatingStatus === selectedOrder.id}
                              >
                                {updatingStatus === selectedOrder.id ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  getStatusIcon(nextStatus)
                                )}
                                {STATUS_LABELS[nextStatus]}
                              </Button>
                            )
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}