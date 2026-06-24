"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, ChevronLeft, ChevronRight, BadgeCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useI18n } from "@/lib/i18n";

interface Review {
  id: number;
  name: string;
  nameAr: string;
  location: string;
  locationAr: string;
  rating: number;
  text: string;
  textAr: string;
  product?: string;
  productAr?: string;
  verified: boolean;
}

const reviews: Review[] = [
  {
    id: 1,
    name: "Ahmed M.",
    nameAr: "أحمد م.",
    location: "Cairo",
    locationAr: "القاهرة",
    rating: 5,
    text: "Best place to buy nicotine pouches in Egypt. Fast delivery and authentic products every time.",
    textAr: "أفضل مكان لشراء أكياس النيكوتين في مصر. توصيل سريع ومنتجات أصلية في كل مرة.",
    product: "White Fox Double Mint Slim 16mg",
    productAr: "وايت فوكس دبل منت سليم 16 مجم",
    verified: true,
  },
  {
    id: 2,
    name: "Sarah K.",
    nameAr: "سارة ك.",
    location: "Alexandria",
    locationAr: "الإسكندرية",
    rating: 5,
    text: "The quiz helped me choose the right product. Excellent customer service and super quick delivery.",
    textAr: "اختبار الاختيار ساعدني أختار المنتج المناسب. خدمة عملاء ممتازة وتوصيل سريع جداً.",
    product: "77 Apple Mint 10.4mg",
    productAr: "77 تفاح بالنعناع 10.4 مجم",
    verified: true,
  },
  {
    id: 3,
    name: "Mohamed R.",
    nameAr: "محمد ر.",
    location: "Giza",
    locationAr: "الجيزة",
    rating: 5,
    text: "Siberia 33 mg is the strongest I have ever tried. Thank you Snusii for bringing these to Egypt!",
    textAr: "سيبيريا 33 مجم أقوى منتج جربته في حياتي. شكراً سنوسي إنك وفّرتهم في مصر!",
    product: "Siberia Slim All White 33mg",
    productAr: "سيبيريا سليم أول وايت 33 مجم",
    verified: true,
  },
  {
    id: 4,
    name: "Youssef A.",
    nameAr: "يوسف أ.",
    location: "Mansoura",
    locationAr: "المنصورة",
    rating: 5,
    text: "Finally a reliable source for quality pouches. The loyalty points are a great bonus. Highly recommended!",
    textAr: "أخيراً مصدر موثوق لأكياس بجودة عالية. نقاط الولاء إضافة ممتازة. أنصح به بشدة!",
    product: "White Fox Full Charge 20mg",
    productAr: "وايت فوكس فول تشارج 20 مجم",
    verified: true,
  },
  {
    id: 5,
    name: "Nour H.",
    nameAr: "نور ح.",
    location: "Cairo",
    locationAr: "القاهرة",
    rating: 4,
    text: "Great variety of flavors and strengths. Delivery was fast even to my area. Will order again for sure.",
    textAr: "تشكيلة رائعة من النكهات والقوى. التوصيل كان سريع حتى لمنطقتي. أكيد هطلب تاني.",
    product: "77 Ghost Bubble Gum 20mg",
    productAr: "77 جوست بابل جام 20 مجم",
    verified: true,
  },
  {
    id: 6,
    name: "Omar T.",
    nameAr: "عمر ت.",
    location: "Aswan",
    locationAr: "أسوان",
    rating: 5,
    text: "I was amazed they deliver all the way to Aswan. Products arrived in perfect condition. 10/10 service.",
    textAr: "انبهرت إنهم بيوصلوا لحد أسوان. المنتجات وصلت في حالة ممتازة. خدمة 10/10.",
    product: "77 VB Edition Arctic Mint 20mg",
    productAr: "77 في بي إديشن آركتك منت 20 مجم",
    verified: true,
  },
];

