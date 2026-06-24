"use client";

import { useI18n } from "@/lib/i18n";
import { ArticleTemplate, HighlightBox } from "../components/article-template";

const meta = {
  titleEn: "How to Store & Use Nicotine Pouches Like a Pro",
  titleAr: "كيفية تخزين واستخدام أكياس النيكوتين مثل المحترفين",
  image: "/images/academy/storage.png",
  categoryKey: "storage" as const,
  readTime: 5,
  date: "2026-02-15",
  authorEn: "Snusii Team",
  authorAr: "فريق سنوسي",
  toc: [
    { id: "storage-tips", labelEn: "Storage Best Practices", labelAr: "أفضل ممارسات التخزين" },
    { id: "usage-technique", labelEn: "Proper Usage Technique", labelAr: "تقنية الاستخدام الصحيحة" },
    { id: "duration", labelEn: "Optimal Duration", labelAr: "المدة المثالية" },
    { id: "disposal", labelEn: "Proper Disposal", labelAr: "التخلص الصحيح" },
    { id: "dos-donts", labelEn: "Do's and Don'ts", labelAr: "ما يجب وما لا يجب فعله" },
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
      slug: "flavor-guide",
      titleEn: "Complete Flavor Guide: From Mint to Bubblegum",
      titleAr: "دليل النكهات الشامل: من النعناع إلى البابل جم",
      image: "/images/academy/flavors.png",
      categoryKey: "flavor" as const,
    },
    {
      slug: "strength-guide",
      titleEn: "Nicotine Strength Guide: Finding Your Perfect Match",
      titleAr: "دليل قوة النيكوتين: إيجاد القوة المناسبة لك",
      image: "/images/academy/strength.png",
      categoryKey: "strength" as const,
    },
  ],
};

