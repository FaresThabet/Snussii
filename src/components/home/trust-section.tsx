"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Truck, Award, Gift } from "lucide-react";
import { useI18n } from "@/lib/i18n";

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.4, 0.25, 1] },
  },
};

export function TrustSection() {
  const { t, locale, isRTL } = useI18n();

  const features =
    locale === "ar"
      ? [
          {
            icon: ShieldCheck,
            title: "منتجات أصلية",
            description:
              "منتجات أصلية 100% من White Fox وSiberia و77. كل كيس موثّق الأصالة والجودة.",
          },
          {
            icon: Truck,
            title: "توصيل سريع",
            description:
              "شحن في نفس اليوم لتغطية كل محافظات مصر الـ27. توصيل خلال 1-2 يوم للقاهرة والإسكندرية.",
          },
          {
            icon: Award,
            title: "ماركات فاخرة",
            description:
              "تشكيلة منتقاة من أرقى أكياس النيكوتين من أكثر المصنّعين العالميين موثوقية.",
          },
          {
            icon: Gift,
            title: "مكافآت الولاء",
            description:
              "اكسب نقاطاً مع كل طلب وافتح خصومات حصرية. مستويات برونزي وفضّي وذهبي متاحة.",
          },
        ]
      : [
          {
            icon: ShieldCheck,
            title: "Authentic Products",
            description:
              "100% genuine products from White Fox, Siberia, and 77. Every pouch verified for authenticity and quality.",
          },
          {
            icon: Truck,
            title: "Fast Delivery",
            description:
              "Same-day dispatch with coverage across all 27 Egyptian governorates. 1-2 days delivery to Cairo and Alexandria.",
          },
          {
            icon: Award,
            title: "Premium Brands",
            description:
              "A curated selection of top-tier nicotine pouches from the world's most respected manufacturers.",
          },
          {
            icon: Gift,
            title: "Loyalty Rewards",
            description:
              "Earn points on every order and unlock exclusive discounts. Bronze, Silver, and Gold tiers available.",
          },
        ];

  return (
    <section className="py-16 sm:py-20 bg-white" dir={isRTL ? "rtl" : "ltr"}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 font-arabic-display">
            {locale === "ar" ? "ليه تختار سنوسي؟" : "Why Snusii?"}
          </h2>
          <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
            {locale === "ar"
              ? "وجهتك الموثوقة لأكياس النيكوتين في مصر بمنتجات فاخرة وخدمة لا منافس لها."
              : "Egypt's trusted nicotine pouch destination with premium products and unmatched service."}
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
        >
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              variants={itemVariants}
              className="group relative rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 mb-4 group-hover:bg-emerald-600 group-hover:text-white transition-colors duration-300">
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="text-base font-semibold text-neutral-900 mb-2 font-arabic-display">
                {feature.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
