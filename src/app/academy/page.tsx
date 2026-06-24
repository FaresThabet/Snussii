"use client";

import { useI18n } from "@/lib/i18n";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  BookOpen,
  Gauge,
  Cherry,
  BarChart3,
  Microscope,
  Package,
  ArrowRight,
  Clock,
  Mail,
  Sparkles,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useRTLEffect } from "@/lib/i18n";

// ─── Categories Config ─────────────────────────────────────────────────

const categories = [
  {
    key: "beginner",
    icon: BookOpen,
    emoji: "🧪",
    href: "/academy/beginners-guide",
    color: "from-emerald-500 to-emerald-700",
  },
  {
    key: "strength",
    icon: Gauge,
    emoji: "💪",
    href: "/academy/strength-guide",
    color: "from-emerald-600 to-teal-700",
  },
  {
    key: "flavor",
    icon: Cherry,
    emoji: "🍋",
    href: "/academy/flavor-guide",
    color: "from-emerald-500 to-cyan-700",
  },
  {
    key: "comparison",
    icon: BarChart3,
    emoji: "📋",
    href: "/academy/brand-comparison",
    color: "from-teal-500 to-emerald-700",
  },
  {
    key: "health",
    icon: Microscope,
    emoji: "🔬",
    href: "/academy/health-science",
    color: "from-emerald-600 to-green-700",
  },
  {
    key: "storage",
    icon: Package,
    emoji: "📦",
    href: "/academy/storage-usage",
    color: "from-green-500 to-emerald-700",
  },
];

// ─── Featured Articles Config ──────────────────────────────────────────

const featuredArticles = [
  {
    slug: "beginners-guide",
    image: "/images/academy/beginners.png",
    categoryKey: "beginner",
    readTime: 8,
    titleEn: "The Complete Beginner's Guide to Nicotine Pouches (2026)",
    titleAr: "دليل المبتدئين الشامل لأكياس النيكوتين (2026)",
    excerptEn:
      "New to nicotine pouches in 2026? Everything you need to know about choosing, using, and enjoying pouches responsibly.",
    excerptAr:
      "جديد على أكياس النيكوتين في 2026؟ كل ما تحتاج معرفته عن اختيار واستخدام أكياس النيكوتين بمسؤولية.",
    isNew: true,
  },
  {
    slug: "strength-guide",
    image: "/images/academy/strength.png",
    categoryKey: "strength",
    readTime: 6,
    titleEn: "Nicotine Strength Guide: Finding Your Perfect Match",
    titleAr: "دليل قوة النيكوتين: إيجاد القوة المناسبة لك",
    excerptEn:
      "Not sure which strength to choose? Our comprehensive guide breaks down mg/g levels and helps you find the right fit.",
    excerptAr:
      "لست متأكداً أي قوة تختار؟ دليلنا الشامل يشرح مستويات ملغم/جم ويساعدك في إيجاد القوة المناسبة.",
    isNew: false,
  },
  {
    slug: "flavor-guide",
    image: "/images/academy/flavors.png",
    categoryKey: "flavor",
    readTime: 7,
    titleEn: "Complete Flavor Guide: From Mint to Bubblegum",
    titleAr: "دليل النكهات الشامل: من النعناع إلى البابل جم",
    excerptEn:
      "Explore the vast world of nicotine pouch flavors — from refreshing mints to exotic fruits and unique blends.",
    excerptAr:
      "استكشف عالم النكهات الواسع لأكياس النيكوتين — من النعناع المنعش إلى الفواكه الاستوائية والمزيج الفريد.",
    isNew: false,
  },
  {
    slug: "brand-comparison",
    image: "/images/academy/brands.png",
    categoryKey: "comparison",
    readTime: 9,
    titleEn: "White Fox vs Siberia vs 77: 2026 Brand Comparison",
    titleAr: "مقارنة العلامات 2026: وايت فوكس ضد سيبريا ضد 77",
    excerptEn:
      "A detailed side-by-side comparison of the top three nicotine pouch brands available in Egypt for 2026.",
    excerptAr:
      "مقارنة مفصلة جنب إلى جنب بين أكبر ثلاث علامات تجارية لأكياس النيكوتين المتوفرة في مصر لعام 2026.",
    isNew: true,
  },
  {
    slug: "health-science",
    image: "/images/academy/health.png",
    categoryKey: "health",
    readTime: 10,
    titleEn: "The Science Behind Nicotine Pouches",
    titleAr: "العلم وراء أكياس النيكوتين",
    excerptEn:
      "How do nicotine pouches actually work? A scientific but accessible deep-dive into absorption, effects, and safety.",
    excerptAr:
      "كيف تعمل أكياس النيكوتين فعلياً؟ نظرة علمية متعمقة لكن مبسطة في الامتصاص والتأثيرات والسلامة.",
    isNew: false,
  },
  {
    slug: "storage-usage",
    image: "/images/academy/storage.png",
    categoryKey: "storage",
    readTime: 5,
    titleEn: "How to Store & Use Nicotine Pouches Like a Pro",
    titleAr: "كيفية تخزين واستخدام أكياس النيكوتين مثل المحترفين",
    excerptEn:
      "Master the art of storing and using nicotine pouches for maximum freshness and satisfaction.",
    excerptAr:
      "أتقن فن تخزين واستخدام أكياس النيكوتين للحصول على أقصى درجات النضارة والرضا.",
    isNew: false,
  },
];

