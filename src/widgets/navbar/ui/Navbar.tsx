"use client";

import { useState } from "react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname } from "@/shared/i18n/navigation";
import { MobileMenu } from "./MobileMenu";

const NAV_LINKS = [
  { href: "/", labelKey: "home" as const },
  { href: "/menu", labelKey: "menu" as const },
  { href: "/packages", labelKey: "packages" as const },
  { href: "/gallery", labelKey: "gallery" as const },
  { href: "/news", labelKey: "news" as const },
  { href: "/reviews", labelKey: "reviews" as const },
  { href: "/contacts", labelKey: "contacts" as const },
];

interface NavbarProps {
  whatsappNumber: string;
}

export function Navbar({ whatsappNumber }: NavbarProps) {
  const t = useTranslations("nav");
  const locale = useLocale();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-30 border-b border-line bg-bg/95 backdrop-blur-md">
      <div className="mx-auto flex h-20 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="relative h-16 w-40 shrink-0">
          <Image
            src="/images/aikollogo.png"
            alt="Айкөл"
            fill
            className="object-contain object-left"
            priority
          />
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-text hover:text-gold"
            >
              {t(link.labelKey)}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-1 text-sm md:flex">
          <Link
            href={pathname}
            locale="ru"
            className={locale === "ru" ? "text-gold" : "text-text-muted"}
          >
            RU
          </Link>
          <span className="text-text-muted">/</span>
          <Link
            href={pathname}
            locale="kg"
            className={locale === "kg" ? "text-gold" : "text-text-muted"}
          >
            КЫР
          </Link>
        </div>

        <button
          type="button"
          aria-label="Открыть меню"
          onClick={() => setMobileOpen(true)}
          className="flex h-11 w-11 items-center justify-center text-gold md:hidden"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-6 w-6">
            <path strokeLinecap="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      <MobileMenu
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        locale={locale}
        whatsappNumber={whatsappNumber}
      />
    </header>
  );
}
