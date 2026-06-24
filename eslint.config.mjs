import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * SNUSII V3 — Strict ESLint Configuration
 * - Enforces TypeScript safety (warns on `any` instead of silent allow)
 * - Catches React hooks pitfalls
 * - Catches Next.js anti-patterns (no-img-element, no-html-link)
 * - Preserves developer escape hatches via per-file overrides when justified
 */
const eslintConfig = [
  ...nextCoreWebVitals,
  ...nextTypescript,
  {
    rules: {
      // ── TypeScript safety (warn-not-error to keep CI green during migration) ──
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
      "@typescript-eslint/no-non-null-assertion": "warn",
      "@typescript-eslint/ban-ts-comment": "warn",
      "@typescript-eslint/prefer-as-const": "warn",
      "@typescript-eslint/no-unused-disable-directive": "warn",
      "@typescript-eslint/consistent-type-imports": "warn",

      // ── React rules ──
      "react-hooks/exhaustive-deps": "warn",
      "react-hooks/rules-of-hooks": "error",
      "react/no-unescaped-entities": "warn",
      "react/display-name": "off",
      "react/prop-types": "off",

      // ── Next.js rules ──
      "@next/next/no-img-element": "warn",
      "@next/next/no-html-link-for-pages": "warn",

      // ── General JavaScript quality ──
      "prefer-const": "warn",
      "no-unused-vars": "off",
      "no-console": [
        "warn",
        { allow: ["warn", "error", "info"] },
      ],
      "no-debugger": "error",
      "no-empty": "warn",
      "no-irregular-whitespace": "warn",
      "no-case-declarations": "warn",
      "no-fallthrough": "error",
      "no-mixed-spaces-and-tabs": "error",
      "no-redeclare": "error",
      "no-undef": "error",
      "no-unreachable": "error",
      "no-useless-escape": "warn",
      "eqeqeq": ["warn", "smart"],
    },
  },
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
      "examples/**",
      "skills/**",
      "playwright-report/**",
      "test-results/**",
    ],
  },
];

export default eslintConfig;
