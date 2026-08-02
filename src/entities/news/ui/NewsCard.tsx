import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/shared/i18n/navigation";
import { Card } from "@/shared/ui/Card";
import { formatDate } from "@/shared/lib/date";
import type { News } from "../model/types";

export function NewsCard({ news }: { news: News }) {
  const locale = useLocale();
  const t = useTranslations("newsPage");
  const title = locale === "kg" ? news.titleKg : news.title;
  const body = locale === "kg" ? news.bodyKg : news.body;

  return (
    <Link href={`/news/${news.id}`}>
      <Card>
        <div className="relative aspect-4/3 bg-surface-muted">
          {news.image && (
            <Image
              src={news.image}
              alt={title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 400px"
            />
          )}
        </div>
        <div className="flex flex-col gap-2 p-4">
          <span className="text-xs text-text-muted">
            {formatDate(news.publishedAt, locale)}
          </span>
          <h3 className="font-heading text-lg text-text">{title}</h3>
          <p className="line-clamp-2 text-sm text-text-muted">{body}</p>
          <span className="text-sm text-gold">{t("readMore")} →</span>
        </div>
      </Card>
    </Link>
  );
}
