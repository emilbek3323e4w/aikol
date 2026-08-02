import { useTranslations } from "next-intl";
import { NewsCard } from "@/entities/news";
import type { News } from "@/entities/news";

export function NewsListPage({ news }: { news: News[] }) {
  const t = useTranslations("newsPage");

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <h1 className="mb-8 text-center font-heading text-4xl text-gold">
        {t("title")}
      </h1>

      {news.length === 0 ? (
        <p className="py-12 text-center text-text-muted">{t("empty")}</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {news.map((item) => (
            <NewsCard key={item.id} news={item} />
          ))}
        </div>
      )}
    </div>
  );
}
