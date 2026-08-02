import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getNewsById } from "@/entities/news";
import { NewsDetailPage } from "@/views/news";
import { buildMetadata } from "@/shared/lib/seo";

export const revalidate = 3600;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}): Promise<Metadata> {
  const { locale, id } = await params;
  const news = await getNewsById(id).catch(() => null);
  if (!news) return {};

  const title = locale === "kg" ? news.titleKg : news.title;
  const body = locale === "kg" ? news.bodyKg : news.body;

  return buildMetadata({
    locale,
    path: `/news/${id}`,
    title,
    description: body.slice(0, 160),
    image: news.image ?? undefined,
  });
}

export default async function NewsDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const news = await getNewsById(id).catch(() => null);
  if (!news) notFound();
  return <NewsDetailPage news={news} />;
}
