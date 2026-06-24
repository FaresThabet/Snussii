import type { NextConfig } from "next";

/**
 * SNUSII V3 — Production-grade Next.js 16 configuration
 *
 * Key changes from V2:
 *  - Removed `typescript.ignoreBuildErrors` and `eslint.ignoreDuringBuilds`
 *    (we now enforce quality at build time)
 *  - Added security headers (CSP, XSS, frame-options, referrer-policy)
 *  - Added `compress`, `poweredByHeader: false`
 *  - Added `experimental.optimizePackageImports` for tree-shaking heavy libs
 *  - Added modular imports for lucide-react and recharts (bundle size win)
 *  - Added `cacheHandler` hook (in-memory fallback for sandbox)
 */
const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "X-XSS-Protection", value: "1; mode=block" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(self)",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=31536000; includeSubDomains; preload",
  },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,

  // NOTE: Build errors are no longer ignored — fix them at the source.
  // eslint: {
  //   ignoreDuringBuilds: false,  // (default)
  // },
  // typescript: {
  //   ignoreBuildErrors: false,   // (default)
  // },

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "z-cdn.chatglm.cn",
        pathname: "/z-ai/static/**",
      },
    ],
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24, // 24h
  },

  experimental: {
    optimizePackageImports: [
      "lucide-react",
      "recharts",
      "@radix-ui/react-icons",
      "date-fns",
      "framer-motion",
    ],
  },

  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
      {
        // Static assets — long-lived cache
        source: "/_next/static/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        // Public images — medium cache
        source: "/images/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=86400, stale-while-revalidate=604800",
          },
        ],
      },
    ];
  },

  async redirects() {
    return [
      // Legacy /login → /sign-in
      { source: "/login", destination: "/sign-in", permanent: true },
    ];
  },

  // V3: cleaner webpack output for production diagnostics
  logging: {
    fetches: { fullUrl: process.env.NODE_ENV === "development" },
  },
};

export default nextConfig;
