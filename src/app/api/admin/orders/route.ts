// ============================================================================
// SNUSII V3 — Admin Orders API
// V2 → V3:
//  - Zod-validated query params (no hand-rolled parsing)
//  - Standardized response shape via `ok()`
//  - `apiHandler` wraps everything for uniform error handling
// ============================================================================

import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { requirePermission } from "@/lib/admin-auth";
import { apiHandler, ok, parseQuery } from "@/lib/api-response";
import { OrderSchemas } from "@/lib/schemas";

export const dynamic = "force-dynamic";

export const GET = apiHandler(async (request: NextRequest) => {
  const { response } = await requirePermission("MANAGE_ORDERS");
  if (response) return response;

  const query = parseQuery(request, OrderSchemas.list);

  const where: Record<string, unknown> = {};
  if (query.status) where.status = query.status;
  if (query.paymentStatus) where.paymentStatus = query.paymentStatus;
  if (query.governorate) where.shippingGovernorate = query.governorate;

  if (query.search) {
    where.OR = [
      { orderNumber: { contains: query.search } },
      { customer: { name: { contains: query.search } } },
      { customer: { email: { contains: query.search } } },
      { guestName: { contains: query.search } },
      { guestPhone: { contains: query.search } },
    ];
  }

  if (query.from || query.to) {
    where.createdAt = {};
    if (query.from) (where.createdAt as Record<string, unknown>).gte = new Date(query.from);
    if (query.to) (where.createdAt as Record<string, unknown>).lte = new Date(query.to);
  }

  const [orders, total] = await Promise.all([
    db.order.findMany({
      where,
      include: {
        customer: {
          select: { id: true, name: true, email: true, phone: true },
        },
        items: {
          include: {
            product: { select: { name: true, image: true, strength: true } },
          },
        },
        payments: {
          select: { method: true, status: true, amount: true },
        },
      },
      orderBy: { createdAt: "desc" },
      skip: (query.page - 1) * query.limit,
      take: query.limit,
    }),
    db.order.count({ where }),
  ]);

  return ok(orders, {
    page: query.page,
    limit: query.limit,
    total,
    totalPages: Math.ceil(total / query.limit),
  });
});
