"use client";

import { useI18n } from "@/lib/i18n";
import { useRTLEffect } from "@/lib/i18n";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Clock,
  Calendar,
  User,
  Share2,
  Copy,
  Check,
  ChevronRight,
  ArrowLeft,
  ArrowRight,
  X,
} from "lucide-react";
import { ReadingProgressBar } from "./reading-progress-bar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

// ─── Types ────────────────────────────────────────────────────────────────

interface TOCItem {
  id: string;
  labelEn: string;
  labelAr: string;
}

interface ArticleMeta {
  titleEn: string;
  titleAr: string;
  image: string;
  categoryKey: string;
  readTime: number;
  date: string;
  authorEn: string;
  authorAr: string;
  toc: TOCItem[];
  relatedArticles: {
    slug: string;
    titleEn: string;
    titleAr: string;
    image: string;
    categoryKey: string;
  }[];
}

// ─── Highlight Box Component ──────────────────────────────────────────────

function HighlightBox({
  type,
  children,
}: {
  type: "info" | "warning" | "tip";
  children: React.ReactNode;
}) {
  const { t } = useI18n();
  const configs = {
    info: {
      border: "border-emerald-500/30",
      bg: "bg-emerald-500/5",
      badge: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
      label:
        t.locale === "ar" ? "معلومة" : "Did You Know?",
      icon: "💡",
    },
    warning: {
      border: "border-amber-500/30",
      bg: "bg-amber-500/5",
      badge: "bg-amber-500/10 text-amber-700 dark:text-amber-300",
      label:
        t.locale === "ar" ? "تحذير" : "Important",
      icon: "⚠️",
    },
    tip: {
      border: "border-sky-500/30",
      bg: "bg-sky-500/5",
      badge: "bg-sky-500/10 text-sky-700 dark:text-sky-300",
      label:
        t.locale === "ar" ? "نصيحة" : "Pro Tip",
      icon: "✨",
    },
  };

  const config = configs[type];

  return (
    <div
      className={`rounded-lg border ${config.border} ${config.bg} p-4 md:p-5 my-6`}
    >
      <div className="flex items-center gap-2 mb-2">
        <span className="text-lg">{config.icon}</span>
        <span
          className={`text-xs font-semibold px-2 py-0.5 rounded-full ${config.badge}`}
        >
          {config.label}
        </span>
      </div>
      <div className="text-sm text-muted-foreground leading-relaxed">
        {children}
      </div>
    </div>
  );
}

// ─── Share Buttons ────────────────────────────────────────────────────────

