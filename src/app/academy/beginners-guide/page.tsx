"use client";

import { useI18n } from "@/lib/i18n";
import { ArticleTemplate, HighlightBox } from "../components/article-template";

const meta = {
  titleEn: "The Complete Beginner's Guide to Nicotine Pouches",
  titleAr: "دليل المبتدئين الشامل لأكياس النيكوتين",
  image: "/images/academy/beginners.png",
  categoryKey: "beginner" as const,
  readTime: 8,
  date: "2026-01-15",
  authorEn: "Snusii Team",
  authorAr: "فريق سنوسي",
  toc: [
    { id: "what-are", labelEn: "What Are Nicotine Pouches?", labelAr: "ما هي أكياس النيكوتين؟" },
    { id: "how-to-use", labelEn: "How to Use Nicotine Pouches", labelAr: "كيفية استخدام أكياس النيكوتين" },
    { id: "choosing-strength", labelEn: "Choosing the Right Strength", labelAr: "اختيار القوة المناسبة" },
    { id: "first-time-tips", labelEn: "First-Time Tips & Best Practices", labelAr: "نصائح المبتدئين وأفضل الممارسات" },
    { id: "common-mistakes", labelEn: "Common Mistakes to Avoid", labelAr: "أخطاء شائعة يجب تجنبها" },
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
      slug: "storage-usage",
      titleEn: "How to Store & Use Nicotine Pouches Like a Pro",
      titleAr: "كيفية تخزين واستخدام أكياس النيكوتين مثل المحترفين",
      image: "/images/academy/storage.png",
      categoryKey: "storage" as const,
    },
  ],
};

export default function BeginnersGuidePage() {
  return (
    <ArticleTemplate meta={meta}>
      <BilingualContent />
    </ArticleTemplate>
  );
}

function BilingualContent() {
  const { locale } = useI18n();

  if (locale === "ar") {
    return <ArabicContent />;
  }
  return <EnglishContent />;
}

