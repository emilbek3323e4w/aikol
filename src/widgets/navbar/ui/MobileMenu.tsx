"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/shared/i18n/navigation";
import { Button } from "@/shared/ui/Button";
import { getWhatsappHref } from "@/shared/lib/contact";

interface NavLink {
  href: string;
  labelKey:
    | "home"
    | "menu"
    | "packages"
    | "gallery"
    | "news"
    | "reviews"
    | "contacts";
}

const NAV_LINKS: NavLink[] = [
  { href: "/", labelKey: "home" },
  { href: "/menu", labelKey: "menu" },
  { href: "/packages", labelKey: "packages" },
  { href: "/gallery", labelKey: "gallery" },
  { href: "/news", labelKey: "news" },
  { href: "/reviews", labelKey: "reviews" },
  { href: "/contacts", labelKey: "contacts" },
];

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
  locale: string;
  whatsappNumber: string;
}

export function MobileMenu({
  open,
  onClose,
  locale,
  whatsappNumber,
}: MobileMenuProps) {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const whatsappHref = getWhatsappHref(
    "Здравствуйте! Хочу узнать про зал в «Айкөл».",
    whatsappNumber,
  );

  return (
    <div
      className={`fixed inset-0 z-50 md:hidden ${open ? "" : "pointer-events-none"}`}
      aria-hidden={!open}
    >
      <div
        className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity ${
          open ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
      />
      <nav
        className={`absolute right-0 top-0 flex h-full w-72 flex-col gap-1 bg-bg-secondary p-6 shadow-xl transition-transform ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Закрыть меню"
          className="mb-6 flex h-11 w-11 items-center justify-center self-end rounded-lg text-gold hover:bg-hover"
        >
          ✕
        </button>

        {NAV_LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            onClick={onClose}
            className="min-h-11 rounded-lg px-3 py-3 text-text hover:bg-hover"
          >
            {t(link.labelKey)}
          </Link>
        ))}

        <div className="mt-4 flex gap-2 px-3">
          <Link
            href={pathname}
            locale="ru"
            className={`min-h-11 flex items-center rounded-lg px-3 text-sm ${
              locale === "ru" ? "text-gold" : "text-text-muted"
            }`}
          >
            RU
          </Link>
          <Link
            href={pathname}
            locale="kg"
            className={`min-h-11 flex items-center rounded-lg px-3 text-sm ${
              locale === "kg" ? "text-gold" : "text-text-muted"
            }`}
          >
            КЫР
          </Link>
        </div>

        <a
          href={whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          onClick={onClose}
          className="mt-4"
        >
          <Button className="w-full">{t("contactCta")}</Button>
        </a>
      </nav>
    </div>
  );
}
