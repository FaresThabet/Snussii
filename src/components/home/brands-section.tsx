"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useI18n } from "@/lib/i18n";
import Link from "next/link";

const brands = [
  {
    name: "White Fox",
    nameAr: "White Fox",
    slug: "white-fox",
    tagline: "Swedish Premium • 4-30 mg/g",
    taglineAr: "صناعة سويدية فاخرة • 4-30 مجم/جم",
    variants: 9,
    color: "from-emerald-50 to-emerald-100",
    accent: "text-emerald-700",
    letter: "WF",
  },
  {
    name: "Siberia",
    nameAr: "Siberia",
    slug: "siberia",
    tagline: "Ultra-Strong • 33 mg/g",
    taglineAr: "قوة استثنائية • 33 مجم/جم",
    variants: 3,
    color: "from-red-50 to-red-100",
    accent: "text-red-700",
    letter: "S",
  },
  {
    name: "77",
    nameAr: "77",
    slug: "77",
    tagline: "Plant-Based • 5.2-20 mg",
    taglineAr: "أكياس نباتية • 5.2-20 مجم",
    variants: 11,
    color: "from-amber-50 to-amber-100",
    accent: "text-amber-700",
    letter: "77",
  },
];

export function BrandsSection() {
  const { locale, isRTL } = useI18n();

  return (
    <section className="py-16 sm:py-20 bg-white" dir={isRTL ? "rtl" : "ltr"}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 font-arabic-display">
            {locale === "ar" ? "تسوّق حسب الماركة" : "Featured Brands"}
          </h2>
          <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
            {locale === "ar"
              ? "تسوّق من أكثر ماركات أكياس النيكوتين موثوقية في العالم، كلها أصلية وموثّقة."
              : "Shop from the world's most trusted nicotine pouch brands, all verified authentic."}
          </p>
        </motion.div>

        {/* Mobile: horizontal scroll */}
        <div className="flex gap-4 overflow-x-auto pb-4 sm:pb-0 lg:grid lg:grid-cols-3 lg:gap-6 scrollbar-hide">
          {brands.map((brand, index) => (
            <motion.div
              key={brand.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex-shrink-0 w-72 lg:w-auto"
            >
              <Link href={`/brands/${brand.slug}`} className="block">
                <Card className="group overflow-hidden border-neutral-200 hover:border-primary/20 hover:shadow-lg transition-all duration-300 cursor-pointer h-full">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div
                        className={`flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${brand.color} group-hover:scale-110 transition-transform duration-300`}
                      >
                        <span className={`text-lg font-bold ${brand.accent}`}>
                          {brand.letter}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-neutral-900 group-hover:text-primary transition-colors font-arabic-display">
                          {brand.name}
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          {locale === "ar" ? brand.taglineAr : brand.tagline}
                        </p>
                        <p className="text-xs text-muted-foreground mt-2">
                          {locale === "ar"
                            ? `${brand.variants} منتج`
                            : `${brand.variants} variants`}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 flex items-center justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="gap-1 text-sm text-primary hover:text-primary"
                      >
                        {locale === "ar" ? "تصفّح" : "Explore"}
                        <ArrowRight className={`h-3.5 w-3.5 ${isRTL ? "rotate-180" : ""}`} />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
