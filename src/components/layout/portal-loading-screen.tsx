"use client";

import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { useI18n } from "@/lib/i18n";

export function PortalLoadingScreen() {
  const { t } = useI18n();

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center gap-4"
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-600">
          <span className="text-white font-bold text-2xl">S</span>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground text-sm">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>{t("loading.verifying")}</span>
        </div>
      </motion.div>
    </div>
  );
}