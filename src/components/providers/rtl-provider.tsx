"use client";

import { useI18n, useRTLEffect } from "@/lib/i18n";

export function RTLProvider({ children }: { children: React.ReactNode }) {
  useRTLEffect();
  return <>{children}</>;
}
