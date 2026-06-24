# Snusii V3 — Enterprise Upgrade

> Egypt's #1 nicotine-pouch e-commerce platform, hardened for production.

This is the V3 upgrade of the Snusii codebase. V3 is a **non-breaking**
upgrade that preserves all V2 business functionality while adding the
security, observability, and quality scaffolding an enterprise deployment
requires.

---

## What's New in V3

- **Security:** scrypt password hashing, env validation, security headers,
  rate limiting, audit logging
- **Code Quality:** strict TypeScript + ESLint configs, no more
  `ignoreBuildErrors`
- **API:** Zod input validation, standardized response shapes, `apiHandler`
  wrapper
- **Enterprise:** audit logs, feature flags, in-app notifications, RBAC
  hardening
- **Database:** 4 new models (AuditLog, AppSetting, FeatureFlag,
  Notification), 18 new indexes, soft-delete columns
- **Tests:** Vitest unit tests + Playwright E2E config + smoke specs
- **Docs:** 13-part V3 upgrade documentation set

---

## Quick Start

```bash
# 1. Install dependencies
bun install

# 2. Configure environment
cp .env.example .env.local
# Edit .env.local — set NEXTAUTH_SECRET, DATABASE_URL, etc.

# 3. Apply database schema
bun run db:generate
bun run db:push

# 4. Seed default data (admin user, brands, products, flags)
bun run db:seed
# → Admin login: admin@snusii.local / Admin123!

# 5. Run the dev server
bun run dev
# → http://localhost:3000
```

---

## Quality Gates

```bash
bun run lint          # ESLint
bun run typecheck     # tsc --noEmit
bun run test          # Vitest unit tests
bun run test:e2e      # Playwright E2E tests
bun run verify        # lint + typecheck + test (run before every PR)
bun run build         # Next.js production build
```

---

## Documentation

The full V3 upgrade documentation lives in [`docs/v3-upgrade/`](./docs/v3-upgrade/):

| # | Document | Purpose |
|---|---|---|
| 01 | `executive-summary.md` | TL;DR of what changed and why |
| 02 | `architecture-review.md` | Folder structure, tech debt, V3 layered model |
| 03 | `security-review.md` | Threats found, fixes applied, OWASP coverage |
| 04 | `performance-review.md` | Bundle, images, caching, DB queries |
| 05 | `dependency-upgrade-report.md` | Package versions, deprecated APIs |
| 06 | `database-review.md` | Schema design, indexes, scalability |
| 07 | `ux-ui-review.md` | Loading/empty/error states, accessibility |
| 08 | `i18n-review.md` | Arabic/English translations, RTL audit |
| 09 | `testing-strategy.md` | Vitest + Playwright coverage plan |
| 10 | `enterprise-features.md` | Audit, flags, notifications, RBAC, rate limit |
| 11 | `prioritized-roadmap.md` | P0 → P3 work items |
| 12 | `deployment-checklist.md` | Pre-deploy, deploy, post-deploy, rollback |
| 13 | `migration-steps.md` | Step-by-step V2 → V3 migration |

Start with `01-executive-summary.md`.

---

## Tech Stack

- **Framework:** Next.js 16 (App Router) + React 19
- **Language:** TypeScript 5 (strict mode)
- **Styling:** Tailwind CSS 4 + shadcn/ui (New York)
- **Database:** Prisma 6 (SQLite dev / PostgreSQL prod)
- **Auth:** NextAuth.js v4 (Credentials provider, scrypt hashing)
- **Validation:** Zod 4
- **State:** Zustand (client) + TanStack Query (server)
- **Tests:** Vitest (unit) + Playwright (E2E)
- **i18n:** English + Arabic with RTL support

---

## Project Structure

```
.
├── docs/v3-upgrade/         # V3 documentation set (13 files)
├── prisma/
│   ├── schema.prisma        # 18 models, 18+ indexes
│   └── seed.ts              # Idempotent seed
├── public/                  # Static assets, product images
├── src/
│   ├── app/                 # App Router pages + API routes
│   ├── components/          # UI, layout, home, product, checkout
│   ├── hooks/               # use-toast, use-mobile
│   ├── lib/                 # V3 enterprise modules live here
│   │   ├── admin-auth.ts    # RBAC guards (typed)
│   │   ├── api-response.ts  # Standardized API helpers
│   │   ├── audit.ts         # Audit log service
│   │   ├── auth.ts          # NextAuth config (type-safe)
│   │   ├── db.ts            # Prisma client
│   │   ├── env.ts           # Zod env validation
│   │   ├── feature-flags.ts # Feature flag service
│   │   ├── logger.ts        # Structured logger
│   │   ├── notifications.ts # Notification service
│   │   ├── password.ts      # scrypt hashing
│   │   ├── rate-limit.ts    # Sliding-window limiter
│   │   └── schemas.ts       # Zod validation schemas
│   ├── locales/             # ar.json, en.json
│   ├── services/            # 9 business services
│   ├── stores/              # Zustand stores
│   ├── types/               # Shared TS types
│   └── middleware.ts        # Correlation IDs, security headers
├── tests/
│   ├── e2e/                 # Playwright specs
│   ├── lib/                 # Vitest unit tests
│   └── setup.ts             # Test setup
├── .env.example             # Env var template
├── .gitignore
├── eslint.config.mjs        # Strict rules
├── next.config.ts           # Security headers, image opts
├── package.json
├── playwright.config.ts     # Multi-browser E2E
├── tsconfig.json            # Strict mode
└── vitest.config.ts         # Unit test config
```

---

## Default Admin Credentials (after seeding)

- **Email:** `admin@snusii.local`
- **Password:** `Admin123!`

⚠️ **Change this immediately in production** via the admin settings page or:

```bash
sqlite3 prisma/dev.db "UPDATE User SET password = '<scrypt-hash>' WHERE email = 'admin@snusii.local';"
```

(Generate a scrypt hash using the `hashPassword()` function in
`src/lib/password.ts`.)

---

## License

Proprietary. © 2026 Snusii. All rights reserved.
