import type { Metadata } from "next";
import { getPublishedNews } from "@/entities/news";
import { NewsListPage } from "@/views/news";
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
    path: "/news",
    title: locale === "kg" ? "Жаңылыктар" : "Новости",
    description:
      locale === "kg"
        ? "«Айкөл» ресторонунун жаңылыктары"
        : "Новости ресторана «Айкөл»",
  });
}

export default async function News() {
  const news = await getPublishedNews().catch(() => []);
  return <NewsListPage news={news} />;
}
