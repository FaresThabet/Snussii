"use client";

import { Minus, Plus, Trash2, Truck, Gift } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useCartStore } from "@/stores/cart-store";
import { useCheckoutStore } from "@/stores/checkout-store";
import { formatPrice, getRemainingForFreeShipping } from "@/lib/shipping";

export function OrderSummary() {
  const { items, removeItem, updateQuantity, subtotal } = useCartStore();
  const {
    getShippingCost,
    getShippingZone,
    getShippingDays,
    getTotal,
  } = useCheckoutStore();

  const shipping = getShippingCost();
  const total = getTotal();
  const remaining = getRemainingForFreeShipping();

  return (
    <div className="space-y-4">
      <h3 className="text-base font-semibold">Order Summary</h3>

      {/* Free shipping progress */}
      {remaining > 0 && (
        <div className="rounded-lg bg-amber-50 border border-amber-200 p-3 space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <Gift className="h-4 w-4 text-amber-600" />
            <span className="font-medium text-amber-800">
              Add {formatPrice(remaining)} more for FREE shipping!
            </span>
          </div>
          <div className="h-2 rounded-full bg-amber-200 overflow-hidden">
            <div
              className="h-full rounded-full bg-amber-500 transition-all duration-500"
              style={{
                width: `${Math.min(100, (subtotal / 1000) * 100)}%`,
              }}
            />
          </div>
        </div>
      )}

      {/* Cart items */}
      <ScrollArea className="max-h-64">
        <div className="space-y-3">
          {items.map((item) => (
            <div key={item.product.id} className="flex gap-3">
              <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-lg bg-muted">
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  className="h-full w-full object-cover"
                />
                <Badge
                  variant="secondary"
                  className="absolute -top-1 -right-1 h-5 min-w-5 p-0 flex items-center justify-center text-[10px]"
                >
                  {item.quantity}
                </Badge>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{item.product.name}</p>
                <p className="text-xs text-muted-foreground">
                  {item.product.brand_name} &middot; {item.product.strength} mg/g
                </p>
              </div>
              <div className="flex flex-col items-end justify-between">
                <span className="text-sm font-semibold">
                  {formatPrice(item.product.price * item.quantity)}
                </span>
                <div className="flex items-center gap-0.5">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                  >
                    {item.quantity <= 1 ? (
                      <Trash2 className="h-3 w-3 text-destructive" />
                    ) : (
                      <Minus className="h-3 w-3" />
                    )}
                  </Button>
                  <span className="w-5 text-center text-xs">{item.quantity}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      <Separator />

      {/* Pricing breakdown */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Subtotal</span>
          <span className="font-medium">{formatPrice(subtotal())}</span>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground flex items-center gap-1.5">
            <Truck className="h-3.5 w-3.5" />
            Shipping
          </span>
          <span className="font-medium">
            {shipping === 0 ? (
              <Badge variant="secondary" className="text-xs bg-emerald-100 text-emerald-700">
                FREE
              </Badge>
            ) : (
              formatPrice(shipping)
            )}
          </span>
        </div>
        {getShippingZone() && (
          <p className="text-xs text-muted-foreground">
            {getShippingZone()} &middot; Estimated {getShippingDays()} business day{getShippingDays() > 1 ? "s" : ""}
          </p>
        )}

        <Separator />

        <div className="flex justify-between items-center">
          <span className="text-base font-semibold">Total</span>
          <span className="text-xl font-bold">{formatPrice(total)}</span>
        </div>
      </div>
    </div>
  );
}
