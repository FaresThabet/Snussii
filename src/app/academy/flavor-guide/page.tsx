"use client";

import { useI18n } from "@/lib/i18n";
import { ArticleTemplate, HighlightBox } from "../components/article-template";

const meta = {
  titleEn: "Complete Flavor Guide: From Mint to Bubblegum",
  titleAr: "دليل النكهات الشامل: من النعناع إلى البابل جم",
  image: "/images/academy/flavors.png",
  categoryKey: "flavor" as const,
  readTime: 7,
  date: "2026-01-22",
  authorEn: "Snusii Team",
  authorAr: "فريق سنوسي",
  toc: [
    { id: "mint-flavors", labelEn: "Mint Flavors", labelAr: "نكهات النعناع" },
    { id: "fruit-flavors", labelEn: "Fruit Flavors", labelAr: "نكهات الفواكه" },
    { id: "unique-flavors", labelEn: "Unique & Specialty Flavors", labelAr: "نكهات فريدة ومتخصصة" },
    { id: "pairing-tips", labelEn: "Flavor Pairing Tips", labelAr: "نصائح مزج النكهات" },
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
      slug: "brand-comparison",
      titleEn: "White Fox vs Siberia vs 77: Brand Comparison",
      titleAr: "مقارنة العلامات: وايت فوكس ضد سيبريا ضد 77",
      image: "/images/academy/brands.png",
      categoryKey: "comparison" as const,
    },
    {
      slug: "beginners-guide",
      titleEn: "The Complete Beginner's Guide to Nicotine Pouches",
      titleAr: "دليل المبتدئين الشامل لأكياس النيكوتين",
      image: "/images/academy/beginners.png",
      categoryKey: "beginner" as const,
    },
  ],
};