function EnglishContent() {
  return (
    <>
      {/* Section 1: What Are Nicotine Pouches */}
      <section id="what-are" className="mb-10">
        <h2 className="text-2xl font-bold text-foreground mb-4">
          What Are Nicotine Pouches?
        </h2>
        <p className="text-muted-foreground leading-relaxed mb-4">
          Nicotine pouches are small, white, pre-portioned bags containing nicotine, flavorings, 
          plant-based fibers, and sweeteners. They are designed to be placed between the upper lip 
          and gum, where nicotine is absorbed through the oral mucosa over time. Unlike traditional 
          snus or chewing tobacco, nicotine pouches are completely <strong>tobacco-free</strong>, 
          making them a cleaner alternative for adult nicotine users.
        </p>
        <p className="text-muted-foreground leading-relaxed mb-4">
          These pouches originated in Sweden as part of the broader &quot;snus&quot; culture, but the modern 
          tobacco-free variant has rapidly gained popularity worldwide. Brands like <strong>White Fox</strong>, 
          <strong>Siberia</strong>, and <strong>77</strong> have become household names among nicotine pouch 
          enthusiasts, particularly in markets like Egypt where they are widely available.
        </p>
        <p className="text-muted-foreground leading-relaxed mb-4">
          Each pouch typically comes in a discreet, pocket-sized can containing anywhere from 15 to 
          24 portions. The pouches themselves are incredibly discreet — they produce no smoke, no vapor, 
          and no noticeable odor, making them perfect for use in social settings, at work, or during travel.
        </p>

        <HighlightBox type="info">
          Nicotine pouches are <strong>not</strong> a smoking cessation product. They are intended for 
          adult nicotine users (21+) who are looking for a smoke-free, tobacco-free alternative. Always 
          consult a healthcare professional if you are trying to quit smoking.
        </HighlightBox>

        <h3 className="text-lg font-semibold text-foreground mt-6 mb-3">
          Key Components of a Nicotine Pouch
        </h3>
        <ul className="space-y-2 text-muted-foreground">
          <li className="flex items-start gap-2">
            <span className="text-emerald-500 mt-1">•</span>
            <span><strong>Nicotine:</strong> The active ingredient, available in varying strengths measured in mg/g (milligrams per gram)</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-emerald-500 mt-1">•</span>
            <span><strong>Plant-based fillers:</strong> Cellulose or other natural fibers that give the pouch its shape and texture</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-emerald-500 mt-1">•</span>
            <span><strong>Flavorings:</strong> Natural and artificial flavors ranging from mint and citrus to berry and coffee</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-emerald-500 mt-1">•</span>
            <span><strong>Sweeteners:</strong> Often xylitol or sucralose to enhance the flavor experience</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-emerald-500 mt-1">•</span>
            <span><strong>pH adjusters:</strong> Help optimize nicotine absorption for a consistent experience</span>
          </li>
        </ul>
      </section>

      {/* Section 2: How to Use */}
      <section id="how-to-use" className="mb-10">
        <h2 className="text-2xl font-bold text-foreground mb-4">
          How to Use Nicotine Pouches
        </h2>
        <p className="text-muted-foreground leading-relaxed mb-4">
          Using a nicotine pouch is remarkably simple, but getting the technique right from the start 
          can significantly enhance your experience. Here is a step-by-step guide to using your first pouch:
        </p>

        <div className="space-y-4 mb-6">
          <div className="flex gap-4 p-4 rounded-lg bg-muted/30">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white text-sm font-bold">
              1
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-1">Open the Can</h4>
              <p className="text-sm text-muted-foreground">
                Most cans have a child-resistant lid. Twist the top to open and remove a single pouch. 
                Many cans also feature a catch lid on the bottom for disposing of used pouches.
              </p>
            </div>
          </div>

          <div className="flex gap-4 p-4 rounded-lg bg-muted/30">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white text-sm font-bold">
              2
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-1">Place Under Your Upper Lip</h4>
              <p className="text-sm text-muted-foreground">
                Take the pouch and gently place it between your upper lip and gum, slightly off to one side. 
                The upper lip area has more saliva and better blood flow, which helps with nicotine absorption.
              </p>
            </div>
          </div>

          <div className="flex gap-4 p-4 rounded-lg bg-muted/30">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white text-sm font-bold">
              3
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-1">Wait for the Tingle</h4>
              <p className="text-sm text-muted-foreground">
                Within 1-5 minutes, you will feel a mild tingling sensation as the nicotine begins to release. 
                This is completely normal and indicates the pouch is working. The flavor and nicotine will 
                gradually release over 20-45 minutes.
              </p>
            </div>
          </div>

          <div className="flex gap-4 p-4 rounded-lg bg-muted/30">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white text-sm font-bold">
              4
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-1">Enjoy and Discard</h4>
              <p className="text-sm text-muted-foreground">
                Keep the pouch in place for 20-45 minutes. When the flavor and nicotine fade, remove the 
                pouch and dispose of it in the can&apos;s catch lid compartment or a trash bin. 
                <strong>Never swallow the pouch.</strong>
              </p>
            </div>
          </div>
        </div>

        <HighlightBox type="tip">
          For your first time, start with a <strong>light-strength pouch (3-6 mg/g)</strong> and keep it 
          in for just 15-20 minutes. This helps your body adjust to nicotine without overwhelming your system.
        </HighlightBox>
      </section>

      {/* Section 3: Choosing Strength */}
      <section id="choosing-strength" className="mb-10">
        <h2 className="text-2xl font-bold text-foreground mb-4">
          Choosing the Right Strength
        </h2>
        <p className="text-muted-foreground leading-relaxed mb-4">
          Nicotine strength is measured in <strong>milligrams per gram (mg/g)</strong> and is the single most 
          important factor in determining your experience. Choosing the wrong strength is the most common 
          mistake beginners make, so let us break it down clearly:
        </p>

        <div className="overflow-x-auto my-6">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-emerald-600 text-white">
                <th className="p-3 text-left rounded-tl-lg">Strength Level</th>
                <th className="p-3 text-left">mg/g Range</th>
                <th className="p-3 text-left">Best For</th>
                <th className="p-3 text-left rounded-tr-lg">Example Products</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-border/50 bg-muted/20">
                <td className="p-3 font-medium text-emerald-600">Light</td>
                <td className="p-3">3 – 6 mg/g</td>
                <td className="p-3 text-muted-foreground">Complete beginners, casual users</td>
                <td className="p-3 text-muted-foreground">77 Light, White Fox Mini</td>
              </tr>
              <tr className="border-b border-border/50">
                <td className="p-3 font-medium text-emerald-600">Medium</td>
                <td className="p-3">8 – 12 mg/g</td>
                <td className="p-3 text-muted-foreground">Moderate users, former light smokers</td>
                <td className="p-3 text-muted-foreground">77 Medium, Siberia Red</td>
              </tr>
              <tr className="border-b border-border/50 bg-muted/20">
                <td className="p-3 font-medium text-emerald-600">Strong</td>
                <td className="p-3">14 – 20 mg/g</td>
                <td className="p-3 text-muted-foreground">Experienced users, former heavy smokers</td>
                <td className="p-3 text-muted-foreground">White Fox Full, 77 Strong</td>
              </tr>
              <tr>
                <td className="p-3 font-medium text-emerald-600">Extra Strong</td>
                <td className="p-3">24+ mg/g</td>
                <td className="p-3 text-muted-foreground">Veteran users only, use with caution</td>
                <td className="p-3 text-muted-foreground">Siberia -80°C, Siberia 33mg</td>
              </tr>
            </tbody>
          </table>
        </div>

        <HighlightBox type="warning">
          <strong>If you have never used nicotine before, always start with the lightest strength available (3 mg/g).</strong> 
          Higher strengths can cause nausea, dizziness, and headaches in new users. You can always increase 
          strength later — you cannot undo an unpleasant first experience.
        </HighlightBox>
      </section>

      {/* Section 4: First-Time Tips */}
      <section id="first-time-tips" className="mb-10">
        <h2 className="text-2xl font-bold text-foreground mb-4">
          First-Time Tips &amp; Best Practices
        </h2>
        <p className="text-muted-foreground leading-relaxed mb-4">
          Here are some essential tips to ensure your first nicotine pouch experience is enjoyable 
          and comfortable:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="p-4 rounded-lg border border-border/50 bg-card">
            <h4 className="font-semibold text-foreground mb-2 text-emerald-600">
              ✓ Do Start Slow
            </h4>
            <p className="text-sm text-muted-foreground">
              Begin with light strength (3-6 mg/g) and limit your usage to 1-2 pouches per day 
              for the first week. Give your body time to adjust.
            </p>
          </div>
          <div className="p-4 rounded-lg border border-border/50 bg-card">
            <h4 className="font-semibold text-foreground mb-2 text-emerald-600">
              ✓ Do Stay Hydrated
            </h4>
            <p className="text-sm text-muted-foreground">
              Nicotine can cause mild dehydration. Drink water before, during, and after using a pouch. 
              This also helps reduce the risk of hiccups.
            </p>
          </div>
          <div className="p-4 rounded-lg border border-border/50 bg-card">
            <h4 className="font-semibold text-foreground mb-2 text-emerald-600">
              ✓ Do Rotate Positions
            </h4>
            <p className="text-sm text-muted-foreground">
              Alternate between left and right sides of your mouth to prevent gum irritation. 
          This simple habit makes a big difference with regular use.
            </p>
          </div>
          <div className="p-4 rounded-lg border border-border/50 bg-card">
            <h4 className="font-semibold text-foreground mb-2 text-emerald-600">
              ✓ Do Try Different Flavors
            </h4>
            <p className="text-sm text-muted-foreground">
              Mint is the most popular starting flavor, but do not be afraid to try citrus, berry, 
              or melon. Everyone&apos;s palate is different.
            </p>
          </div>
        </div>
      </section>

      {/* Section 5: Common Mistakes */}
      <section id="common-mistakes" className="mb-10">
        <h2 className="text-2xl font-bold text-foreground mb-4">
          Common Mistakes to Avoid
        </h2>
        <p className="text-muted-foreground leading-relaxed mb-4">
          Learning from others&apos; mistakes can save you from an uncomfortable experience. Here are the 
          most common pitfalls beginners encounter:
        </p>

        <div className="space-y-4">
          <div className="p-4 rounded-lg border border-amber-500/20 bg-amber-500/5">
            <h4 className="font-semibold text-foreground mb-2 text-amber-600">
              ✗ Starting with High Strength
            </h4>
            <p className="text-sm text-muted-foreground">
              The number one mistake. Starting with 16mg/g or higher is almost guaranteed to cause 
              discomfort. Always start low and work your way up gradually.
            </p>
          </div>
          <div className="p-4 rounded-lg border border-amber-500/20 bg-amber-500/5">
            <h4 className="font-semibold text-foreground mb-2 text-amber-600">
              ✗ Keeping It In Too Long
            </h4>
            <p className="text-sm text-muted-foreground">
              More time does not equal more enjoyment. After 45 minutes, the pouch has released most 
              of its nicotine and may cause gum irritation if left longer.
            </p>
          </div>
          <div className="p-4 rounded-lg border border-amber-500/20 bg-amber-500/5">
            <h4 className="font-semibold text-foreground mb-2 text-amber-600">
              ✗ Swallowing the Pouch
            </h4>
            <p className="text-sm text-muted-foreground">
              Nicotine pouches are not meant to be swallowed. Always remove and dispose of them properly. 
              If accidentally swallowed, drink water and consult a doctor if you feel unwell.
            </p>
          </div>
          <div className="p-4 rounded-lg border border-amber-500/20 bg-amber-500/5">
            <h4 className="font-semibold text-foreground mb-2 text-amber-600">
              ✗ Using on an Empty Stomach
            </h4>
            <p className="text-sm text-muted-foreground">
              Nicotine on an empty stomach can cause nausea much more easily. Have a light meal or 
              snack before your first pouch of the day.
            </p>
          </div>
        </div>

        <HighlightBox type="tip">
          Ready to start shopping? Browse our <strong>beginner-friendly collection</strong> at Snusii 
          for the best selection of light-strength nicotine pouches in Egypt, with fast COD delivery 
          to all 27 governorates.
        </HighlightBox>
      </section>
    </>
  );
}

