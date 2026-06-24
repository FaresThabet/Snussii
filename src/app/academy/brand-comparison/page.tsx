"use client";

import { useI18n } from "@/lib/i18n";
import { ArticleTemplate, HighlightBox } from "../components/article-template";

const meta = {
  titleEn: "White Fox vs Siberia vs 77: Brand Comparison",
  titleAr: "مقارنة العلامات: وايت فوكس ضد سيبريا ضد 77",
  image: "/images/academy/brands.png",
  categoryKey: "comparison" as const,
  readTime: 9,
  date: "2026-02-01",
  authorEn: "Snusii Team",
  authorAr: "فريق سنوسي",
  toc: [
    { id: "brand-history", labelEn: "Brand History & Background", labelAr: "تاريخ العلامات وخلفيتها" },
    { id: "product-ranges", labelEn: "Product Ranges", labelAr: "نطاقات المنتجات" },
    { id: "strength-comparison", labelEn: "Strength Comparison", labelAr: "مقارنة القوة" },
    { id: "price-comparison", labelEn: "Price Comparison", labelAr: "مقارنة الأسعار" },
    { id: "best-for", labelEn: "Best For...", labelAr: "الأفضل لـ..." },
  ],
  relatedArticles: [
    {
      slug: "strength-guide",
      titleEn: "Nicotine Strength Guide: Finding Your Perfect Match",
      titleAr: "دليل قوة النيكوتين: إيجاد القوة المناسبة لك",
      image: "/images/academy/strength.png",
      categoryKey: "strength" as const,
    },
    {
      slug: "flavor-guide",
      titleEn: "Complete Flavor Guide: From Mint to Bubblegum",
      titleAr: "دليل النكهات الشامل: من النعناع إلى البابل جم",
      image: "/images/academy/flavors.png",
      categoryKey: "flavor" as const,
    },
    {
      slug: "health-science",
      titleEn: "The Science Behind Nicotine Pouches",
      titleAr: "العلم وراء أكياس النيكوتين",
      image: "/images/academy/health.png",
      categoryKey: "health" as const,
    },
  ],
};

export default function BrandComparisonPage() {
  return (
    <ArticleTemplate meta={meta}>
      <BilingualContent />
    </ArticleTemplate>
  );
}

function BilingualContent() {
  const { locale } = useI18n();
  if (locale === "ar") return <ArabicContent />;
  return <EnglishContent />;
}

