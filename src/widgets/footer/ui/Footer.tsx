import { useTranslations } from "next-intl";
import { Link } from "@/shared/i18n/navigation";
import type { SettingsMap } from "@/entities/settings/model/keys";
import { getWhatsappHref } from "@/shared/lib/contact";

interface FooterProps {
  settings: SettingsMap;
}

export function Footer({ settings }: FooterProps) {
  const t = useTranslations("nav");
  const tFooter = useTranslations("footer");
  const year = new Date().getFullYear();
  const whatsappHref = getWhatsappHref(
    "Здравствуйте! Хочу узнать про зал в «Айкөл».",
    settings.whatsapp_number,
  );

  return (
    <footer className="border-t border-line bg-bg-secondary">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 px-4 py-12 sm:px-6 md:grid-cols-3">
        <div>
          <span className="font-heading text-xl text-gold">Айкөл</span>
          <div className="mt-3 flex gap-2">
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
              className="flex h-11 w-11 items-center justify-center rounded-full bg-gold/10 text-gold transition-colors hover:bg-gold/20"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.9 9.9 0 0 0 4.74 1.21h.01c5.46 0 9.91-4.45 9.91-9.91C21.96 6.45 17.5 2 12.04 2Zm0 18.13a8.2 8.2 0 0 1-4.19-1.15l-.3-.18-3.11.82.83-3.03-.2-.31a8.17 8.17 0 0 1-1.26-4.37c0-4.52 3.68-8.2 8.23-8.2 4.52 0 8.2 3.68 8.2 8.2 0 4.53-3.68 8.22-8.2 8.22Zm4.5-6.15c-.25-.12-1.47-.72-1.7-.81-.23-.08-.39-.12-.56.13-.17.25-.64.81-.78.97-.14.17-.29.19-.53.06-.25-.12-1.05-.39-2-1.23-.74-.66-1.24-1.47-1.39-1.72-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.12-.14.16-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.35-.77-1.85-.2-.48-.41-.42-.56-.42h-.48c-.17 0-.43.06-.66.31s-.87.85-.87 2.08.89 2.41 1.02 2.58c.12.17 1.76 2.69 4.27 3.77.6.26 1.06.41 1.43.53.6.19 1.14.16 1.57.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.08.15-1.18-.06-.11-.23-.17-.48-.29Z" />
              </svg>
            </a>
            <a
              href={settings.instagram_url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="flex h-11 w-11 items-center justify-center rounded-full bg-gold/10 text-gold transition-colors hover:bg-gold/20"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5">
                <rect x="3" y="3" width="18" height="18" rx="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none" />
              </svg>
            </a>
          </div>
        </div>

        <nav className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
          <Link href="/menu" className="text-text-muted hover:text-gold">
            {t("menu")}
          </Link>
          <Link href="/packages" className="text-text-muted hover:text-gold">
            {t("packages")}
          </Link>
          <Link href="/gallery" className="text-text-muted hover:text-gold">
            {t("gallery")}
          </Link>
          <Link href="/news" className="text-text-muted hover:text-gold">
            {t("news")}
          </Link>
          <Link href="/reviews" className="text-text-muted hover:text-gold">
            {t("reviews")}
          </Link>
          <Link href="/contacts" className="text-text-muted hover:text-gold">
            {t("contacts")}
          </Link>
        </nav>

        <div className="flex flex-col gap-2 text-sm text-text-muted">
          <a href={`tel:${settings.phone_primary}`} className="hover:text-gold">
            {settings.phone_primary}
          </a>
          {settings.phone_secondary && (
            <a href={`tel:${settings.phone_secondary}`} className="hover:text-gold">
              {settings.phone_secondary}
            </a>
          )}
          <span>{settings.work_hours}</span>
        </div>
      </div>

      <div className="border-t border-line py-4 text-center text-xs text-text-muted">
        © {year} Айкөл. {tFooter("rights")}.
      </div>
    </footer>
  );
}