function ShareButtons() {
  const { t, locale, isRTL } = useI18n();
  const [copied, setCopied] = useState(false);
  const url = typeof window !== "undefined" ? window.location.href : "";

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  const shareLinks = [
    {
      name: "WhatsApp",
      color: "hover:bg-green-500/10 hover:text-green-600",
      href: `https://wa.me/?text=${encodeURIComponent(url)}`,
    },
    {
      name: "Twitter",
      color: "hover:bg-sky-500/10 hover:text-sky-600",
      href: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}`,
    },
    {
      name: "Facebook",
      color: "hover:bg-blue-500/10 hover:text-blue-600",
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    },
  ];

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-muted-foreground">
        <Share2 className="w-4 h-4 inline mr-1" />
        {t("academy.shareArticle")}:
      </span>
      {shareLinks.map((link) => (
        <a
          key={link.name}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          className={`text-xs px-2.5 py-1.5 rounded-full border border-border/50 text-muted-foreground ${link.color} transition-colors`}
        >
          {link.name}
        </a>
      ))}
      <button
        onClick={handleCopy}
        className={`text-xs px-2.5 py-1.5 rounded-full border border-border/50 text-muted-foreground hover:bg-emerald-500/10 hover:text-emerald-600 transition-colors flex items-center gap-1`}
      >
        {copied ? (
          <>
            <Check className="w-3 h-3" />
            {locale === "ar" ? "تم النسخ" : "Copied!"}
          </>
        ) : (
          <>
            <Copy className="w-3 h-3" />
            {locale === "ar" ? "نسخ الرابط" : "Copy Link"}
          </>
        )}
      </button>
    </div>
  );
}

// ─── Main Article Template Component ──────────────────────────────────────

export function ArticleTemplate({
  meta,
  children,
}: {
  meta: ArticleMeta;
  children: React.ReactNode;
}) {
  const { t, locale, isRTL } = useI18n();
  useRTLEffect();
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: "-80px 0px -70% 0px" }
    );

    meta.toc.forEach((item) => {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [meta.toc]);

  return (
    <div className="min-h-screen bg-background" dir={isRTL ? "rtl" : "ltr"}>
      <ReadingProgressBar />

      {/* ── Article Header ──────────────────────────────────────── */}
      <header className="relative">
        <div className="relative aspect-[21/9] md:aspect-[21/8] overflow-hidden">
          <Image
            src={meta.image}
            alt={locale === "ar" ? meta.titleAr : meta.titleEn}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 -mt-24 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Badge className="bg-emerald-600 text-white text-xs px-3 py-1 mb-4">
              {t(`academy.categories.${meta.categoryKey}`)}
            </Badge>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 leading-tight max-w-4xl">
              {locale === "ar" ? meta.titleAr : meta.titleEn}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-4">
              <div className="flex items-center gap-1.5">
                <User className="w-4 h-4" />
                <span>
                  {locale === "ar" ? meta.authorAr : meta.authorEn}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                <span>{meta.date}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                <span>
                  {meta.readTime} {t("academy.readTime")}
                </span>
              </div>
            </div>
            <ShareButtons />
          </motion.div>
        </div>
      </header>

      {/* ── Article Body ────────────────────────────────────────── */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 md:py-16">
        <div className="flex gap-10 lg:gap-16">
          {/* Sidebar TOC — Desktop */}
          <aside className="hidden lg:block w-56 shrink-0">
            <div className="sticky top-24">
              <h4 className="text-sm font-semibold text-foreground mb-4">
                {t("academy.tableOfContents")}
              </h4>
              <nav className="space-y-1">
                {meta.toc.map((item) => (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    className={`block text-sm py-1.5 transition-colors ${
                      activeSection === item.id
                        ? "text-emerald-600 font-medium border-l-2 border-emerald-600 pl-3"
                        : "text-muted-foreground hover:text-foreground pl-3 border-l-2 border-transparent"
                    } ${isRTL ? "border-l-0 border-r-2 pl-0 pr-3" : ""}`}
                    style={
                      activeSection === item.id && isRTL
                        ? { borderLeftColor: "transparent", borderRightColor: "rgb(5 150 105)" }
                        : undefined
                    }
                  >
                    {locale === "ar" ? item.labelAr : item.labelEn}
                  </a>
                ))}
              </nav>

              {/* Related Articles Sidebar */}
              <div className="mt-8 pt-8 border-t border-border/50">
                <h4 className="text-sm font-semibold text-foreground mb-4">
                  {t("academy.relatedArticles")}
                </h4>
                <div className="space-y-3">
                  {meta.relatedArticles.map((related) => (
                    <Link
                      key={related.slug}
                      href={`/academy/${related.slug}`}
                      className="group block"
                    >
                      <div className="text-sm font-medium text-muted-foreground group-hover:text-emerald-600 transition-colors line-clamp-2">
                        {locale === "ar" ? related.titleAr : related.titleEn}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <article className="flex-1 min-w-0">
            {/* Mobile TOC */}
            <div className="lg:hidden mb-8">
              <Collapsible>
                <CollapsibleTrigger className="flex items-center justify-between w-full p-4 rounded-lg border border-border/50 bg-muted/30 text-sm font-medium">
                  <span>{t("academy.tableOfContents")}</span>
                  <ChevronRight className="w-4 h-4" />
                </CollapsibleTrigger>
                <CollapsibleContent className="mt-2 p-4 rounded-lg border border-border/50 bg-muted/30">
                  <nav className="space-y-2">
                    {meta.toc.map((item) => (
                      <a
                        key={item.id}
                        href={`#${item.id}`}
                        className="block text-sm text-muted-foreground hover:text-emerald-600 transition-colors"
                      >
                        {locale === "ar" ? item.labelAr : item.labelEn}
                      </a>
                    ))}
                  </nav>
                </CollapsibleContent>
              </Collapsible>
            </div>

            {/* Article Content */}
            <div className="prose-sm md:prose prose-neutral dark:prose-invert max-w-none">
              {children}
            </div>

            {/* Bottom Share */}
            <div className="mt-12 pt-8 border-t border-border/50">
              <ShareButtons />
            </div>

            {/* Back to Academy */}
            <div className="mt-8">
              <Link href="/academy">
                <Button
                  variant="outline"
                  className="gap-2 hover:bg-emerald-500/10 hover:border-emerald-500/30 hover:text-emerald-600"
                >
                  {isRTL ? (
                    <ArrowRight className="w-4 h-4" />
                  ) : (
                    <ArrowLeft className="w-4 h-4" />
                  )}
                  {t("academy.backToAcademy")}
                </Button>
              </Link>
            </div>

            {/* Related Articles Carousel */}
            <div className="mt-12 pt-8 border-t border-border/50">
              <h3 className="text-xl font-bold text-foreground mb-6">
                {t("academy.relatedArticles")}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {meta.relatedArticles.map((related) => (
                  <Link key={related.slug} href={`/academy/${related.slug}`}>
                    <div className="group rounded-lg border border-border/50 overflow-hidden hover:border-emerald-500/50 hover:shadow-md transition-all">
                      <div className="relative aspect-video">
                        <Image
                          src={related.image}
                          alt={
                            locale === "ar"
                              ? related.titleAr
                              : related.titleEn
                          }
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div className="p-3">
                        <Badge
                          variant="secondary"
                          className="text-xs mb-2 bg-emerald-500/10 text-emerald-600"
                        >
                          {t(`academy.categories.${related.categoryKey}`)}
                        </Badge>
                        <h4 className="text-sm font-medium text-foreground group-hover:text-emerald-600 transition-colors line-clamp-2">
                          {locale === "ar" ? related.titleAr : related.titleEn}
                        </h4>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </article>
        </div>
      </div>
    </div>
  );
}

// Re-export for article pages
export { HighlightBox };