export default function StorageUsagePage() {
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
      <section id="storage-tips" className="mb-10">
        <h2 className="text-2xl font-bold text-foreground mb-4">Storage Best Practices</h2>
        <p className="text-muted-foreground leading-relaxed mb-4">
          Proper storage is the secret to maintaining the freshness, flavor, and nicotine potency of 
          your pouches. Most nicotine pouches have a shelf life of 12-18 months when stored correctly, 
          but improper storage can degrade them within weeks. Here is how to store them like a pro:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="p-4 rounded-lg border border-border/50 bg-card">
            <h4 className="font-semibold text-emerald-600 mb-2">🌡️ Keep Cool &amp; Dry</h4>
            <p className="text-sm text-muted-foreground">
              Store at room temperature (15-25°C / 59-77°F). Avoid direct sunlight, heat sources, and 
              humid environments. A drawer, closet, or cabinet is ideal. Avoid leaving cans in your car, 
              especially during Egyptian summers where temperatures can exceed 40°C.
            </p>
          </div>
          <div className="p-4 rounded-lg border border-border/50 bg-card">
            <h4 className="font-semibold text-emerald-600 mb-2">🔒 Keep Sealed</h4>
            <p className="text-sm text-muted-foreground">
              Always close the lid tightly after removing a pouch. The rubber seal on quality cans is 
              designed to maintain moisture balance. Once opened, use the pouches within 2-3 weeks 
              for the best flavor experience.
            </p>
          </div>
          <div className="p-4 rounded-lg border border-border/50 bg-card">
            <h4 className="font-semibold text-emerald-600 mb-2">🧊 Refrigeration (Optional)</h4>
            <p className="text-sm text-muted-foreground">
              While not required, storing unopened cans in the refrigerator can extend freshness 
              significantly. Do not freeze pouches, as this can damage the flavor compounds and alter 
              the pouch texture.
            </p>
          </div>
          <div className="p-4 rounded-lg border border-border/50 bg-card">
            <h4 className="font-semibold text-emerald-600 mb-2">📦 Keep Away From Pets &amp; Children</h4>
            <p className="text-sm text-muted-foreground">
              Nicotine is toxic to pets and dangerous for children. Always store cans in a secure location 
              out of reach. The child-resistant lids provide an extra layer of safety, but they are not 
              childproof.
            </p>
          </div>
        </div>

        <HighlightBox type="warning">
          <strong>Egypt&apos;s climate warning:</strong> In Egypt&apos;s hot and humid climate, proper storage is 
          especially important. Never leave pouches in direct sunlight or in a hot car. Consider 
          using a dedicated pouch case or carrying case for on-the-go storage.
        </HighlightBox>
      </section>

      <section id="usage-technique" className="mb-10">
        <h2 className="text-2xl font-bold text-foreground mb-4">Proper Usage Technique</h2>
        <p className="text-muted-foreground leading-relaxed mb-4">
          Getting the most out of your nicotine pouches is about more than just placing it under your lip. 
          Here are some pro-level techniques to maximize your experience:
        </p>

        <div className="space-y-4 mb-6">
          <div className="p-4 rounded-lg bg-muted/30">
            <h4 className="font-semibold text-foreground mb-2">1. Pre-Positioning</h4>
            <p className="text-sm text-muted-foreground">
              Before placing the pouch, gently dry your upper lip area with a tissue. Excess saliva 
              can dilute the flavor and slow absorption. A dry starting point means faster onset and 
              more intense flavor.
            </p>
          </div>
          <div className="p-4 rounded-lg bg-muted/30">
            <h4 className="font-semibold text-foreground mb-2">2. Optimal Placement</h4>
            <p className="text-sm text-muted-foreground">
              Place the pouch slightly off-center, under your upper lip near the canine tooth. 
              This position provides maximum contact with the mucosa while remaining comfortable. 
              Many experienced users prefer the left side as it feels more natural during daily activities.
            </p>
          </div>
          <div className="p-4 rounded-lg bg-muted/30">
            <h4 className="font-semibold text-foreground mb-2">3. Managing Saliva</h4>
            <p className="text-sm text-muted-foreground">
              Some saliva increase is normal and actually helps with nicotine release. However, 
              excessive saliva can cause the pouch to slide. If needed, gently press the pouch 
              against your gum with your tongue to keep it in place. Swallow saliva naturally — 
              do not spit.
            </p>
          </div>
          <div className="p-4 rounded-lg bg-muted/30">
            <h4 className="font-semibold text-foreground mb-2">4. The Lip Tuck</h4>
            <p className="text-sm text-muted-foreground">
              For extra discretion, gently tuck your upper lip over the pouch. This creates a 
              completely invisible placement that nobody will notice, even during face-to-face 
              conversations.
            </p>
          </div>
        </div>

        <HighlightBox type="tip">
          <strong>Pro move:</strong> Alternate sides with each pouch. This prevents localized gum 
          irritation and ensures even wear. If you notice any sensitivity on one side, give it a few 
          days of rest.
        </HighlightBox>
      </section>

      <section id="duration" className="mb-10">
        <h2 className="text-2xl font-bold text-foreground mb-4">Optimal Duration</h2>
        <p className="text-muted-foreground leading-relaxed mb-4">
          How long should you keep a pouch in? The answer depends on several factors, but here 
          are general guidelines:
        </p>

        <div className="overflow-x-auto my-6">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-emerald-600 text-white">
                <th className="p-3 text-left rounded-tl-lg">Strength Level</th>
                <th className="p-3 text-left">Recommended Duration</th>
                <th className="p-3 text-left rounded-tr-lg">Notes</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-border/50">
                <td className="p-3 font-medium">Light (3-6 mg/g)</td>
                <td className="p-3 text-muted-foreground">30-45 minutes</td>
                <td className="p-3 text-muted-foreground">Gentle experience, can keep longer</td>
              </tr>
              <tr className="border-b border-border/50 bg-muted/20">
                <td className="p-3 font-medium">Medium (8-12 mg/g)</td>
                <td className="p-3 text-muted-foreground">20-35 minutes</td>
                <td className="p-3 text-muted-foreground">Sweet spot for most users</td>
              </tr>
              <tr className="border-b border-border/50">
                <td className="p-3 font-medium">Strong (14-20 mg/g)</td>
                <td className="p-3 text-muted-foreground">15-30 minutes</td>
                <td className="p-3 text-muted-foreground">Remove when effects plateau</td>
              </tr>
              <tr>
                <td className="p-3 font-medium">Extra Strong (24+ mg/g)</td>
                <td className="p-3 text-muted-foreground">10-25 minutes</td>
                <td className="p-3 text-muted-foreground">Shorter duration recommended</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section id="disposal" className="mb-10">
        <h2 className="text-2xl font-bold text-foreground mb-4">Proper Disposal</h2>
        <p className="text-muted-foreground leading-relaxed mb-4">
          Responsible disposal is an important but often overlooked aspect of nicotine pouch use. 
          Here is how to do it properly:
        </p>
        <ul className="space-y-2 text-muted-foreground mb-4">
          <li className="flex items-start gap-2">
            <span className="text-emerald-500 mt-1">•</span>
            <span><strong>Use the catch lid:</strong> Most quality cans have a compartment in the bottom lid for storing used pouches temporarily. This is the most convenient option when you are on the go.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-emerald-500 mt-1">•</span>
            <span><strong>Wrap and bin:</strong> If no catch lid is available, wrap the used pouch in a tissue or the original can&apos;s foil wrapper before disposing in a trash bin.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-emerald-500 mt-1">•</span>
            <span><strong>Never flush:</strong> Nicotine pouches should never be flushed down the toilet or thrown in nature. They contain nicotine, which is toxic to aquatic life.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-emerald-500 mt-1">•</span>
            <span><strong>Empty catch lid regularly:</strong> The catch lid compartment should be emptied into a trash bin at the end of each day. Do not let used pouches accumulate.</span>
          </li>
        </ul>
      </section>

      <section id="dos-donts" className="mb-10">
        <h2 className="text-2xl font-bold text-foreground mb-4">Do&apos;s and Don&apos;ts</h2>
        <p className="text-muted-foreground leading-relaxed mb-4">
          A quick reference guide for the most important do&apos;s and don&apos;ts of nicotine pouch use:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-bold text-emerald-600 mb-4 text-lg">✅ Do&apos;s</h4>
            <div className="space-y-3">
              <div className="p-3 rounded-lg border border-emerald-500/20 bg-emerald-500/5 text-sm">
                <strong className="text-foreground">Start with light strength</strong> if you are a beginner
              </div>
              <div className="p-3 rounded-lg border border-emerald-500/20 bg-emerald-500/5 text-sm">
                <strong className="text-foreground">Stay hydrated</strong> — drink water with every pouch
              </div>
              <div className="p-3 rounded-lg border border-emerald-500/20 bg-emerald-500/5 text-sm">
                <strong className="text-foreground">Rotate mouth positions</strong> to prevent gum irritation
              </div>
              <div className="p-3 rounded-lg border border-emerald-500/20 bg-emerald-500/5 text-sm">
                <strong className="text-foreground">Store properly</strong> — cool, dry, sealed
              </div>
              <div className="p-3 rounded-lg border border-emerald-500/20 bg-emerald-500/5 text-sm">
                <strong className="text-foreground">Dispose responsibly</strong> — use catch lid or wrap before binning
              </div>
              <div className="p-3 rounded-lg border border-emerald-500/20 bg-emerald-500/5 text-sm">
                <strong className="text-foreground">Listen to your body</strong> — remove if you feel discomfort
              </div>
            </div>
          </div>
          <div>
            <h4 className="font-bold text-red-500 mb-4 text-lg">❌ Don&apos;ts</h4>
            <div className="space-y-3">
              <div className="p-3 rounded-lg border border-red-500/20 bg-red-500/5 text-sm">
                <strong className="text-foreground">Do not exceed 8 pouches/day</strong> — use in moderation
              </div>
              <div className="p-3 rounded-lg border border-red-500/20 bg-red-500/5 text-sm">
                <strong className="text-foreground">Do not use on empty stomach</strong> — causes nausea
              </div>
              <div className="p-3 rounded-lg border border-red-500/20 bg-red-500/5 text-sm">
                <strong className="text-foreground">Do not swallow pouches</strong> — remove and dispose properly
              </div>
              <div className="p-3 rounded-lg border border-red-500/20 bg-red-500/5 text-sm">
                <strong className="text-foreground">Do not use expired pouches</strong> — check the expiry date
              </div>
              <div className="p-3 rounded-lg border border-red-500/20 bg-red-500/5 text-sm">
                <strong className="text-foreground">Do not share pouches</strong> — hygiene matters
              </div>
              <div className="p-3 rounded-lg border border-red-500/20 bg-red-500/5 text-sm">
                <strong className="text-foreground">Do not use if under 21</strong> — age restriction applies
              </div>
            </div>
          </div>
        </div>

        <HighlightBox type="tip">
          Ready to put these tips into practice? Shop the <strong>full range of nicotine pouches</strong> 
          at Snusii, with fast delivery to all 27 Egyptian governorates. Every can ships with proper 
          storage instructions included!
        </HighlightBox>
      </section>
    </>
  );
}

