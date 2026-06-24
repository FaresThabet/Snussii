"use client";

import { useI18n } from "@/lib/i18n";
import { ArticleTemplate, HighlightBox } from "../components/article-template";

const meta = {
  titleEn: "The Science Behind Nicotine Pouches",
  titleAr: "العلم وراء أكياس النيكوتين",
  image: "/images/academy/health.png",
  categoryKey: "health" as const,
  readTime: 10,
  date: "2026-02-10",
  authorEn: "Snusii Team",
  authorAr: "فريق سنوسي",
  toc: [
    { id: "how-they-work", labelEn: "How Nicotine Pouches Work", labelAr: "كيف تعمل أكياس النيكوتين" },
    { id: "absorption", labelEn: "Nicotine Absorption Process", labelAr: "عملية امتصاص النيكوتين" },
    { id: "vs-smoking", labelEn: "Nicotine Pouches vs Smoking", labelAr: "أكياس النيكوتين مقابل التدخين" },
    { id: "vs-vaping", labelEn: "Nicotine Pouches vs Vaping", labelAr: "أكياس النيكوتين مقابل الفايب" },
    { id: "faq", labelEn: "Frequently Asked Questions", labelAr: "الأسئلة المتكررة" },
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
  ],
};

export default function HealthSciencePage() {
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
      <section id="how-they-work" className="mb-10">
        <h2 className="text-2xl font-bold text-foreground mb-4">How Nicotine Pouches Work</h2>
        <p className="text-muted-foreground leading-relaxed mb-4">
          Nicotine pouches deliver nicotine through a process called <strong>buccal absorption</strong> — 
          the transfer of substances through the mucous membranes lining the inside of the mouth. When a 
          pouch is placed between the upper lip and gum, the nicotine dissolves slowly in the saliva and 
          passes through the oral mucosa directly into the bloodstream.
        </p>
        <p className="text-muted-foreground leading-relaxed mb-4">
          This is fundamentally different from smoking, where nicotine is inhaled into the lungs and absorbed 
          through the pulmonary capillaries. Buccal absorption is slower and more gradual, resulting in a 
          smoother, less spike-heavy nicotine delivery. This is why many users report a more pleasant 
          experience compared to smoking or vaping.
        </p>

        <HighlightBox type="info">
          <strong>Key difference:</strong> Nicotine pouches deliver nicotine through the mouth lining, not 
          the lungs. This means <strong>no combustion, no tar, no carbon monoxide, and no thousands of 
          harmful chemicals</strong> found in cigarette smoke.
        </HighlightBox>
      </section>

      <section id="absorption" className="mb-10">
        <h2 className="text-2xl font-bold text-foreground mb-4">Nicotine Absorption Process</h2>
        <p className="text-muted-foreground leading-relaxed mb-4">
          The absorption of nicotine from a pouch follows a well-documented pharmacokinetic curve. Here is 
          what happens from the moment you place a pouch to when the nicotine reaches your brain:
        </p>

        <ol className="space-y-4 text-muted-foreground mb-6">
          <li className="flex items-start gap-3">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white text-xs font-bold">1</div>
            <div>
              <strong className="text-foreground">Initial Release (0-5 minutes):</strong> The pouch begins 
              to release nicotine and flavor. You feel the characteristic tingling sensation as the 
              nicotine stimulates the nerve endings in your gums.
            </div>
          </li>
          <li className="flex items-start gap-3">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white text-xs font-bold">2</div>
            <div>
              <strong className="text-foreground">Peak Absorption (10-30 minutes):</strong> Nicotine levels 
              in your bloodstream rise steadily. This is when you feel the primary effects — alertness, 
              focus, and mild euphoria. Most of the active nicotine is absorbed during this window.
            </div>
          </li>
          <li className="flex items-start gap-3">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white text-xs font-bold">3</div>
            <div>
              <strong className="text-foreground">Plateau (30-45 minutes):</strong> Nicotine absorption 
              slows as the pouch depletes. Effects stabilize, and you maintain a comfortable nicotine level.
            </div>
          </li>
          <li className="flex items-start gap-3">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white text-xs font-bold">4</div>
            <div>
              <strong className="text-foreground">Decline (after 45 minutes):</strong> The pouch has 
              released most of its nicotine. Effects gradually diminish as nicotine is metabolized by the liver.
            </div>
          </li>
        </ol>

        <HighlightBox type="tip">
          <strong>Maximum absorption occurs between 15-30 minutes.</strong> Keeping the pouch in longer 
          than 45 minutes provides diminishing returns and increases the risk of gum irritation. 
          The optimal window is 20-40 minutes for most users.
        </HighlightBox>

        <h3 className="text-lg font-semibold text-foreground mt-6 mb-3">Factors Affecting Absorption Rate</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="p-3 rounded-lg bg-muted/30 text-sm">
            <strong className="text-foreground">pH Level</strong>
            <p className="text-muted-foreground mt-1">Higher pH means more free-base nicotine, which absorbs faster. This is why some pouches feel stronger despite having the same mg/g rating.</p>
          </div>
          <div className="p-3 rounded-lg bg-muted/30 text-sm">
            <strong className="text-foreground">Saliva Flow</strong>
            <p className="text-muted-foreground mt-1">More saliva helps dissolve nicotine but can also wash it away. The pouch design balances moisture retention with release rate.</p>
          </div>
          <div className="p-3 rounded-lg bg-muted/30 text-sm">
            <strong className="text-foreground">Mouth Position</strong>
            <p className="text-muted-foreground mt-1">The upper lip area has a thin mucosa with good blood supply, making it ideal for efficient buccal absorption.</p>
          </div>
          <div className="p-3 rounded-lg bg-muted/30 text-sm">
            <strong className="text-foreground">Food & Drink</strong>
            <p className="text-muted-foreground mt-1">Alcohol and acidic drinks can increase absorption. Cold beverages may slow it. Eating during use can reduce absorption rate.</p>
          </div>
        </div>
      </section>

      <section id="vs-smoking" className="mb-10">
        <h2 className="text-2xl font-bold text-foreground mb-4">Nicotine Pouches vs Smoking</h2>
        <p className="text-muted-foreground leading-relaxed mb-4">
          One of the most common questions is how nicotine pouches compare to traditional cigarettes. 
          While both deliver nicotine, the method and health implications are vastly different:
        </p>

        <div className="overflow-x-auto my-6">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-emerald-600 text-white">
                <th className="p-3 text-left rounded-tl-lg">Aspect</th>
                <th className="p-3 text-left">Nicotine Pouches</th>
                <th className="p-3 text-left rounded-tr-lg">Cigarette Smoking</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-border/50">
                <td className="p-3 font-medium">Combustion</td>
                <td className="p-3 text-emerald-600 font-medium">None ✓</td>
                <td className="p-3 text-red-500 font-medium">Yes — burns at 800°C</td>
              </tr>
              <tr className="border-b border-border/50 bg-muted/20">
                <td className="p-3 font-medium">Tar</td>
                <td className="p-3 text-emerald-600 font-medium">None ✓</td>
                <td className="p-3 text-red-500 font-medium">Yes — causes lung damage</td>
              </tr>
              <tr className="border-b border-border/50">
                <td className="p-3 font-medium">Carbon Monoxide</td>
                <td className="p-3 text-emerald-600 font-medium">None ✓</td>
                <td className="p-3 text-red-500 font-medium">Yes — reduces oxygen in blood</td>
              </tr>
              <tr className="border-b border-border/50 bg-muted/20">
                <td className="p-3 font-medium">Second-hand Effects</td>
                <td className="p-3 text-emerald-600 font-medium">None ✓</td>
                <td className="p-3 text-red-500 font-medium">Harmful to bystanders</td>
              </tr>
              <tr className="border-b border-border/50">
                <td className="p-3 font-medium">Smoke/Odor</td>
                <td className="p-3 text-emerald-600 font-medium">None ✓</td>
                <td className="p-3 text-red-500 font-medium">Strong, persistent smell</td>
              </tr>
              <tr>
                <td className="p-3 font-medium">Nicotine Delivery</td>
                <td className="p-3 text-muted-foreground">Slow, controlled via mouth</td>
                <td className="p-3 text-muted-foreground">Rapid spike via lungs</td>
              </tr>
            </tbody>
          </table>
        </div>

        <HighlightBox type="warning">
          <strong>Important:</strong> While nicotine pouches eliminate combustion-related harm, nicotine 
          itself is addictive and can raise blood pressure and heart rate. They are not risk-free. If you 
          do not currently use nicotine, there is no health benefit to starting. Always consult a healthcare 
          professional.
        </HighlightBox>
      </section>

      <section id="vs-vaping" className="mb-10">
        <h2 className="text-2xl font-bold text-foreground mb-4">Nicotine Pouches vs Vaping</h2>
        <p className="text-muted-foreground leading-relaxed mb-4">
          Vaping (e-cigarettes) and nicotine pouches are both smoke-free alternatives, but they differ 
          in several key ways:
        </p>

        <ul className="space-y-3 text-muted-foreground mb-6">
          <li className="flex items-start gap-2">
            <span className="text-emerald-500 mt-1">✓</span>
            <span><strong>Discretion:</strong> Pouches are invisible during use. Vaping produces visible vapor and may not be allowed in all settings.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-emerald-500 mt-1">✓</span>
            <span><strong>Maintenance:</strong> Pouches require no charging, refilling, or cleaning. Vaping devices need regular maintenance and coil replacements.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-emerald-500 mt-1">✓</span>
            <span><strong>Convenience:</strong> Pouches are grab-and-go. Vaping requires carrying a device and e-liquid.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-emerald-500 mt-1">✓</span>
            <span><strong>Travel:</strong> Pouches have no restrictions on air travel. Vaping devices may be restricted or confiscated.</span>
          </li>
        </ul>
      </section>

      <section id="faq" className="mb-10">
        <h2 className="text-2xl font-bold text-foreground mb-4">Frequently Asked Questions</h2>
        
        <div className="space-y-4">
          <div className="p-5 rounded-lg border border-border/50 bg-card">
            <h4 className="font-semibold text-foreground mb-2">Are nicotine pouches safe?</h4>
            <p className="text-sm text-muted-foreground">
              Nicotine pouches are generally considered less harmful than smoking because they eliminate 
              combustion, tar, and thousands of harmful chemicals. However, they still contain addictive 
              nicotine. Long-term health effects are still being studied. They are intended for adult use only (21+).
            </p>
          </div>
          <div className="p-5 rounded-lg border border-border/50 bg-card">
            <h4 className="font-semibold text-foreground mb-2">Can nicotine pouches help me quit smoking?</h4>
            <p className="text-sm text-muted-foreground">
              Nicotine pouches are not approved as smoking cessation products. If you want to quit smoking, 
              consult a doctor about proven methods like NRT (nicotine replacement therapy), prescription 
              medications, or behavioral therapy.
            </p>
          </div>
          <div className="p-5 rounded-lg border border-border/50 bg-card">
            <h4 className="font-semibold text-foreground mb-2">How long should I use a pouch?</h4>
            <p className="text-sm text-muted-foreground">
              The optimal duration is 20-45 minutes. Beyond this, the pouch has released most of its nicotine 
              and extended use increases the risk of gum irritation. Never use more than one pouch at a time.
            </p>
          </div>
          <div className="p-5 rounded-lg border border-border/50 bg-card">
            <h4 className="font-semibold text-foreground mb-2">Can I use pouches while pregnant?</h4>
            <p className="text-sm text-muted-foreground">
              <strong>Absolutely not.</strong> Nicotine is harmful to fetal development and should not be 
              used during pregnancy or breastfeeding. Consult a healthcare provider for guidance.
            </p>
          </div>
          <div className="p-5 rounded-lg border border-border/50 bg-card">
            <h4 className="font-semibold text-foreground mb-2">Do nicotine pouches stain teeth?</h4>
            <p className="text-sm text-muted-foreground">
              Unlike traditional snus or chewing tobacco, white nicotine pouches do not contain tobacco 
              leaf, which is the primary staining agent. They are much less likely to cause teeth staining 
              compared to tobacco products.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}