// ─── Popular Topics ─────────────────────────────────────────────────────

const popularTopicsEN = [
  "Getting Started",
  "Strength Levels",
  "Best Flavors",
  "White Fox",
  "Siberia",
  "77 Brand",
  "Nicotine Absorption",
  "Vs Smoking",
  "Storage Tips",
  "Beginner Tips",
  "Flavor Profiles",
  "Brand Reviews",
];

const popularTopicsAR = [
  "البداية",
  "مستويات القوة",
  "أفضل النكهات",
  "وايت فوكس",
  "سيبريا",
  "علامة 77",
  "امتصاص النيكوتين",
  "مقابل التدخين",
  "نصائح التخزين",
  "نصائح المبتدئين",
  "ملامح النكهات",
  "مراجعات العلامات",
];

// ─── Animation Variants ─────────────────────────────────────────────────

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

const stagger = {
  animate: { transition: { staggerChildren: 0.1 } },
};

export default function AcademyPage() {
  const { t, locale, isRTL } = useI18n();
  useRTLEffect();

  const topics = locale === "ar" ? popularTopicsAR : popularTopicsEN;

  return (
    <div className="min-h-screen bg-background" dir={isRTL ? "rtl" : "ltr"}>
      {/* ── Hero Section ────────────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-900 via-emerald-800 to-emerald-950" />
        <div className="absolute inset-0 opacity-20">
          <Image
            src="/images/academy/hero.png"
            alt="Snusii Academy"
            fill
            className="object-cover"
            priority
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/80 to-transparent" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <motion.div
            className="text-center max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <Badge className="mb-6 bg-emerald-500/20 text-emerald-200 border-emerald-500/30 px-4 py-1.5 text-sm">
              <Sparkles className="w-3.5 h-3.5 mr-1.5" />
              {locale === "ar" ? "مركز المعرفة" : "Knowledge Hub"}
            </Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 tracking-tight">
              {t("academy.title")}
            </h1>
            <p className="text-lg md:text-xl text-emerald-100/80 max-w-2xl mx-auto leading-relaxed">
              {t("academy.subtitle")}
            </p>
          </motion.div>
        </div>

        {/* Bottom wave decoration */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" className="w-full h-auto text-background">
            <path
              fill="currentColor"
              d="M0,40 C360,80 720,0 1080,40 C1260,60 1380,50 1440,40 L1440,60 L0,60 Z"
            />
          </svg>
        </div>
      </section>

      {/* ── Categories Grid ──────────────────────────────────────────── */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-12"
            {...fadeInUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
              {locale === "ar" ? "تصفح حسب الفئة" : "Browse by Category"}
            </h2>
            <p className="text-muted-foreground">
              {locale === "ar"
                ? "اختر الفئة المناسبة وابدأ رحلتك"
                : "Choose a category and start your journey"}
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6"
            variants={stagger}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {categories.map((cat, i) => {
              const Icon = cat.icon;
              return (
                <motion.div key={cat.key} variants={fadeInUp}>
                  <Link href={cat.href}>
                    <motion.div
                      className="group relative overflow-hidden rounded-xl border border-border/50 bg-card p-5 md:p-6 hover:border-emerald-500/50 hover:shadow-lg hover:shadow-emerald-500/5 transition-all duration-300"
                      whileHover={{ y: -4, scale: 1.02 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    >
                      {/* Gradient accent top bar */}
                      <div
                        className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${cat.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                      />

                      <div className="flex flex-col gap-3">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 group-hover:bg-emerald-500/20 transition-colors">
                            <Icon className="h-5 w-5" />
                          </div>
                          <span className="text-2xl">{cat.emoji}</span>
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground group-hover:text-emerald-600 transition-colors">
                            {t(`academy.categories.${cat.key}`)}
                          </h3>
                          <p className="text-sm text-muted-foreground mt-1">
                            {t(`academy.categories.${cat.key}Desc`)}
                          </p>
                        </div>
                        <div className="flex items-center text-emerald-600 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                          {t("academy.readMore")}
                          <ChevronRight
                            className={`w-4 h-4 ml-1 ${
                              isRTL ? "rotate-180 ml-0 mr-1" : ""
                            }`}
                          />
                        </div>
                      </div>
                    </motion.div>
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* ── Featured Articles ────────────────────────────────────────── */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            className="flex items-center justify-between mb-10"
            {...fadeInUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                {t("academy.featuredArticles")}
              </h2>
            </div>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={stagger}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {featuredArticles.map((article, i) => (
              <motion.div key={article.slug} variants={fadeInUp}>
                <Link href={`/academy/${article.slug}`}>
                  <motion.article
                    className="group relative overflow-hidden rounded-xl border border-border/50 bg-card hover:border-emerald-500/50 hover:shadow-lg hover:shadow-emerald-500/5 transition-all duration-300"
                    whileHover={{ y: -4 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    {/* Image */}
                    <div className="relative aspect-video overflow-hidden">
                      <Image
                        src={article.image}
                        alt={
                          locale === "ar" ? article.titleAr : article.titleEn
                        }
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3 left-3 flex gap-1.5">
                        <Badge className="bg-emerald-600 text-white text-xs px-2.5 py-1">
                          {t(`academy.categories.${article.categoryKey}`)}
                        </Badge>
                        {article.isNew && (
                          <Badge className="bg-amber-500 text-white text-xs px-2.5 py-1">
                            {locale === "ar" ? "جديد 2026" : "NEW 2026"}
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-5">
                      <h3 className="font-semibold text-foreground group-hover:text-emerald-600 transition-colors line-clamp-2 mb-2">
                        {locale === "ar" ? article.titleAr : article.titleEn}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                        {locale === "ar" ? article.excerptAr : article.excerptEn}
                      </p>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5" />
                          <span>
                            {article.readTime} {t("academy.readTime")}
                          </span>
                        </div>
                        <div className="flex items-center text-emerald-600 font-medium">
                          {t("academy.readMore")}
                          <ArrowRight
                            className={`w-3.5 h-3.5 ml-1 ${
                              isRTL ? "rotate-180 ml-0 mr-1" : ""
                            }`}
                          />
                        </div>
                      </div>
                    </div>
                  </motion.article>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Popular Topics ───────────────────────────────────────────── */}
      <section className="py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-10"
            {...fadeInUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
              {t("academy.popularTopics")}
            </h2>
          </motion.div>

          <motion.div
            className="flex flex-wrap justify-center gap-2.5 max-w-3xl mx-auto"
            variants={stagger}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {topics.map((topic, i) => (
              <motion.div key={i} variants={fadeInUp}>
                <Badge
                  variant="outline"
                  className="px-4 py-2 text-sm cursor-pointer hover:bg-emerald-500/10 hover:border-emerald-500/30 hover:text-emerald-600 transition-all duration-200 rounded-full"
                >
                  {topic}
                </Badge>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Newsletter Signup ────────────────────────────────────────── */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-emerald-900 via-emerald-800 to-emerald-950 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 rounded-full bg-emerald-400 blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-emerald-300 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            className="max-w-xl mx-auto text-center"
            {...fadeInUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            <div className="flex justify-center mb-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-emerald-500/20">
                <Mail className="h-7 w-7 text-emerald-300" />
              </div>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
              {t("academy.newsletterTitle")}
            </h2>
            <p className="text-emerald-100/70 mb-8 leading-relaxed">
              {t("academy.newsletterSubtitle")}
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Input
                placeholder={t("academy.emailPlaceholder")}
                type="email"
                className="h-12 bg-white/10 border-white/20 text-white placeholder:text-emerald-200/50 focus:border-emerald-400 focus:ring-emerald-400"
              />
              <Button className="h-12 bg-emerald-500 hover:bg-emerald-400 text-white px-8 font-semibold whitespace-nowrap">
                {t("academy.subscribe")}
              </Button>
            </div>
            <p className="text-xs text-emerald-200/40 mt-4">
              {locale === "ar"
                ? "نحترم خصوصيتك. يمكنك إلغاء الاشتراك في أي وقت."
                : "We respect your privacy. Unsubscribe at any time."}
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
