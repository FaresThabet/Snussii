"use client";

import { motion } from "framer-motion";
import {
  Banknote,
  CreditCard,
  Receipt,
  Smartphone,
  Zap,
  CheckCircle2,
} from "lucide-react";
import { useCheckoutStore } from "@/stores/checkout-store";
import { PaymentMethod, PAYMENT_OPTIONS } from "@/types/checkout";

function getPaymentIcon(name: string) {
  switch (name) {
    case "Banknote":
      return <Banknote className="h-5 w-5" />;
    case "CreditCard":
      return <CreditCard className="h-5 w-5" />;
    case "Receipt":
      return <Receipt className="h-5 w-5" />;
    case "Smartphone":
      return <Smartphone className="h-5 w-5" />;
    case "Zap":
      return <Zap className="h-5 w-5" />;
    default:
      return <CreditCard className="h-5 w-5" />;
  }
}

export function PaymentMethods() {
  const { form, setPaymentMethod } = useCheckoutStore();

  return (
    <div className="space-y-3">
      <h3 className="text-base font-semibold">Payment Method</h3>

      <div className="grid gap-2">
        {PAYMENT_OPTIONS.map((option) => {
          const isSelected = form.paymentMethod === option.value;
          return (
            <motion.button
              key={option.value}
              type="button"
              whileHover={{ scale: 1.005 }}
              whileTap={{ scale: 0.995 }}
              onClick={() => setPaymentMethod(option.value as PaymentMethod)}
              className={`flex items-start gap-3 rounded-xl border-2 p-4 text-left transition-all ${
                isSelected
                  ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                  : "border-border hover:border-primary/30 hover:bg-muted/50"
              }`}
            >
              {/* Icon */}
              <div
                className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg transition-colors ${
                  isSelected
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {getPaymentIcon(option.icon)}
              </div>

              {/* Label + description */}
              <div className="flex-1 min-w-0">
                <span className="block text-sm font-semibold">
                  {option.label}
                </span>
                <span className="block text-xs text-muted-foreground mt-0.5">
                  {option.description}
                </span>
              </div>

              {/* Selected indicator */}
              {isSelected && (
                <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-1" />
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
