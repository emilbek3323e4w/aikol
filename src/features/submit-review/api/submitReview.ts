import type { CreateReviewInput } from "../model/schema";

type SubmitResult = { ok: true } | { ok: false; message: string };

export async function submitReview(
  input: CreateReviewInput,
): Promise<SubmitResult> {
  const res = await fetch("/api/reviews", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  if (res.ok) return { ok: true };

  const json = await res.json().catch(() => null);
  return {
    ok: false,
    message: json?.error?.message ?? "Не удалось отправить отзыв",
  };
}
