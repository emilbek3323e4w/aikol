import { unstable_cache, revalidateTag } from "next/cache";
import { prisma } from "@/shared/lib/prisma";
import type { News } from "../model/types";

function serialize(news: {
  id: string;
  title: string;
  titleKg: string;
  body: string;
  bodyKg: string;
  image: string | null;
  isPublished: boolean;
  publishedAt: Date;
  updatedAt: Date;
}): News {
  return {
    id: news.id,
    title: news.title,
    titleKg: news.titleKg,
    body: news.body,
    bodyKg: news.bodyKg,
    image: news.image,
    isPublished: news.isPublished,
    publishedAt: news.publishedAt.toISOString(),
    updatedAt: news.updatedAt.toISOString(),
  };
}

async function fetchPublishedNews(): Promise<News[]> {
  const news = await prisma.news.findMany({
    where: { isPublished: true },
    orderBy: { publishedAt: "desc" },
  });
  return news.map(serialize);
}

export const getPublishedNews = unstable_cache(
  fetchPublishedNews,
  ["published-news"],
  { tags: ["news"], revalidate: 3600 },
);

async function fetchNewsById(id: string): Promise<News | null> {
  const news = await prisma.news.findUnique({ where: { id } });
  if (!news || !news.isPublished) return null;
  return serialize(news);
}

export const getNewsById = unstable_cache(fetchNewsById, ["news-by-id"], {
  tags: ["news"],
  revalidate: 3600,
});

export async function getAllNews(): Promise<News[]> {
  const news = await prisma.news.findMany({ orderBy: { publishedAt: "desc" } });
  return news.map(serialize);
}

interface NewsInput {
  title: string;
  titleKg: string;
  body: string;
  bodyKg: string;
  image?: string;
  isPublished?: boolean;
}

export async function createNews(input: NewsInput): Promise<News> {
  const news = await prisma.news.create({ data: input });
  revalidateTag("news", "max");
  return serialize(news);
}

export async function updateNews(
  id: string,
  input: Partial<NewsInput>,
): Promise<News> {
  const news = await prisma.news.update({ where: { id }, data: input });
  revalidateTag("news", "max");
  return serialize(news);
}

export async function deleteNews(id: string): Promise<void> {
  await prisma.news.delete({ where: { id } });
  revalidateTag("news", "max");
}
