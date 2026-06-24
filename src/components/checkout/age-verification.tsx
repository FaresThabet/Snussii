"use client";

import { ShieldAlert, ShieldCheck } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { useCheckoutStore } from "@/stores/checkout-store";

export function AgeVerification() {
  const { form, toggleAgeVerified } = useCheckoutStore();

  return (
    <div
      className={`rounded-xl border-2 p-4 transition-all ${
        form.ageVerified
          ? "border-emerald-500/30 bg-emerald-500/5"
          : "border-amber-500/30 bg-amber-500/5"
      }`}
    >
      <div className="flex items-start gap-3">
        {form.ageVerified ? (
          <ShieldCheck className="h-6 w-6 text-emerald-500 flex-shrink-0 mt-0.5" />
        ) : (
          <ShieldAlert className="h-6 w-6 text-amber-500 flex-shrink-0 mt-0.5" />
        )}

        <div className="flex-1 space-y-2">
          <label
            htmlFor="age-verify"
            className="flex items-start gap-3 cursor-pointer"
          >
            <Checkbox
              id="age-verify"
              checked={form.ageVerified}
              onCheckedChange={toggleAgeVerified}
              className="mt-0.5"
            />
            <span className="text-sm font-medium leading-snug">
              I confirm I am <strong>21+ years old</strong> and understand this
              product contains nicotine. I agree to age verification at delivery.
            </span>
          </label>
          <p className="text-xs text-muted-foreground pl-7">
            By proceeding, you acknowledge that nicotine is an addictive
            substance. Sale to minors is strictly prohibited by Egyptian law.
          </p>
        </div>
      </div>
    </div>
  );
}