function EnglishContent() {
  return (
    <>
      <section id="brand-history" className="mb-10">
        <h2 className="text-2xl font-bold text-foreground mb-4">Brand History &amp; Background</h2>
        <p className="text-muted-foreground leading-relaxed mb-4">
          Understanding where each brand comes from helps you appreciate their unique approach to 
          nicotine pouches. Let us take a look at the origins of the three biggest brands in the 
          Egyptian market:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="p-5 rounded-xl border border-border/50 bg-card">
            <h4 className="font-bold text-lg text-emerald-600 mb-2">🦊 White Fox</h4>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Manufactured by GN Tobacco in Sweden, White Fox represents premium Swedish quality 
              with a modern twist. Known for balanced strength profiles and clean, refreshing flavors. 
              The brand launched in 2019 and quickly became a favorite for users seeking quality without 
              extreme intensity. White Fox products use high-purity nicotine for a smooth, consistent experience.
            </p>
          </div>
          <div className="p-5 rounded-xl border border-border/50 bg-card">
            <h4 className="font-bold text-lg text-sky-600 mb-2">🧊 Siberia</h4>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Siberia is produced by AG Snus in Sweden and is legendary for pushing the limits of 
              nicotine strength. The brand&apos;s flagship product, Siberia -80°C, delivers an astonishing 
              43 mg/g — one of the strongest pouches ever made. Siberia is the go-to choice for experienced 
              users who demand maximum intensity. The extreme cold branding reflects the intense experience.
            </p>
          </div>
          <div className="p-5 rounded-xl border border-border/50 bg-card">
            <h4 className="font-bold text-lg text-amber-600 mb-2">7️⃣ 77</h4>
            <p className="text-sm text-muted-foreground leading-relaxed">
              77 is manufactured by Skruf Snus in Sweden and offers the widest range of flavors and 
              strengths in the market. The brand is known for innovation — they were one of the first to 
              introduce fruit flavors in nicotine pouches. 77 caters to all experience levels with products 
              ranging from 3 mg/g to 17 mg/g. Excellent quality-to-price ratio makes it a customer favorite.
            </p>
          </div>
        </div>
      </section>

      <section id="product-ranges" className="mb-10">
        <h2 className="text-2xl font-bold text-foreground mb-4">Product Ranges</h2>
        <p className="text-muted-foreground leading-relaxed mb-4">
          Each brand has its own product lineup with different flavors and strengths. Here is an 
          overview of what each brand offers:
        </p>

        <div className="overflow-x-auto my-6">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-emerald-600 text-white">
                <th className="p-3 text-left rounded-tl-lg">Feature</th>
                <th className="p-3 text-left">White Fox</th>
                <th className="p-3 text-left">Siberia</th>
                <th className="p-3 text-left rounded-tr-lg">77</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-border/50">
                <td className="p-3 font-medium">Flavor Count</td>
                <td className="p-3 text-muted-foreground">5+ flavors</td>
                <td className="p-3 text-muted-foreground">3-4 flavors</td>
                <td className="p-3 text-muted-foreground">10+ flavors</td>
              </tr>
              <tr className="border-b border-border/50 bg-muted/20">
                <td className="p-3 font-medium">Strength Range</td>
                <td className="p-3 text-muted-foreground">4 – 16 mg/g</td>
                <td className="p-3 text-muted-foreground">8 – 43 mg/g</td>
                <td className="p-3 text-muted-foreground">3 – 17 mg/g</td>
              </tr>
              <tr className="border-b border-border/50">
                <td className="p-3 font-medium">Pouch Sizes</td>
                <td className="p-3 text-muted-foreground">Mini, Slim, Large</td>
                <td className="p-3 text-muted-foreground">Slim, Large</td>
                <td className="p-3 text-muted-foreground">Slim, Large</td>
              </tr>
              <tr className="border-b border-border/50 bg-muted/20">
                <td className="p-3 font-medium">Pouches per Can</td>
                <td className="p-3 text-muted-foreground">20 – 24</td>
                <td className="p-3 text-muted-foreground">20 – 22</td>
                <td className="p-3 text-muted-foreground">20 – 22</td>
              </tr>
              <tr>
                <td className="p-3 font-medium">Made In</td>
                <td className="p-3 text-muted-foreground">Sweden</td>
                <td className="p-3 text-muted-foreground">Sweden</td>
                <td className="p-3 text-muted-foreground">Sweden</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section id="strength-comparison" className="mb-10">
        <h2 className="text-2xl font-bold text-foreground mb-4">Strength Comparison</h2>
        <p className="text-muted-foreground leading-relaxed mb-4">
          This is where the brands differ most dramatically. The chart below shows each brand&apos;s 
          strength tiers side by side:
        </p>

        <div className="overflow-x-auto my-6">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-emerald-600 text-white">
                <th className="p-3 text-left rounded-tl-lg">Tier</th>
                <th className="p-3 text-left">White Fox</th>
                <th className="p-3 text-left">Siberia</th>
                <th className="p-3 text-left rounded-tr-lg">77</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-border/50 bg-emerald-50/50 dark:bg-emerald-950/20">
                <td className="p-3 font-medium text-emerald-600">Light</td>
                <td className="p-3 text-muted-foreground">4 mg/g (Mini)</td>
                <td className="p-3 text-muted-foreground text-red-400">Not Available</td>
                <td className="p-3 text-muted-foreground">3 mg/g (Light)</td>
              </tr>
              <tr className="border-b border-border/50">
                <td className="p-3 font-medium text-emerald-600">Medium</td>
                <td className="p-3 text-muted-foreground">12 mg/g</td>
                <td className="p-3 text-muted-foreground">8 mg/g (Red)</td>
                <td className="p-3 text-muted-foreground">7 – 9 mg/g</td>
              </tr>
              <tr className="border-b border-border/50 bg-emerald-50/50 dark:bg-emerald-950/20">
                <td className="p-3 font-medium text-emerald-600">Strong</td>
                <td className="p-3 text-muted-foreground">16 mg/g (Full)</td>
                <td className="p-3 text-muted-foreground">24 mg/g (Blue)</td>
                <td className="p-3 text-muted-foreground">13 mg/g</td>
              </tr>
              <tr className="bg-amber-50/50 dark:bg-amber-950/20">
                <td className="p-3 font-medium text-amber-600">Extra Strong</td>
                <td className="p-3 text-muted-foreground text-red-400">Not Available</td>
                <td className="p-3 text-muted-foreground font-bold text-amber-600">43 mg/g (-80°C)</td>
                <td className="p-3 text-muted-foreground">17 mg/g</td>
              </tr>
            </tbody>
          </table>
        </div>

        <HighlightBox type="warning">
          <strong>Siberia -80°C at 43 mg/g is extremely potent.</strong> This is roughly 3x the strength 
          of an average pouch. Only experienced users with high nicotine tolerance should consider this product. 
          New users should never start with any Siberia product above 8 mg/g.
        </HighlightBox>
      </section>

      <section id="price-comparison" className="mb-10">
        <h2 className="text-2xl font-bold text-foreground mb-4">Price Comparison</h2>
        <p className="text-muted-foreground leading-relaxed mb-4">
          All three brands are competitively priced in the Egyptian market. Here are approximate price 
          ranges per can (prices may vary):
        </p>

        <div className="overflow-x-auto my-6">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-emerald-600 text-white">
                <th className="p-3 text-left rounded-tl-lg">Brand</th>
                <th className="p-3 text-left">Price Range (EGP)</th>
                <th className="p-3 text-left rounded-tr-lg">Value Rating</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-border/50">
                <td className="p-3 font-medium">White Fox</td>
                <td className="p-3 text-muted-foreground">250 – 350 EGP</td>
                <td className="p-3 text-amber-500">★★★★☆</td>
              </tr>
              <tr className="border-b border-border/50 bg-muted/20">
                <td className="p-3 font-medium">Siberia</td>
                <td className="p-3 text-muted-foreground">280 – 400 EGP</td>
                <td className="p-3 text-amber-500">★★★★☆</td>
              </tr>
              <tr>
                <td className="p-3 font-medium">77</td>
                <td className="p-3 text-muted-foreground">200 – 300 EGP</td>
                <td className="p-3 text-amber-500">★★★★★</td>
              </tr>
            </tbody>
          </table>
        </div>

        <HighlightBox type="tip">
          At Snusii, we offer <strong>competitive pricing</strong> on all three brands with regular 
          promotions and bundle deals. Check our promotions page for the latest discounts and save 
          even more on your favorite products!
        </HighlightBox>
      </section>

      <section id="best-for" className="mb-10">
        <h2 className="text-2xl font-bold text-foreground mb-4">Best For...</h2>
        <p className="text-muted-foreground leading-relaxed mb-4">
          Not sure which brand to choose? Here is our quick recommendation guide:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-5 rounded-xl border border-emerald-500/30 bg-emerald-500/5">
            <h4 className="font-bold text-emerald-600 mb-3">🦊 White Fox Is Best For:</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Quality-conscious users who want premium Swedish manufacturing</li>
              <li>• Intermediate users who want balanced strength (4-16 mg/g)</li>
              <li>• Users who prefer clean, refreshing mint flavors</li>
              <li>• Those who want a refined, premium experience</li>
            </ul>
          </div>
          <div className="p-5 rounded-xl border border-sky-500/30 bg-sky-500/5">
            <h4 className="font-bold text-sky-600 mb-3">🧊 Siberia Is Best For:</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Experienced users who need maximum nicotine delivery</li>
              <li>• Former heavy smokers with high nicotine tolerance</li>
              <li>• Users who love intense, icy mint sensations</li>
              <li>• Those who want the strongest pouches available</li>
            </ul>
          </div>
          <div className="p-5 rounded-xl border border-amber-500/30 bg-amber-500/5">
            <h4 className="font-bold text-amber-600 mb-3">7️⃣ 77 Is Best For:</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Beginners who need light-strength options (3 mg/g)</li>
              <li>• Flavor explorers who want the widest variety</li>
              <li>• Budget-conscious buyers seeking great value</li>
              <li>• Anyone who wants innovation and variety</li>
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}

function ArabicContent() {
  return (
    <>
      <section id="brand-history" className="mb-10">
        <h2 className="text-2xl font-bold text-foreground mb-4">تاريخ العلامات وخلفيتها</h2>
        <p className="text-muted-foreground leading-relaxed mb-4">
          فهم أصل كل علامة تجارية يساعدك في تقدير نهجها الفريد لأكياس النيكوتين. 
          لنلقِ نظرة على أصول أكبر ثلاث علامات في السوق المصري:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="p-5 rounded-xl border border-border/50 bg-card">
            <h4 className="font-bold text-lg text-emerald-600 mb-2">🦊 وايت فوكس</h4>
            <p className="text-sm text-muted-foreground leading-relaxed">
              تُصنع بواسطة GN Tobacco في السويد، وتمثل وايت فوكس جودة سويدية فاخرة مع لمسة 
              عصرية. معروفة بملفات قوة متوازنة ونكهات نظيفة ومنعشة. أُطلقت العلامة في 2019 
              وأصبحت مفضلة سريعاً للمستخدمين الباحثين عن الجودة دون كثافة مفرطة.
            </p>
          </div>
          <div className="p-5 rounded-xl border border-border/50 bg-card">
            <h4 className="font-bold text-lg text-sky-600 mb-2">🧊 سيبريا</h4>
            <p className="text-sm text-muted-foreground leading-relaxed">
              تُنتج سيبريا بواسطة AG Snus في السويد وهي أسطورية في دفع حدود قوة النيكوتين. 
              منتجها الرائد سيبريا -80 درجة يقدم 43 ملغم/جم مذهلة — من أقوى الأكياس 
              الموجودة. سيبريا هي الخيار الأول للمستخدمين ذوي الخبرة المطالبين بأقصى شدة.
            </p>
          </div>
          <div className="p-5 rounded-xl border border-border/50 bg-card">
            <h4 className="font-bold text-lg text-amber-600 mb-2">7️⃣ 77</h4>
            <p className="text-sm text-muted-foreground leading-relaxed">
              تُصنع 77 بواسطة Skruf Snus في السويد وتقدم أوسع نطاق من النكهات والقوى في 
              السوق. العلامة معروفة بالابتكار — كانت من أولى من قدموا نكهات الفواكه. 77 
              تلبي جميع مستويات الخبرة بمنتجات من 3 إلى 17 ملغم/جم.
            </p>
          </div>
        </div>
      </section>

      <section id="product-ranges" className="mb-10">
        <h2 className="text-2xl font-bold text-foreground mb-4">نطاقات المنتجات</h2>
        <p className="text-muted-foreground leading-relaxed mb-4">
          كل علامة لديها خط منتجاتها الخاص بنكهات وقوى مختلفة. إليك نظرة عامة على ما تقدمه كل علامة:
        </p>

        <div className="overflow-x-auto my-6">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-emerald-600 text-white">
                <th className="p-3 text-right rounded-tr-lg">الميزة</th>
                <th className="p-3 text-right">وايت فوكس</th>
                <th className="p-3 text-right">سيبريا</th>
                <th className="p-3 text-right rounded-tl-lg">77</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-border/50">
                <td className="p-3 font-medium">عدد النكهات</td>
                <td className="p-3 text-muted-foreground">+5 نكهات</td>
                <td className="p-3 text-muted-foreground">3-4 نكهات</td>
                <td className="p-3 text-muted-foreground">+10 نكهات</td>
              </tr>
              <tr className="border-b border-border/50 bg-muted/20">
                <td className="p-3 font-medium">نطاق القوة</td>
                <td className="p-3 text-muted-foreground">4 – 16 ملغم/جم</td>
                <td className="p-3 text-muted-foreground">8 – 43 ملغم/جم</td>
                <td className="p-3 text-muted-foreground">3 – 17 ملغم/جم</td>
              </tr>
              <tr className="border-b border-border/50">
                <td className="p-3 font-medium">أحجام الكيس</td>
                <td className="p-3 text-muted-foreground">ميني، سليم، لارج</td>
                <td className="p-3 text-muted-foreground">سليم، لارج</td>
                <td className="p-3 text-muted-foreground">سليم، لارج</td>
              </tr>
              <tr className="border-b border-border/50 bg-muted/20">
                <td className="p-3 font-medium">أكياس لكل علبة</td>
                <td className="p-3 text-muted-foreground">20 – 24</td>
                <td className="p-3 text-muted-foreground">20 – 22</td>
                <td className="p-3 text-muted-foreground">20 – 22</td>
              </tr>
              <tr>
                <td className="p-3 font-medium">بلد المنشأ</td>
                <td className="p-3 text-muted-foreground">السويد</td>
                <td className="p-3 text-muted-foreground">السويد</td>
                <td className="p-3 text-muted-foreground">السويد</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section id="strength-comparison" className="mb-10">
        <h2 className="text-2xl font-bold text-foreground mb-4">مقارنة القوة</h2>
        <p className="text-muted-foreground leading-relaxed mb-4">
          هنا تختلف العلامات بشكل أكبر دراماتيكياً. الجدول أدناه يعرض مستويات القوة 
          لكل علامة جنب إلى جنب:
        </p>

        <div className="overflow-x-auto my-6">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-emerald-600 text-white">
                <th className="p-3 text-right rounded-tr-lg">المستوى</th>
                <th className="p-3 text-right">وايت فوكس</th>
                <th className="p-3 text-right">سيبريا</th>
                <th className="p-3 text-right rounded-tl-lg">77</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-border/50 bg-emerald-50/50 dark:bg-emerald-950/20">
                <td className="p-3 font-medium text-emerald-600">خفيفة</td>
                <td className="p-3 text-muted-foreground">4 ملغم/جم (ميني)</td>
                <td className="p-3 text-muted-foreground text-red-400">غير متوفرة</td>
                <td className="p-3 text-muted-foreground">3 ملغم/جم (لايت)</td>
              </tr>
              <tr className="border-b border-border/50">
                <td className="p-3 font-medium text-emerald-600">متوسطة</td>
                <td className="p-3 text-muted-foreground">12 ملغم/جم</td>
                <td className="p-3 text-muted-foreground">8 ملغم/جم (ريد)</td>
                <td className="p-3 text-muted-foreground">7 – 9 ملغم/جم</td>
              </tr>
              <tr className="border-b border-border/50 bg-emerald-50/50 dark:bg-emerald-950/20">
                <td className="p-3 font-medium text-emerald-600">قوية</td>
                <td className="p-3 text-muted-foreground">16 ملغم/جم (فول)</td>
                <td className="p-3 text-muted-foreground">24 ملغم/جم (بلو)</td>
                <td className="p-3 text-muted-foreground">13 ملغم/جم</td>
              </tr>
              <tr className="bg-amber-50/50 dark:bg-amber-950/20">
                <td className="p-3 font-medium text-amber-600">فائقة القوة</td>
                <td className="p-3 text-muted-foreground text-red-400">غير متوفرة</td>
                <td className="p-3 text-muted-foreground font-bold text-amber-600">43 ملغم/جم (-80 درجة)</td>
                <td className="p-3 text-muted-foreground">17 ملغم/جم</td>
              </tr>
            </tbody>
          </table>
        </div>

        <HighlightBox type="warning">
          <strong>سيبريا -80 درجة بـ 43 ملغم/جم قوية جداً.</strong> هذه تقريباً 3 أضعاف قوة 
          الكيس المتوسط. فقط المستخدمون ذوو الخبرة مع تحمل عالٍ للنيكوتين يجب أن يفكروا 
          في هذا المنتج. المستخدمون الجدد لا يجب أن يبدأوا بأي منتج سيبريا فوق 8 ملغم/جم.
        </HighlightBox>
      </section>

      <section id="price-comparison" className="mb-10">
        <h2 className="text-2xl font-bold text-foreground mb-4">مقارنة الأسعار</h2>
        <p className="text-muted-foreground leading-relaxed mb-4">
          جميع العلامات الثلاث منافسة في الأسعار في السوق المصري. إليك نطاقات الأسعار التقريبية 
          لكل علبة (قد تختلف الأسعار):
        </p>

        <div className="overflow-x-auto my-6">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-emerald-600 text-white">
                <th className="p-3 text-right rounded-tr-lg">العلامة</th>
                <th className="p-3 text-right">نطاق السعر (ج.م)</th>
                <th className="p-3 text-right rounded-tl-lg">تقييم القيمة</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-border/50">
                <td className="p-3 font-medium">وايت فوكس</td>
                <td className="p-3 text-muted-foreground">250 – 350 ج.م</td>
                <td className="p-3 text-amber-500">★★★★☆</td>
              </tr>
              <tr className="border-b border-border/50 bg-muted/20">
                <td className="p-3 font-medium">سيبريا</td>
                <td className="p-3 text-muted-foreground">280 – 400 ج.م</td>
                <td className="p-3 text-amber-500">★★★★☆</td>
              </tr>
              <tr>
                <td className="p-3 font-medium">77</td>
                <td className="p-3 text-muted-foreground">200 – 300 ج.م</td>
                <td className="p-3 text-amber-500">★★★★★</td>
              </tr>
            </tbody>
          </table>
        </div>

        <HighlightBox type="tip">
          في سنوسي، نقدم <strong>أسعاراً تنافسية</strong> على جميع العلامات الثلاث مع عروض 
          منتظمة وباقات توفير. تفضل بزيارة صفحة العروض لأحدث الخصومات!
        </HighlightBox>
      </section>

      <section id="best-for" className="mb-10">
        <h2 className="text-2xl font-bold text-foreground mb-4">الأفضل لـ...</h2>
        <p className="text-muted-foreground leading-relaxed mb-4">
          لست متأكداً أي علامة تختار؟ إليك دليل توصية سريع:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-5 rounded-xl border border-emerald-500/30 bg-emerald-500/5">
            <h4 className="font-bold text-emerald-600 mb-3">🦊 وايت فوكس الأفضل لـ:</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• المستخدمون المهتمون بالجودة السويدية الفاخرة</li>
              <li>• المستخدمون المتوسطون الباحثون عن قوة متوازنة (4-16 ملغم/جم)</li>
              <li>• محبو النعناع النظيف والمنعش</li>
              <li>• من يبحثون عن تجربة فاخرة ومصقولة</li>
            </ul>
          </div>
          <div className="p-5 rounded-xl border border-sky-500/30 bg-sky-500/5">
            <h4 className="font-bold text-sky-600 mb-3">🧊 سيبريا الأفضل لـ:</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• المستخدمون ذوو الخبرة المحتاجون لأقصى نيكوتين</li>
              <li>• المدخنون السابقون الكثيفون مع تحمل عالٍ</li>
              <li>• محبو الإحساس المنعش المكثف والثلجي</li>
              <li>• من يريدون أقوى الأكياس المتوفرة</li>
            </ul>
          </div>
          <div className="p-5 rounded-xl border border-amber-500/30 bg-amber-500/5">
            <h4 className="font-bold text-amber-600 mb-3">7️⃣ 77 الأفضل لـ:</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• المبتدئون المحتاجون لخيارات خفيفة (3 ملغم/جم)</li>
              <li>• مستكشفو النكهات الباحثون عن أوسع تنوع</li>
              <li>• المشترون الواعون بالتكلفة الباحثون عن قيمة ممتازة</li>
              <li>• أي شخص يريد ابتكاراً وتنوعاً</li>
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
