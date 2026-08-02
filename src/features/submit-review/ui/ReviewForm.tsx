"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Input } from "@/shared/ui/Input";
import { Textarea } from "@/shared/ui/Textarea";
import { Button } from "@/shared/ui/Button";
import { createReviewSchema } from "../model/schema";
import { submitReview } from "../api/submitReview";

export function ReviewForm() {
  const t = useTranslations("reviewsPage");
  const [clientName, setClientName] = useState("");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">(
    "idle",
  );
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = createReviewSchema.safeParse({ clientName, rating, comment });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Проверьте поля формы");
      return;
    }
    setError(null);
    setStatus("submitting");
    const result = await submitReview(parsed.data);
    if (result.ok) {
      setStatus("success");
      setClientName("");
      setRating(5);
      setComment("");
    } else {
      setStatus("error");
      setError(result.message);
    }
  };

  if (status === "success") {
    return (
      <p className="rounded-lg bg-success/10 px-4 py-3 text-center text-sm text-success">
        {t("submitSuccess")}
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <h2 className="font-heading text-xl text-gold">{t("formTitle")}</h2>

      <Input
        label={t("nameLabel")}
        value={clientName}
        onChange={(e) => setClientName(e.target.value)}
      />

      <div className="flex flex-col gap-1.5">
        <span className="text-sm text-text-muted">{t("ratingLabel")}</span>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              aria-label={`${star}`}
              className={`text-2xl ${star <= rating ? "text-gold" : "text-line"}`}
            >
              ★
            </button>
          ))}
        </div>
      </div>

      <Textarea
        label={t("commentLabel")}
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        maxLength={1000}
      />

      {error && <p className="text-sm text-danger">{error}</p>}

      <Button type="submit" disabled={status === "submitting"}>
        Отправить
      </Button>
    </form>
  );
}
