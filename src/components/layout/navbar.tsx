"use client";

import { ShoppingCart, User, Menu, Building2, Briefcase, Phone, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { SearchBar } from "@/components/layout/search-bar";
import { LanguageSwitcher } from "@/components/layout/language-switcher";
import { CartDrawer } from "@/components/layout/cart-drawer";
import { useCartStore } from "@/stores/cart-store";
import { useI18n } from "@/lib/i18n";
import { CONTACT, telLink, whatsappLink } from "@/lib/contact";
import Link from "next/link";
import Image from "next/image";

// ─── Nav Links Config ──────────────────────────────────────────────────────

const navLinkKeys = [
  { key: "nav.allProducts", href: "/products" },
  { key: "nav.brands", href: "/brands" },
  { key: "nav.bestSellers", href: "/best-sellers" },
  { key: "nav.aboutUs", href: "/about" },
  { key: "nav.contact", href: "/contact" },
  { key: "nav.faq", href: "/faq" },
];

export function Navbar() {
  const { toggleCart, totalItems } = useCartStore();
  const { t } = useI18n();

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Left: Mobile menu + Logo */}
          <div className="flex items-center gap-3">
            {/* Mobile hamburger */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-72">
                <SheetHeader>
                  <SheetTitle className="flex items-center gap-2">
                    <Image src="/logo.jpg" alt="Snusii" width={32} height={32} className="rounded-lg object-cover" />
                    Snusii
                  </SheetTitle>
                </SheetHeader>
                <nav className="flex flex-col gap-2 mt-6">
                  {navLinkKeys.map((item) => (
                    <Link
                      key={item.key}
                      href={item.href}
                      className="rounded-md px-3 py-2.5 text-sm font-medium hover:bg-muted/50 transition-colors"
                    >
                      {t(item.key)}
                    </Link>
                  ))}
                  <div className="h-px bg-border my-2" />
                  <Link
                    href="/b2b"
                    className="rounded-md px-3 py-2.5 text-sm font-medium text-emerald-600 hover:bg-emerald-50 transition-colors inline-flex items-center gap-2"
                  >
                    <Building2 className="h-4 w-4" />
                    {t("nav.b2bPortal")}
                  </Link>
                  <Link
                    href="/corporate"
                    className="rounded-md px-3 py-2.5 text-sm font-medium text-indigo-600 hover:bg-indigo-50 transition-colors inline-flex items-center gap-2"
                  >
                    <Briefcase className="h-4 w-4" />
                    {t("nav.corporatePortal")}
                  </Link>
                  <div className="h-px bg-border my-2" />
                  <a
                    href={telLink()}
                    className="rounded-md px-3 py-2.5 text-sm font-medium hover:bg-muted/50 transition-colors inline-flex items-center gap-2"
                  >
                    <Phone className="h-4 w-4 text-emerald-600" />
                    {CONTACT.phoneDisplay}
                  </a>
                  <a
                    href={whatsappLink()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-md px-3 py-2.5 text-sm font-medium text-emerald-700 hover:bg-emerald-50 transition-colors inline-flex items-center gap-2"
                  >
                    <MessageCircle className="h-4 w-4" />
                    {t("b2b.whatsapp")}
                  </a>
                </nav>
              </SheetContent>
            </Sheet>

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <Image src="/logo.jpg" alt="Snusii" width={40} height={40} className="rounded-lg object-cover ring-1 ring-border" />
              <span className="text-xl font-bold tracking-tight hidden sm:inline-block">
                Snusii
              </span>
            </Link>
          </div>

          {/* Center: Desktop nav links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinkKeys.map((item) => (
              <Link
                key={item.key}
                href={item.href}
                className="rounded-md px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground hover:bg-muted/50"
              >
                {t(item.key)}
              </Link>
            ))}
            <div className="w-px h-5 bg-border mx-1" />
            <Link
              href="/b2b"
              className="inline-flex items-center gap-1.5 rounded-full bg-emerald-600 px-3 py-1 text-xs font-semibold text-white hover:bg-emerald-700 transition-colors"
            >
              <Building2 className="h-3.5 w-3.5" />
              B2B
            </Link>
            <Link
              href="/terms"
              className="inline-flex items-center gap-1.5 rounded-full bg-muted px-3 py-1 text-xs font-semibold text-foreground hover:bg-muted/80 transition-colors"
            >
              {t("nav.terms")}
            </Link>
          </nav>

          {/* Right: Search + Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Search (desktop) */}
            <div className="hidden md:block">
              <SearchBar />
            </div>

            {/* Language switcher */}
            <LanguageSwitcher />

            {/* WhatsApp quick */}
            <a
              href={whatsappLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex h-9 w-9 items-center justify-center rounded-md text-emerald-600 hover:bg-emerald-50 transition-colors"
              aria-label={t("b2b.whatsapp")}
            >
              <MessageCircle className="h-5 w-5" />
            </a>

            {/* Phone quick */}
            <a
              href={telLink()}
              className="hidden sm:inline-flex h-9 w-9 items-center justify-center rounded-md text-foreground hover:bg-muted transition-colors"
              aria-label={t("nav.call")}
            >
              <Phone className="h-5 w-5" />
            </a>

            {/* Cart */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleCart}
              className="relative"
              aria-label={t("nav.cart")}
            >
              <ShoppingCart className="h-5 w-5" />
              {totalItems() > 0 && (
                <Badge className="absolute -right-1 -top-1 h-5 min-w-5 rounded-full p-0 flex items-center justify-center text-[10px] font-bold">
                  {totalItems()}
                </Badge>
              )}
            </Button>

            {/* User Account */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="User account">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-muted text-xs font-semibold">
                      <User className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem asChild>
                  <Link href="/sign-in">{t("nav.signIn")}</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/create-account">{t("nav.createAccount")}</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/faq">{t("nav.faq")}</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/terms">{t("nav.terms")}</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Mobile search bar */}
        <div className="md:hidden px-4 pb-3">
          <SearchBar />
        </div>
      </header>

      {/* Cart drawer (rendered at layout level) */}
      <CartDrawer />
    </>
  );
}
