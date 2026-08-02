import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { EventPage } from "@/views/events";
import { getSettingsMap } from "@/entities/settings";
import { EVENT_TYPES, type EventTypeSlug } from "@/shared/config/constants";
import { buildMetadata } from "@/shared/lib/seo";

export function generateStaticParams() {
  return EVENT_TYPES.map((event) => ({ type: event.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; type: string }>;
}): Promise<Metadata> {
  const { locale, type } = await params;
  const event = EVENT_TYPES.find((e) => e.slug === type);
  if (!event) return {};

  const t = await getTranslations({ locale, namespace: "eventTypes" });
  const tPages = await getTranslations({ locale, namespace: "eventPages" });

  return buildMetadata({
    locale,
    path: `/events/${type}`,
    title: t(event.enumValue),
    description: tPages(`descriptions.${event.enumValue}`),
  });
}

export default async function EventTypePage({
  params,
}: {
  params: Promise<{ type: string }>;
}) {
  const { type } = await params;
  const isValid = EVENT_TYPES.some((event) => event.slug === type);
  if (!isValid) {
    notFound();
  }

  const settings = await getSettingsMap();

  return (
    <EventPage
      slug={type as EventTypeSlug}
      whatsappNumber={settings.whatsapp_number}
    />
  );
}