export default function FlavorGuidePage() {
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

function FlavorCard({ emoji, name, desc, color }: { emoji: string; name: string; desc: string; color: string }) {
  return (
    <div className={`p-4 rounded-lg border border-border/50 bg-card hover:shadow-md transition-shadow`}>
      <div className="flex items-start gap-3">
        <span className="text-3xl">{emoji}</span>
        <div>
          <h4 className={`font-semibold mb-1 ${color}`}>{name}</h4>
          <p className="text-sm text-muted-foreground">{desc}</p>
        </div>
      </div>
    </div>
  );
}

function EnglishContent() {
  return (
    <>
      <section id="mint-flavors" className="mb-10">
        <h2 className="text-2xl font-bold text-foreground mb-4">Mint Flavors</h2>
        <p className="text-muted-foreground leading-relaxed mb-4">
          Mint is the undisputed king of nicotine pouch flavors, accounting for over 60% of all sales 
          worldwide. The cooling sensation of mint naturally complements the tingling effect of nicotine, 
          creating a refreshing experience that many users find addictive in its own right. From crisp 
          peppermint to smooth spearmint, the mint family offers something for every palate.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          <FlavorCard emoji="🌿" name="Peppermint" desc="Sharp, crisp, and intensely cooling. The most popular mint variant with a strong refreshing blast." color="text-emerald-600" />
          <FlavorCard emoji="🍃" name="Spearmint" desc="Smoother and sweeter than peppermint. Gentle cooling with a naturally sweet finish." color="text-emerald-600" />
          <FlavorCard emoji="❄️" name="Arctic Mint" desc="Extreme cooling sensation designed to feel icy cold. Siberia&apos;s signature mint experience." color="text-sky-600" />
          <FlavorCard emoji="💚" name="Wintergreen" desc="Slightly sweet with a medicinal, camphor-like cooling. Popular in American-style pouches." color="text-emerald-600" />
        </div>

        <HighlightBox type="tip">
          <strong>New user tip:</strong> If you are new to nicotine pouches, start with a <strong>spearmint</strong> 
          flavor. It is the smoothest mint option and pairs beautifully with light-strength pouches.
        </HighlightBox>
      </section>

      <section id="fruit-flavors" className="mb-10">
        <h2 className="text-2xl font-bold text-foreground mb-4">Fruit Flavors</h2>
        <p className="text-muted-foreground leading-relaxed mb-4">
          Fruit flavors have exploded in popularity over the past few years, offering a fun and vibrant 
          alternative to the traditional mint experience. From tropical mango to tart citrus, fruit pouches 
          are perfect for users who want something different and exciting.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          <FlavorCard emoji="🍋" name="Citrus / Lemon" desc="Zesty, bright, and tangy. Lemon pouches deliver a clean, uplifting flavor that is great for daytime use." color="text-yellow-600" />
          <FlavorCard emoji="🍊" name="Orange & Mandarin" desc="Sweet and juicy with a sunny disposition. One of the most refreshing non-mint options." color="text-orange-600" />
          <FlavorCard emoji="🍇" name="Berry Mix" desc="A blend of blueberry, raspberry, and blackberry. Sweet, slightly tart, and deeply satisfying." color="text-purple-600" />
          <FlavorCard emoji="🍑" name="Melon / Peach" desc="Tropical and luscious with natural sweetness. Melon flavors are especially popular in summer." color="text-green-600" />
          <FlavorCard emoji="🍒" name="Cherry" desc="Rich, dark cherry with a hint of sweetness. A sophisticated fruit option that feels indulgent." color="text-red-600" />
          <FlavorCard emoji="🍍" name="Tropical" desc="A blend of mango, pineapple, and passion fruit. Exotic and vacation-worthy." color="text-amber-600" />
        </div>

        <HighlightBox type="info">
          Fruit flavors tend to have a slightly shorter duration than mint flavors because the fruit 
          compounds dissipate faster. Expect about 15-30 minutes of peak flavor from fruit pouches, 
          compared to 20-40 minutes for mint.
        </HighlightBox>
      </section>

      <section id="unique-flavors" className="mb-10">
        <h2 className="text-2xl font-bold text-foreground mb-4">Unique &amp; Specialty Flavors</h2>
        <p className="text-muted-foreground leading-relaxed mb-4">
          For the adventurous user, several brands have introduced creative flavors that push the 
          boundaries of what a nicotine pouch can taste like. These specialty flavors are perfect 
          for users looking to break away from the ordinary.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          <FlavorCard emoji="☕" name="Coffee" desc="Rich, roasted coffee aroma with subtle sweetness. Perfect for morning use or coffee lovers." color="text-amber-700" />
          <FlavorCard emoji="🍬" name="Bubblegum" desc="Sweet, nostalgic bubblegum taste. Playful and fun with a candy-like finish." color="text-pink-600" />
          <FlavorCard emoji="🍫" name="Licorice" desc="Traditional Scandinavian flavor with an earthy, slightly sweet licorice profile." color="text-yellow-700" />
          <FlavorCard emoji="🍯" name="Honey / Vanilla" desc="Warm, smooth, and subtly sweet. A sophisticated option for evening use." color="text-amber-600" />
        </div>
      </section>

      <section id="pairing-tips" className="mb-10">
        <h2 className="text-2xl font-bold text-foreground mb-4">Flavor Pairing Tips</h2>
        <p className="text-muted-foreground leading-relaxed mb-4">
          Just like with food and beverages, certain nicotine pouch flavors pair better with specific 
          times, activities, and even drinks. Here are some pairing suggestions to elevate your experience:
        </p>

        <div className="overflow-x-auto my-6">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-emerald-600 text-white">
                <th className="p-3 text-left rounded-tl-lg">Occasion</th>
                <th className="p-3 text-left">Recommended Flavor</th>
                <th className="p-3 text-left rounded-tr-lg">Why</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-border/50">
                <td className="p-3 font-medium">Morning / Work</td>
                <td className="p-3">Peppermint, Coffee</td>
                <td className="p-3 text-muted-foreground">Invigorating, alert, and refreshing</td>
              </tr>
              <tr className="border-b border-border/50 bg-muted/20">
                <td className="p-3 font-medium">Afternoon</td>
                <td className="p-3">Citrus, Berry Mix</td>
                <td className="p-3 text-muted-foreground">Light, fruity, prevents afternoon fatigue</td>
              </tr>
              <tr className="border-b border-border/50">
                <td className="p-3 font-medium">Evening / Relaxing</td>
                <td className="p-3">Vanilla, Honey, Melon</td>
                <td className="p-3 text-muted-foreground">Smooth, calming, not overpowering</td>
              </tr>
              <tr>
                <td className="p-3 font-medium">Social Events</td>
                <td className="p-3">Spearmint, Bubblegum</td>
                <td className="p-3 text-muted-foreground">Pleasant breath, approachable flavor</td>
              </tr>
            </tbody>
          </table>
        </div>

        <HighlightBox type="tip">
          <strong>Rotation strategy:</strong> Keep 2-3 different flavors on hand and rotate throughout the day. 
          This prevents flavor fatigue and keeps each pouch experience fresh and enjoyable. Many Snusii 
          customers start their day with mint and switch to fruit in the afternoon.
        </HighlightBox>
      </section>
    </>
  );
}

function ArabicContent() {
  return (
    <>
      <section id="mint-flavors" className="mb-10">
        <h2 className="text-2xl font-bold text-foreground mb-4">نكهات النعناع</h2>
        <p className="text-muted-foreground leading-relaxed mb-4">
          النعناع هو الملك بلا منازع لنكهات أكياس النيكوتين، يمثل أكثر من 60% من جميع المبيعات 
          في جميع أنحاء العالم. الإحساس المنعش للنعناع يكمل بشكل طبيعي تأثير الوخز للنيكوتين، 
          مما يخلق تجربة منعشة يجدها كثير من المستخدمين ممتعة. من النعناع الحاد إلى النعناع 
          الناعم، عائلة النعناع تقدم شيئاً لكل ذوق.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          <FlavorCard emoji="🌿" name="نعناع حار" desc="حاد ونضيف ومنعش بشدة. المتغير الأكثر شعبية مع انفجار منعش قوي." color="text-emerald-600" />
          <FlavorCard emoji="🍃" name="نعناع ناعم" desc="أنعم وأحلى من النعناع الحار. تبريد لطيف مع نهاية حلوة طبيعية." color="text-emerald-600" />
          <FlavorCard emoji="❄️" name="نعناع القطبي" desc="إحساس تبريد شديد مصمم ليشعر بالبرد القارس. تجربة النعناع المميزة لسيبريا." color="text-sky-600" />
          <FlavorCard emoji="💚" name="وينترغرين" desc="حلو قليلاً مع تبريد دوائي يشبه الكافور. شائع في الأكياس الأمريكية." color="text-emerald-600" />
        </div>

        <HighlightBox type="tip">
          <strong>نصيحة للمستخدم الجديد:</strong> إذا كنت جديداً على أكياس النيكوتين، ابدأ بنكهة 
          <strong>النعناع الناعم</strong>. إنها أخيار النعناع الأكثر سلاسة وتتناغم بشكل جميل 
          مع أكياس القوة الخفيفة.
        </HighlightBox>
      </section>

      <section id="fruit-flavors" className="mb-10">
        <h2 className="text-2xl font-bold text-foreground mb-4">نكهات الفواكه</h2>
        <p className="text-muted-foreground leading-relaxed mb-4">
          نكهات الفواكه شهدت انفجاراً في الشعبية خلال السنوات القليلة الماضية، مما يوفر خياراً 
          ممتعاً وحياً كبديل لتجربة النعناع التقليدية. من المانجو الاستوائي إلى الحمضيات اللاذعة، 
          أكياس الفواكه مثالية للمستخدمين الذين يريدون شيئاً مختلفاً ومثيراً.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          <FlavorCard emoji="🍋" name="حمضيات / ليمون" desc="لاذع ومشرق ومائل للحموضة. أكياس الليمون تقدم نكهة نظيفة ومحفزة رائعة للاستخدام النهاري." color="text-yellow-600" />
          <FlavorCard emoji="🍊" name="برتقال وماندرين" desc="حلو وعصاري مع مزاج مشرق. من أكثر الخيارات المنعشة غير النعناعية شعبية." color="text-orange-600" />
          <FlavorCard emoji="🍇" name="مزيج التوت" desc="مزيج من التوت الأزرق والعنب والفراولة. حلو وحموضة قليلاً ومرضٍ بعمق." color="text-purple-600" />
          <FlavorCard emoji="🍑" name="بطيخ / خوخ" desc="استوائي وفاتن بحلاوة طبيعية. نكهات البطيخ شائعة بشكل خاص في الصيف." color="text-green-600" />
          <FlavorCard emoji="🍒" name="كرز" desc="كرز غامق مع لمسة حلاوة. خيار فواكه راقٍ يبدو فاخراً." color="text-red-600" />
          <FlavorCard emoji="🍍" name="استوائي" desc="مزيج من المانجو والأناناس وفاكهة الباشن. غريب وجدير بالإجازة." color="text-amber-600" />
        </div>

        <HighlightBox type="info">
          نكهات الفواكه تميل إلى أن تكون أقصر مدة من نكهات النعناع لأن مركبات الفواكه 
          تتبدد أسرع. توقع حوالي 15-30 دقيقة من ذروة النكهة من أكياس الفواكه، 
          مقارنة بـ 20-40 دقيقة للنعناع.
        </HighlightBox>
      </section>

      <section id="unique-flavors" className="mb-10">
        <h2 className="text-2xl font-bold text-foreground mb-4">نكهات فريدة ومتخصصة</h2>
        <p className="text-muted-foreground leading-relaxed mb-4">
          للمستخدم المغامر، عدة علامات تجارية قدمت نكهات إبداعية تتخطى حدود ما يمكن أن 
          تتذوقه أكياس النيكوتين. هذه النكهات المتخصصة مثالية للمستخدمين الباحثين عن التميز 
          عن المعتاد.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          <FlavorCard emoji="☕" name="قهوة" desc="رائحة قهوة محمصة غنية مع حلاوة خفيفة. مثالية للاستخدام الصباحي أو محبي القهوة." color="text-amber-700" />
          <FlavorCard emoji="🍬" name="بابل جم" desc="طعم بابل جم حلو ونوستالجي. مرح وممتع مع نهاية حلوة كالحلوى." color="text-pink-600" />
          <FlavorCard emoji="🍫" name="عرق السوس" desc="نكهة اسكندنافية تقليدية بميزة ترابية وحلوة قليلاً." color="text-yellow-700" />
          <FlavorCard emoji="🍯" name="عسل / فانيلا" desc="دافئ وناعم وحلو بشكل خفيف. خيار راقٍ للاستخدام المسائي." color="text-amber-600" />
        </div>
      </section>

      <section id="pairing-tips" className="mb-10">
        <h2 className="text-2xl font-bold text-foreground mb-4">نصائح مزج النكهات</h2>
        <p className="text-muted-foreground leading-relaxed mb-4">
          تماماً مثل الطعام والمشروبات، نكهات أكياس النيكوتين معينة تتناغم بشكل أفضل مع أوقات 
          وأنشطة وحتى مشروبات محددة. إليك بعض اقتراحات المزج لتحسين تجربتك:
        </p>

        <div className="overflow-x-auto my-6">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-emerald-600 text-white">
                <th className="p-3 text-right rounded-tr-lg">المناسبة</th>
                <th className="p-3 text-right">النكهة الموصى بها</th>
                <th className="p-3 text-right rounded-tl-lg">السبب</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-border/50">
                <td className="p-3 font-medium">صباح / عمل</td>
                <td className="p-3">نعناع حار، قهوة</td>
                <td className="p-3 text-muted-foreground">منعش ومنبه ومحفز</td>
              </tr>
              <tr className="border-b border-border/50 bg-muted/20">
                <td className="p-3 font-medium">بعد الظهر</td>
                <td className="p-3">حمضيات، مزيج توت</td>
                <td className="p-3 text-muted-foreground">خفيف وفاكهي ويمنع تعب بعد الظهر</td>
              </tr>
              <tr className="border-b border-border/50">
                <td className="p-3 font-medium">مساء / استرخاء</td>
                <td className="p-3">فانيلا، عسل، بطيخ</td>
                <td className="p-3 text-muted-foreground">ناعم ومهدئ وغير مفرط</td>
              </tr>
              <tr>
                <td className="p-3 font-medium">مناسبات اجتماعية</td>
                <td className="p-3">نعناع ناعم، بابل جم</td>
                <td className="p-3 text-muted-foreground">نفَس لطيف ونكهة مقبولة</td>
              </tr>
            </tbody>
          </table>
        </div>

        <HighlightBox type="tip">
          <strong>استراتيجية التدوير:</strong> احتفظ بـ 2-3 نكهات مختلفة في متناول يدك ودرها 
          طوال اليوم. هذا يمنع إرهاق النكهة ويحافظ على كل تجربة كيس طازجة وممتعة. كثير من 
          عملاء سنوسي يبدأون يومهم بالنعناع ويتحولون للفواكه بعد الظهر.
        </HighlightBox>
      </section>
    </>
  );
}
