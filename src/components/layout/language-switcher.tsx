"use client";

import { useTransition, useEffect } from "react";
import { Languages } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";

export function LanguageSwitcher() {
  const { locale, setLocale, isRTL } = useI18n();
  const [isPending, startTransition] = useTransition();

  const toggle = () => {
    const next = locale === "en" ? "ar" : "en";
    startTransition(() => {
      setLocale(next);
    });
  };

  // Ensure DOM is in sync on mount (handles SSR hydration mismatch)
  useEffect(() => {
    const html = document.documentElement;
    const expectedDir = locale === "ar" ? "rtl" : "ltr";
    if (html.getAttribute("dir") !== expectedDir) {
      html.setAttribute("dir", expectedDir);
      html.setAttribute("lang", locale);
    }
  }, [locale]);

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggle}
      disabled={isPending}
      className="gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50"
    >
      <Languages className="h-4 w-4" />
      <span>{locale === "en" ? "العربية" : "English"}</span>
      {isRTL && (
        <span className="hidden sm:inline text-[10px] px-1 py-0.5 rounded bg-emerald-100 text-emerald-700 font-semibold">
          RTL
        </span>
      )}
    </Button>
  );
}
