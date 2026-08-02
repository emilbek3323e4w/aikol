import type { Metadata } from "next";
import { ContactsPage } from "@/views/contacts";
import { getSettingsMap } from "@/entities/settings";
import { buildMetadata } from "@/shared/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return buildMetadata({
    locale,
    path: "/contacts",
    title: locale === "kg" ? "Байланыш" : "Контакты",
    description:
      locale === "kg"
        ? "«Айкөл» ресторонунун байланыш маалыматы"
        : "Контакты и адрес ресторана «Айкөл» в Бишкеке",
  });
}

export default async function Contacts() {
  const settings = await getSettingsMap();
  return <ContactsPage settings={settings} />;
}
