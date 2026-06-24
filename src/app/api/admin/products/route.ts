// ============================================================================
// SNUSII V3 — Admin Products API
// V2 → V3:
//  - Uses `apiHandler` wrapper for uniform error handling
//  - Uses `parseBody`/`parseQuery` with Zod schemas (no hand-rolled checks)
//  - Uses `ok()`/`created()` standardized response shape
//  - Uses new `requirePermission` return-shape contract
//  - Records audit log entries on create/update
//  - Adds pagination metadata in standardized `meta` field
// ============================================================================

import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { requirePermission } from "@/lib/admin-auth";
import { apiHandler, ok, created, conflict, parseBody, parseQuery } from "@/lib/api-response";
import { ProductSchemas, PaginationSchema } from "@/lib/schemas";
import { auditAsync, auditMetaFromRequest } from "@/lib/audit";

export const dynamic = "force-dynamic";

// ─── GET: List Products ─────────────────────────────────────────────────────

export const GET = apiHandler(async (request: NextRequest) => {
  const { session, response } = await requirePermission("MANAGE_PRODUCTS");
  if (response) return response;

  const query = parseQuery(request, ProductSchemas.list);

  const where: Record<string, unknown> = {};
  if (query.search) {
    where.OR = [
      { name: { contains: query.search } },
      { nameAr: { contains: query.search } },
      { sku: { contains: query.search } },
      { flavor: { contains: query.search } },
    ];
  }
  if (query.brandId) where.brandId = query.brandId;
  if (query.categoryId) where.categoryId = query.categoryId;
  if (query.active) where.isActive = query.active === "true";

  const orderBy: Record<string, string> = { [query.sort]: query.order };

  const [products, total] = await Promise.all([
    db.product.findMany({
      where,
      include: {
        brand: { select: { id: true, name: true, slug: true } },
        category: { select: { id: true, name: true } },
        _count: { select: { reviews: true, orderItems: true } },
      },
      orderBy,
      skip: (query.page - 1) * query.limit,
      take: query.limit,
    }),
    db.product.count({ where }),
  ]);

  const meta = {
    page: query.page,
    limit: query.limit,
    total,
    totalPages: Math.ceil(total / query.limit),
  };
  return ok(products, meta);
});

// ─── POST: Create Product ─────────────────────────────────────────────────

export const POST = apiHandler(async (request: NextRequest) => {
  const { session, response } = await requirePermission("MANAGE_PRODUCTS");
  if (response) return response;

  const input = await parseBody(request, ProductSchemas.create);
  const audit = auditMetaFromRequest(request);

  // Uniqueness checks (parallel for efficiency)
  const [existingSku, existingSlug] = await Promise.all([
    db.product.findUnique({ where: { sku: input.sku }, select: { id: true } }),
    db.product.findUnique({ where: { slug: input.slug }, select: { id: true } }),
  ]);
  if (existingSku) return conflict("SKU already exists");
  if (existingSlug) return conflict("Slug already exists");

  const product = await db.product.create({
    data: {
      name: input.name,
      nameAr: input.nameAr ?? null,
      slug: input.slug,
      shortDescription: input.shortDescription ?? null,
      description: input.description ?? null,
      strength: input.strength,
      flavor: input.flavor,
      canCount: input.canCount,
      price: input.price,
      comparePrice: input.comparePrice ?? null,
      stock: input.stock,
      sku: input.sku,
      image: input.image,
      images: input.images ? JSON.stringify(input.images) : "[]",
      blurHash: input.blurHash ?? null,
      isFeatured: input.isFeatured,
      isBestseller: input.isBestseller,
      isActive: input.isActive,
      brandId: input.brandId,
      categoryId: input.categoryId,
      metaTitle: input.metaTitle ?? null,
      metaDescription: input.metaDescription ?? null,
      sortOrder: input.sortOrder,
    },
    include: {
      brand: { select: { id: true, name: true } },
      category: { select: { id: true, name: true } },
    },
  });

  auditAsync({
    action: "product.create",
    actorId: session.user.id,
    actorEmail: session.user.email,
    actorRole: session.user.role,
    targetType: "Product",
    targetId: product.id,
    description: `Created product "${product.name}" (SKU ${product.sku})`,
    after: { name: product.name, sku: product.sku, price: product.price },
    ip: audit.ip,
    userAgent: audit.userAgent,
    correlationId: audit.correlationId,
  });

  return created(product);
});

// Helper kept for type symmetry with other routes
export const _paginationSchema = PaginationSchema;
