"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

// ─── Shadcn UI Components ───────────────────────────────────────────────────
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// ─── Icons ───────────────────────────────────────────────────────────────────
import {
  Search,
  Plus,
  Pencil,
  Trash2,
  Loader2,
  Star,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
  PackageX,
  RefreshCw,
} from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────────────

interface ProductBrand {
  id: string;
  name: string;
  slug: string;
}

interface ProductCategory {
  id: string;
  name: string;
}

interface ProductCount {
  reviews: number;
  orderItems: number;
}

interface Product {
  id: string;
  name: string;
  nameAr: string | null;
  slug: string;
  shortDescription: string | null;
  strength: number;
  flavor: string;
  canCount: number;
  price: number;
  comparePrice: number | null;
  stock: number;
  sku: string;
  image: string;
  images: string;
  isFeatured: boolean;
  isBestseller: boolean;
  isActive: boolean;
  brand: ProductBrand;
  category: ProductCategory;
  _count: ProductCount;
  createdAt: string;
  updatedAt: string;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface ProductFormData {
  name: string;
  nameAr: string;
  slug: string;
  shortDescription: string;
  description: string;
  strength: string;
  flavor: string;
  canCount: string;
  price: string;
  comparePrice: string;
  stock: string;
  sku: string;
  image: string;
  images: string;
  isFeatured: boolean;
  isBestseller: boolean;
  isActive: boolean;
  brandId: string;
  categoryId: string;
  metaTitle: string;
  metaDescription: string;
  sortOrder: string;
}

const emptyForm: ProductFormData = {
  name: "",
  nameAr: "",
  slug: "",
  shortDescription: "",
  description: "",
  strength: "",
  flavor: "",
  canCount: "20",
  price: "",
  comparePrice: "",
  stock: "0",
  sku: "",
  image: "",
  images: "[]",
  isFeatured: false,
  isBestseller: false,
  isActive: true,
  brandId: "",
  categoryId: "",
  metaTitle: "",
  metaDescription: "",
  sortOrder: "0",
};

// ─── Helpers ────────────────────────────────────────────────────────────────

function getStrengthColor(strength: number) {
  if (strength >= 30) return "text-red-500";
  if (strength >= 20) return "text-orange-500";
  if (strength >= 12) return "text-amber-500";
  return "text-green-500";
}

function getStrengthBg(strength: number) {
  if (strength >= 30) return "bg-red-500/10 text-red-500 border-red-500/20";
  if (strength >= 20) return "bg-orange-500/10 text-orange-500 border-orange-500/20";
  if (strength >= 12) return "bg-amber-500/10 text-amber-500 border-amber-500/20";
  return "bg-green-500/10 text-green-500 border-green-500/20";
}

function formatEGP(amount: number) {
  return `EGP ${amount.toLocaleString("en-EG", { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
}

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

// ─── Animation Variants ─────────────────────────────────────────────────────

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

// ─── Component ──────────────────────────────────────────────────────────────

export default function AdminProductsPage() {
  // Data state
  const [products, setProducts] = useState<Product[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  });
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [brandFilter, setBrandFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);

  // Selection
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [selectAll, setSelectAll] = useState(false);

  // Dialogs
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState<Product | null>(null);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  // Form state
  const [formData, setFormData] = useState<ProductFormData>(emptyForm);
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof ProductFormData, string>>>({});
  const [brands, setBrands] = useState<{ id: string; name: string }[]>([]);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);

  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ─── Fetch Products ─────────────────────────────────────────────────────

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set("page", currentPage.toString());
      params.set("limit", "20");
      if (debouncedSearch) params.set("search", debouncedSearch);
      if (brandFilter !== "all") params.set("brandId", brandFilter);
      if (statusFilter !== "all") params.set("active", statusFilter);

      const res = await fetch(`/api/admin/products?${params.toString()}`);
      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: "Failed to fetch products" }));
        throw new Error(err.error || "Failed to fetch products");
      }
      const data = await res.json();

      setProducts(data.products || []);
      setPagination(data.pagination || { page: 1, limit: 20, total: 0, totalPages: 0 });

      // Derive brands & categories from products
      const brandMap = new Map<string, { id: string; name: string }>();
      const catMap = new Map<string, { id: string; name: string }>();
      for (const p of data.products || []) {
        if (p.brand?.id && p.brand?.name) brandMap.set(p.brand.id, { id: p.brand.id, name: p.brand.name });
        if (p.category?.id && p.category?.name) catMap.set(p.category.id, { id: p.category.id, name: p.category.name });
      }
      if (brandMap.size > 0) setBrands(Array.from(brandMap.values()).sort((a, b) => a.name.localeCompare(b.name)));
      if (catMap.size > 0) setCategories(Array.from(catMap.values()).sort((a, b) => a.name.localeCompare(b.name)));
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to fetch products");
    } finally {
      setLoading(false);
    }
  }, [currentPage, debouncedSearch, brandFilter, statusFilter]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // ─── Debounced Search ────────────────────────────────────────────────────

  useEffect(() => {
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    debounceTimerRef.current = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setCurrentPage(1);
    }, 300);
    return () => {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    };
  }, [searchQuery]);

  // Reset page on filter change
  useEffect(() => {
    setCurrentPage(1);
  }, [brandFilter, statusFilter]);

  // Clear selection on page/filter change
  useEffect(() => {
    setSelectedIds(new Set());
    setSelectAll(false);
  }, [currentPage, debouncedSearch, brandFilter, statusFilter]);

  // ─── Selection Logic ─────────────────────────────────────────────────────

  const toggleSelectAll = () => {
    if (selectAll) {
      setSelectedIds(new Set());
      setSelectAll(false);
    } else {
      setSelectedIds(new Set(products.map((p) => p.id)));
      setSelectAll(true);
    }
  };

  const toggleSelectOne = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  useEffect(() => {
    if (products.length > 0 && selectedIds.size === products.length) {
      setSelectAll(true);
    } else {
      setSelectAll(false);
    }
  }, [products.length, selectedIds.size]);

  // ─── Form Helpers ────────────────────────────────────────────────────────

  const updateField = (field: keyof ProductFormData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setFormErrors((prev) => ({ ...prev, [field]: undefined }));
    // Auto-generate slug from name
    if (field === "name" && typeof value === "string" && !formData.slug) {
      setFormData((prev) => ({ ...prev, slug: generateSlug(value) }));
    }
  };

  const validateForm = (): boolean => {
    const errors: Partial<Record<keyof ProductFormData, string>> = {};
    if (!formData.name.trim()) errors.name = "Name is required";
    if (!formData.slug.trim()) errors.slug = "Slug is required";
    if (!formData.strength || isNaN(Number(formData.strength)) || Number(formData.strength) < 0)
      errors.strength = "Valid strength is required";
    if (!formData.price || isNaN(Number(formData.price)) || Number(formData.price) <= 0)
      errors.price = "Valid price is required";
    if (!formData.sku.trim()) errors.sku = "SKU is required";
    if (!formData.brandId) errors.brandId = "Brand is required";
    if (!formData.categoryId) errors.categoryId = "Category is required";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const populateForm = (product: Product) => {
    setFormData({
      name: product.name,
      nameAr: product.nameAr || "",
      slug: product.slug,
      shortDescription: product.shortDescription || "",
      description: "",
      strength: product.strength.toString(),
      flavor: product.flavor,
      canCount: product.canCount.toString(),
      price: product.price.toString(),
      comparePrice: product.comparePrice?.toString() || "",
      stock: product.stock.toString(),
      sku: product.sku,
      image: product.image || "",
      images: product.images || "[]",
      isFeatured: product.isFeatured,
      isBestseller: product.isBestseller,
      isActive: product.isActive,
      brandId: product.brand?.id || "",
      categoryId: product.category?.id || "",
      metaTitle: "",
      metaDescription: "",
      sortOrder: "0",
    });
    setFormErrors({});
  };

  // ─── Create Product ───────────────────────────────────────────────────────

  const handleCreate = async () => {
    if (!validateForm()) return;
    setActionLoading(true);
    try {
      const body = {
        name: formData.name,
        nameAr: formData.nameAr || null,
        slug: formData.slug,
        shortDescription: formData.shortDescription || null,
        description: formData.description || null,
        strength: Number(formData.strength),
        flavor: formData.flavor,
        canCount: Number(formData.canCount) || 20,
        price: Number(formData.price),
        comparePrice: formData.comparePrice ? Number(formData.comparePrice) : null,
        stock: Number(formData.stock) || 0,
        sku: formData.sku,
        image: formData.image || "",
        images: formData.images || "[]",
        isFeatured: formData.isFeatured,
        isBestseller: formData.isBestseller,
        isActive: formData.isActive,
        brandId: formData.brandId,
        categoryId: formData.categoryId,
        metaTitle: formData.metaTitle || null,
        metaDescription: formData.metaDescription || null,
        sortOrder: Number(formData.sortOrder) || 0,
      };

      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create product");

      toast.success(`Product "${formData.name}" created successfully`);
      setCreateDialogOpen(false);
      setFormData(emptyForm);
      fetchProducts();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to create product");
    } finally {
      setActionLoading(false);
    }
  };

  // ─── Edit Product ─────────────────────────────────────────────────────────

  const handleEdit = async () => {
    if (!productToEdit || !validateForm()) return;
    setActionLoading(true);
    try {
      const body: Record<string, unknown> = {
        name: formData.name,
        nameAr: formData.nameAr || null,
        slug: formData.slug,
        shortDescription: formData.shortDescription || null,
        description: formData.description || null,
        strength: Number(formData.strength),
        flavor: formData.flavor,
        canCount: Number(formData.canCount) || 20,
        price: Number(formData.price),
        comparePrice: formData.comparePrice ? Number(formData.comparePrice) : null,
        stock: Number(formData.stock) || 0,
        sku: formData.sku,
        image: formData.image || "",
        images: formData.images || "[]",
        isFeatured: formData.isFeatured,
        isBestseller: formData.isBestseller,
        isActive: formData.isActive,
        brandId: formData.brandId,
        categoryId: formData.categoryId,
        metaTitle: formData.metaTitle || null,
        metaDescription: formData.metaDescription || null,
        sortOrder: Number(formData.sortOrder) || 0,
      };

      const res = await fetch(`/api/admin/products/${productToEdit.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update product");

      toast.success(`Product "${formData.name}" updated successfully`);
      setEditDialogOpen(false);
      setProductToEdit(null);
      fetchProducts();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update product");
    } finally {
      setActionLoading(false);
    }
  };

