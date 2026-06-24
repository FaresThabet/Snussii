"use client";

import { ShoppingCart, MessageCircle } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Product } from "@/types";
import { useCartStore } from "@/stores/cart-store";
import { useI18n } from "@/lib/i18n";
import { whatsappOrderLink } from "@/lib/contact";
import { formatPrice, formatStrength, toArabicNumerals } from "@/lib/format";
import { toast } from "sonner";
import Link from "next/link";

function getStrengthColor(strength: number): string {
  if (strength >= 30) return "bg-red-500/10 text-red-600 border-red-500/20";
  if (strength >= 20) return "bg-orange-500/10 text-orange-600 border-orange-500/20";
  if (strength >= 12) return "bg-amber-500/10 text-amber-600 border-amber-500/20";
  return "bg-green-500/10 text-green-600 border-green-500/20";
}

/** Derive format (Slim / Mini / Regular / Ultra-Slim) from product name. */
function getFormat(name: string): { en: string; ar: string } {
  const n = name.toLowerCase();
  if (n.includes("ultra slim")) return { en: "Ultra-Slim", ar: "الترا سليم" };
  if (n.includes("mini")) return { en: "Mini", ar: "ميني" };
  if (n.includes("slim")) return { en: "Slim", ar: "سليم" };
  if (n.includes("regular")) return { en: "Regular", ar: "ريجولار" };
  return { en: "Slim", ar: "سليم" };
}

interface ProductCardProps {
  product: Product;
  index?: number;
}

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  const { addItem, openCart } = useCartStore();
  const { t, isRTL, locale } = useI18n();

  const handleAddToCart = () => {
    addItem(product);
    openCart();
    toast.success(
      locale === "ar"
        ? `تمت إضافة "${product.name_ar ?? product.name}" إلى السلة`
        : `${product.name} added to cart`
    );
  };

  const handleWhatsApp = () => {
    const productName = locale === "ar" && product.name_ar ? product.name_ar : product.name;
    window.open(whatsappOrderLink(productName, product.price), "_blank", "noopener,noreferrer");
  };

  const hasDiscount = product.compare_price && product.compare_price > product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.compare_price! - product.price) / product.compare_price!) * 100)
    : 0;

  const format = getFormat(product.name);
  const is77 = product.brand_slug === "77";
  const strengthUnit = is77 ? "mg/pouch" : "mg/g" as const;

  // Display name: show BOTH Arabic + English (Arabic first when RTL)
  const displayName = isRTL
    ? product.name_ar ?? product.name
    : product.name;
  const secondaryName = isRTL ? product.name : product.name_ar ?? product.name;

  const brandDisplayName = isRTL
    ? product.brand_name === "White Fox"
      ? "وايت فوكس"
      : product.brand_name === "Siberia"
      ? "سيبيريا"
      : "77"
    : product.brand_name;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.4,
        delay: index * 0.06,
        ease: [0.25, 0.4, 0.25, 1],
      }}
      whileHover={{ y: -6 }}
      className="group h-full"
    >
      <Card className="overflow-hidden border border-border/50 bg-card hover:border-primary/20 hover:shadow-lg transition-all duration-300 h-full flex flex-col">
        {/* Image section */}
        <div className="relative aspect-square overflow-hidden bg-muted">
          <Link href={`/products/${product.slug}`} className="block h-full w-full">
            <motion.img
              src={product.image}
              alt={displayName}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.4 }}
              loading="lazy"
            />
          </Link>

          {/* Overlay badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {hasDiscount && (
              <Badge className="bg-red-500 text-white border-0 text-[10px] font-bold px-2 py-0.5">
                -{isRTL ? toArabicNumerals(discountPercent) : discountPercent}%
              </Badge>
            )}
            {product.bestseller && (
              <Badge className="bg-amber-500 text-white border-0 text-[10px] font-bold px-2 py-0.5">
                {t("product.bestSeller")}
              </Badge>
            )}
          </div>

          {/* Strength + Format badges — bottom-right */}
          <div className="absolute bottom-3 right-3 flex flex-col gap-1 items-end">
            <Badge
              variant="outline"
              className={`${getStrengthColor(product.strength)} text-[10px] font-bold px-2 py-0.5 backdrop-blur-sm`}
            >
              {formatStrength(product.strength, strengthUnit, locale)}
            </Badge>
            <Badge variant="outline" className="bg-background/80 text-[10px] font-bold px-2 py-0.5 backdrop-blur-sm">
              {isRTL ? format.ar : format.en}
            </Badge>
          </div>

          {/* Quick add overlay */}
          <motion.div
            className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            initial={false}
          >
            <Button
              size="sm"
              className="w-full gap-2 bg-white text-foreground hover:bg-white/90 font-semibold text-xs"
              onClick={handleAddToCart}
            >
              <ShoppingCart className="h-3.5 w-3.5" />
              {t("product.addToCart")}
            </Button>
          </motion.div>
        </div>

        {/* Info section */}
        <CardContent className="p-4 flex-1 flex flex-col">
          {/* Brand (Arabic + English when RTL) */}
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
            {brandDisplayName}
            {isRTL && (
              <span className="text-[10px] text-muted-foreground/70 mr-1.5 normal-case">· {product.brand_name}</span>
            )}
          </p>

          {/* Product name — Arabic primary (RTL), English primary (LTR), secondary shown beneath */}
          <Link href={`/products/${product.slug}`} className="block">
            <h3 className="text-sm font-semibold leading-tight line-clamp-2 group-hover:text-primary transition-colors">
              {displayName}
            </h3>
            <p className="text-[11px] text-muted-foreground/80 mt-0.5 line-clamp-1" dir={isRTL ? "ltr" : "rtl"}>
              {secondaryName}
            </p>
          </Link>

          {/* Flavor + format */}
          <div className="flex flex-wrap gap-1.5 mt-2">
            <span className="text-[10px] font-medium bg-muted px-2 py-0.5 rounded">
              {isRTL ? (product.flavor_ar ?? product.flavor) : product.flavor}
            </span>
            <span className="text-[10px] font-medium bg-muted px-2 py-0.5 rounded">
              {isRTL ? format.ar : format.en}
            </span>
          </div>

          {/* Price */}
          <div className="flex items-end gap-2 mt-3">
            <span className="text-lg font-bold">{formatPrice(product.price, locale)}</span>
            {hasDiscount && (
              <span className="text-sm text-muted-foreground line-through">
                {formatPrice(product.compare_price!, locale)}
              </span>
            )}
          </div>

          {/* Stock status */}
          <div className="mt-1.5 flex items-center gap-1.5">
            {product.stock > 0 ? (
              <>
                <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" />
                <span className="text-[11px] text-emerald-600 font-medium">{t("product.inStock")}</span>
              </>
            ) : (
              <>
                <span className="inline-block h-2 w-2 rounded-full bg-red-500" />
                <span className="text-[11px] text-red-600 font-medium">{t("product.outOfStock")}</span>
              </>
            )}
          </div>

          {/* Actions */}
          <div className="mt-3 grid grid-cols-2 gap-2">
            <Button
              size="sm"
              variant="default"
              className="gap-1.5 text-xs h-9"
              onClick={handleAddToCart}
            >
              <ShoppingCart className="h-3.5 w-3.5" />
              {t("product.addToCart")}
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="gap-1.5 text-xs h-9 border-emerald-500 text-emerald-700 hover:bg-emerald-50"
              onClick={handleWhatsApp}
            >
              <MessageCircle className="h-3.5 w-3.5" />
              {t("product.orderNow")}
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
