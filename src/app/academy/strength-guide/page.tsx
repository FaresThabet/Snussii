"use client";

import { useI18n } from "@/lib/i18n";
import { ArticleTemplate, HighlightBox } from "../components/article-template";

const meta = {
  titleEn: "Nicotine Strength Guide: Finding Your Perfect Match",
  titleAr: "دليل قوة النيكوتين: إيجاد القوة المناسبة لك",
  image: "/images/academy/strength.png",
  categoryKey: "strength" as const,
  readTime: 6,
  date: "2026-01-18",
  authorEn: "Snusii Team",
  authorAr: "فريق سنوسي",
  toc: [
    { id: "understanding-mg", labelEn: "Understanding mg/g", labelAr: "فهم ملغم/جم" },
    { id: "strength-levels", labelEn: "Strength Levels Breakdown", labelAr: "تفصيل مستويات القوة" },
    { id: "brand-comparison", labelEn: "Brand Strength Comparison", labelAr: "مقارنة قوة العلامات التجارية" },
    { id: "transitioning", labelEn: "How to Transition Between Strengths", labelAr: "كيفية الانتقال بين مستويات القوة" },
  ],
  relatedArticles: [
    {
      slug: "beginners-guide",
      titleEn: "The Complete Beginner's Guide to Nicotine Pouches",
      titleAr: "دليل المبتدئين الشامل لأكياس النيكوتين",
      image: "/images/academy/beginners.png",
      categoryKey: "beginner" as const,
    },
    {
      slug: "brand-comparison",
      titleEn: "White Fox vs Siberia vs 77: Brand Comparison",
      titleAr: "مقارنة العلامات: وايت فوكس ضد سيبريا ضد 77",
      image: "/images/academy/brands.png",
      categoryKey: "comparison" as const,
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

export default function StrengthGuidePage() {
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
      <section id="understanding-mg" className="mb-10">
        <h2 className="text-2xl font-bold text-foreground mb-4">
          Understanding mg/g
        </h2>
        <p className="text-muted-foreground leading-relaxed mb-4">
          The strength of a nicotine pouch is measured in <strong>milligrams per gram (mg/g)</strong>. 
          This number tells you exactly how much nicotine is present in each gram of pouch material. 
          For example, a pouch labeled &quot;12 mg/g&quot; contains 12 milligrams of nicotine per gram of 
          pouch content.
        </p>
        <p className="text-muted-foreground leading-relaxed mb-4">
          However, there is an important detail: the total nicotine you actually absorb depends on the 
          <strong> pouch weight</strong> as well. A standard nicotine pouch weighs approximately 0.5 to 
          1 gram. So a &quot;12 mg/g&quot; pouch weighing 0.6g contains roughly 7.2mg of total nicotine — 
          but your body only absorbs about <strong>30-50%</strong> of that amount through the oral mucosa.
        </p>

        <HighlightBox type="info">
          <strong>Key formula:</strong> Total nicotine = mg/g × pouch weight (in grams). Your actual 
          absorbed dose is typically 30-50% of the total nicotine content, depending on pouch duration, 
          saliva flow, and individual biology.
        </HighlightBox>

        <h3 className="text-lg font-semibold text-foreground mt-6 mb-3">
          What Affects Your Experience
        </h3>
        <ul className="space-y-2 text-muted-foreground mb-4">
          <li className="flex items-start gap-2">
            <span className="text-emerald-500 mt-1">•</span>
            <span><strong>Body weight and metabolism:</strong> Larger individuals and faster metabolizers may need higher strengths</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-emerald-500 mt-1">•</span>
            <span><strong>Previous nicotine use:</strong> Former smokers and vapers have higher tolerance</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-emerald-500 mt-1">•</span>
            <span><strong>Food intake:</strong> An empty stomach increases nicotine absorption rate</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-emerald-500 mt-1">•</span>
            <span><strong>Pouch duration:</strong> Longer use means more total nicotine absorbed</span>
          </li>
        </ul>
      </section>

      <section id="strength-levels" className="mb-10">
        <h2 className="text-2xl font-bold text-foreground mb-4">
          Strength Levels Breakdown
        </h2>
        <p className="text-muted-foreground leading-relaxed mb-4">
          The nicotine pouch industry has standardized four main strength tiers. Understanding where you 
          fall on this spectrum is crucial for a good experience:
        </p>

        {/* Visual Strength Bar */}
        <div className="my-8 space-y-3">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium text-emerald-600">Light (3-6 mg/g)</span>
              <span className="text-muted-foreground">Mild buzz</span>
            </div>
            <div className="w-full h-3 rounded-full bg-muted overflow-hidden">
              <div className="h-full rounded-full bg-gradient-to-r from-emerald-300 to-emerald-400" style={{ width: "25%" }} />
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium text-emerald-600">Medium (8-12 mg/g)</span>
              <span className="text-muted-foreground">Noticeable effect</span>
            </div>
            <div className="w-full h-3 rounded-full bg-muted overflow-hidden">
              <div className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-emerald-500" style={{ width: "50%" }} />
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium text-emerald-600">Strong (14-20 mg/g)</span>
              <span className="text-muted-foreground">Powerful hit</span>
            </div>
            <div className="w-full h-3 rounded-full bg-muted overflow-hidden">
              <div className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-700" style={{ width: "75%" }} />
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium text-emerald-600">Extra Strong (24+ mg/g)</span>
              <span className="text-muted-foreground">Maximum intensity</span>
            </div>
            <div className="w-full h-3 rounded-full bg-muted overflow-hidden">
              <div className="h-full rounded-full bg-gradient-to-r from-emerald-700 to-emerald-900" style={{ width: "100%" }} />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-lg border border-emerald-500/20 bg-emerald-500/5">
            <h4 className="font-semibold text-emerald-600 mb-2">Light: 3–6 mg/g</h4>
            <p className="text-sm text-muted-foreground">
              Ideal for complete beginners and those who use nicotine occasionally. Provides a subtle, 
              pleasant sensation without overwhelming effects. Also recommended for sensitive individuals 
              or those transitioning away from very low-nicotine vape products.
            </p>
          </div>
          <div className="p-4 rounded-lg border border-emerald-500/20 bg-emerald-500/5">
            <h4 className="font-semibold text-emerald-600 mb-2">Medium: 8–12 mg/g</h4>
            <p className="text-sm text-muted-foreground">
              The sweet spot for most users. Delivers a satisfying nicotine experience that is noticeable 
              but not overwhelming. Perfect for former light-to-moderate cigarette smokers (less than a 
              pack per day).
            </p>
          </div>
          <div className="p-4 rounded-lg border border-emerald-500/20 bg-emerald-500/5">
            <h4 className="font-semibold text-emerald-600 mb-2">Strong: 14–20 mg/g</h4>
            <p className="text-sm text-muted-foreground">
              Designed for experienced nicotine users and former heavy smokers (a pack or more per day). 
              These pouches deliver a powerful, satisfying hit. Not recommended for beginners — may 
              cause nausea or dizziness in new users.
            </p>
          </div>
          <div className="p-4 rounded-lg border border-amber-500/20 bg-amber-500/5">
            <h4 className="font-semibold text-amber-600 mb-2">Extra Strong: 24+ mg/g</h4>
            <p className="text-sm text-muted-foreground">
              The highest tier available. Products like Siberia -80°C deliver up to 43 mg/g — this is 
              for veteran users only. Use with extreme caution. First-time users should never start at 
              this level.
            </p>
          </div>
        </div>
      </section>

      <section id="brand-comparison" className="mb-10">
        <h2 className="text-2xl font-bold text-foreground mb-4">
          Brand Strength Comparison
        </h2>
        <p className="text-muted-foreground leading-relaxed mb-4">
          Different brands offer different strength profiles. Here is how the top three brands compare 
          across their product lines:
        </p>

        <div className="overflow-x-auto my-6">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-emerald-600 text-white">
                <th className="p-3 text-left rounded-tl-lg">Brand</th>
                <th className="p-3 text-left">Lightest</th>
                <th className="p-3 text-left">Medium</th>
                <th className="p-3 text-left">Strong</th>
                <th className="p-3 text-left rounded-tr-lg">Strongest</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-border/50">
                <td className="p-3 font-medium">White Fox</td>
                <td className="p-3 text-muted-foreground">4 mg/g (Mini)</td>
                <td className="p-3 text-muted-foreground">12 mg/g</td>
                <td className="p-3 text-muted-foreground">16 mg/g (Full)</td>
                <td className="p-3 text-muted-foreground">16 mg/g</td>
              </tr>
              <tr className="border-b border-border/50 bg-muted/20">
                <td className="p-3 font-medium">Siberia</td>
                <td className="p-3 text-muted-foreground">8 mg/g (Red)</td>
                <td className="p-3 text-muted-foreground">—</td>
                <td className="p-3 text-muted-foreground">24 mg/g (Blue)</td>
                <td className="p-3 text-muted-foreground font-semibold text-amber-600">43 mg/g (-80°C)</td>
              </tr>
              <tr>
                <td className="p-3 font-medium">77</td>
                <td className="p-3 text-muted-foreground">3 mg/g (Light)</td>
                <td className="p-3 text-muted-foreground">7 mg/g</td>
                <td className="p-3 text-muted-foreground">13 mg/g</td>
                <td className="p-3 text-muted-foreground">17 mg/g</td>
              </tr>
            </tbody>
          </table>
        </div>

        <HighlightBox type="tip">
          <strong>Siberia</strong> is known for extreme strengths that other brands do not match. If you 
          are looking for the strongest pouches available, Siberia is the go-to. For a more balanced 
          experience, <strong>White Fox</strong> and <strong>77</strong> offer excellent variety.
        </HighlightBox>
      </section>

      <section id="transitioning" className="mb-10">
        <h2 className="text-2xl font-bold text-foreground mb-4">
          How to Transition Between Strengths
        </h2>
        <p className="text-muted-foreground leading-relaxed mb-4">
          Moving up (or down) in strength should be done gradually. Here is a recommended approach:
        </p>
        <ol className="space-y-3 text-muted-foreground">
          <li className="flex items-start gap-3">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white text-xs font-bold">1</div>
            <span><strong>Wait at least 2 weeks</strong> at your current strength before considering a change. Your body needs time to build tolerance or reset.</span>
          </li>
          <li className="flex items-start gap-3">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white text-xs font-bold">2</div>
            <span><strong>Moving up?</strong> Increase by no more than 2-4 mg/g per step. For example: 6 → 8 → 12 mg/g.</span>
          </li>
          <li className="flex items-start gap-3">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white text-xs font-bold">3</div>
            <span><strong>Moving down?</strong> Decrease gradually and extend usage time slightly to compensate. For example: reduce from 12 to 8 mg/g but keep the pouch in 5-10 minutes longer.</span>
          </li>
          <li className="flex items-start gap-3">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white text-xs font-bold">4</div>
            <span><strong>Listen to your body.</strong> If you experience headaches, nausea, or dizziness, go back to your previous strength immediately.</span>
          </li>
        </ol>

        <HighlightBox type="warning">
          <strong>Signs of too much nicotine:</strong> Nausea, dizziness, headache, rapid heartbeat, 
          cold sweats, and hiccups. If you experience any of these, remove the pouch immediately, 
          drink water, and rest. These symptoms typically pass within 15-30 minutes.
        </HighlightBox>
      </section>
    </>
  );
}

function ArabicContent() {
  return (
    <>
      <section id="understanding-mg" className="mb-10">
        <h2 className="text-2xl font-bold text-foreground mb-4">
          فهم ملغم/جم
        </h2>
        <p className="text-muted-foreground leading-relaxed mb-4">
          تُقاس قوة كيس النيكوتين بـ <strong>ملليجرام لكل جرام (ملغم/جم)</strong>. 
          هذا الرقم يخبرك بالضبط كم نيكوتين موجود في كل جرام من مادة الكيس. 
          على سبيل المثال، كيس مُعلّب &quot;12 ملغم/جم&quot; يحتوي على 12 ملليجرام نيكوتين لكل جرام 
          من محتوى الكيس.
        </p>
        <p className="text-muted-foreground leading-relaxed mb-4">
          لكن هناك تفصيل مهم: إجمالي النيكوتين الذي يمتصه جسمك فعلياً يعتمد أيضاً على 
          <strong>وزن الكيس</strong>. كيس النيكوتين القياسي يزن حوالي 0.5 إلى 1 جرام. 
          لذا كيس &quot;12 ملغم/جم&quot; يزن 0.6 جرام يحتوي تقريباً على 7.2 ملغم إجمالي نيكوتين — 
          لكن جسمك يمتص فقط <strong>30-50%</strong> من تلك الكمية عبر الغشاء المخاطي الفموي.
        </p>

        <HighlightBox type="info">
          <strong>المعادلة الرئيسية:</strong> إجمالي النيكوتين = ملغم/جم × وزن الكيس (بالجرام). 
          الجرعة الممتصة فعلياً هي عادة 30-50% من إجمالي محتوى النيكوتين، حسب مدة الكيس 
          وتدفق اللعاب والبيولوجيا الفردية.
        </HighlightBox>

        <h3 className="text-lg font-semibold text-foreground mt-6 mb-3">
          ما يؤثر على تجربتك
        </h3>
        <ul className="space-y-2 text-muted-foreground mb-4">
          <li className="flex items-start gap-2">
            <span className="text-emerald-500 mt-1">•</span>
            <span><strong>وزن الجسم والتمثيل الغذائي:</strong> الأشخاص الأكبر حجماً والذين يمتلكون أيض أسرع قد يحتاجون قوى أعلى</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-emerald-500 mt-1">•</span>
            <span><strong>الاستخدام السابق للنيكوتين:</strong> المدخنون والفايبر السابقون لديهم تحمل أعلى</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-emerald-500 mt-1">•</span>
            <span><strong>تناول الطعام:</strong> المعدة الفارغة تزيد معدل امتصاص النيكوتين</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-emerald-500 mt-1">•</span>
            <span><strong>مدة الكيس:</strong> الاستخدام الأطول يعني امتصاص نيكوتين إجمالي أكثر</span>
          </li>
        </ul>
      </section>

      <section id="strength-levels" className="mb-10">
        <h2 className="text-2xl font-bold text-foreground mb-4">
          تفصيل مستويات القوة
        </h2>
        <p className="text-muted-foreground leading-relaxed mb-4">
          صناعة أكياس النيكوتين توحّدت حول أربعة مستويات رئيسية للقوة. فهم مكانك في هذا 
          الطيف أمر حاسم لتجربة جيدة:
        </p>

        {/* Visual Strength Bar */}
        <div className="my-8 space-y-3">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium text-emerald-600">خفيفة (3-6 ملغم/جم)</span>
              <span className="text-muted-foreground">وخز خفيف</span>
            </div>
            <div className="w-full h-3 rounded-full bg-muted overflow-hidden">
              <div className="h-full rounded-full bg-gradient-to-r from-emerald-300 to-emerald-400" style={{ width: "25%" }} />
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium text-emerald-600">متوسطة (8-12 ملغم/جم)</span>
              <span className="text-muted-foreground">تأثير ملحوظ</span>
            </div>
            <div className="w-full h-3 rounded-full bg-muted overflow-hidden">
              <div className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-emerald-500" style={{ width: "50%" }} />
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium text-emerald-600">قوية (14-20 ملغم/جم)</span>
              <span className="text-muted-foreground">قوة كبيرة</span>
            </div>
            <div className="w-full h-3 rounded-full bg-muted overflow-hidden">
              <div className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-700" style={{ width: "75%" }} />
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium text-emerald-600">فائقة القوة (24+ ملغم/جم)</span>
              <span className="text-muted-foreground">أقصى شدة</span>
            </div>
            <div className="w-full h-3 rounded-full bg-muted overflow-hidden">
              <div className="h-full rounded-full bg-gradient-to-r from-emerald-700 to-emerald-900" style={{ width: "100%" }} />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-lg border border-emerald-500/20 bg-emerald-500/5">
            <h4 className="font-semibold text-emerald-600 mb-2">خفيفة: 3–6 ملغم/جم</h4>
            <p className="text-sm text-muted-foreground">
              مثالية للمبتدئين تماماً والذين يستخدمون النيكوتين بين الحين والآخر. توفر إحساساً 
              خفيفاً وممتعاً دون تأثيرات مفرطة. موصى بها أيضاً للأفراد الحساسين أو الذين 
              ينتقلون من منتجات الفايب منخفضة النيكوتين جداً.
            </p>
          </div>
          <div className="p-4 rounded-lg border border-emerald-500/20 bg-emerald-500/5">
            <h4 className="font-semibold text-emerald-600 mb-2">متوسطة: 8–12 ملغم/جم</h4>
            <p className="text-sm text-muted-foreground">
              النقطة المثالية لمعظم المستخدمين. توفر تجربة نيكوتين مرضية ملحوظة لكن ليست 
              مفرطة. مثالية لمدخني السجائر السابقين الخفيفين إلى المعتدلين (أقل من علبة في اليوم).
            </p>
          </div>
          <div className="p-4 rounded-lg border border-emerald-500/20 bg-emerald-500/5">
            <h4 className="font-semibold text-emerald-600 mb-2">قوية: 14–20 ملغم/جم</h4>
            <p className="text-sm text-muted-foreground">
              مصممة للمستخدمين ذوي الخبرة والمدخنين السابقين الكثيفين (علبة أو أكثر يومياً). 
              هذه الأكياس توفر قوة كبيرة ومرضية. غير موصى بها للمبتدئين — قد تسبب غثياناً أو 
              دواراً للمستخدمين الجدد.
            </p>
          </div>
          <div className="p-4 rounded-lg border border-amber-500/20 bg-amber-500/5">
            <h4 className="font-semibold text-amber-600 mb-2">فائقة القوة: 24+ ملغم/جم</h4>
            <p className="text-sm text-muted-foreground">
              أعلى مستوى متاح. منتجات مثل سيبريا -80 درجة تصل إلى 43 ملغم/جم — هذا 
              للمحترفين فقط. استخدم بحذر شديد. لا يجب أن يبدأ المستخدمون الجدد بهذا المستوى أبداً.
            </p>
          </div>
        </div>
      </section>

      <section id="brand-comparison" className="mb-10">
        <h2 className="text-2xl font-bold text-foreground mb-4">
          مقارنة قوة العلامات التجارية
        </h2>
        <p className="text-muted-foreground leading-relaxed mb-4">
          العلامات التجارية المختلفة تقدم ملفات قوة مختلفة. إليك كيف تقارن أعلى ثلاث علامات 
          عبر منتجاتها:
        </p>

        <div className="overflow-x-auto my-6">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-emerald-600 text-white">
                <th className="p-3 text-right rounded-tr-lg">العلامة</th>
                <th className="p-3 text-right">الأخف</th>
                <th className="p-3 text-right">المتوسط</th>
                <th className="p-3 text-right">القوي</th>
                <th className="p-3 text-right rounded-tl-lg">الأقوى</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-border/50">
                <td className="p-3 font-medium">وايت فوكس</td>
                <td className="p-3 text-muted-foreground">4 ملغم/جم (ميني)</td>
                <td className="p-3 text-muted-foreground">12 ملغم/جم</td>
                <td className="p-3 text-muted-foreground">16 ملغم/جم (فول)</td>
                <td className="p-3 text-muted-foreground">16 ملغم/جم</td>
              </tr>
              <tr className="border-b border-border/50 bg-muted/20">
                <td className="p-3 font-medium">سيبريا</td>
                <td className="p-3 text-muted-foreground">8 ملغم/جم (ريد)</td>
                <td className="p-3 text-muted-foreground">—</td>
                <td className="p-3 text-muted-foreground">24 ملغم/جم (بلو)</td>
                <td className="p-3 text-muted-foreground font-semibold text-amber-600">43 ملغم/جم (-80 درجة)</td>
              </tr>
              <tr>
                <td className="p-3 font-medium">77</td>
                <td className="p-3 text-muted-foreground">3 ملغم/جم (لايت)</td>
                <td className="p-3 text-muted-foreground">7 ملغم/جم</td>
                <td className="p-3 text-muted-foreground">13 ملغم/جم</td>
                <td className="p-3 text-muted-foreground">17 ملغم/جم</td>
              </tr>
            </tbody>
          </table>
        </div>

        <HighlightBox type="tip">
          <strong>سيبريا</strong> معروفة بقوى استثنائية لا تضاهيها علامات أخرى. إذا كنت 
          تبحث عن أقوى الأكياس المتوفرة، سيبريا هي الخيار الأول. لتجربة أكثر توازناً، 
          <strong>وايت فوكس</strong> و<strong>77</strong> يوفران تنوعاً ممتازاً.
        </HighlightBox>
      </section>

      <section id="transitioning" className="mb-10">
        <h2 className="text-2xl font-bold text-foreground mb-4">
          كيفية الانتقال بين مستويات القوة
        </h2>
        <p className="text-muted-foreground leading-relaxed mb-4">
          الانتقال لأعلى أو أسفل في القوة يجب أن يتم تدريجياً. إليك المنهج الموصى به:
        </p>
        <ol className="space-y-3 text-muted-foreground">
          <li className="flex items-start gap-3">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white text-xs font-bold">1</div>
            <span><strong>انتظر أسبوعين على الأقل</strong> عند قوتك الحالية قبل التفكير في التغيير. جسمك يحتاج وقتاً لبناء التحمل أو إعادة الضبط.</span>
          </li>
          <li className="flex items-start gap-3">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white text-xs font-bold">2</div>
            <span><strong>صعوداً؟</strong> زِد بما لا يزيد عن 2-4 ملغم/جم لكل خطوة. على سبيل المثال: 6 ← 8 ← 12 ملغم/جم.</span>
          </li>
          <li className="flex items-start gap-3">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white text-xs font-bold">3</div>
            <span><strong>نزولاً؟</strong> قلل تدريجياً ومدّد وقت الاستخدام قليلاً للتعويض. على سبيل المثال: قلل من 12 إلى 8 ملغم/جم لكن أبقِ الكيس 5-10 دقائق أطول.</span>
          </li>
          <li className="flex items-start gap-3">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white text-xs font-bold">4</div>
            <span><strong>استمع لجسمك.</strong> إذا شعرت بصداع أو غثيان أو دوار، عد لقوتك السابقة فوراً.</span>
          </li>
        </ol>

        <HighlightBox type="warning">
          <strong>علامات كثرة النيكوتين:</strong> غثيان، دوار، صداع، تسارع نبضات القلب، 
          تعرق بارد، و فواق. إذا عانيت من أي منها، أزل الكيس فوراً، اشرب الماء، واسترح. 
          هذه الأعراض تزول عادة خلال 15-30 دقيقة.
        </HighlightBox>
      </section>
    </>
  );
}
