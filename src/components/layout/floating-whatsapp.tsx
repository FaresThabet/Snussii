"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { CONTACT, whatsappLink } from "@/lib/contact";

export function FloatingWhatsApp() {
  const { t, isRTL } = useI18n();
  const [visible, setVisible] = useState(false);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 200);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.6, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.6, y: 20 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className={`fixed bottom-5 z-50 ${isRTL ? "left-5" : "right-5"} flex items-end gap-2`}
          dir={isRTL ? "rtl" : "ltr"}
        >
          {/* Expanded card */}
          <AnimatePresence>
            {expanded && (
              <motion.div
                initial={{ opacity: 0, x: isRTL ? 20 : -20, scale: 0.9 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: isRTL ? 20 : -20, scale: 0.9 }}
                transition={{ duration: 0.2 }}
                className="mb-1 w-64 rounded-xl bg-background border border-border shadow-2xl overflow-hidden"
              >
                <div className="bg-emerald-600 text-white p-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center">
                      <MessageCircle className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold leading-tight">Snusii</p>
                      <p className="text-[10px] text-white/80 leading-tight">{t("b2b.whatsapp")}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setExpanded(false)}
                    className="text-white/80 hover:text-white"
                    aria-label="Close"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <div className="p-3 space-y-2">
                  <p className="text-xs text-muted-foreground">
                    {isRTL
                      ? "تواصل معنا عبر واتساب للاستفسار والطلب السريع."
                      : "Contact us on WhatsApp for fast ordering & inquiries."}
                  </p>
                  <p className="text-xs font-semibold" dir="ltr">
                    📞 {CONTACT.phoneDisplay}
                  </p>
                  <a
                    href={whatsappLink()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full text-center bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold py-2 rounded-lg transition-colors"
                  >
                    {t("b2b.whatsapp")} ↗
                  </a>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Main FAB */}
          <button
            onClick={() => setExpanded((v) => !v)}
            className="relative h-14 w-14 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-xl flex items-center justify-center transition-colors"
            aria-label={t("b2b.whatsapp")}
          >
            <span className="absolute inset-0 rounded-full bg-emerald-500 animate-ping opacity-30" />
            {expanded ? (
              <X className="h-6 w-6 relative" />
            ) : (
              <MessageCircle className="h-7 w-7 relative" />
            )}
            {/* Notification dot */}
            {!expanded && (
              <span className="absolute top-0 right-0 h-3 w-3 rounded-full bg-red-500 ring-2 ring-background" />
            )}
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
