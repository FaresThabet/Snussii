"use client";

import { motion } from "framer-motion";
import { ArrowRight, ShoppingCart, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { mockProducts } from "@/lib/mock-data";
import { useCartStore } from "@/stores/cart-store";
import { useI18n } from "@/lib/i18n";
import { formatPrice, toArabicNumerals } from "@/lib/format";
import { toast } from "sonner";
import Link from "next/link";

function getStrengthColor(strength: number): string {
  if (strength >= 30) return "bg-red-500/10 text-red-600 border-red-500/20";
  if (strength >= 20) return "bg-orange-500/10 text-orange-600 border-orange-500/20";
  if (strength >= 12) return "bg-amber-500/10 text-amber-600 border-amber-500/20";
  return "bg-green-500/10 text-green-600 border-green-500/20";
}

export function BestSellersSection() {
  const bestsellers = mockProducts.filter((p) => p.bestseller).slice(0, 4);
  const addItem = useCartStore((s) => s.addItem);
  const openCart = useCartStore((s) => s.openCart);
  const { locale, isRTL } = useI18n();

  const handleAddToCart = (product: (typeof bestsellers)[0]) => {
    addItem(product);
    openCart();
    toast.success(
      locale === "ar"
        ? `أُضيف "${product.name_ar ?? product.name}" إلى السلة`
        : `${product.name} added to cart`
    );
  };

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
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 font-arabic-display">
              {locale === "ar" ? "الأكثر طلباً" : "Best Sellers"}
            </h2>
            <p className="mt-2 text-muted-foreground">
              {locale === "ar"
                ? "أكثر المنتجات طلباً لدى عملائنا في كل مصر."
                : "Our most popular products loved by customers across Egypt."}
            </p>
          </div>
          <Button
            variant="ghost"
            className="gap-1.5 text-sm hidden sm:flex"
            onClick={() => (window.location.href = "/products")}
          >
            {locale === "ar" ? "تصفّح الكل" : "View All"}
            <ArrowRight className={`h-4 w-4 ${isRTL ? "rotate-180" : ""}`} />
          </Button>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {bestsellers.map((product, index) => {
            const hasDiscount = product.compare_price && product.compare_price > product.price;
            const discountPercent = hasDiscount
              ? Math.round(((product.compare_price! - product.price) / product.compare_price!) * 100)
              : 0;

            const displayName = isRTL ? (product.name_ar ?? product.name) : product.name;
            const brandDisplay = isRTL
              ? (product.brand_name === "White Fox" ? "وايت فوكس · White Fox"
                : product.brand_name === "Siberia" ? "سيبيريا · Siberia"
                : "77")
              : product.brand_name;
            const strengthUnit = product.brand_slug === "77" ? "mg/pouch" : "mg/g";
            const strengthUnitAr = product.brand_slug === "77" ? "مجم/كيس" : "مجم/جم";

            return (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                whileHover={{ y: -4 }}
                className="group"
              >
                <Link href={`/products/${product.slug}`} className="block">
                  <div className="relative rounded-2xl border border-neutral-200 bg-white overflow-hidden hover:shadow-lg transition-all duration-300 h-full">
                    {/* Image */}
                    <div className="relative aspect-square overflow-hidden bg-neutral-100">
                      <img
                        src={product.image}
                        alt={displayName}
                        className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />

                      {/* Badges */}
                      <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                        {hasDiscount && (
                          <Badge className="bg-red-500 text-white border-0 text-[10px] font-bold px-2 py-0.5">
                            -{isRTL ? toArabicNumerals(discountPercent) : discountPercent}%
                          </Badge>
                        )}
                        <Badge className="bg-amber-500 text-white border-0 text-[10px] font-bold px-2 py-0.5">
                          {locale === "ar" ? "الأكثر طلباً" : "Best Seller"}
                        </Badge>
                      </div>

                      {/* Strength badge */}
                      <div className="absolute bottom-3 right-3">
                        <Badge
                          variant="outline"
                          className={`${getStrengthColor(product.strength)} text-[10px] font-bold px-2 py-0.5 backdrop-blur-sm`}
                        >
                          {isRTL
                            ? `${toArabicNumerals(product.strength)} ${strengthUnitAr}`
                            : `${product.strength} ${strengthUnit}`}
                        </Badge>
                      </div>
                    </div>

                    {/* Info */}
                    <div className="p-4">
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-0.5">
                        {brandDisplay}
                      </p>
                      <h3 className="text-sm font-semibold text-neutral-900 leading-tight line-clamp-2 group-hover:text-primary transition-colors font-arabic">
                        {displayName}
                      </h3>

                      {/* Rating */}
                      <div className="flex items-center gap-1 mt-1.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star key={star} className="h-3 w-3 fill-amber-400 text-amber-400" />
                        ))}
                        <span className="text-[10px] text-muted-foreground ml-1" dir="ltr">
                          ({toArabicNumerals(Math.floor(Math.random() * 50 + 20))})
                        </span>
                      </div>

                      {/* Price */}
                      <div className="flex items-end gap-2 mt-2">
                        <span className="text-base font-bold text-neutral-900">
                          {formatPrice(product.price, locale)}
                        </span>
                        {hasDiscount && (
                          <span className="text-xs text-muted-foreground line-through">
                            {formatPrice(product.compare_price!, locale)}
                          </span>
                        )}
                      </div>

                      {/* Quick add */}
                      <Button
                        size="sm"
                        className="w-full gap-2 mt-3 text-xs font-semibold"
                        onClick={(e) => {
                          e.preventDefault();
                          handleAddToCart(product);
                        }}
                      >
                        <ShoppingCart className="h-3.5 w-3.5" />
                        {locale === "ar" ? "أضف إلى السلة" : "Add to Cart"}
                      </Button>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* Mobile view all */}
        <div className="mt-8 text-center sm:hidden">
          <Button
            variant="outline"
            className="gap-2"
            onClick={() => (window.location.href = "/products")}
          >
            {locale === "ar" ? "تصفّح كل المنتجات" : "View All Products"}
            <ArrowRight className={`h-4 w-4 ${isRTL ? "rotate-180" : ""}`} />
          </Button>
        </div>
      </div>
    </section>
  );
}
