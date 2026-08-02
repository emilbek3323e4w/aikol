import Image from "next/image";
import { useLocale } from "next-intl";
import { formatDate } from "@/shared/lib/date";
import type { News } from "@/entities/news";

export function NewsDetailPage({ news }: { news: News }) {
  const locale = useLocale();
  const title = locale === "kg" ? news.titleKg : news.title;
  const body = locale === "kg" ? news.bodyKg : news.body;

  return (
    <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      {news.image && (
        <div className="relative mb-8 aspect-video overflow-hidden rounded-xl bg-surface-muted">
          <Image src={news.image} alt={title} fill className="object-cover" />
        </div>
      )}
      <p className="mb-2 text-sm text-text-muted">
        {formatDate(news.publishedAt, locale)}
      </p>
      <h1 className="mb-6 font-heading text-3xl text-gold">{title}</h1>
      <p className="whitespace-pre-line text-text-muted">{body}</p>
    </article>
  );
}