  // ─── Delete Product (soft) ───────────────────────────────────────────────

  const handleDelete = async () => {
    if (!productToDelete) return;
    setActionLoading(true);
    try {
      const res = await fetch(`/api/admin/products/${productToDelete.id}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to delete product");

      toast.success(`Product "${productToDelete.name}" deactivated successfully`);
      setDeleteDialogOpen(false);
      setProductToDelete(null);
      fetchProducts();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to delete product");
    } finally {
      setActionLoading(false);
    }
  };

  // ─── Bulk Actions ─────────────────────────────────────────────────────────

  const handleBulkActivate = async () => {
    if (selectedIds.size === 0) return;
    setActionLoading(true);
    try {
      await Promise.all(
        Array.from(selectedIds).map((id) =>
          fetch(`/api/admin/products/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ isActive: true }),
          })
        )
      );
      toast.success(`${selectedIds.size} product(s) activated`);
      setSelectedIds(new Set());
      setSelectAll(false);
      fetchProducts();
    } catch {
      toast.error("Failed to activate products");
    } finally {
      setActionLoading(false);
    }
  };

  const handleBulkDeactivate = async () => {
    if (selectedIds.size === 0) return;
    setActionLoading(true);
    try {
      await Promise.all(
        Array.from(selectedIds).map((id) =>
          fetch(`/api/admin/products/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ isActive: false }),
          })
        )
      );
      toast.success(`${selectedIds.size} product(s) deactivated`);
      setSelectedIds(new Set());
      setSelectAll(false);
      fetchProducts();
    } catch {
      toast.error("Failed to deactivate products");
    } finally {
      setActionLoading(false);
    }
  };

  // ─── Computed Values ──────────────────────────────────────────────────────

  const showingFrom = pagination.total > 0 ? (pagination.page - 1) * pagination.limit + 1 : 0;
  const showingTo = Math.min(pagination.page * pagination.limit, pagination.total);
  const paginationRange = useMemo(() => {
    const total = pagination.totalPages;
    const current = pagination.page;
    const pages: (number | "ellipsis")[] = [];

    if (total <= 7) {
      for (let i = 1; i <= total; i++) pages.push(i);
    } else {
      pages.push(1);
      if (current > 3) pages.push("ellipsis");
      for (
        let i = Math.max(2, current - 1);
        i <= Math.min(total - 1, current + 1);
        i++
      ) {
        pages.push(i);
      }
      if (current < total - 2) pages.push("ellipsis");
      pages.push(total);
    }
    return pages;
  }, [pagination.totalPages, pagination.page]);

  // ─── Product Form Dialog ───────────────────────────────────────────────────

  const ProductFormDialog = ({
    open,
    onOpenChange,
    title,
    onSubmit,
    submitLabel,
  }: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title: string;
    onSubmit: () => void;
    submitLabel: string;
  }) => (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
          {/* Name (EN) */}
          <div className="space-y-2">
            <Label htmlFor="form-name">
              Name (English) <span className="text-destructive">*</span>
            </Label>
            <Input
              id="form-name"
              placeholder="e.g. Ice Cool Mint"
              value={formData.name}
              onChange={(e) => updateField("name", e.target.value)}
            />
            {formErrors.name && <p className="text-xs text-destructive">{formErrors.name}</p>}
          </div>

          {/* Name (AR) */}
          <div className="space-y-2">
            <Label htmlFor="form-nameAr">Name (Arabic)</Label>
            <Input
              id="form-nameAr"
              placeholder="e.g. نعناع مثلج"
              dir="rtl"
              value={formData.nameAr}
              onChange={(e) => updateField("nameAr", e.target.value)}
            />
          </div>

          {/* Slug */}
          <div className="space-y-2">
            <Label htmlFor="form-slug">
              Slug <span className="text-destructive">*</span>
            </Label>
            <Input
              id="form-slug"
              placeholder="e.g. ice-cool-mint"
              value={formData.slug}
              onChange={(e) => updateField("slug", e.target.value)}
            />
            {formErrors.slug && <p className="text-xs text-destructive">{formErrors.slug}</p>}
          </div>

          {/* SKU */}
          <div className="space-y-2">
            <Label htmlFor="form-sku">
              SKU <span className="text-destructive">*</span>
            </Label>
            <Input
              id="form-sku"
              placeholder="e.g. SN-ICM-001"
              value={formData.sku}
              onChange={(e) => updateField("sku", e.target.value)}
            />
            {formErrors.sku && <p className="text-xs text-destructive">{formErrors.sku}</p>}
          </div>

          {/* Brand */}
          <div className="space-y-2">
            <Label>
              Brand <span className="text-destructive">*</span>
            </Label>
            <Select value={formData.brandId} onValueChange={(v) => updateField("brandId", v)}>
              <SelectTrigger className={formErrors.brandId ? "border-destructive" : ""}>
                <SelectValue placeholder="Select brand" />
              </SelectTrigger>
              <SelectContent>
                {brands.map((b) => (
                  <SelectItem key={b.id} value={b.id}>
                    {b.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {formErrors.brandId && <p className="text-xs text-destructive">{formErrors.brandId}</p>}
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label>
              Category <span className="text-destructive">*</span>
            </Label>
            <Select value={formData.categoryId} onValueChange={(v) => updateField("categoryId", v)}>
              <SelectTrigger className={formErrors.categoryId ? "border-destructive" : ""}>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {formErrors.categoryId && <p className="text-xs text-destructive">{formErrors.categoryId}</p>}
          </div>

          {/* Strength */}
          <div className="space-y-2">
            <Label htmlFor="form-strength">
              Strength (mg) <span className="text-destructive">*</span>
            </Label>
            <Input
              id="form-strength"
              type="number"
              min="0"
              placeholder="e.g. 12"
              value={formData.strength}
              onChange={(e) => updateField("strength", e.target.value)}
            />
            {formErrors.strength && <p className="text-xs text-destructive">{formErrors.strength}</p>}
          </div>

          {/* Flavor */}
          <div className="space-y-2">
            <Label htmlFor="form-flavor">Flavor</Label>
            <Input
              id="form-flavor"
              placeholder="e.g. Mint"
              value={formData.flavor}
              onChange={(e) => updateField("flavor", e.target.value)}
            />
          </div>

          {/* Can Count */}
          <div className="space-y-2">
            <Label htmlFor="form-canCount">Can Count</Label>
            <Input
              id="form-canCount"
              type="number"
              min="1"
              value={formData.canCount}
              onChange={(e) => updateField("canCount", e.target.value)}
            />
          </div>

          {/* Price */}
          <div className="space-y-2">
            <Label htmlFor="form-price">
              Price (EGP) <span className="text-destructive">*</span>
            </Label>
            <Input
              id="form-price"
              type="number"
              min="0"
              step="0.01"
              placeholder="e.g. 299"
              value={formData.price}
              onChange={(e) => updateField("price", e.target.value)}
            />
            {formErrors.price && <p className="text-xs text-destructive">{formErrors.price}</p>}
          </div>

          {/* Compare Price */}
          <div className="space-y-2">
            <Label htmlFor="form-comparePrice">Compare Price (EGP)</Label>
            <Input
              id="form-comparePrice"
              type="number"
              min="0"
              step="0.01"
              placeholder="Original price before discount"
              value={formData.comparePrice}
              onChange={(e) => updateField("comparePrice", e.target.value)}
            />
          </div>

          {/* Stock */}
          <div className="space-y-2">
            <Label htmlFor="form-stock">Stock</Label>
            <Input
              id="form-stock"
              type="number"
              min="0"
              value={formData.stock}
              onChange={(e) => updateField("stock", e.target.value)}
            />
          </div>

          {/* Image URL */}
          <div className="space-y-2">
            <Label htmlFor="form-image">Image URL</Label>
            <Input
              id="form-image"
              placeholder="https://..."
              value={formData.image}
              onChange={(e) => updateField("image", e.target.value)}
            />
          </div>

          {/* Images JSON */}
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="form-images">Additional Images (JSON array)</Label>
            <Textarea
              id="form-images"
              placeholder='["url1", "url2"]'
              rows={2}
              value={formData.images}
              onChange={(e) => updateField("images", e.target.value)}
            />
          </div>

          {/* Short Description */}
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="form-shortDescription">Short Description</Label>
            <Textarea
              id="form-shortDescription"
              placeholder="Brief product description"
              rows={2}
              value={formData.shortDescription}
              onChange={(e) => updateField("shortDescription", e.target.value)}
            />
          </div>

          {/* Toggles Row */}
          <div className="flex items-center gap-6 md:col-span-2 flex-wrap">
            <div className="flex items-center gap-2">
              <Switch
                checked={formData.isActive}
                onCheckedChange={(checked) => updateField("isActive", checked)}
              />
              <Label className="cursor-pointer" onClick={() => updateField("isActive", !formData.isActive)}>
                Active
              </Label>
            </div>
            <div className="flex items-center gap-2">
              <Switch
                checked={formData.isFeatured}
                onCheckedChange={(checked) => updateField("isFeatured", checked)}
              />
              <Label className="cursor-pointer" onClick={() => updateField("isFeatured", !formData.isFeatured)}>
                Featured
              </Label>
            </div>
            <div className="flex items-center gap-2">
              <Switch
                checked={formData.isBestseller}
                onCheckedChange={(checked) => updateField("isBestseller", checked)}
              />
              <Label className="cursor-pointer" onClick={() => updateField("isBestseller", !formData.isBestseller)}>
                Bestseller
              </Label>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={actionLoading}
          >
            Cancel
          </Button>
          <Button onClick={onSubmit} disabled={actionLoading}>
            {actionLoading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
            {submitLabel}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <motion.div
      variants={fadeInUp}
      initial="hidden"
      animate="visible"
      className="bg-muted/20 min-h-screen"
    >
      <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8 max-w-[1400px] mx-auto">
        {/* ─── Page Header ──────────────────────────────────────────────── */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight">Products</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage your product catalog</p>
        </div>

        {/* ─── Toolbar: Filters + Actions ───────────────────────────────── */}
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          {/* Search */}
          <div className="relative flex-1 min-w-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, SKU, or flavor..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Brand Filter */}
          <Select value={brandFilter} onValueChange={setBrandFilter}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="All Brands" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Brands</SelectItem>
              {brands.map((b) => (
                <SelectItem key={b.id} value={b.id}>
                  {b.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Status Filter */}
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="true">Active</SelectItem>
              <SelectItem value="false">Inactive</SelectItem>
            </SelectContent>
          </Select>

          {/* Create Product Button */}
          <Dialog open={createDialogOpen} onOpenChange={(open) => {
            setCreateDialogOpen(open);
            if (open) setFormData(emptyForm);
          }}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Add Product
              </Button>
            </DialogTrigger>
            <ProductFormDialog
              open={createDialogOpen}
              onOpenChange={setCreateDialogOpen}
              title="Create New Product"
              onSubmit={handleCreate}
              submitLabel="Create Product"
            />
          </Dialog>
        </div>

        {/* ─── Bulk Actions Bar ───────────────────────────────────────── */}
        {selectedIds.size > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 mb-4 p-3 rounded-lg bg-primary/5 border border-primary/20"
          >
            <span className="text-sm font-medium text-muted-foreground">
              {selectedIds.size} selected
            </span>
            <Button size="sm" variant="outline" onClick={handleBulkActivate} disabled={actionLoading}>
              {actionLoading ? <Loader2 className="h-3 w-3 animate-spin mr-1" /> : null}
              Activate
            </Button>
            <Button size="sm" variant="outline" onClick={handleBulkDeactivate} disabled={actionLoading}>
              Deactivate
            </Button>
          </motion.div>
        )}

        {/* ─── Summary ─────────────────────────────────────────────────── */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-muted-foreground">
            Showing {showingFrom}–{showingTo} of {pagination.total} products
          </p>
          <Button
            variant="ghost"
            size="sm"
            onClick={fetchProducts}
            disabled={loading}
            className="gap-1.5"
          >
            <RefreshCw className={cn("h-3.5 w-3.5", loading && "animate-spin")} />
            Refresh
          </Button>
        </div>

        {/* ─── Products Table ───────────────────────────────────────────── */}
        <div className="rounded-xl border border-border/50 bg-card overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="w-10">
                    <Checkbox
                      checked={selectAll}
                      onCheckedChange={toggleSelectAll}
                    />
                  </TableHead>
                  <TableHead className="w-[70px]">Image</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead className="hidden md:table-cell">SKU</TableHead>
                  <TableHead className="hidden lg:table-cell">Brand</TableHead>
                  <TableHead className="hidden lg:table-cell">Category</TableHead>
                  <TableHead>Strength</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead className="hidden sm:table-cell">Stock</TableHead>
                  <TableHead className="hidden sm:table-cell">Status</TableHead>
                  <TableHead className="hidden xl:table-cell">Featured</TableHead>
                  <TableHead className="hidden xl:table-cell">Best</TableHead>
                  <TableHead className="w-[100px] text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {loading ? (
                  // Loading skeleton rows
                  Array.from({ length: 8 }).map((_, i) => (
                    <TableRow key={`skeleton-${i}`}>
                      <TableCell>
                        <div className="h-4 w-4 animate-pulse bg-muted rounded" />
                      </TableCell>
                      <TableCell>
                        <div className="h-10 w-10 animate-pulse bg-muted rounded-lg" />
                      </TableCell>
                      <TableCell>
                        <div className="h-4 w-32 animate-pulse bg-muted rounded" />
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <div className="h-4 w-20 animate-pulse bg-muted rounded" />
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        <div className="h-4 w-16 animate-pulse bg-muted rounded" />
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        <div className="h-4 w-16 animate-pulse bg-muted rounded" />
                      </TableCell>
                      <TableCell>
                        <div className="h-5 w-10 animate-pulse bg-muted rounded" />
                      </TableCell>
                      <TableCell>
                        <div className="h-4 w-16 animate-pulse bg-muted rounded" />
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <div className="h-4 w-10 animate-pulse bg-muted rounded" />
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <div className="h-5 w-14 animate-pulse bg-muted rounded-full" />
                      </TableCell>
                      <TableCell className="hidden xl:table-cell">
                        <div className="h-4 w-6 animate-pulse bg-muted rounded" />
                      </TableCell>
                      <TableCell className="hidden xl:table-cell">
                        <div className="h-4 w-6 animate-pulse bg-muted rounded" />
                      </TableCell>
                      <TableCell>
                        <div className="h-4 w-16 animate-pulse bg-muted rounded ml-auto" />
                      </TableCell>
                    </TableRow>
                  ))
                ) : products.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={13} className="h-48 text-center">
                      <div className="flex flex-col items-center gap-2 text-muted-foreground">
                        <PackageX className="h-10 w-10" />
                        <p className="text-sm font-medium">No products found</p>
                        <p className="text-xs">Try adjusting your search or filters</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  products.map((product) => (
                    <TableRow
                      key={product.id}
                      className={cn(
                        "group transition-colors",
                        !product.isActive && "opacity-60",
                        selectedIds.has(product.id) && "bg-primary/5"
                      )}
                    >
                      {/* Checkbox */}
                      <TableCell>
                        <Checkbox
                          checked={selectedIds.has(product.id)}
                          onCheckedChange={() => toggleSelectOne(product.id)}
                        />
                      </TableCell>

                      {/* Image Thumbnail */}
                      <TableCell>
                        <div className="relative w-[50px] h-[50px] rounded-lg overflow-hidden bg-muted">
                          <Image
                            src={product.image || "/placeholder.png"}
                            alt={product.name}
                            width={50}
                            height={50}
                            className="object-cover"
                          />
                        </div>
                      </TableCell>

                      {/* Name (EN + AR) */}
                      <TableCell>
                        <div className="min-w-0">
                          <p className="font-medium text-sm truncate max-w-[200px]">{product.name}</p>
                          {product.nameAr && (
                            <p className="text-xs text-muted-foreground truncate max-w-[200px]" dir="rtl">
                              {product.nameAr}
                            </p>
                          )}
                        </div>
                      </TableCell>

                      {/* SKU */}
                      <TableCell className="hidden md:table-cell">
                        <span className="text-xs font-mono text-muted-foreground">{product.sku}</span>
                      </TableCell>

                      {/* Brand */}
                      <TableCell className="hidden lg:table-cell">
                        <span className="text-sm">{product.brand?.name || "—"}</span>
                      </TableCell>

                      {/* Category */}
                      <TableCell className="hidden lg:table-cell">
                        <span className="text-sm">{product.category?.name || "—"}</span>
                      </TableCell>

                      {/* Strength */}
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={cn("text-xs font-semibold tabular-nums", getStrengthBg(product.strength))}
                        >
                          {product.strength}mg
                        </Badge>
                      </TableCell>

                      {/* Price */}
                      <TableCell>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold tabular-nums">{formatEGP(product.price)}</p>
                          {product.comparePrice && product.comparePrice > product.price && (
                            <p className="text-xs text-muted-foreground line-through tabular-nums">
                              {formatEGP(product.comparePrice)}
                            </p>
                          )}
                        </div>
                      </TableCell>

                      {/* Stock */}
                      <TableCell className="hidden sm:table-cell">
                        <div className="flex items-center gap-1.5">
                          <span className={cn(
                            "text-sm tabular-nums",
                            product.stock === 0 && "text-destructive font-semibold",
                            product.stock > 0 && product.stock <= 5 && "text-amber-500 font-medium",
                            product.stock > 5 && "text-muted-foreground"
                          )}>
                            {product.stock}
                          </span>
                          {product.stock > 0 && product.stock <= 5 && (
                            <Badge variant="destructive" className="text-[10px] px-1 py-0 h-4">
                              Low
                            </Badge>
                          )}
                          {product.stock === 0 && (
                            <Badge variant="secondary" className="text-[10px] px-1 py-0 h-4">
                              Out
                            </Badge>
                          )}
                        </div>
                      </TableCell>

                      {/* Status */}
                      <TableCell className="hidden sm:table-cell">
                        <Badge
                          variant={product.isActive ? "default" : "secondary"}
                          className={cn(
                            "text-xs",
                            product.isActive
                              ? "bg-green-500/10 text-green-500 border-green-500/20 hover:bg-green-500/15"
                              : "bg-red-500/10 text-red-500 border-red-500/20 hover:bg-red-500/15"
                          )}
                        >
                          {product.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>

                      {/* Featured */}
                      <TableCell className="hidden xl:table-cell">
                        {product.isFeatured ? (
                          <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                        ) : (
                          <span className="text-muted-foreground/30">—</span>
                        )}
                      </TableCell>

                      {/* Bestseller */}
                      <TableCell className="hidden xl:table-cell">
                        {product.isBestseller ? (
                          <TrendingUp className="h-4 w-4 text-emerald-500" />
                        ) : (
                          <span className="text-muted-foreground/30">—</span>
                        )}
                      </TableCell>

                      {/* Actions */}
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => {
                              populateForm(product);
                              setProductToEdit(product);
                              setEditDialogOpen(true);
                            }}
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                            onClick={() => {
                              setProductToDelete(product);
                              setDeleteDialogOpen(true);
                            }}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* ─── Pagination ──────────────────────────────────────────────── */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-border/50 px-4 py-3">
              <p className="text-sm text-muted-foreground hidden sm:block">
                Page {pagination.page} of {pagination.totalPages}
              </p>

              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  disabled={pagination.page <= 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>

                {paginationRange.map((page, idx) =>
                  page === "ellipsis" ? (
                    <span key={`ellipsis-${idx}`} className="px-2 text-muted-foreground text-sm">
                      ...
                    </span>
                  ) : (
                    <Button
                      key={page}
                      variant={pagination.page === page ? "default" : "outline"}
                      size="icon"
                      className="h-8 w-8 text-sm"
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </Button>
                  )
                )}

                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  disabled={pagination.page >= pagination.totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(pagination.totalPages, p + 1))}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* ─── Edit Dialog ─────────────────────────────────────────────── */}
        <ProductFormDialog
          open={editDialogOpen}
          onOpenChange={(open) => {
            setEditDialogOpen(open);
            if (!open) setProductToEdit(null);
          }}
          title={`Edit Product: ${productToEdit?.name || ""}`}
          onSubmit={handleEdit}
          submitLabel="Save Changes"
        />

        {/* ─── Delete Confirmation Dialog ─────────────────────────────── */}
        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <DialogContent className="sm:max-w-[420px]">
            <DialogHeader>
              <DialogTitle>Deactivate Product</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <p className="text-sm text-muted-foreground">
                Are you sure you want to deactivate{" "}
                <span className="font-semibold text-foreground">"{productToDelete?.name}"</span>?
                This will remove the product from the store but preserve all order history.
              </p>
              {productToDelete?._count?.orderItems > 0 && (
                <div className="mt-3 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
                  <p className="text-xs text-amber-500">
                    ⚠ This product has {productToDelete._count.orderItems} order(s) associated with it.
                    Deactivating will not affect existing orders.
                  </p>
                </div>
              )}
            </div>
            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setDeleteDialogOpen(false)}
                disabled={actionLoading}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleDelete}
                disabled={actionLoading}
                className="gap-2"
              >
                {actionLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                <Trash2 className="h-4 w-4" />
                Deactivate
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </motion.div>
  );
}