function ArabicContent() {
  return (
    <>
      {/* Section 1: What Are Nicotine Pouches */}
      <section id="what-are" className="mb-10">
        <h2 className="text-2xl font-bold text-foreground mb-4">
          ما هي أكياس النيكوتين؟
        </h2>
        <p className="text-muted-foreground leading-relaxed mb-4">
          أكياس النيكوتين هي أكياس صغيرة بيضاء محددة الحجم تحتوي على النيكوتين والنكهات 
          والألياف النباتية والمحليات. تم تصميمها لتوضع بين الشفة العليا واللثة، حيث يتم امتصاص 
          النيكوتين عبر الغشاء المخاطي الفموي مع مرور الوقت. على عكس السنوس التقليدي أو تبغ 
          المضغ، فإن أكياس النيكوتين خالية تماماً من <strong>التبغ</strong>، مما يجعلها بديلاً 
          أنظف لمستخدمي النيكوتين البالغين.
        </p>
        <p className="text-muted-foreground leading-relaxed mb-4">
          نشأت هذه الأكياس في السويد كجزء من ثقافة السنوس الأوسع، لكن النسخة الحديثة 
          الخالية من التبغ اكتسبت شعبية سريعة في جميع أنحاء العالم. أصبحت العلامات التجارية 
          مثل <strong>وايت فوكس</strong> و<strong>سيبريا</strong> و<strong>77</strong> من 
          الأسماء المعروفة بين محبي أكياس النيكوتين، خاصة في أسواق مثل مصر حيث تتوفر بكثرة.
        </p>
        <p className="text-muted-foreground leading-relaxed mb-4">
          كل علبة عادة تحتوي على عبوة مناسبة للجيب تحتوي من 15 إلى 24 حصة. الأكياس نفسها 
          غير مرئية تماماً — لا تنتج دخاناً ولا بخاراً ولا رائحة ملحوظة، مما يجعلها مثالية 
          للاستخدام في الأماكن الاجتماعية أو في العمل أو أثناء السفر.
        </p>

        <HighlightBox type="info">
          أكياس النيكوتين <strong>ليست</strong> منتجاً للإقلاع عن التدخين. هي مخصصة لمستخدمي 
          النيكوتين البالغين (21+) الذين يبحثون عن بديل خالٍ من الدخان والتبغ. استشر دائماً 
          أخصائي رعاية صحية إذا كنت تحاول الإقلاع عن التدخين.
        </HighlightBox>

        <h3 className="text-lg font-semibold text-foreground mt-6 mb-3">
          المكونات الرئيسية لكياس النيكوتين
        </h3>
        <ul className="space-y-2 text-muted-foreground">
          <li className="flex items-start gap-2">
            <span className="text-emerald-500 mt-1">•</span>
            <span><strong>النيكوتين:</strong> المكون الفعال، متوفر بقو مختلفة تُقاس بملغم/جم (ملليجرام لكل جرام)</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-emerald-500 mt-1">•</span>
            <span><strong>الحشوات النباتية:</strong> السيلولوز أو الألياف الطبيعية الأخرى التي تعطي الكيس شكله وقوامه</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-emerald-500 mt-1">•</span>
            <span><strong>النكهات:</strong> نكهات طبيعية وصناعية تتراوح من النعناع والحمضيات إلى التوت والقهوة</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-emerald-500 mt-1">•</span>
            <span><strong>المحليات:</strong> غالباً زايليتول أو سكريالوز لتحسين تجربة النكهة</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-emerald-500 mt-1">•</span>
            <span><strong>منظمات الأس الهيدروجيني:</strong> تساعد في تحسين امتصاص النيكوتين لتجربة متسقة</span>
          </li>
        </ul>
      </section>

      {/* Section 2: How to Use */}
      <section id="how-to-use" className="mb-10">
        <h2 className="text-2xl font-bold text-foreground mb-4">
          كيفية استخدام أكياس النيكوتين
        </h2>
        <p className="text-muted-foreground leading-relaxed mb-4">
          استخدام كيس النيكوتين سهل بشكل مذهل، لكن إتقان التقنية الصحيحة من البداية 
          يمكن أن يحسن تجربتك بشكل كبير. إليك دليل خطوة بخطوة لاستخدام أول كيس لك:
        </p>

        <div className="space-y-4 mb-6">
          <div className="flex gap-4 p-4 rounded-lg bg-muted/30">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white text-sm font-bold">
              1
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-1">افتح العلبة</h4>
              <p className="text-sm text-muted-foreground">
                معظم العلب لها غطاء مقاوم للأطفال. أدر الغطاء لفتحه وأخرج كيساً واحداً. 
                العديد من العلب تتميز أيضاً بغطاء علوي في الأسفل للتخلص من الأكياس المستخدمة.
              </p>
            </div>
          </div>

          <div className="flex gap-4 p-4 rounded-lg bg-muted/30">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white text-sm font-bold">
              2
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-1">ضع تحت شفتك العليا</h4>
              <p className="text-sm text-muted-foreground">
                خذ الكيس وضعه بلطف بين شفتك العليا ولثتك، مائلاً قليلاً إلى أحد الجانبين. 
                منطقة الشفة العليا بها الكثير من اللعاب وتدفق دم أفضل، مما يساعد في امتصاص النيكوتين.
              </p>
            </div>
          </div>

          <div className="flex gap-4 p-4 rounded-lg bg-muted/30">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white text-sm font-bold">
              3
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-1">انتظر الوخز</h4>
              <p className="text-sm text-muted-foreground">
                خلال 1-5 دقائق، ستشعر بوخز خفيف عندما يبدأ النيكوتين بالتحرر. 
                هذا أمر طبيعي تماماً ويشير إلى أن الكيس يعمل. النكهة والنيكوتين سيتحرران تدريجياً 
                على مدار 20-45 دقيقة.
              </p>
            </div>
          </div>

          <div className="flex gap-4 p-4 rounded-lg bg-muted/30">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white text-sm font-bold">
              4
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-1">استمتع ثم تخلص</h4>
              <p className="text-sm text-muted-foreground">
                أبقِ الكيس في مكانه لمدة 20-45 دقيقة. عندما تخف النكهة والنيكوتين، أزل 
                الكيس وتخلص منه في حاوية التخلص بالعلبة أو في سلة المهملات. 
                <strong>لا تبتلع الكيس أبداً.</strong>
              </p>
            </div>
          </div>
        </div>

        <HighlightBox type="tip">
          للمرة الأولى، ابدأ بكيس <strong>خفيف القوة (3-6 ملغم/جم)</strong> وأبقه لمدة 
          15-20 دقيقة فقط. هذا يساعد جسمك على التكيف مع النيكوتين دون إرهاق جهازك.
        </HighlightBox>
      </section>

      {/* Section 3: Choosing Strength */}
      <section id="choosing-strength" className="mb-10">
        <h2 className="text-2xl font-bold text-foreground mb-4">
          اختيار القوة المناسبة
        </h2>
        <p className="text-muted-foreground leading-relaxed mb-4">
          تُقاس قوة النيكوتين بـ <strong>ملليجرام لكل جرام (ملغم/جم)</strong> وهي أهم عامل 
          في تحديد تجربتك. اختيار القوة الخاطئة هو الخطأ الأكثر شيوعاً للمبتدئين:
        </p>

        <div className="overflow-x-auto my-6">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-emerald-600 text-white">
                <th className="p-3 text-right rounded-tr-lg">مستوى القوة</th>
                <th className="p-3 text-right">نطاق ملغم/جم</th>
                <th className="p-3 text-right">الأفضل لـ</th>
                <th className="p-3 text-right rounded-tl-lg">أمثلة المنتجات</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-border/50 bg-muted/20">
                <td className="p-3 font-medium text-emerald-600">خفيفة</td>
                <td className="p-3">3 – 6 ملغم/جم</td>
                <td className="p-3 text-muted-foreground">المبتدئين تماماً، المستخدمين العرضيين</td>
                <td className="p-3 text-muted-foreground">77 لايت، وايت فوكس ميني</td>
              </tr>
              <tr className="border-b border-border/50">
                <td className="p-3 font-medium text-emerald-600">متوسطة</td>
                <td className="p-3">8 – 12 ملغم/جم</td>
                <td className="p-3 text-muted-foreground">المستخدمين المعتدلين، المدخنين السابقين الخفيفين</td>
                <td className="p-3 text-muted-foreground">77 ميد، سيبريا ريد</td>
              </tr>
              <tr className="border-b border-border/50 bg-muted/20">
                <td className="p-3 font-medium text-emerald-600">قوية</td>
                <td className="p-3">14 – 20 ملغم/جم</td>
                <td className="p-3 text-muted-foreground">المستخدمين ذوي الخبرة، المدخنين السابقين الكثيفين</td>
                <td className="p-3 text-muted-foreground">وايت فوكس فول، 77 سترونج</td>
              </tr>
              <tr>
                <td className="p-3 font-medium text-emerald-600">فائقة القوة</td>
                <td className="p-3">24+ ملغم/جم</td>
                <td className="p-3 text-muted-foreground">للمحترفين فقط، استخدم بحذر</td>
                <td className="p-3 text-muted-foreground">سيبريا -80 درجة، سيبريا 33 ملغم</td>
              </tr>
            </tbody>
          </table>
        </div>

        <HighlightBox type="warning">
          <strong>إذا لم تستخدم النيكوتين من قبل، ابدأ دائماً بأقل قوة متاحة (3 ملغم/جم).</strong> 
          القوى الأعلى قد تسبب الغثيان والدوار والصداع للمستخدمين الجدد. يمكنك دائماً زيادة 
          القوة لاحقاً — لكنك لا تستطيع التراجع عن تجربة أولى غير سارة.
        </HighlightBox>
      </section>

      {/* Section 4: First-Time Tips */}
      <section id="first-time-tips" className="mb-10">
        <h2 className="text-2xl font-bold text-foreground mb-4">
          نصائح المبتدئين وأفضل الممارسات
        </h2>
        <p className="text-muted-foreground leading-relaxed mb-4">
          إليك بعض النصائح الأساسية لضمان أن تكون تجربتك الأولى مع أكياس النيكوتين 
          ممتعة ومريحة:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="p-4 rounded-lg border border-border/50 bg-card">
            <h4 className="font-semibold text-foreground mb-2 text-emerald-600">
              ✓ ابدأ ببطء
            </h4>
            <p className="text-sm text-muted-foreground">
              ابدأ بقوة خفيفة (3-6 ملغم/جم) وحدد استخدامك بـ 1-2 كيس في اليوم 
              خلال الأسبوع الأول. أعطِ جسمك وقتاً للتكيف.
            </p>
          </div>
          <div className="p-4 rounded-lg border border-border/50 bg-card">
            <h4 className="font-semibold text-foreground mb-2 text-emerald-600">
              ✓ حافظ على ترطيبك
            </h4>
            <p className="text-sm text-muted-foreground">
              النيكوتين قد يسبب جفافاً خفيفاً. اشرب الماء قبل وأثناء وبعد استخدام الكيس. 
              هذا يساعد أيضاً في تقليل خطر الفواق.
            </p>
          </div>
          <div className="p-4 rounded-lg border border-border/50 bg-card">
            <h4 className="font-semibold text-foreground mb-2 text-emerald-600">
              ✓ بدّل الأماكن
            </h4>
            <p className="text-sm text-muted-foreground">
              بدّل بين الجانب الأيسر والأيمن من فمك لمنع تهيج اللثة. 
          هذه العادة البسيطة تحدث فرقاً كبيراً مع الاستخدام المنتظم.
            </p>
          </div>
          <div className="p-4 rounded-lg border border-border/50 bg-card">
            <h4 className="font-semibold text-foreground mb-2 text-emerald-600">
              ✓ جرّب نكهات مختلفة
            </h4>
            <p className="text-sm text-muted-foreground">
              النعناع هو النكهة الأكثر شعبية للبداية، لكن لا تتردد في تجربة الحمضيات 
              أو التوت أو البطيخ. ذوق الجميع مختلف.
            </p>
          </div>
        </div>
      </section>

      {/* Section 5: Common Mistakes */}
      <section id="common-mistakes" className="mb-10">
        <h2 className="text-2xl font-bold text-foreground mb-4">
          أخطاء شائعة يجب تجنبها
        </h2>
        <p className="text-muted-foreground leading-relaxed mb-4">
          التعلم من أخطاء الآخرين يمكن أن ينقذك من تجربة غير مريحة. إليك أكثر 
          الأخطاء شيوعاً التي يواجهها المبتدئون:
        </p>

        <div className="space-y-4">
          <div className="p-4 rounded-lg border border-amber-500/20 bg-amber-500/5">
            <h4 className="font-semibold text-foreground mb-2 text-amber-600">
              ✗ البدء بقوة عالية
            </h4>
            <p className="text-sm text-muted-foreground">
              الخطأ رقم واحد. البدء بـ 16 ملغم/جم أو أعلى يضمن تقريباً حدوث 
              عدم ارتياح. ابدأ دائماً منخفضاً واعمل طريقك للأعلى تدريجياً.
            </p>
          </div>
          <div className="p-4 rounded-lg border border-amber-500/20 bg-amber-500/5">
            <h4 className="font-semibold text-foreground mb-2 text-amber-600">
              ✗ إبقاؤه لفترة طويلة جداً
            </h4>
            <p className="text-sm text-muted-foreground">
              وقت أطول لا يساوي استمتاعاً أكثر. بعد 45 دقيقة، يكون الكيس قد حرر معظم 
              نيكوتينه وقد يسبب تهيج اللثة إذا ترك أطول.
            </p>
          </div>
          <div className="p-4 rounded-lg border border-amber-500/20 bg-amber-500/5">
            <h4 className="font-semibold text-foreground mb-2 text-amber-600">
              ✗ ابتلاع الكيس
            </h4>
            <p className="text-sm text-muted-foreground">
              أكياس النيكوتين ليست مصممة للابتلاع. أزلها دائماً وتخلص منها بشكل صحيح. 
              إذا ابتُلعت بالخطأ، اشرب الماء واستشر طبيباً إذا شعرت بعدم الراحة.
            </p>
          </div>
          <div className="p-4 rounded-lg border border-amber-500/20 bg-amber-500/5">
            <h4 className="font-semibold text-foreground mb-2 text-amber-600">
              ✗ الاستخدام على معدة فارغة
            </h4>
            <p className="text-sm text-muted-foreground">
              النيكوتين على معدة فارغة قد يسبب الغثيان بسهولة أكبر. تناول وجبة خفيفة 
              أو وجبة خفيفة قبل أول كيس لك في اليوم.
            </p>
          </div>
        </div>

        <HighlightBox type="tip">
          مستعد للبدء في التسوق؟ تصفح <strong>مجموعتنا المناسبة للمبتدئين</strong> في سنوسي 
          لأفضل اختيار لأكياس النيكوتين خفيفة القوة في مصر، مع توصيل سريع عند الاستلام 
          لجميع المحافظات الـ27.
        </HighlightBox>
      </section>
    </>
  );
}
