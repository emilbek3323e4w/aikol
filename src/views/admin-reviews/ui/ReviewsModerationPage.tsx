"use client";

import { useEffect, useState } from "react";
import { Button } from "@/shared/ui/Button";
import { Badge } from "@/shared/ui/Badge";
import { Spinner } from "@/shared/ui/Spinner";
import { useToast } from "@/shared/ui/Toast";
import { formatDate } from "@/shared/lib/date";
import type { Review, ReviewStatus } from "@/entities/review/model/types";

type Tab = "PENDING" | "APPROVED";

export function ReviewsModerationPage() {
  const { showToast } = useToast();
  const [tab, setTab] = useState<Tab>("PENDING");
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async (status: Tab) => {
    setLoading(true);
    const res = await fetch(`/api/reviews?status=${status}`);
    const json = await res.json();
    if (json.success) setReviews(json.data);
    setLoading(false);
  };

  useEffect(() => {
    void Promise.resolve().then(() => load(tab));
  }, [tab]);

  const handleModerate = async (id: string, status: ReviewStatus) => {
    setReviews((prev) => prev.filter((r) => r.id !== id));
    const res = await fetch(`/api/reviews/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (res.ok) {
      showToast(status === "APPROVED" ? "Отзыв одобрен" : "Отзыв отклонён", "success");
    } else {
      showToast("Не удалось обновить отзыв", "error");
      load(tab);
    }
  };

  return (
    <div>
      <h1 className="mb-6 font-heading text-2xl text-gold">Отзывы</h1>

      <div className="mb-6 flex gap-2">
        <button
          type="button"
          onClick={() => setTab("PENDING")}
          className={`min-h-11 rounded-lg px-4 py-2 text-sm ${
            tab === "PENDING" ? "bg-gold text-on-gold font-medium" : "bg-bg-secondary text-text-muted"
          }`}
        >
          На модерации
        </button>
        <button
          type="button"
          onClick={() => setTab("APPROVED")}
          className={`min-h-11 rounded-lg px-4 py-2 text-sm ${
            tab === "APPROVED" ? "bg-gold text-on-gold font-medium" : "bg-bg-secondary text-text-muted"
          }`}
        >
          Одобренные
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Spinner />
        </div>
      ) : reviews.length === 0 ? (
        <p className="text-text-muted">Нет отзывов</p>
      ) : (
        <div className="flex flex-col gap-3">
          {reviews.map((review) => (
            <div key={review.id} className="rounded-lg bg-bg-secondary p-4">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-text">{review.clientName}</span>
                <Badge tone="neutral">
                  {"★".repeat(review.rating)}
                  {"☆".repeat(5 - review.rating)}
                </Badge>
              </div>
              <p className="mb-3 text-sm text-text-muted">{review.comment}</p>
              <p className="mb-3 text-xs text-text-muted">
                {formatDate(review.createdAt, "ru")}
              </p>
              <div className="flex gap-2">
                {tab === "PENDING" ? (
                  <>
                    <Button onClick={() => handleModerate(review.id, "APPROVED")}>
                      Одобрить
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={() => handleModerate(review.id, "REJECTED")}
                    >
                      Отклонить
                    </Button>
                  </>
                ) : (
                  <Button
                    variant="secondary"
                    onClick={() => handleModerate(review.id, "REJECTED")}
                  >
                    Снять с публикации
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
