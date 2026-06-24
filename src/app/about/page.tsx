import type { Metadata } from "next";
import { BreadcrumbSchema } from "@/components/seo/json-ld";
import { SITE_URL } from "@/lib/seo";
import { AboutContent } from "./about-client";

// ─── SEO Metadata ───────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: "من نحن — سنوسي، متجر أكياس النيكوتين الفاخر في مصر",
  description:
    "تعرّف على سنوسي — متجر أكياس النيكوتين الفاخر رقم 1 في مصر. اكتشف مهمتنا في توفير أكياس نيكوتين أصلية خالية من التبغ لكل المحافظات الـ27. منتجات White Fox وSiberia و77 الأصلية 100%.",
  keywords: [
    "عن سنوسي",
    "سنوسي مصر",
    "أكياس نيكوتين مصر من نحن",
    "مهمة سنوسي",
    "أكياس نيكوتين أصلية مصر",
    "متجر سنوس فاخر مصر",
  ],
  openGraph: {
    title: "من نحن — سنوسي، متجر أكياس النيكوتين الفاخر في مصر",
    description:
      "اكتشف القصة وراء أكبر سوق لأكياس النيكوتين في مصر. منتجات أصلية، توصيل سريع، ومهمة لخدمة كل المحافظات الـ27.",
    url: `${SITE_URL}/about`,
    type: "website",
    locale: "ar_EG",
  },
  twitter: {
    card: "summary_large_image",
    title: "من نحن — سنوسي، متجر أكياس النيكوتين الفاخر في مصر",
    description:
      "اكتشف القصة وراء أكبر سوق لأكياس النيكوتين في مصر.",
  },
  robots: { index: true, follow: true },
  alternates: { canonical: `${SITE_URL}/about` },
};

// ─── Page Component ─────────────────────────────────────────────────────────

export default function AboutPage() {
  const breadcrumbItems = [
    { name: "الرئيسية", url: SITE_URL },
    { name: "من نحن", url: `${SITE_URL}/about` },
  ];

  return (
    <div className="dark">
      <BreadcrumbSchema items={breadcrumbItems} />
      <AboutContent />
    </div>
  );
}