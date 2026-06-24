"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";

const STORAGE_KEY = "snusii-age-verified-v1";

export function AgeGate() {
  const { t, isRTL } = useI18n();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    try {
      const verified = localStorage.getItem(STORAGE_KEY);
      if (!verified) {
        setOpen(true);
      }
    } catch {
      // localStorage not available — skip
    }
  }, []);

  const confirm = () => {
    try {
      localStorage.setItem(STORAGE_KEY, "1");
    } catch {
      // ignore
    }
    setOpen(false);
  };

  const reject = () => {
    // Redirect away from the site
    window.location.href = "https://www.google.com";
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          dir={isRTL ? "rtl" : "ltr"}
        >
          <motion.div
            initial={{ scale: 0.92, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.92, y: 20 }}
            transition={{ duration: 0.25, ease: [0.25, 0.4, 0.25, 1] }}
            className="relative w-full max-w-md overflow-hidden rounded-2xl bg-background border border-border shadow-2xl"
          >
            {/* Header band */}
            <div className="bg-gradient-to-br from-red-600 via-red-700 to-red-800 p-6 text-white text-center">
              <div className="mx-auto mb-3 h-14 w-14 rounded-full bg-white/15 flex items-center justify-center ring-4 ring-white/10">
                <AlertTriangle className="h-7 w-7" />
              </div>
              <h2 className="text-xl font-bold tracking-tight">
                {isRTL ? "تحذير: محتوى للبالغين فقط" : "Adults Only — Age Verification"}
              </h2>
              <p className="text-xs text-white/80 mt-1">{t("b2b.ageGate")}</p>
            </div>

            {/* Body */}
            <div className="p-6 space-y-4">
              <p className="text-sm text-muted-foreground leading-relaxed">
                {isRTL
                  ? "هذا الموقع يبيع منتجات تحتوي على النيكوتين. النيكوتين مادة تسبب الإدمان. الدخول مخصص فقط للأشخاص البالغين (21 عاماً أو أكثر). بالدخول فإنك تؤكد أنك بلغت السن القانونية."
                  : "This website sells products containing nicotine. Nicotine is an addictive chemical. Access is restricted to adults aged 21 or older. By entering, you confirm that you are of legal age."}
              </p>

              <div className="rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 p-3 flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-red-700 dark:text-red-400 leading-relaxed">
                  {t("b2b.healthWarning")}
                </p>
              </div>

              {/* Actions */}
              <div className="grid grid-cols-1 gap-2">
                <Button
                  size="lg"
                  onClick={confirm}
                  className="gap-2 h-12 font-semibold bg-emerald-600 hover:bg-emerald-700"
                >
                  <ShieldCheck className="h-5 w-5" />
                  {isRTL ? "أنا بالغ (21+) — ادخل الموقع" : "I am 21+ — Enter Site"}
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={reject}
                  className="text-xs text-muted-foreground"
                >
                  {isRTL ? "أنا تحت 21 — اخرج" : "I am under 21 — Leave"}
                </Button>
              </div>

              <p className="text-[10px] text-muted-foreground/80 text-center">
                {isRTL
                  ? "© 2026 Snusii — جميع الحقوق محفوظة. مصر."
                  : "© 2026 Snusii — All rights reserved. Egypt."}
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