function ArabicContent() {
  return (
    <>
      <section id="how-they-work" className="mb-10">
        <h2 className="text-2xl font-bold text-foreground mb-4">كيف تعمل أكياس النيكوتين</h2>
        <p className="text-muted-foreground leading-relaxed mb-4">
          أكياس النيكوتين تقدم النيكوتين عبر عملية تسمى <strong>الامتصاص الفموي</strong> — 
          نقل المواد عبر الأغشية المخاطية المبطنة للفم من الداخل. عندما يوضع الكيس بين الشفة 
          العليا واللثة، يذوب النيكوتين ببطء في اللعاب ويعبر الغشاء المخاطي الفموي مباشرة 
          إلى مجرى الدم.
        </p>
        <p className="text-muted-foreground leading-relaxed mb-4">
          هذا مختلف جوهرياً عن التدخين حيث يُستنشق النيكوتين إلى الرئتين ويُمتَص عبر الشعيرات 
          الدموية الرئوية. الامتصاص الفموي أبطأ وأكثر تدريجاً، مما ينتج عنه تسليم نيكوتين 
          أنعم وأقل ذروة حدة. لهذا السبب يقرأ كثير من المستخدمين أن التجربة أكثر متعة مقارنة 
          بالتدخين أو الفايب.
        </p>

        <HighlightBox type="info">
          <strong>الفرق الرئيسي:</strong> أكياس النيكوتين تقدم النيكوتين عبر بطانة الفم، 
          وليس الرئتين. هذا يعني <strong>لا احتراق، لا قطران، لا أول أكسيد الكربون، وآلاف 
          المواد الكيميائية الضارة</strong> الموجودة في دخان السجائر.
        </HighlightBox>
      </section>

      <section id="absorption" className="mb-10">
        <h2 className="text-2xl font-bold text-foreground mb-4">عملية امتصاص النيكوتين</h2>
        <p className="text-muted-foreground leading-relaxed mb-4">
          امتصاص النيكوتين من الكيس يتبع منحنى حركي دوائي موثق جيداً. إليك ما يحدث من لحظة 
          وضع الكيس حتى يصل النيكوتين إلى عقلك:
        </p>

        <ol className="space-y-4 text-muted-foreground mb-6">
          <li className="flex items-start gap-3">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white text-xs font-bold">1</div>
            <div>
              <strong className="text-foreground">الإطلاق الأولي (0-5 دقائق):</strong> يبدأ الكيس 
              في إطلاق النيكوتين والنكهة. تشعر بالوخز المميز عندما يحفز النيكوتين النهايات 
              العصبية في لثتك.
            </div>
          </li>
          <li className="flex items-start gap-3">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white text-xs font-bold">2</div>
            <div>
              <strong className="text-foreground">ذروة الامتصاص (10-30 دقيقة):</strong> ترتفع مستويات 
              النيكوتين في الدم بشكل ثابت. هنا تشعر بالتأثيرات الأساسية — اليقظة والتركيز 
              والنشوة الخفيفة. معظم النيكوتين الفعال يُمتَص خلال هذه الفترة.
            </div>
          </li>
          <li className="flex items-start gap-3">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white text-xs font-bold">3</div>
            <div>
              <strong className="text-foreground">الاستقرار (30-45 دقيقة):</strong> يتباطأ امتصاص 
              النيكوتين مع نفاد الكيس. التأثيرات تستقر وتحافظ على مستوى نيكوتين مريح.
            </div>
          </li>
          <li className="flex items-start gap-3">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white text-xs font-bold">4</div>
            <div>
              <strong className="text-foreground">الانخفاض (بعد 45 دقيقة):</strong> يكون الكيس قد 
              حرر معظم نيكوتينه. التأثيرات تتلاشى تدريجياً مع استقلاب النيكوتين بواسطة الكبد.
            </div>
          </li>
        </ol>

        <HighlightBox type="tip">
          <strong>الامتصاص الأقصى يحدث بين 15-30 دقيقة.</strong> إبقاء الكيس أطول من 45 دقيقة 
          يوفر عوائد متناقصة ويزيد خطر تهيج اللثة. النافذة المثالية هي 20-40 دقيقة لمعظم المستخدمين.
        </HighlightBox>

        <h3 className="text-lg font-semibold text-foreground mt-6 mb-3">العوامل المؤثرة على معدل الامتصاص</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="p-3 rounded-lg bg-muted/30 text-sm">
            <strong className="text-foreground">مستوى الأس الهيدروجيني</strong>
            <p className="text-muted-foreground mt-1">كلما كان الأس أعلى، كلما كان هناك نيكوتين حر أكثر، مما يمتص أسرع. لهذا بعض الأكياس تشعر بقوة أكبر رغم نفس تصنيف ملغم/جم.</p>
          </div>
          <div className="p-3 rounded-lg bg-muted/30 text-sm">
            <strong className="text-foreground">تدفق اللعاب</strong>
            <p className="text-muted-foreground mt-1">اللعاب الأكثر يساعد في إذابة النيكوتين لكن يمكن أن يغسله بعيداً. تصميم الكيس يوازن بين الاحتفاظ بالرطوبة ومعدل الإطلاق.</p>
          </div>
          <div className="p-3 rounded-lg bg-muted/30 text-sm">
            <strong className="text-foreground">موضع الفم</strong>
            <p className="text-muted-foreground mt-1">منطقة الشفة العليا لها غشاء رقيق مع إمداد دم جيد، مما يجعلها مثالية للامتصاص الفموي الفعال.</p>
          </div>
          <div className="p-3 rounded-lg bg-muted/30 text-sm">
            <strong className="text-foreground">الطعام والشراب</strong>
            <p className="text-muted-foreground mt-1">الكحول والمشروبات الحمضية يمكن أن تزيد الامتصاص. المشروبات الباردة قد تبطئه. الأكل أثناء الاستخدام يمكن أن يقلل معدل الامتصاص.</p>
          </div>
        </div>
      </section>

      <section id="vs-smoking" className="mb-10">
        <h2 className="text-2xl font-bold text-foreground mb-4">أكياس النيكوتين مقابل التدخين</h2>
        <p className="text-muted-foreground leading-relaxed mb-4">
          من أكثر الأسئلة شيوعاً كيف تقارن أكياس النيكوتين بالسجائر التقليدية. بينما يقدم 
          كلاهما النيكوتين، الطريقة والتأثيرات الصحية مختلفة جذرياً:
        </p>

        <div className="overflow-x-auto my-6">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-emerald-600 text-white">
                <th className="p-3 text-right rounded-tr-lg">الجانب</th>
                <th className="p-3 text-right">أكياس النيكوتين</th>
                <th className="p-3 text-right rounded-tl-lg">تدخين السجائر</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-border/50">
                <td className="p-3 font-medium">الاحتراق</td>
                <td className="p-3 text-emerald-600 font-medium">لا يوجد ✓</td>
                <td className="p-3 text-red-500 font-medium">نعم — يحترق عند 800 درجة</td>
              </tr>
              <tr className="border-b border-border/50 bg-muted/20">
                <td className="p-3 font-medium">القطران</td>
                <td className="p-3 text-emerald-600 font-medium">لا يوجد ✓</td>
                <td className="p-3 text-red-500 font-medium">نعم — يسبب تلف الرئة</td>
              </tr>
              <tr className="border-b border-border/50">
                <td className="p-3 font-medium">أول أكسيد الكربون</td>
                <td className="p-3 text-emerald-600 font-medium">لا يوجد ✓</td>
                <td className="p-3 text-red-500 font-medium">نعم — يقلل الأكسجين في الدم</td>
              </tr>
              <tr className="border-b border-border/50 bg-muted/20">
                <td className="p-3 font-medium">التأثيرات الجانبية</td>
                <td className="p-3 text-emerald-600 font-medium">لا يوجد ✓</td>
                <td className="p-3 text-red-500 font-medium">ضار للمحيطين</td>
              </tr>
              <tr className="border-b border-border/50">
                <td className="p-3 font-medium">الدخان/الرائحة</td>
                <td className="p-3 text-emerald-600 font-medium">لا يوجد ✓</td>
                <td className="p-3 text-red-500 font-medium">رائحة قوية ومستمرة</td>
              </tr>
              <tr>
                <td className="p-3 font-medium">تسليم النيكوتين</td>
                <td className="p-3 text-muted-foreground">بطيء ومتحكم عبر الفم</td>
                <td className="p-3 text-muted-foreground">ذروة سريعة عبر الرئتين</td>
              </tr>
            </tbody>
          </table>
        </div>

        <HighlightBox type="warning">
          <strong>مهم:</strong> بينما تزيل أكياس النيكوتين الضرر المتعلق بالاحتراق، النيكوتين 
          نفسه مسبب للإدمان ويمكن أن يرفع ضغط الدم ومعدل ضربات القلب. ليست خالية من المخاطر. 
          إذا لم تكن تستخدم النيكوتين حالياً، لا توجد فائدة صحية من البدء.
        </HighlightBox>
      </section>

      <section id="vs-vaping" className="mb-10">
        <h2 className="text-2xl font-bold text-foreground mb-4">أكياس النيكوتين مقابل الفايب</h2>
        <p className="text-muted-foreground leading-relaxed mb-4">
          الفايب (السجائر الإلكترونية) وأكياس النيكوتين كلاهما بدائل خالية من الدخان، لكنهما 
          يختلفان في عدة جوانب رئيسية:
        </p>

        <ul className="space-y-3 text-muted-foreground mb-6">
          <li className="flex items-start gap-2">
            <span className="text-emerald-500 mt-1">✓</span>
            <span><strong>التخفي:</strong> الأكياس غير مرئية أثناء الاستخدام. الفايب ينتج بخاراً مرئياً وقد لا يُسمح به في جميع الأماكن.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-emerald-500 mt-1">✓</span>
            <span><strong>الصيانة:</strong> الأكياس لا تحتاج شحناً أو إعادة تعبئة أو تنظيفاً. أجهزة الفايب تحتاج صيانة منتظمة.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-emerald-500 mt-1">✓</span>
            <span><strong>الراحة:</strong> الأكياس جاهزة للاستخدام فوراً. الفايب يتطلب حمل الجهاز والسائل.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-emerald-500 mt-1">✓</span>
            <span><strong>السفر:</strong> الأكياس ليس لها قيود على السفر الجوي. أجهزة الفايب قد تكون محظورة.</span>
          </li>
        </ul>
      </section>

      <section id="faq" className="mb-10">
        <h2 className="text-2xl font-bold text-foreground mb-4">الأسئلة المتكررة</h2>
        
        <div className="space-y-4">
          <div className="p-5 rounded-lg border border-border/50 bg-card">
            <h4 className="font-semibold text-foreground mb-2">هل أكياس النيكوتين آمنة؟</h4>
            <p className="text-sm text-muted-foreground">
              تُعتبر أكياس النيكوتين أقل ضرراً عموماً من التدخين لأنها تزيل الاحتراق والقطران 
              وآلاف المواد الكيميائية الضارة. لكنها لا تزال تحتوي على نيكوتين مسبب للإدمان. 
              التأثيرات الصحية طويلة المدى ما زالت قيد الدراسة. مخصصة للبالغين فقط (21+).
            </p>
          </div>
          <div className="p-5 rounded-lg border border-border/50 bg-card">
            <h4 className="font-semibold text-foreground mb-2">هل يمكن أن تساعدني أكياس النيكوتين في الإقلاع عن التدخين؟</h4>
            <p className="text-sm text-muted-foreground">
              أكياس النيكوتين ليست معتمدة كمنتج للإقلاع عن التدخين. إذا كنت تريد الإقلاع، 
              استشر طبيباً حول الطرق المثبتة مثل العلاج ببدائل النيكوتين أو الأدوية الموصوفة.
            </p>
          </div>
          <div className="p-5 rounded-lg border border-border/50 bg-card">
            <h4 className="font-semibold text-foreground mb-2">كم مدة استخدام الكيس؟</h4>
            <p className="text-sm text-muted-foreground">
              المدة المثالية هي 20-45 دقيقة. بعد ذلك، يكون الكيس قد حرر معظم نيكوتينه 
              والاستخدام الممتد يزيد خطر تهيج اللثة. لا تستخدم أكثر من كيس واحد في كل مرة.
            </p>
          </div>
          <div className="p-5 rounded-lg border border-border/50 bg-card">
            <h4 className="font-semibold text-foreground mb-2">هل يمكنني استخدام الأكياس أثناء الحمل؟</h4>
            <p className="text-sm text-muted-foreground">
              <strong>بكل تأكيد لا.</strong> النيكوتين ضار لتطور الجنين ولا يجب استخدامه 
              أثناء الحمل أو الرضاعة.
            </p>
          </div>
          <div className="p-5 rounded-lg border border-border/50 bg-card">
            <h4 className="font-semibold text-foreground mb-2">هل تسبب أكياس النيكوتين اصفرار الأسنان؟</h4>
            <p className="text-sm text-muted-foreground">
              على عكس السنوس التقليدي أو تبغ المضغ، أكياس النيكوتين البيضاء لا تحتوي على 
              أوراق التبغ التي هي العامل الرئيسي في التلوين. احتمالها أقل بكثير في تسبب 
              اصفرار الأسنان مقارنة بمنتجات التبغ.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
