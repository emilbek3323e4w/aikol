import { useLocale, useTranslations } from "next-intl";
import { Button } from "@/shared/ui/Button";
import type { SettingsMap } from "@/entities/settings/model/keys";

interface ContactsPageProps {
  settings: SettingsMap;
}

export function ContactsPage({ settings }: ContactsPageProps) {
  const t = useTranslations("contacts");
  const locale = useLocale();
  const address = locale === "kg" ? settings.address_kg : settings.address_ru;
  const phones = [settings.phone_primary, settings.phone_secondary].filter(Boolean);

  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
      <h1 className="mb-10 text-center font-heading text-4xl text-gold">
        {t("title")}
      </h1>

      <div className="grid gap-8 sm:grid-cols-2">
        <div>
          <h2 className="mb-2 text-sm uppercase tracking-wide text-text-muted">
            {t("phonesTitle")}
          </h2>
          <div className="flex flex-col gap-1">
            {phones.map((phone) => (
              <a
                key={phone}
                href={`tel:${phone}`}
                className="text-lg text-text hover:text-gold"
              >
                {phone}
              </a>
            ))}
          </div>
          <a
            href={`https://wa.me/${settings.whatsapp_number}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-block"
          >
            <Button>WhatsApp</Button>
          </a>
        </div>

        <div>
          <h2 className="mb-2 text-sm uppercase tracking-wide text-text-muted">
            {t("addressTitle")}
          </h2>
          <p className="text-lg text-text">{address}</p>

          <h2 className="mb-2 mt-6 text-sm uppercase tracking-wide text-text-muted">
            {t("hoursTitle")}
          </h2>
          <p className="text-lg text-text">{settings.work_hours}</p>

          <a
            href={settings.instagram_url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-block text-gold hover:underline"
          >
            Instagram
          </a>
        </div>
      </div>

      <div className="mt-12 overflow-hidden rounded-xl bg-bg-secondary">
        {settings.map_url ? (
          <iframe
            src={settings.map_url}
            className="h-96 w-full border-0"
            loading="lazy"
            title="Карта"
          />
        ) : (
          <div className="flex h-64 items-center justify-center text-sm text-text-muted">
            {t("mapPlaceholder")}
          </div>
        )}
      </div>
    </div>
  );
}
