import { useTranslations } from "next-intl";
import { ReviewCard } from "@/entities/review";
import type { Review } from "@/entities/review";
import { ReviewForm } from "@/features/submit-review";

export function ReviewsPage({ reviews }: { reviews: Review[] }) {
  const t = useTranslations("reviewsPage");

  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
      <h1 className="mb-10 text-center font-heading text-4xl text-gold">
        {t("title")}
      </h1>

      <div className="mb-12 rounded-xl bg-bg-secondary p-6">
        <ReviewForm />
      </div>

      {reviews.length === 0 ? (
        <p className="py-8 text-center text-text-muted">{t("empty")}</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {reviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
      )}
    </div>
  );
}
