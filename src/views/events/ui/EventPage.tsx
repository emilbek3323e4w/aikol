import { useTranslations } from "next-intl";
import { Button } from "@/shared/ui/Button";
import type { EventTypeSlug } from "@/shared/config/constants";
import { EVENT_TYPES } from "@/shared/config/constants";
import { getWhatsappHref } from "@/shared/lib/contact";

interface EventPageProps {
  slug: EventTypeSlug;
  whatsappNumber: string;
}

export function EventPage({ slug, whatsappNumber }: EventPageProps) {
  const t = useTranslations("eventPages");
  const tEvents = useTranslations("eventTypes");
  const event = EVENT_TYPES.find((e) => e.slug === slug)!;
  const whatsappHref = getWhatsappHref(
    `Здравствуйте! Интересует мероприятие «${tEvents(event.enumValue)}» в «Айкөл».`,
    whatsappNumber,
  );

  return (
    <>
      <section className="relative flex min-h-[50vh] items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_50%_20%,#2a2a2a,#1a1a1a_70%)] px-4 text-center">
        <div className="absolute inset-0 bg-black/40" aria-hidden />
        <div className="relative z-10 flex flex-col items-center gap-4">
          <span className="text-5xl">{event.icon}</span>
          <h1 className="font-heading text-4xl text-gold sm:text-5xl">
            {tEvents(event.enumValue)}
          </h1>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6">
        <p className="text-lg text-text-muted">
          {t(`descriptions.${event.enumValue}`)}
        </p>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
        <h2 className="mb-6 text-center font-heading text-2xl text-gold">
          {t("galleryTitle")}
        </h2>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="flex aspect-4/3 items-center justify-center rounded-xl bg-bg-secondary text-sm text-text-muted"
            >
              {t("galleryEmpty")}
            </div>
          ))}
        </div>
      </section>

      <section className="bg-bg-secondary py-16">
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-6 px-4 text-center sm:px-6">
          <a href={whatsappHref} target="_blank" rel="noopener noreferrer">
            <Button>{t("cta")}</Button>
          </a>
        </div>
      </section>
    </>
  );
}
