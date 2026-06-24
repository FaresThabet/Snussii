// ============================================================================
// SNUSII V3 — Database Seed
// ============================================================================
// Idempotent: safe to run multiple times. Creates:
//  - 3 Brands (White Fox, 77, Siberia)
//  - 2 Categories
//  - 1 SUPER_ADMIN user (email: admin@snusii.local, password: Admin123!)
//  - Sample products
//  - Default app settings
//  - Default feature flags
// ============================================================================

import { PrismaClient } from "@prisma/client";
import { hashPassword } from "../src/lib/password";

const db = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // ── Brands ──────────────────────────────────────────────────────────────
  const brands = await Promise.all([
    db.brand.upsert({
      where: { slug: "white-fox" },
      update: {},
      create: { name: "White Fox", slug: "white-fox", country: "Sweden", sortOrder: 1 },
    }),
    db.brand.upsert({
      where: { slug: "77" },
      update: {},
      create: { name: "77", slug: "77", country: "Sweden", sortOrder: 2 },
    }),
    db.brand.upsert({
      where: { slug: "siberia" },
      update: {},
      create: { name: "Siberia", slug: "siberia", country: "Sweden", sortOrder: 3 },
    }),
  ]);

  // ── Categories ──────────────────────────────────────────────────────────
  const [allWhite, slim] = await Promise.all([
    db.category.upsert({
      where: { slug: "all-white" },
      update: {},
      create: { name: "All White", slug: "all-white", sortOrder: 1 },
    }),
    db.category.upsert({
      where: { slug: "slim" },
      update: {},
      create: { name: "Slim", slug: "slim", sortOrder: 2 },
    }),
  ]);

  // ── Admin User ──────────────────────────────────────────────────────────
  const adminPassword = await hashPassword("Admin123!");
  const admin = await db.user.upsert({
    where: { email: "admin@snusii.local" },
    update: {},
    create: {
      email: "admin@snusii.local",
      password: adminPassword,
      name: "System Administrator",
      role: "SUPER_ADMIN",
      permissions: JSON.stringify([]),
      isActive: true,
    },
  });
  console.log(`  ✓ Admin user: ${admin.email}`);

  // ── Sample Products ─────────────────────────────────────────────────────
  const sampleProducts = [
    {
      name: "White Fox Double Mint Slim 16mg",
      slug: "white-fox-double-mint-slim-16mg",
      strength: 16,
      flavor: "Double Mint",
      price: 250,
      sku: "WF-DM-16",
      brandId: brands[0].id,
      categoryId: slim.id,
    },
    {
      name: "77 Watermelon Ice 10.4mg",
      slug: "77-watermelon-ice-10-4mg",
      strength: 10,
      flavor: "Watermelon Ice",
      price: 220,
      sku: "77-WI-10",
      brandId: brands[1].id,
      categoryId: allWhite.id,
    },
    {
      name: "Siberia Extremely Strong 33mg",
      slug: "siberia-extremely-strong-33mg",
      strength: 33,
      flavor: "Mint",
      price: 320,
      sku: "SIB-ES-33",
      brandId: brands[2].id,
      categoryId: slim.id,
    },
  ];

  for (const p of sampleProducts) {
    await db.product.upsert({
      where: { slug: p.slug },
      update: {},
      create: {
        ...p,
        stock: 100,
        image: "",
        images: "[]",
        isBestseller: true,
      },
    });
  }
  console.log(`  ✓ ${sampleProducts.length} sample products`);

  // ── Default App Settings ────────────────────────────────────────────────
  const defaultSettings = {
    siteName: "Snusii",
    supportEmail: "support@snusii.local",
    supportPhone: "+20 100 000 0000",
    freeShippingThreshold: 1000,
    defaultShippingCost: 60,
    taxRate: 0.14,
    minOrderValue: 100,
    ageVerificationRequired: true,
    maintenanceMode: false,
  };
  await db.appSetting.upsert({
    where: { key: "general" },
    update: {},
    create: { key: "general", value: JSON.stringify(defaultSettings) },
  });
  console.log("  ✓ Default app settings");

  // ── Default Feature Flags ───────────────────────────────────────────────
  const defaultFlags = [
    { key: "new_checkout", description: "V3 unified checkout flow", enabled: true, rolloutPct: 100 },
    { key: "loyalty_redesign", description: "New loyalty dashboard UI", enabled: false, rolloutPct: 0 },
    { key: "ai_product_recommendations", description: "Personalized recommendations", enabled: false, rolloutPct: 0 },
    { key: "corporate_portal", description: "B2B corporate portal", enabled: true, rolloutPct: 100 },
  ];
  for (const flag of defaultFlags) {
    await db.featureFlag.upsert({
      where: { key: flag.key },
      update: {},
      create: flag,
    });
  }
  console.log(`  ✓ ${defaultFlags.length} feature flags`);

  console.log("✅ Seed complete");
  console.log("   Admin login: admin@snusii.local / Admin123!");
}

main()
  .catch((err) => {
    console.error("❌ Seed failed:", err);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