function ArabicContent() {
  return (
    <>
      <section id="storage-tips" className="mb-10">
        <h2 className="text-2xl font-bold text-foreground mb-4">أفضل ممارسات التخزين</h2>
        <p className="text-muted-foreground leading-relaxed mb-4">
          التخزين الصحيح هو السر للحفاظ على النضارة والنكهة وفعالية النيكوتين في أكياسك. معظم 
          أكياس النيكوتين لها صلاحية 12-18 شهراً عند التخزين الصحيح، لكن التخزين الخاطئ يمكن أن 
          يفسدها خلال أسابيع. إليك كيف تخزنها مثل المحترفين:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="p-4 rounded-lg border border-border/50 bg-card">
            <h4 className="font-semibold text-emerald-600 mb-2">🌡️ أبقِ بارداً وجافاً</h4>
            <p className="text-sm text-muted-foreground">
              خزّن في درجة حرارة الغرفة (15-25 درجة مئوية). تجنب أشعة الشمس المباشرة ومصادر 
              الحرارة والبيئات الرطبة. الدرج أو الخزانة مثاليان. تجنب ترك العلب في سيارتك، 
              خاصة في صيف مصر حيث تتجاوز الحرارة 40 درجة.
            </p>
          </div>
          <div className="p-4 rounded-lg border border-border/50 bg-card">
            <h4 className="font-semibold text-emerald-600 mb-2">🔒 أبقِ مغلقاً بإحكام</h4>
            <p className="text-sm text-muted-foreground">
              أغلق الغطاء دائماً بإحكام بعد إخراج كيس. مانع التسرب المطاطي في العلب الجيدة 
              مصمم للحفاظ على توازن الرطوبة. بعد الفتح، استخدم الأكياس خلال 2-3 أسابيع 
              لأفضل تجربة نكهة.
            </p>
          </div>
          <div className="p-4 rounded-lg border border-border/50 bg-card">
            <h4 className="font-semibold text-emerald-600 mb-2">🧊 التبريد (اختياري)</h4>
            <p className="text-sm text-muted-foreground">
              بينما ليس مطلوباً، تخزين العلب غير المفتوحة في الثلاجة يمكن أن يمد النضارة 
              بشكل كبير. لا تُجمّد الأكياس، لأن هذا قد يضر بمركبات النكهة ويغير قوام الكيس.
            </p>
          </div>
          <div className="p-4 rounded-lg border border-border/50 bg-card">
            <h4 className="font-semibold text-emerald-600 mb-2">📦 أبقِ بعيداً عن الحيوانات والأطفال</h4>
            <p className="text-sm text-muted-foreground">
              النيكوتين سام للحيوانات وخطير للأطفال. خزّن العلب دائماً في مكان آمن بعيداً عن 
              المتناول. الأغطية المقاومة للأطفال توفر طبقة أمان إضافية لكنها ليست مضادة للأطفال.
            </p>
          </div>
        </div>

        <HighlightBox type="warning">
          <strong>تحذير مناخ مصر:</strong> في مناخ مصر الحار والرطب، التخزين الصحيح مهم بشكل 
          خاص. لا تترك الأكياس أبداً في أشعة الشمس المباشرة أو في سيارة ساخنة. فكر في 
          استخدام حاوية مخصصة للأكياس.
        </HighlightBox>
      </section>

      <section id="usage-technique" className="mb-10">
        <h2 className="text-2xl font-bold text-foreground mb-4">تقنية الاستخدام الصحيحة</h2>
        <p className="text-muted-foreground leading-relaxed mb-4">
          الحصول على أقصى استفادة من أكياس النيكوتين يتعلق بأكثر من مجرد وضعها تحت شفتك. 
          إليك بعض التقنيات المحترفة لتعظيم تجربتك:
        </p>

        <div className="space-y-4 mb-6">
          <div className="p-4 rounded-lg bg-muted/30">
            <h4 className="font-semibold text-foreground mb-2">1. التحضير المسبق</h4>
            <p className="text-sm text-muted-foreground">
              قبل وضع الكيس، جفف منطقة شفتك العليا بلطف بمنديل. اللعاب الزائد يمكن أن يخفف 
              النكهة ويبطئ الامتصاص. نقطة بداية جافة تعني ظهوراً أسرع ونكهة أكثر كثافة.
            </p>
          </div>
          <div className="p-4 rounded-lg bg-muted/30">
            <h4 className="font-semibold text-foreground mb-2">2. الوضع المثالي</h4>
            <p className="text-sm text-muted-foreground">
              ضع الكيس قليلاً خارج المركز، تحت شفتك العليا بالقرب من الضرس الناب. هذا الوضع 
              يوفر أقصى اتصال مع الغشاء المخاطي مع الحفاظ على الراحة.
            </p>
          </div>
          <div className="p-4 rounded-lg bg-muted/30">
            <h4 className="font-semibold text-foreground mb-2">3. إدارة اللعاب</h4>
            <p className="text-sm text-muted-foreground">
              بعض زيادة اللعاب طبيعية وتساعد فعلاً في إطلاق النيكوتين. لكن اللعاب الزائد يمكن 
              أن يتسبب في انزلاق الكيس. إذا لزم الأمر، اضغط بلطف على الكيس ضد لثتك بلسانك 
              للحفاظ على مكانه. ابتلع اللعاب بشكل طبيعي — لا تبصق.
            </p>
          </div>
          <div className="p-4 rounded-lg bg-muted/30">
            <h4 className="font-semibold text-foreground mb-2">4. طي الشفة</h4>
            <p className="text-sm text-muted-foreground">
              لمزيد من التخفي، اطوِ شفتك العليا بلطف فوق الكيس. هذا يخلق وضعاً غير مرئي 
              تماماً لن يلاحظه أحد، حتى خلال المحادثات وجهاً لوجه.
            </p>
          </div>
        </div>

        <HighlightBox type="tip">
          <strong>حركة محترفة:</strong> بدّل الجانبين مع كل كيس. هذا يمنع تهيج اللثة الموضعي 
          ويضمن تآكلاً متساوياً. إذا لاحظت أي حساسية على جانب، أعطه عدة أيام من الراحة.
        </HighlightBox>
      </section>

      <section id="duration" className="mb-10">
        <h2 className="text-2xl font-bold text-foreground mb-4">المدة المثالية</h2>
        <p className="text-muted-foreground leading-relaxed mb-4">
          كم مدة إبقاء الكيس؟ الإجابة تعتمد على عدة عوامل، لكن إليك الإرشادات العامة:
        </p>

        <div className="overflow-x-auto my-6">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-emerald-600 text-white">
                <th className="p-3 text-right rounded-tr-lg">مستوى القوة</th>
                <th className="p-3 text-right">المدة الموصى بها</th>
                <th className="p-3 text-right rounded-tl-lg">ملاحظات</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-border/50">
                <td className="p-3 font-medium">خفيفة (3-6 ملغم/جم)</td>
                <td className="p-3 text-muted-foreground">30-45 دقيقة</td>
                <td className="p-3 text-muted-foreground">تجربة لطيفة، يمكن إبقاؤها أطول</td>
              </tr>
              <tr className="border-b border-border/50 bg-muted/20">
                <td className="p-3 font-medium">متوسطة (8-12 ملغم/جم)</td>
                <td className="p-3 text-muted-foreground">20-35 دقيقة</td>
                <td className="p-3 text-muted-foreground">النقطة المثالية لمعظم المستخدمين</td>
              </tr>
              <tr className="border-b border-border/50">
                <td className="p-3 font-medium">قوية (14-20 ملغم/جم)</td>
                <td className="p-3 text-muted-foreground">15-30 دقيقة</td>
                <td className="p-3 text-muted-foreground">أزل عندما تستقر التأثيرات</td>
              </tr>
              <tr>
                <td className="p-3 font-medium">فائقة القوة (24+ ملغم/جم)</td>
                <td className="p-3 text-muted-foreground">10-25 دقيقة</td>
                <td className="p-3 text-muted-foreground">مدة أقصر موصى بها</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section id="disposal" className="mb-10">
        <h2 className="text-2xl font-bold text-foreground mb-4">التخلص الصحيح</h2>
        <p className="text-muted-foreground leading-relaxed mb-4">
          التخلص المسؤول جانب مهم لكنه غالباً يُغفل في استخدام أكياس النيكوتين. إليك 
          كيفية القيام بذلك بشكل صحيح:
        </p>
        <ul className="space-y-2 text-muted-foreground mb-4">
          <li className="flex items-start gap-2">
            <span className="text-emerald-500 mt-1">•</span>
            <span><strong>استخدم غطاء التخزين:</strong> معظم العلب الجيدة لها حجرة في الغطاء السفلي لتخزين الأكياس المستخدمة مؤقتاً.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-emerald-500 mt-1">•</span>
            <span><strong>لفّ وتخلص:</strong> إذا لم يكن الغطاء متاحاً، لفّ الكيس المستخدم في منديل قبل التخلص في سلة المهملات.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-emerald-500 mt-1">•</span>
            <span><strong>لا ترمِ في المرحاض:</strong> لا يجب رمي أكياس النيكوتين في المرحاض أو الطبيعة. النيكوتين سام للحياة المائية.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-emerald-500 mt-1">•</span>
            <span><strong>أفرغ الحجرة بانتظام:</strong> أفرغ حجرة التخزين في سلة المهملات في نهاية كل يوم.</span>
          </li>
        </ul>
      </section>

      <section id="dos-donts" className="mb-10">
        <h2 className="text-2xl font-bold text-foreground mb-4">ما يجب وما لا يجب فعله</h2>
        <p className="text-muted-foreground leading-relaxed mb-4">
          دليل مرجعي سريع لأهم ما يجب وما لا يجب فعله في استخدام أكياس النيكوتين:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-bold text-emerald-600 mb-4 text-lg">✅ ما يجب فعله</h4>
            <div className="space-y-3">
              <div className="p-3 rounded-lg border border-emerald-500/20 bg-emerald-500/5 text-sm">
                <strong className="text-foreground">ابدأ بقوة خفيفة</strong> إذا كنت مبتدئاً
              </div>
              <div className="p-3 rounded-lg border border-emerald-500/20 bg-emerald-500/5 text-sm">
                <strong className="text-foreground">حافظ على الترطيب</strong> — اشرب الماء مع كل كيس
              </div>
              <div className="p-3 rounded-lg border border-emerald-500/20 bg-emerald-500/5 text-sm">
                <strong className="text-foreground">بدّل أماكن الفم</strong> لمنع تهيج اللثة
              </div>
              <div className="p-3 rounded-lg border border-emerald-500/20 bg-emerald-500/5 text-sm">
                <strong className="text-foreground">خزّن بشكل صحيح</strong> — بارد، جاف، مُغلق
              </div>
              <div className="p-3 rounded-lg border border-emerald-500/20 bg-emerald-500/5 text-sm">
                <strong className="text-foreground">تخلص بمسؤولية</strong> — استخدم غطاء التخزين أو لفّ قبل التخلص
              </div>
              <div className="p-3 rounded-lg border border-emerald-500/20 bg-emerald-500/5 text-sm">
                <strong className="text-foreground">استمع لجسمك</strong> — أزل إذا شعرت بعدم الراحة
              </div>
            </div>
          </div>
          <div>
            <h4 className="font-bold text-red-500 mb-4 text-lg">❌ ما لا يجب فعله</h4>
            <div className="space-y-3">
              <div className="p-3 rounded-lg border border-red-500/20 bg-red-500/5 text-sm">
                <strong className="text-foreground">لا تتجاوز 8 أكياس/يوم</strong> — استخدم باعتدال
              </div>
              <div className="p-3 rounded-lg border border-red-500/20 bg-red-500/5 text-sm">
                <strong className="text-foreground">لا تستخدم على معدة فارغة</strong> — يسبب غثياناً
              </div>
              <div className="p-3 rounded-lg border border-red-500/20 bg-red-500/5 text-sm">
                <strong className="text-foreground">لا تبتلع الأكياس</strong> — أزلها وتخلص بشكل صحيح
              </div>
              <div className="p-3 rounded-lg border border-red-500/20 bg-red-500/5 text-sm">
                <strong className="text-foreground">لا تستخدم أكياس منتهية</strong> — تحقق من تاريخ الصلاحية
              </div>
              <div className="p-3 rounded-lg border border-red-500/20 bg-red-500/5 text-sm">
                <strong className="text-foreground">لا تشارك الأكياس</strong> — النظافة مهمة
              </div>
              <div className="p-3 rounded-lg border border-red-500/20 bg-red-500/5 text-sm">
                <strong className="text-foreground">لا تستخدم إذا كان عمرك أقل من 21</strong> — قيود العمر سارية
              </div>
            </div>
          </div>
        </div>

        <HighlightBox type="tip">
          مستعد لتطبيق هذه النصائح عملياً؟ تسوق من <strong>المجموعة الكاملة لأكياس النيكوتين</strong> 
          في سنوسي، مع توصيل سريع لجميع المحافظات المصرية الـ27. كل علبة تشحن مع تعليمات 
          تخزين صحيحة مضمنة!
        </HighlightBox>
      </section>
    </>
  );
}
