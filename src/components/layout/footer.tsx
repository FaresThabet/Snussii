"use client";

import Link from "next/link";
import Image from "next/image";
import { useI18n } from "@/lib/i18n";
import { Building2, Briefcase, Phone, MessageCircle, AlertTriangle, ShieldAlert } from "lucide-react";
import { CONTACT, telLink, whatsappLink } from "@/lib/contact";

const shopLinks = [
  { key: "footer.allProducts", href: "/products" },
  { key: "footer.whiteFox", href: "/brands/white-fox" },
  { key: "footer.siberia", href: "/brands/siberia" },
  { key: "footer.seventySeven", href: "/brands/77" },
  { key: "footer.bestSellers", href: "/best-sellers" },
];

const supportLinks = [
  { key: "footer.faq", href: "/faq" },
  { key: "footer.shipping", href: "/faq#shipping" },
  { key: "footer.returns", href: "/faq#returns" },
  { key: "footer.contact", href: "/contact" },
  { key: "footer.trackOrder", href: "/sign-in" },
];

const portalsLinks = [
  { key: "footer.b2bPortal", href: "/b2b", icon: Building2 },
  { key: "footer.corporatePortal", href: "/corporate", icon: Briefcase },
  { key: "footer.academy", href: "/academy", icon: null },
  { key: "footer.privacy", href: "/terms", icon: null },
  { key: "footer.terms", href: "/terms", icon: null },
];

export function Footer() {
  const { t } = useI18n();

  return (
    <footer className="border-t border-border/40 bg-muted/30 mt-auto">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <Image src="/logo.jpg" alt="Snusii" width={36} height={36} className="rounded-lg object-cover ring-1 ring-border" />
              <span className="font-bold text-lg">Snusii</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed mb-3">
              {t("footer.brand")}
            </p>
            {/* Contact quick block */}
            <div className="space-y-1.5 text-sm">
              <a href={telLink()} className="flex items-center gap-2 text-foreground hover:text-emerald-600 transition-colors">
                <Phone className="h-4 w-4 text-emerald-600" />
                <span dir="ltr">{CONTACT.phoneDisplay}</span>
              </a>
              <a
                href={whatsappLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-foreground hover:text-emerald-600 transition-colors"
              >
                <MessageCircle className="h-4 w-4 text-emerald-600" />
                {t("b2b.whatsapp")}
              </a>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="text-sm font-semibold mb-3">{t("footer.shop")}</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {shopLinks.map((item) => (
                <li key={item.key}>
                  <Link href={item.href} className="hover:text-foreground transition-colors">
                    {t(item.key)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-sm font-semibold mb-3">{t("footer.support")}</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {supportLinks.map((item) => (
                <li key={item.key}>
                  <Link href={item.href} className="hover:text-foreground transition-colors">
                    {t(item.key)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Portals */}
          <div>
            <h4 className="text-sm font-semibold mb-3">{t("footer.portals")}</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {portalsLinks.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.key}>
                    <Link
                      href={item.href}
                      className="hover:text-foreground transition-colors inline-flex items-center gap-2"
                    >
                      {Icon && <Icon className="h-4 w-4" />}
                      {t(item.key)}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        {/* B2B link + Health warning */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-3">
          <Link
            href="/b2b"
            className="flex items-start gap-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900 p-3 hover:border-emerald-400 transition-colors"
          >
            <ShieldAlert className="h-5 w-5 text-emerald-700 dark:text-emerald-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-emerald-800 dark:text-emerald-400 uppercase tracking-wide">
                {t("nav.b2bPortal")}
              </p>
              <p className="text-xs text-emerald-700 dark:text-emerald-500/80 mt-0.5">
                {t("b2b.disclaimer")}
              </p>
            </div>
          </Link>

          <div className="flex items-start gap-2.5 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 p-3">
            <AlertTriangle className="h-5 w-5 text-red-700 dark:text-red-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-red-800 dark:text-red-400 uppercase tracking-wide">
                {t("b2b.ageGate")}
              </p>
              <p className="text-xs text-red-700 dark:text-red-500/80 mt-0.5">
                {t("b2b.healthWarning")}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-border/40 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">{t("footer.rights")}</p>
          <div className="flex items-center gap-4">
            <span className="text-xs text-muted-foreground">
              {t("footer.acceptedPayments")}
            </span>
            <div className="flex gap-2 text-xs text-muted-foreground font-medium">
              {["COD", "Vodafone Cash", "InstaPay", "Bank Transfer"].map((m) => (
                <span key={m}>{m}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
