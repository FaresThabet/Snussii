// ============================================================================
// SNUSII V3 — Order Status Update API
// V2 → V3:
//  - Zod-validated body
//  - Audit log entry on every status change
//  - Atomic DB transaction (status + timeline timestamp)
//  - Standardized response shape
// ============================================================================

import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { requirePermission } from "@/lib/admin-auth";
import {
  apiHandler,
  ok,
  notFound,
  parseBody,
} from "@/lib/api-response";
import { OrderSchemas } from "@/lib/schemas";
import { auditAsync, auditMetaFromRequest } from "@/lib/audit";

export const dynamic = "force-dynamic";

const TIMELINE_FIELD: Record<string, "confirmedAt" | "shippedAt" | "deliveredAt" | "cancelledAt"> = {
  CONFIRMED: "confirmedAt",
  SHIPPED: "shippedAt",
  DELIVERED: "deliveredAt",
  CANCELLED: "cancelledAt",
};

export const PATCH = apiHandler(async (request: NextRequest, ctx: { params: Promise<{ id: string }> }) => {
  const { session, response } = await requirePermission("MANAGE_ORDERS");
  if (response) return response;

  const { id } = await ctx.params;
  const input = await parseBody(request, OrderSchemas.statusUpdate);
  const audit = auditMetaFromRequest(request);

  const order = await db.order.findUnique({
    where: { id },
    select: { id: true, orderNumber: true, status: true },
  });
  if (!order) return notFound("Order not found");

  const updates: Record<string, unknown> = {
    status: input.status,
  };
  const tsField = TIMELINE_FIELD[input.status];
  if (tsField) updates[tsField] = new Date();

  // Auto-update payment status on terminal states
  if (input.status === "DELIVERED") {
    updates.paymentStatus = "PAID";
  } else if (input.status === "CANCELLED") {
    updates.paymentStatus = "REFUNDED";
  }

  const updated = await db.order.update({
    where: { id },
    data: updates,
    include: {
      items: true,
      customer: { select: { id: true, name: true, email: true } },
    },
  });

  auditAsync({
    action: "order.status.change",
    actorId: session.user.id,
    actorEmail: session.user.email,
    actorRole: session.user.role,
    targetType: "Order",
    targetId: order.id,
    description: `Order ${order.orderNumber}: ${order.status} → ${input.status}`,
    before: { status: order.status },
    after: { status: input.status, note: input.note },
    ip: audit.ip,
    userAgent: audit.userAgent,
    correlationId: audit.correlationId,
    metadata: input.note ? { note: input.note } : undefined,
  });

  return ok(updated);
});
