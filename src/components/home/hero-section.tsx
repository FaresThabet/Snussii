"use client";

import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck, Truck, CreditCard, UserCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useI18n } from "@/lib/i18n";

export function HeroSection() {
  const { t, locale, isRTL } = useI18n();

  const scrollToQuiz = () => {
    document.getElementById("nicotine-quiz")?.scrollIntoView({ behavior: "smooth" });
  };

  const trustBadges =
    locale === "ar"
      ? [
          { icon: ShieldCheck, label: "منتجات أصلية 100%" },
          { icon: Truck, label: "توصيل سريع (1-2 يوم القاهرة)" },
          { icon: CreditCard, label: "دفع آمن (عند الاستلام، فودافون كاش، إنستا باي)" },
          { icon: UserCheck, label: "للبالغين 21+ فقط" },
        ]
      : [
          { icon: ShieldCheck, label: "Authentic Products" },
          { icon: Truck, label: "Fast Delivery (1-2 days Cairo)" },
          { icon: CreditCard, label: "Secure Payments (COD, Vodafone Cash, InstaPay)" },
          { icon: UserCheck, label: "21+ Age Verified" },
        ];

  return (
    <section className="relative overflow-hidden">
      {/* Gradient background with subtle pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-800" />
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      {/* Decorative floating elements */}
      <div className="absolute top-1/4 left-10 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-amber-500/8 rounded-full blur-3xl" />

      <div
        className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 sm:py-28 lg:py-36"
        dir={isRTL ? "rtl" : "ltr"}
      >
        <div className="max-w-3xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Badge
              variant="secondary"
              className="mb-6 px-4 py-1.5 text-sm bg-white/10 text-white/90 border-white/20 backdrop-blur-sm"
            >
              {locale === "ar"
                ? "متجر أكياس النيكوتين رقم 1 في مصر"
                : "Egypt's #1 Nicotine Pouch Marketplace"}
            </Badge>
          </motion.div>

          {/* Headline */}
          <motion.h1
            className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.2] font-arabic-display"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            {locale === "ar" ? (
              <>
                اكتشف{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-amber-400">
                  الفاخر
                </span>{" "}
                من أكياس النيكوتين في مصر
              </>
            ) : (
              <>
                Discover Egypt&apos;s{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-amber-400">
                  Premium
                </span>{" "}
                Nicotine Pouch Marketplace
              </>
            )}
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            className="mt-6 text-lg sm:text-xl text-white/70 leading-relaxed max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {locale === "ar"
              ? "أكياس نيكوتين خالية من التبغ، سرية، وتصل إلى بابك. تسوّق منتجات وايت فوكس وسيبيريا و77 الأصلية في جميع المحافظات الـ27."
              : "Tobacco-free, discreet, and delivered to your door. Shop authentic White Fox, Siberia, and 77 products across all 27 governorates."}
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Button
              size="lg"
              className="gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold px-8 h-12 text-base"
              onClick={scrollToQuiz}
            >
              {locale === "ar" ? "اعثر على الكيس المثالي لك" : "Find Your Perfect Pouch"}
              <ArrowRight className={`h-4 w-4 ${isRTL ? "rotate-180" : ""}`} />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="gap-2 border-white/30 text-white hover:bg-white/10 hover:text-white font-semibold px-8 h-12 text-base"
              onClick={() => (window.location.href = "/products")}
            >
              {locale === "ar" ? "تسوق الآن" : "Shop Now"}
            </Button>
          </motion.div>

          {/* Trust badges */}
          <motion.div
            className="mt-12 flex flex-wrap items-center justify-center gap-x-6 gap-y-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            {trustBadges.map((badge) => (
              <div
                key={badge.label}
                className="flex items-center gap-2 text-white/60 text-sm"
              >
                <badge.icon className="h-4 w-4 text-emerald-400" />
                <span>{badge.label}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
