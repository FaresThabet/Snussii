"use client";

import { motion, useInView } from "framer-motion";
import { useEffect, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import {
  Shield,
  Truck,
  TrendingDown,
  MessageCircle,
  ArrowRight,
  AlertTriangle,
  Package,
  Users,
  MapPin,
  ShoppingBag,
  Star,
  Clock,
  Heart,
  Home,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { useI18n } from "@/lib/i18n";
import { toArabicNumerals } from "@/lib/format";

// ─── Animation Helpers ──────────────────────────────────────────────────────

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0 },
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

function FadeInSection({ children, className = "", delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
      variants={fadeUp}
      transition={{ duration: 0.6, ease: [0.25, 0.4, 0.25, 1], delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function AnimatedCounter({ target, suffix = "", prefix = "", duration = 2000, isRTL = false }: { target: number; suffix?: string; prefix?: string; duration?: number; isRTL?: boolean }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  useEffect(() => {
    if (!inView) return;
    const startTime = performance.now();
    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [inView, target, duration]);

  const display = isRTL ? toArabicNumerals(count.toLocaleString("en-US")) : count.toLocaleString();

  return (
    <span ref={ref}>
      {prefix}
      {display}
      {suffix}
    </span>
  );
}

// ─── Data ───────────────────────────────────────────────────────────────────

const stats = [
  { icon: Package, value: 23, suffix: "+", labelEn: "Products", labelAr: "منتج", descEn: "Premium nicotine pouch variants", descAr: "تشكيلة أكياس نيكوتين فاخرة" },
  { icon: Star, value: 3, suffix: "", labelEn: "Brands", labelAr: "ماركات", descEn: "World-class Swedish brands", descAr: "ماركات سويدية عالمية" },
  { icon: MapPin, value: 27, suffix: "", labelEn: "Governorates", labelAr: "محافظة", descEn: "Nationwide delivery coverage", descAr: "توصيل لكل محافظات مصر" },
  { icon: ShoppingBag, value: 10000, suffix: "+", labelEn: "Orders", labelAr: "طلب", descEn: "Delivered to happy customers", descAr: "تم توصيلها لعملاء سعداء" },
];

const features = [
  {
    icon: Shield,
    titleEn: "100% Authentic",
    titleAr: "أصلي 100%",
    descEn: "Every product in our catalog is sourced directly from certified Swedish manufacturers. We guarantee genuine White Fox, Siberia, and 77 products — no counterfeits, no compromises. Each batch is verified upon arrival at our Cairo fulfillment center.",
    descAr: "كل منتج في كتالوجنا مستورد مباشرة من المصنّعين السويديين المعتمدين. نضمن أصالة منتجات White Fox وSiberia و77 — بدون تقليد ولا تنازلات. كل تشغيلة يتم التحقق منها فور وصولها لمخزننا في القاهرة.",
  },
  {
    icon: Truck,
    titleEn: "Fast Delivery",
    titleAr: "توصيل سريع",
    descEn: "We deliver to all 27 Egyptian governorates in 2–5 business days. Orders placed before 2 PM ship same-day from our Cairo warehouse. Cairo and Alexandria customers often receive their orders within 24–48 hours via our express delivery partners.",
    descAr: "نوصّل لكل محافظات مصر الـ27 خلال 2-5 أيام عمل. الطلبات اللي بتوصل قبل الساعة 2 الضهر بتنشحن في نفس اليوم من مخزننا في القاهرة. عملاء القاهرة والإسكندرية بيوصلهم الطلب خلال 24-48 ساعة عبر شركاء التوصيل السريع.",
  },
  {
    icon: TrendingDown,
    titleEn: "Best Prices",
    titleAr: "أفضل الأسعار",
    descEn: "We negotiate directly with manufacturers to bring you the most competitive pricing in Egypt. Regular promotions, bundle deals, and our loyalty rewards program ensure you always get the best value. Starting from just 350 EGP per can.",
    descAr: "بنتفاوض مباشرة مع المصنّعين عشان نوفّرلك أفضل الأسعار في مصر. عروض دورية، باقات مخفضة، وبرنامج نقاط الولاء بيخليك دايماً تحصل على أفضل قيمة. الأسعار تبدأ من 350 جنيه فقط للعلبة.",
  },
  {
    icon: MessageCircle,
    titleEn: "24/7 Support",
    titleAr: "دعم على مدار الساعة",
    descEn: "Our dedicated support team is available around the clock via WhatsApp, live chat, and email. Whether you need help choosing the right product, tracking your order, or have any questions — we're always just a message away.",
    descAr: "فريق الدعم المخصّص بتاعنا متاح على مدار الساعة عبر واتساب والمحادثة المباشرة والبريد الإلكتروني. سواء محتاج مساعدة في اختيار المنتج المناسب، تتبّع طلبك، أو أي استفسار — إحنا دايماً على بعد رسالة منك.",
  },
];

const brands = [
  {
    name: "White Fox",
    slug: "white-fox",
    letter: "WF",
    gradient: "from-emerald-500/20 to-emerald-600/5",
    borderAccent: "hover:border-emerald-500/40",
    iconBg: "bg-emerald-500/15 text-emerald-400",
    taglineEn: "Swedish Premium",
    taglineAr: "صناعة سويدية فاخرة",
    strengthRange: "4–30 mg/g",
    strengthRangeAr: "٤–٣٠ مجم/جم",
    descEn: "Crafted in Sweden by GN Tobacco, White Fox delivers a refined nicotine experience with an extensive flavor range. From cool mint to tropical fruit, each pouch offers consistent release and premium quality. Available in strengths from 4 mg/g to a bold 30 mg/g, catering to every preference from first-time users to seasoned enthusiasts.",
    descAr: "مصنوع في السويد بواسطة GN Tobacco، White Fox يقدّم تجربة نيكوتين راقية بتشكيلة نكهات واسعة. من النعناع البارد للفواكه الاستوائية، كل كيس يوفر إطلاقاً ثابتاً وجودة فاخرة. متوفّر بقوى من 4 مجم/جم وحتى 30 مجم/جم الجريء، يناسب كل الأذواق من المبتدئين للمتمرّسين.",
    variants: 9,
  },
  {
    name: "Siberia",
    slug: "siberia",
    letter: "S",
    gradient: "from-red-500/20 to-red-600/5",
    borderAccent: "hover:border-red-500/40",
    iconBg: "bg-red-500/15 text-red-400",
    taglineEn: "Ultra-Strong",
    taglineAr: "قوة استثنائية",
    strengthRange: "33 mg/g",
    strengthRangeAr: "٣٣ مجم/جم",
    descEn: "Manufactured by GN Tobacco in Sweden, Siberia is the gold standard for users seeking maximum nicotine intensity. At 33 mg/g, it delivers one of the strongest experiences available anywhere in the world. Despite its power, Siberia maintains a smooth, well-rounded flavor profile that has earned it a cult following across Europe and the Middle East.",
    descAr: "مصنّع بواسطة GN Tobacco في السويد، Siberia هو المعيار الذهبي للمستخدمين الباحثين عن أقصى قوة نيكوتين. بقوة 33 مجم/جم، يقدّم واحدة من أقوى التجارب المتاحة في العالم. رغم قوته، يحافظ Siberia على ملف نكهة سلس ومتوازن كسبه قاعدة جماهيرية واسعة في أوروبا والشرق الأوسط.",
    variants: 3,
  },
  {
    name: "77",
    slug: "77",
    letter: "77",
    gradient: "from-amber-500/20 to-amber-600/5",
    borderAccent: "hover:border-amber-500/40",
    iconBg: "bg-amber-500/15 text-amber-400",
    taglineEn: "Plant-Based",
    taglineAr: "نباتي 100%",
    strengthRange: "5.2–20 mg",
    strengthRangeAr: "٥.٢–٢٠ مجم",
    descEn: "77 stands apart with its 100% plant-based pouch material, making it the go-to choice for health-conscious users. Produced by Luna Corporate in Poland, 77 offers an impressive 11 flavor variants ranging from classic mint to exotic blends. With strengths from 5.2 mg/pouch to 20 mg/pouch, it provides a balanced experience for all user levels.",
    descAr: "77 يتميّز بمادة الكيس النباتية 100%، مما يجعله الخيار الأول للمستخدمين المهتمّين بصحتهم. منتج بواسطة Luna Corporate في بولندا، 77 يوفر 11 نكهة متنوّعة من النعناع الكلاسيكي للمزج الاستوائي. بقوى من 5.2 مجم/كيس إلى 20 مجم/كيس، يقدّم تجربة متوازنة لكل المستخدمين.",
    variants: 11,
  },
];

// ─── Hero Section ───────────────────────────────────────────────────────────

function HeroSection({ locale, isRTL }: { locale: "ar" | "en"; isRTL: boolean }) {
  const isAR = locale === "ar";
  return (
    <section className="relative overflow-hidden" dir={isRTL ? "rtl" : "ltr"}>
      <div className="absolute inset-0 bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950" />
      <div
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />
      <div className="absolute top-1/3 left-0 w-[500px] h-[500px] bg-emerald-500/8 rounded-full blur-[120px]" />
      <div className="absolute bottom-1/4 right-0 w-[400px] h-[400px] bg-amber-500/6 rounded-full blur-[100px]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 sm:py-28 lg:py-36">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Badge variant="secondary" className="mb-6 px-4 py-1.5 text-sm bg-white/10 text-white/90 border-white/20 backdrop-blur-sm font-arabic">
              <Heart className="h-3.5 w-3.5 mr-1.5" />
              {isAR ? "صُنع لمصر، من المصريين" : "Built for Egypt, by Egyptians"}
            </Badge>
          </motion.div>

          <motion.h1
            className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.2] font-arabic-display"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            {isAR ? (
              <>
                متجر أكياس النيكوتين{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-amber-400">
                  الفاخر
                </span>{" "}
                رقم 1 في مصر
              </>
            ) : (
              <>
                Egypt&apos;s #1{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-amber-400">
                  Premium
                </span>{" "}
                Nicotine Pouch Store
              </>
            )}
          </motion.h1>

          <motion.p
            className="mt-6 text-lg sm:text-xl text-white/60 leading-relaxed max-w-2xl mx-auto font-arabic"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {isAR
              ? "انطلق سنوسي بمهمّة واحدة: إننا نوفّر للمصريين أفضل أكياس النيكوتين الخالية من التبغ في العالم — أصلية، بأسعار مناسبة، وتوصلك لباب بيتك في كل المحافظات الـ27."
              : "Snusii was founded with a single mission: to give Egyptians access to the world's finest tobacco-free nicotine pouches — authentic, affordable, and delivered to your doorstep across all 27 governorates."}
          </motion.p>

          <motion.div
            className="mt-10 flex flex-wrap items-center justify-center gap-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            {(isAR
              ? ["تأسس 2024", "القاهرة، مصر", "أصلي 100%", "27 محافظة"]
              : ["Est. 2024", "Cairo, Egypt", "100% Authentic", "27 Governorates"]
            ).map((tag) => (
              <span key={tag} className="px-3 py-1.5 rounded-full text-xs font-medium text-white/50 border border-white/10 bg-white/5 font-arabic">
                {tag}
              </span>
            ))}
          </motion.div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#0a0a0a] to-transparent" />
    </section>
  );
}

// ─── Our Story Section ──────────────────────────────────────────────────────

function OurStorySection({ locale, isRTL }: { locale: "ar" | "en"; isRTL: boolean }) {
  const isAR = locale === "ar";
  return (
    <section className="py-16 sm:py-24" dir={isRTL ? "rtl" : "ltr"}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          <FadeInSection>
            <div>
              <Badge variant="outline" className="mb-4 px-3 py-1 text-xs font-medium border-emerald-500/30 text-emerald-400 bg-emerald-500/10 font-arabic">
                {isAR ? "قصّتنا" : "Our Story"}
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-6 font-arabic-display">
                {isAR ? "من القاهرة لكل ركن في مصر" : "From Cairo to Every Corner of Egypt"}
              </h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed font-arabic">
                <p>
                  {isAR
                    ? "سنوسي وُلد أوائل 2024 من إحباط بسيط: الحصول على أكياس نيكوتين أصلية وعالية الجودة في مصر كان معناه الاعتماد على بائعين غير موثوقين، دفع أسعار مبالغ فيها، أو أسوأ — شراء منتجات مقلّدة دون أن تعرف."
                    : "Snusii was born in early 2024 from a simple frustration: getting your hands on genuine, high-quality nicotine pouches in Egypt meant relying on unreliable resellers, paying inflated prices, or worse — unknowingly buying counterfeit products."}
                </p>
                <p>
                  {isAR
                    ? "المؤسّسون، فريق من روّاد الأعمال المصريين الشباب في القاهرة، عاشوا التجربة دي بنفسهم. بعد شهور من البحث، مفاوضات مباشرة مع المصنّعين السويديين، وبناء سلسلة توريد من الصفر، أُطلق سنوسي كأول منصة مصرية متخصصة في بيع أكياس النيكوتين."
                    : "Our founders, a team of young Egyptian entrepreneurs based in Cairo, experienced this firsthand. After months of research, direct negotiations with Swedish manufacturers, and building a supply chain from scratch, Snusii launched as Egypt's first dedicated nicotine pouch e-commerce platform."}
                </p>
                <p>
                  {isAR
                    ? "اليوم، نفخر إننا أكبر سوق لأكياس النيكوتين الفاخرة في مصر. بنتعاون حصرياً مع GN Tobacco وSnusFactory — اتنين من أكثر المصنّعين السويديين احتراماً — عشان نضمن إن كل علبة بتخرج من مخزننا أصلية 100%."
                    : "Today, we're proud to be the country's largest marketplace for premium nicotine pouches. We work exclusively with GN Tobacco and SnusFactory — two of Sweden's most respected manufacturers — to ensure every can that leaves our warehouse is 100% genuine."}
                </p>
                <p>
                  {isAR
                    ? "التزامنا يتعدّى بيع المنتجات. بنينا سنوسي ليتثقّف، ليقدّم تجربة شراء استثنائية، ويرد الجميل للمجتمع اللي وثق فينا أولاً. كل طلب بيتعامل معاه بعناية، كل عميل عيلة، وكل منتج مدعوم بضمان الأصالة."
                    : "Our commitment goes beyond selling products. We've built Snusii to educate, to deliver an exceptional shopping experience, and to give back to the community that trusted us first. Every order is handled with care, every customer is treated like family, and every product is backed by our authenticity guarantee."}
                </p>
              </div>
            </div>
          </FadeInSection>

          <motion.div
            className="grid grid-cols-2 gap-4"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
          >
            {stats.map((stat) => (
              <motion.div
                key={stat.labelEn}
                variants={fadeUp}
                transition={{ duration: 0.5, ease: [0.25, 0.4, 0.25, 1] }}
                className="group relative rounded-2xl border border-border/40 bg-card p-5 sm:p-6 hover:border-border/70 transition-all duration-300"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 mb-4 group-hover:bg-emerald-500/20 transition-colors duration-300">
                  <stat.icon className="h-5 w-5" />
                </div>
                <div className="text-3xl sm:text-4xl font-bold tracking-tight font-arabic-display">
                  <AnimatedCounter target={stat.value} suffix={stat.suffix} isRTL={isRTL} />
                </div>
                <p className="text-sm font-semibold mt-1 font-arabic">{isAR ? stat.labelAr : stat.labelEn}</p>
                <p className="text-xs text-muted-foreground mt-0.5 font-arabic">{isAR ? stat.descAr : stat.descEn}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ─── Why Snusii Section ─────────────────────────────────────────────────────

function WhySnusiiSection({ locale, isRTL }: { locale: "ar" | "en"; isRTL: boolean }) {
  const isAR = locale === "ar";
  return (
    <section className="py-16 sm:py-24 bg-muted/20" dir={isRTL ? "rtl" : "ltr"}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <FadeInSection className="text-center mb-12">
          <Badge variant="outline" className="mb-4 px-3 py-1 text-xs font-medium border-amber-500/30 text-amber-400 bg-amber-500/10 font-arabic">
            {isAR ? "ليه تختارنا" : "Why Choose Us"}
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight font-arabic-display">
            {isAR ? "ليه تختار سنوسي؟" : "Why Snusii?"}
          </h2>
          <p className="mt-3 text-muted-foreground max-w-xl mx-auto font-arabic">
            {isAR
              ? "إحنا مش مجرد متجر أونلاين. دي اللي بتفرّقنا كأكثر وجهة موثوقة لأكياس النيكوتين في مصر."
              : "We're not just another online store. Here's what sets Snusii apart as Egypt's most trusted nicotine pouch destination."}
          </p>
        </FadeInSection>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
        >
          {features.map((feature) => (
            <motion.div
              key={feature.titleEn}
              variants={fadeUp}
              transition={{ duration: 0.5, ease: [0.25, 0.4, 0.25, 1] }}
              className="group relative rounded-2xl border border-border/40 bg-card p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 hover:border-border/70 transition-all duration-300"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 mb-4 group-hover:bg-emerald-500 group-hover:text-white transition-colors duration-300">
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="text-base font-semibold mb-2 font-arabic-display">{isAR ? feature.titleAr : feature.titleEn}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed font-arabic">{isAR ? feature.descAr : feature.descEn}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// ─── Our Brands Section ─────────────────────────────────────────────────────

function OurBrandsSection({ locale, isRTL }: { locale: "ar" | "en"; isRTL: boolean }) {
  const isAR = locale === "ar";
  return (
    <section className="py-16 sm:py-24" dir={isRTL ? "rtl" : "ltr"}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <FadeInSection className="text-center mb-12">
          <Badge variant="outline" className="mb-4 px-3 py-1 text-xs font-medium border-emerald-500/30 text-emerald-400 bg-emerald-500/10 font-arabic">
            {isAR ? "شركاؤنا" : "Our Partners"}
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight font-arabic-display">
            {isAR ? "ماركاتنا" : "Our Brands"}
          </h2>
          <p className="mt-3 text-muted-foreground max-w-xl mx-auto font-arabic">
            {isAR
              ? "بنتعاون حصرياً مع أكثر مصنّعي أكياس النيكوتين موثوقية في العالم عشان نضمن الأصالة والجودة."
              : "We partner exclusively with the world's most respected nicotine pouch manufacturers to guarantee authenticity and quality."}
          </p>
        </FadeInSection>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {brands.map((brand, index) => (
            <FadeInSection key={brand.name} delay={index * 0.1}>
              <Link href={`/brands/${brand.slug}`}>
                <div className="group relative rounded-2xl border border-border/40 bg-card overflow-hidden hover:border-border/70 hover:shadow-xl transition-all duration-300 h-full">
                  <div className={`h-1.5 w-full bg-gradient-to-r ${brand.gradient}`} />
                  <div className="p-6 sm:p-8">
                    <div className="flex items-start gap-4 mb-5">
                      <div className={`flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl ${brand.iconBg} group-hover:scale-110 transition-transform duration-300`}>
                        <span className="text-base font-bold">{brand.letter}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg font-semibold group-hover:text-emerald-400 transition-colors font-arabic-display">
                            {brand.name}
                          </h3>
                          <ArrowRight className={`h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-all duration-300 ${isRTL ? "rotate-180 -translate-x-0.5" : "translate-x-0.5"}`} />
                        </div>
                        <p className="text-sm text-muted-foreground mt-0.5 font-arabic">
                          {isAR ? brand.taglineAr : brand.taglineEn} &middot; <span dir="ltr">{isAR ? brand.strengthRangeAr : brand.strengthRange}</span>
                        </p>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-5 font-arabic">
                      {isAR ? brand.descAr : brand.descEn}
                    </p>
                    <div className="flex items-center gap-4 pt-4 border-t border-border/40">
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-arabic">
                        <Package className="h-3.5 w-3.5" />
                        <span>{isAR ? `${toArabicNumerals(brand.variants)} منتج` : `${brand.variants} variants`}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-arabic">
                        <Shield className="h-3.5 w-3.5" />
                        <span>{isAR ? "أصلي 100%" : "100% Authentic"}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </FadeInSection>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Age Compliance Section ─────────────────────────────────────────────────

function AgeComplianceSection({ locale, isRTL }: { locale: "ar" | "en"; isRTL: boolean }) {
  const isAR = locale === "ar";
  return (
    <section className="py-16 sm:py-24 bg-muted/20" dir={isRTL ? "rtl" : "ltr"}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <FadeInSection>
          <div className="max-w-3xl mx-auto">
            <div className="relative rounded-2xl border border-amber-500/20 bg-amber-500/5 p-6 sm:p-8 lg:p-10">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/15 text-amber-400 mb-5">
                <AlertTriangle className="h-6 w-6" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-4 font-arabic-display">
                {isAR ? "الالتزام بالعمر والمسؤولية الصحية" : "Age Compliance & Health Responsibility"}
              </h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed font-arabic">
                <p className="font-medium text-foreground/90">
                  {isAR
                    ? "لازم تكون 21 سنة أو أكبر عشان تشتري أكياس نيكوتين من سنوسي. ده متطلب قانوني ومسؤولية بناخدها بجدية تامة."
                    : "You must be 21 years or older to purchase nicotine pouches from Snusii. This is a legal requirement and a responsibility we take extremely seriously."}
                </p>
                <p>
                  {isAR
                    ? "النيكوتين مادة تسبّب الإدمان. منتجاتنا مخصّصة للمستهلكين البالغين فقط، ومش مفروضة لغير المدخنين، أو السيدات الحوامل أو المرضعات، أو الأشخاص اللي عندهم تاريخ مع أمراض القلب والأوعية الدموية. مع إن أكياس النيكوتين خالية من التبغ وما بتشترطش احتراق أو استنشاق للقطران، إلا أنها بتوصل نيكوتين — منبّه ممكن يزيد معدل ضربات القلب وضغط الدم."
                    : "Nicotine is an addictive substance. Our products are intended exclusively for adult nicotine consumers and are not recommended for non-smokers, pregnant or nursing women, or individuals with a history of cardiovascular disease. While nicotine pouches are tobacco-free and do not involve combustion or inhalation of tar, they still deliver nicotine — a stimulant that can increase heart rate and blood pressure."}
                </p>
                <p>
                  {isAR
                    ? "في سنوسي، بنفرض تحقّق صارم من العمر عند إتمام الطلب. كمان بنردّع بنشاط استخدام القاصرين عبر ممارساتنا التسويقية، التغليف، وإرشادات المجتمع. إحنا بنؤمن بالشفافية: منتجاتنا بدائل لتقليل الضرر للمدخنين البالغين، مش إكسسوار lifestyle للشباب."
                    : "At Snusii, we enforce strict age verification at checkout. We also actively discourage use by minors through our marketing practices, packaging, and community guidelines. We believe in transparency: our products are harm-reduction alternatives for adult smokers, not lifestyle accessories for young people."}
                </p>
                <p>
                  {isAR
                    ? "لو بتحاول توقف النيكوتين نهائياً، بننصحك تستشار أخصائي رعاية صحية. إحنا بنؤيد الخيارات المُدرَكة والاستهلاك المسؤول."
                    : "If you're trying to quit nicotine entirely, we encourage you to consult a healthcare professional. We support informed choices and responsible consumption."}
                </p>
              </div>
              <div className="mt-6 pt-6 border-t border-amber-500/20">
                <div className="flex flex-wrap gap-3">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20 font-arabic">
                    <AlertTriangle className="h-3 w-3" />
                    {isAR ? "مطلوب 21+" : "21+ Age Required"}
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20 font-arabic">
                    <Shield className="h-3 w-3" />
                    {isAR ? "تأكيد العمر عند الدفع" : "Age Verified at Checkout"}
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20 font-arabic">
                    <Heart className="h-3 w-3" />
                    {isAR ? "استهلاك مسؤول" : "Consume Responsibly"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </FadeInSection>
      </div>
    </section>
  );
}

// ─── CTA Section ────────────────────────────────────────────────────────────

function CTASection({ locale, isRTL }: { locale: "ar" | "en"; isRTL: boolean }) {
  const isAR = locale === "ar";
  return (
    <section className="py-16 sm:py-24" dir={isRTL ? "rtl" : "ltr"}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <FadeInSection>
          <div className="relative rounded-2xl border border-border/40 bg-card overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-[80px]" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-amber-500/5 rounded-full blur-[60px]" />

            <div className="relative px-6 py-12 sm:px-12 sm:py-16 lg:px-16 lg:py-20 text-center">
              <motion.h2
                className="text-3xl sm:text-4xl font-bold tracking-tight font-arabic-display"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                {isAR ? (
                  <>
                    جاهز{" "}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-amber-400">
                      تبدأ؟
                    </span>
                  </>
                ) : (
                  <>
                    Ready to{" "}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-amber-400">
                      Get Started?
                    </span>
                  </>
                )}
              </motion.h2>

              <motion.p
                className="mt-4 text-muted-foreground max-w-lg mx-auto font-arabic"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                {isAR
                  ? "تصفّح تشكيلتنا الكاملة لأكثر من 23 نوع من أكياس النيكوتين الفاخرة. شحن مجاني للطلبات فوق 1000 جنيه لكل المحافظات الـ27."
                  : "Browse our complete collection of 23+ premium nicotine pouches. Free delivery on orders over 1,000 EGP to all 27 governorates."}
              </motion.p>

              <motion.div
                className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <Button asChild size="lg" className={`gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold px-8 h-12 text-base font-arabic ${isRTL ? "flex-row-reverse" : ""}`}>
                  <Link href="/products">
                    {isAR ? "ابدأ التسوّق" : "Start Shopping"}
                    <ArrowRight className={`h-4 w-4 ${isRTL ? "rotate-180" : ""}`} />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="gap-2 border-border/60 font-semibold px-8 h-12 text-base font-arabic">
                  <Link href="/products">{isAR ? "تصفّح كل المنتجات" : "View All Products"}</Link>
                </Button>
              </motion.div>

              <motion.div
                className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-xs text-muted-foreground font-arabic"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                <span className="flex items-center gap-1.5">
                  <Truck className="h-3.5 w-3.5 text-emerald-400" />
                  {isAR ? "شحن مجاني فوق 1000 جنيه" : "Free delivery over 1,000 EGP"}
                </span>
                <span className="flex items-center gap-1.5">
                  <Shield className="h-3.5 w-3.5 text-emerald-400" />
                  {isAR ? "أصلي 100%" : "100% Authentic"}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 text-emerald-400" />
                  {isAR ? "شحن في نفس اليوم" : "Same-day dispatch"}
                </span>
              </motion.div>
            </div>
          </div>
        </FadeInSection>
      </div>
    </section>
  );
}

// ─── Main Export ────────────────────────────────────────────────────────────

export function AboutContent() {
  const { locale, isRTL } = useI18n();
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <HeroSection locale={locale} isRTL={isRTL} />
        <OurStorySection locale={locale} isRTL={isRTL} />
        <WhySnusiiSection locale={locale} isRTL={isRTL} />
        <OurBrandsSection locale={locale} isRTL={isRTL} />
        <AgeComplianceSection locale={locale} isRTL={isRTL} />
        <CTASection locale={locale} isRTL={isRTL} />
      </main>
      <Footer />
    </>
  );
}
