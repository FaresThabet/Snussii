"use client";

import { motion } from "framer-motion";
import { ArrowRight, Clock, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useI18n } from "@/lib/i18n";
import Link from "next/link";

interface Article {
  id: number;
  slug: string;
  title: string;
  titleAr: string;
  category: string;
  categoryAr: string;
  categoryColor: string;
  excerpt: string;
  excerptAr: string;
  readTime: string;
  readTimeAr: string;
  date: string;
  dateAr: string;
  image: string;
}

const articles: Article[] = [
  {
    id: 1,
    slug: "beginners-guide",
    title: "Nicotine Pouches vs Smoking: Complete Comparison",
    titleAr: "أكياس النيكوتين مقابل التدخين: مقارنة شاملة",
    category: "Guide",
    categoryAr: "دليل",
    categoryColor: "bg-blue-100 text-blue-700",
    excerpt:
      "Discover the key differences between nicotine pouches and traditional smoking. We break down health effects, cost, social impact, and user experience in this comprehensive comparison.",
    excerptAr:
      "اكتشف الفروق الجوهرية بين أكياس النيكوتين والتدخين التقليدي. نشرح لك التأثيرات الصحية، التكلفة، الأثر الاجتماعي، وتجربة الاستخدام في هذه المقارنة الشاملة.",
    readTime: "8 min read",
    readTimeAr: "8 دقائق قراءة",
    date: "Jan 15, 2026",
    dateAr: "15 يناير 2026",
    image: "/images/academy/beginners.png",
  },
  {
    id: 2,
    slug: "strength-guide",
    title: "How to Choose the Right Nicotine Strength",
    titleAr: "إزاي تختار قوة النيكوتين المناسبة لك",
    category: "Beginner Guide",
    categoryAr: "دليل المبتدئين",
    categoryColor: "bg-emerald-100 text-emerald-700",
    excerpt:
      "New to nicotine pouches? Our strength guide covers everything from 4 mg beginner pouches to 33 mg expert-level options, helping you find the perfect fit.",
    excerptAr:
      "جديد على أكياس النيكوتين؟ دليلنا يغطي كل القوى من 4 مجم للمبتدئين وحتى 33 مجم للمتمرّسين، ويساعدك تلاقي الأنسب لك.",
    readTime: "5 min read",
    readTimeAr: "5 دقائق قراءة",
    date: "Jan 18, 2026",
    dateAr: "18 يناير 2026",
    image: "/images/academy/strength.png",
  },
  {
    id: 3,
    slug: "flavor-guide",
    title: "Top 5 Flavors for Beginners in Egypt",
    titleAr: "أفضل 5 نكهات للمبتدئين في مصر",
    category: "Recommendations",
    categoryAr: "توصيات",
    categoryColor: "bg-amber-100 text-amber-700",
    excerpt:
      "Starting your nicotine pouch journey? These 5 flavors are the best entry points for Egyptian users, from refreshing mints to sweet berries.",
    excerptAr:
      "بتبدأ رحلتك مع أكياس النيكوتين؟ الـ5 نكهات دول أفضل بداية للمستخدمين المصريين، من النعناع المنعش للتوت الحلو.",
    readTime: "4 min read",
    readTimeAr: "4 دقائق قراءة",
    date: "Jan 22, 2026",
    dateAr: "22 يناير 2026",
    image: "/images/academy/flavors.png",
  },
];

export function AcademySection() {
  const { locale, isRTL } = useI18n();

  return (
    <section className="py-16 sm:py-20 bg-neutral-50" dir={isRTL ? "rtl" : "ltr"}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          className="flex items-end justify-between mb-10"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div>
            <div className="flex items-center gap-2 mb-2">
              <BookOpen className="h-5 w-5 text-primary" />
              <span className="text-sm font-semibold text-primary uppercase tracking-wider">
                {locale === "ar" ? "الأكاديمية" : "Academy"}
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 font-arabic-display">
              {locale === "ar" ? "تعلّم عن أكياس النيكوتين" : "Learn About Nicotine Pouches"}
            </h2>
            <p className="mt-2 text-muted-foreground max-w-xl">
              {locale === "ar"
                ? "أدلة خبراء، مقارنات، ونصائح تساعدك تاخد قراراتك بثقة."
                : "Expert guides, comparisons, and tips to help you make informed choices."}
            </p>
          </div>
          <Button
            variant="ghost"
            className="gap-1.5 text-sm hidden sm:flex"
            onClick={() => (window.location.href = "/academy")}
          >
            {locale === "ar" ? "ادخل الأكاديمية" : "Visit Academy"}
            <ArrowRight className={`h-4 w-4 ${isRTL ? "rotate-180" : ""}`} />
          </Button>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article, index) => (
            <motion.article
              key={article.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group rounded-2xl border border-neutral-200 bg-white overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer"
            >
              <Link href={`/academy/${article.slug}`} className="block">
                <div className="relative aspect-[16/10] overflow-hidden bg-neutral-100">
                  <img
                    src={article.image}
                    alt={isRTL ? article.titleAr : article.title}
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute top-3 left-3">
                    <Badge className={`${article.categoryColor} border-0 text-[10px] font-semibold px-2.5 py-1`}>
                      {isRTL ? article.categoryAr : article.category}
                    </Badge>
                  </div>
                </div>

                <div className="p-5">
                  <h3 className="text-base font-semibold text-neutral-900 leading-snug line-clamp-2 group-hover:text-primary transition-colors font-arabic-display">
                    {isRTL ? article.titleAr : article.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-2 leading-relaxed line-clamp-3 font-arabic">
                    {isRTL ? article.excerptAr : article.excerpt}
                  </p>

                  <div className="flex items-center justify-between mt-4 pt-3 border-t border-neutral-100">
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="font-arabic">{isRTL ? article.dateAr : article.date}</span>
                      <span className="h-1 w-1 rounded-full bg-muted-foreground" />
                      <span className="flex items-center gap-1 font-arabic">
                        <Clock className="h-3 w-3" />
                        {isRTL ? article.readTimeAr : article.readTime}
                      </span>
                    </div>
                    <span className="text-xs font-semibold text-primary opacity-0 group-hover:opacity-100 transition-opacity font-arabic">
                      {locale === "ar" ? "اقرأ المزيد" : "Read More"}
                    </span>
                  </div>
                </div>
              </Link>
            </motion.article>
          ))}
        </div>

        <div className="mt-8 text-center sm:hidden">
          <Button
            variant="outline"
            className="gap-2"
            onClick={() => (window.location.href = "/academy")}
          >
            {locale === "ar" ? "ادخل الأكاديمية" : "Visit Academy"}
            <ArrowRight className={`h-4 w-4 ${isRTL ? "rotate-180" : ""}`} />
          </Button>
        </div>
      </div>
    </section>
  );
}
