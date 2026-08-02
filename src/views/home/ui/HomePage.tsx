import { useLocale, useTranslations } from "next-intl";
import { Hero } from "@/widgets/hero";
import { Link } from "@/shared/i18n/navigation";
import { Button } from "@/shared/ui/Button";
import { MenuCard } from "@/entities/menu-item";
import { ReviewCard } from "@/entities/review";
import type { Review } from "@/entities/review";
import type { SettingsMap } from "@/entities/settings/model/keys";
import { EVENT_TYPES } from "@/shared/config/constants";
import { getWhatsappHref } from "@/shared/lib/contact";
import { SEED_POPULAR_DISHES } from "../model/seed";

interface HomePageProps {
  reviews: Review[];
  settings: SettingsMap;
}

export function HomePage({ reviews, settings }: HomePageProps) {
  const t = useTranslations("home");
  const tEvents = useTranslations("eventTypes");
  const locale = useLocale();
  const whatsappHref = getWhatsappHref(
    "Здравствуйте! Хочу узнать про зал в «Айкөл».",
    settings.whatsapp_number,
  );
  const heroTitle = locale === "kg" ? settings.hero_title_kg : settings.hero_title_ru;
  const heroSubtitle =
    locale === "kg" ? settings.hero_subtitle_kg : settings.hero_subtitle_ru;

  return (
    <>
      <Hero
        title={heroTitle}
        subtitle={heroSubtitle}
        whatsappNumber={settings.whatsapp_number}
      />

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <h2 className="mb-8 text-center font-heading text-3xl text-gold">
          {t("eventsTitle")}
        </h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {EVENT_TYPES.map((event) => (
            <Link
              key={event.slug}
              href={`/events/${event.slug}`}
              className="flex flex-col items-center gap-3 rounded-xl bg-bg-secondary p-6 text-center transition-transform hover:-translate-y-1 hover:bg-hover"
            >
              <span className="text-4xl">{event.icon}</span>
              <span className="text-sm text-text">
                {tEvents(event.enumValue)}
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-bg-secondary py-16">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 sm:px-6 md:grid-cols-3">
          <div className="flex flex-col items-center gap-2 text-center">
            <span className="font-heading text-3xl text-gold">300</span>
            <span className="text-sm text-text-muted">{t("aboutGuests")}</span>
          </div>
          <div className="flex flex-col items-center gap-2 text-center">
            <span className="font-heading text-xl text-gold">
              {t("aboutCuisine")}
            </span>
          </div>
          <div className="flex flex-col items-center gap-2 text-center">
            <span className="font-heading text-xl text-gold">
              {t("aboutService")}
            </span>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="font-heading text-3xl text-gold">
            {t("popularDishesTitle")}
          </h2>
          <Link href="/menu" className="text-sm text-gold hover:underline">
            {t("popularDishesCta")} →
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {SEED_POPULAR_DISHES.map((item) => (
            <MenuCard key={item.id} item={item} locale={locale} />
          ))}
        </div>
      </section>

      <section className="bg-bg-secondary py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="font-heading text-3xl text-gold">
              {t("reviewsTitle")}
            </h2>
            <Link href="/reviews" className="text-sm text-gold hover:underline">
              {t("reviewsCta")} →
            </Link>
          </div>
          {reviews.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-3">
              {reviews.map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))}
            </div>
          ) : (
            <div className="px-6 py-12 text-center">
              <p className="text-text-muted">{t("reviewsEmpty")}</p>
            </div>
          )}
        </div>
      </section>

      <section className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-4 py-20 text-center sm:px-6">
        <h2 className="font-heading text-3xl text-gold">{t("ctaTitle")}</h2>
        <a href={whatsappHref} target="_blank" rel="noopener noreferrer">
          <Button>{t("ctaContact")}</Button>
        </a>
      </section>
    </>
  );
}
