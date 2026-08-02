import type { Metadata } from "next";
import { getMenuCategories } from "@/entities/menu-item";
import { MenuPage } from "@/views/menu";
import { buildMetadata } from "@/shared/lib/seo";

export const revalidate = 3600;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return buildMetadata({
    locale,
    path: "/menu",
    title: locale === "kg" ? "Меню" : "Меню",
    description:
      locale === "kg"
        ? "«Айкөл» ресторонунун менюсу"
        : "Меню ресторана «Айкөл» — национальная и европейская кухня",
  });
}

export default async function Menu() {
  const categories = await getMenuCategories().catch(() => []);
  return <MenuPage categories={categories} />;
}
