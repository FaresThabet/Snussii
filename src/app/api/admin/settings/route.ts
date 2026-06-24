// ============================================================================
// SNUSII V2 — Admin Settings API
// GET  /api/admin/settings → Get system settings
// PUT  /api/admin/settings → Update system settings
//
// Uses a JSON-based key-value store in a simple in-memory / DB approach.
// For production, consider a dedicated Settings model in Prisma.
// Currently stores settings as a JSON blob in an env/config pattern.
// ============================================================================

import { NextRequest, NextResponse } from "next/server";
import { requireSuperAdmin } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

// ─── Default Settings ───────────────────────────────────────────────────────

const DEFAULT_SETTINGS = {
  store: {
    name: "Snusii",
    tagline: "Egypt's #1 Premium Nicotine Pouches",
    email: "support@snusii.com",
    phone: "+20XXXXXXXXX",
    currency: "EGP",
    locale: "en",
    taxRate: 0.14, // 14% VAT
  },
  shipping: {
    freeShippingThreshold: 500, // EGP
    defaultCost: 45,
    defaultDays: 2,
  },
  loyalty: {
    enabled: true,
    pointsPer100EGP: 10,
    pointValueEGP: 0.5,
  },
  payments: {
    codEnabled: true,
    paymobEnabled: false,
    fawryEnabled: false,
    vodafoneCashEnabled: false,
    instapayEnabled: false,
  },
  notifications: {
    orderConfirmation: true,
    shippingUpdate: true,
    deliveryConfirmation: true,
    promotionalEmails: false,
  },
};

// ─── In-memory settings store (persist to DB in production) ───────────────
let settings: Record<string, unknown> = { ...DEFAULT_SETTINGS };

// ─── GET: Retrieve Settings ─────────────────────────────────────────────────

export async function GET() {
  try {
    await requireSuperAdmin();

    const section = new URLSearchParams(new URL("").searchParams).get("section");
    // Return all settings or a specific section
    const result = section ? settings[section] || {} : settings;

    return NextResponse.json({ settings: result });
  } catch (error) {
    if (error instanceof NextResponse) throw error;
    console.error("[Admin Settings] Get error:", error);
    return NextResponse.json(
      { error: "Failed to fetch settings" },
      { status: 500 }
    );
  }
}

// ─── PUT: Update Settings ──────────────────────────────────────────────────

export async function PUT(request: NextRequest) {
  try {
    await requireSuperAdmin();

    const body = await request.json();

    if (!body.section || typeof body.section !== "string") {
      return NextResponse.json(
        { error: "section is required (e.g., 'store', 'shipping', 'loyalty', 'payments', 'notifications')" },
        { status: 400 }
      );
    }

    const section = body.section;
    const values = body.values;

    if (!values || typeof values !== "object") {
      return NextResponse.json(
        { error: "values object is required" },
        { status: 400 }
      );
    }

    // Validate section exists
    if (!(section in DEFAULT_SETTINGS)) {
      return NextResponse.json(
        { error: `Invalid section: ${section}. Valid sections: ${Object.keys(DEFAULT_SETTINGS).join(", ")}` },
        { status: 400 }
      );
    }

    // Deep merge values into existing settings
    settings[section] = {
      ...(settings[section] as Record<string, unknown>),
      ...values,
    };

    return NextResponse.json({
      message: `Settings updated for section: ${section}`,
      settings: settings[section],
    });
  } catch (error) {
    if (error instanceof NextResponse) throw error;
    console.error("[Admin Settings] Update error:", error);
    return NextResponse.json(
      { error: "Failed to update settings" },
      { status: 500 }
    );
  }
}
