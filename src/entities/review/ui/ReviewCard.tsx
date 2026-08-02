import { Card } from "@/shared/ui/Card";
import type { Review } from "../model/types";

export function ReviewCard({ review }: { review: Review }) {
  return (
    <Card className="p-6">
      <div className="mb-2 flex items-center justify-between">
        <span className="font-medium text-text">{review.clientName}</span>
        <span className="text-gold" aria-label={`${review.rating} из 5`}>
          {"★".repeat(review.rating)}
          <span className="text-line">{"★".repeat(5 - review.rating)}</span>
        </span>
      </div>
      <p className="text-sm text-text-muted">{review.comment}</p>
    </Card>
  );
}
