"use client";

import { useEffect, useState } from "react";
import { Button } from "@/shared/ui/Button";
import { Badge } from "@/shared/ui/Badge";
import { Spinner } from "@/shared/ui/Spinner";
import { useToast } from "@/shared/ui/Toast";
import { NewsFormModal } from "@/features/manage-news";
import { formatDate } from "@/shared/lib/date";
import type { News } from "@/entities/news/model/types";

export function NewsManagementPage() {
  const { showToast } = useToast();
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editNews, setEditNews] = useState<News | null>(null);

  const load = async () => {
    setLoading(true);
    const res = await fetch("/api/news?all=true");
    const json = await res.json();
    if (json.success) setNews(json.data);
    setLoading(false);
  };

  useEffect(() => {
    void Promise.resolve().then(() => load());
  }, []);

  const handleTogglePublished = async (item: News) => {
    setNews((prev) =>
      prev.map((n) => (n.id === item.id ? { ...n, isPublished: !n.isPublished } : n)),
    );
    const res = await fetch(`/api/news/${item.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isPublished: !item.isPublished }),
    });
    if (!res.ok) {
      showToast("Не удалось изменить публикацию", "error");
      load();
    }
  };

  const handleDelete = async (item: News) => {
    if (!confirm(`Удалить новость «${item.title}»?`)) return;
    const res = await fetch(`/api/news/${item.id}`, { method: "DELETE" });
    if (res.ok) {
      showToast("Новость удалена", "success");
      load();
    } else {
      showToast("Не удалось удалить новость", "error");
    }
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-heading text-2xl text-gold">Новости</h1>
        <Button
          onClick={() => {
            setEditNews(null);
            setModalOpen(true);
          }}
        >
          + Новость
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Spinner />
        </div>
      ) : news.length === 0 ? (
        <p className="text-text-muted">Новостей пока нет</p>
      ) : (
        <div className="flex flex-col gap-3">
          {news.map((item) => (
            <div key={item.id} className="flex items-center gap-4 rounded-lg bg-bg-secondary p-4">
              <div className="flex-1">
                <p className="text-text">{item.title}</p>
                <p className="text-sm text-text-muted">
                  {formatDate(item.publishedAt, "ru")}
                </p>
              </div>
              <Badge tone={item.isPublished ? "success" : "neutral"}>
                {item.isPublished ? "Опубликовано" : "Черновик"}
              </Badge>
              <label className="flex items-center gap-2 text-xs text-text-muted">
                <input
                  type="checkbox"
                  checked={item.isPublished}
                  onChange={() => handleTogglePublished(item)}
                  className="h-4 w-4 accent-gold"
                />
              </label>
              <Button
                variant="ghost"
                onClick={() => {
                  setEditNews(item);
                  setModalOpen(true);
                }}
              >
                Изменить
              </Button>
              <Button variant="ghost" onClick={() => handleDelete(item)}>
                Удалить
              </Button>
            </div>
          ))}
        </div>
      )}

      {modalOpen && (
        <NewsFormModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          editNews={editNews}
          onSaved={load}
        />
      )}
    </div>
  );
}