export function TestimonialsSection() {
  const { locale, isRTL } = useI18n();
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const total = reviews.length;

  const nextSlide = useCallback(() => {
    setCurrent((prev) => (prev + 1) % total);
  }, [total]);

  const prevSlide = useCallback(() => {
    setCurrent((prev) => (prev - 1 + total) % total);
  }, [total]);

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [isPaused, nextSlide]);

  const getVisibleReviews = () => {
    const items: Review[] = [];
    for (let i = 0; i < 3; i++) {
      items.push(reviews[(current + i) % total]);
    }
    return items;
  };

  const visibleReviews = getVisibleReviews();

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
            {locale === "ar" ? "قالوا عنّا" : "What Our Customers Say"}
          </h2>
          <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
            {locale === "ar"
              ? "موثوق من آلاف العملاء في كل مصر. اقرأ تجاربهم الحقيقية مع سنوسي."
              : "Trusted by thousands of customers across Egypt. Read their real experiences with Snusii."}
          </p>
        </motion.div>

        <div
          className="relative"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div className="hidden md:grid md:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {visibleReviews.map((review) => (
                <motion.div
                  key={review.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4 }}
                  className="rounded-2xl border border-neutral-200 p-6 bg-white hover:shadow-md transition-shadow"
                >
                  <ReviewCard review={review} locale={locale} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <div className="md:hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={reviews[current].id}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
                className="rounded-2xl border border-neutral-200 p-6 bg-white"
              >
                <ReviewCard review={reviews[current]} locale={locale} />
              </motion.div>
            </AnimatePresence>
          </div>

          <Button
            variant="outline"
            size="icon"
            className={`absolute top-1/2 -translate-y-1/2 h-9 w-9 rounded-full shadow-md hidden md:flex ${
              isRTL ? "right-0 translate-x-1/2" : "left-0 -translate-x-1/2"
            }`}
            onClick={prevSlide}
          >
            {isRTL ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
          <Button
            variant="outline"
            size="icon"
            className={`absolute top-1/2 -translate-y-1/2 h-9 w-9 rounded-full shadow-md hidden md:flex ${
              isRTL ? "left-0 -translate-x-1/2" : "right-0 translate-x-1/2"
            }`}
            onClick={nextSlide}
          >
            {isRTL ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </Button>
        </div>

        <div className="flex items-center justify-center gap-2 mt-8">
          {reviews.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrent(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === current ? "w-6 bg-emerald-500" : "w-2 bg-neutral-300 hover:bg-neutral-400"
              }`}
              aria-label={`Go to review ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function ReviewCard({ review, locale }: { review: Review; locale: "ar" | "en" }) {
  const isAR = locale === "ar";
  const name = isAR ? review.nameAr : review.name;
  const location = isAR ? review.locationAr : review.location;
  const text = isAR ? review.textAr : review.text;
  const product = isAR ? review.productAr : review.product;

  return (
    <>
      <div className="flex items-center gap-0.5 mb-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={`h-4 w-4 ${
              i < review.rating ? "fill-amber-400 text-amber-400" : "fill-neutral-200 text-neutral-200"
            }`}
          />
        ))}
      </div>

      <p className="text-sm text-neutral-700 leading-relaxed mb-4 font-arabic">
        &ldquo;{text}&rdquo;
      </p>

      {product && (
        <p className="text-xs text-muted-foreground mb-4">
          {isAR ? "المنتج المشترى:" : "Purchased:"}{" "}
          <span className="font-medium text-neutral-600">{product}</span>
        </p>
      )}

      <div className="flex items-center gap-3 pt-4 border-t border-neutral-100">
        <Avatar className="h-9 w-9">
          <AvatarFallback className="bg-neutral-100 text-xs font-semibold text-neutral-600 font-arabic">
            {name.split(" ").map((n) => n[0]).join("")}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex items-center gap-1.5">
            <span className="text-sm font-semibold text-neutral-900 font-arabic">{name}</span>
            {review.verified && <BadgeCheck className="h-3.5 w-3.5 text-emerald-500" />}
          </div>
          <span className="text-xs text-muted-foreground font-arabic">{location}</span>
        </div>
      </div>
    </>
  );
}
