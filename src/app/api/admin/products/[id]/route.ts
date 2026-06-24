// ============================================================================
// SNUSII V2 — Admin Single Product API
// PUT    /api/admin/products/:id → Update product
// DELETE /api/admin/products/:id → Delete product (soft: isActive = false)
// ============================================================================

import { NextRequest, NextResponse } from "next/server";
import { requirePermission } from "@/lib/admin-auth";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

// ─── PUT: Update Product ───────────────────────────────────────────────────

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requirePermission("MANAGE_PRODUCTS");
    const { id } = await params;

    const existing = await db.product.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const body = await request.json();

    // Don't allow changing slug to an existing one
    if (body.slug && body.slug !== existing.slug) {
      const slugTaken = await db.product.findUnique({ where: { slug: body.slug } });
      if (slugTaken) {
        return NextResponse.json({ error: "Slug already taken" }, { status: 409 });
      }
    }

    // Don't allow changing SKU to an existing one
    if (body.sku && body.sku !== existing.sku) {
      const skuTaken = await db.product.findUnique({ where: { sku: body.sku } });
      if (skuTaken) {
        return NextResponse.json({ error: "SKU already taken" }, { status: 409 });
      }
    }

    const updated = await db.product.update({
      where: { id },
      data: {
        ...(body.name !== undefined && { name: body.name }),
        ...(body.nameAr !== undefined && { nameAr: body.nameAr }),
        ...(body.slug !== undefined && { slug: body.slug }),
        ...(body.shortDescription !== undefined && { shortDescription: body.shortDescription }),
        ...(body.description !== undefined && { description: body.description }),
        ...(body.strength !== undefined && { strength: body.strength }),
        ...(body.flavor !== undefined && { flavor: body.flavor }),
        ...(body.canCount !== undefined && { canCount: body.canCount }),
        ...(body.price !== undefined && { price: body.price }),
        ...(body.comparePrice !== undefined && { comparePrice: body.comparePrice }),
        ...(body.stock !== undefined && { stock: body.stock }),
        ...(body.sku !== undefined && { sku: body.sku }),
        ...(body.image !== undefined && { image: body.image }),
        ...(body.images !== undefined && { images: JSON.stringify(body.images) }),
        ...(body.blurHash !== undefined && { blurHash: body.blurHash }),
        ...(body.isFeatured !== undefined && { isFeatured: body.isFeatured }),
        ...(body.isBestseller !== undefined && { isBestseller: body.isBestseller }),
        ...(body.isActive !== undefined && { isActive: body.isActive }),
        ...(body.brandId !== undefined && { brandId: body.brandId }),
        ...(body.categoryId !== undefined && { categoryId: body.categoryId }),
        ...(body.metaTitle !== undefined && { metaTitle: body.metaTitle }),
        ...(body.metaDescription !== undefined && { metaDescription: body.metaDescription }),
        ...(body.sortOrder !== undefined && { sortOrder: body.sortOrder }),
      },
      include: {
        brand: { select: { id: true, name: true } },
        category: { select: { id: true, name: true } },
        _count: { select: { reviews: true, orderItems: true } },
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    if (error instanceof NextResponse) throw error;
    console.error("[Admin Products] Update error:", error);
    return NextResponse.json(
      { error: "Failed to update product" },
      { status: 500 }
    );
  }
}

// ─── DELETE: Delete Product (soft delete) ───────────────────────────────────

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requirePermission("MANAGE_PRODUCTS");
    const { id } = await params;

    const existing = await db.product.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Soft delete: set isActive = false (preserves order history integrity)
    const deactivated = await db.product.update({
      where: { id },
      data: { isActive: false, isFeatured: false, isBestseller: false },
      select: { id: true, name: true, sku: true, isActive: true },
    });

    return NextResponse.json({
      message: "Product deactivated successfully",
      product: deactivated,
    });
  } catch (error) {
    if (error instanceof NextResponse) throw error;
    console.error("[Admin Products] Delete error:", error);
    return NextResponse.json(
      { error: "Failed to delete product" },
      { status: 500 }
    );
  }
}
