import { useTranslations } from "next-intl";
import { Link } from "@/shared/i18n/navigation";
import type { SettingsMap } from "@/entities/settings/model/keys";

interface FooterProps {
  settings: SettingsMap;
}

export function Footer({ settings }: FooterProps) {
  const t = useTranslations("nav");
  const tFooter = useTranslations("footer");
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-line bg-bg-secondary">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-3">
        <div>
          <span className="font-heading text-xl text-gold">Айкөл</span>
          <p className="mt-2 text-sm text-text-muted">
            {tFooter("tagline")}
          </p>
          <a
            href={settings.instagram_url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-block text-sm text-gold hover:underline"
          >
            Instagram
          </a>
        </div>

        <nav className="flex flex-col gap-2 text-sm">
          <Link href="/menu" className="text-text-muted hover:text-gold">
            {t("menu")}
          </Link>
          <Link href="/gallery" className="text-text-muted hover:text-gold">
            {t("gallery")}
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
