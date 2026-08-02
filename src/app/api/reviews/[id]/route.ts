import { z } from "zod";
import { moderateReview } from "@/entities/review";
import { auth } from "@/shared/lib/auth";
import { apiError, apiSuccess } from "@/shared/lib/apiResponse";

const patchSchema = z.object({
  status: z.enum(["PENDING", "APPROVED", "REJECTED"]),
});

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth();
  if (!session) return apiError("UNAUTHORIZED", "Требуется вход", 401);

  const { id } = await params;
  const body = await request.json().catch(() => null);
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) {
    return apiError("VALIDATION_ERROR", "Некорректный статус", 400);
  }

  try {
    const review = await moderateReview(id, parsed.data.status);
    return apiSuccess(review);
  } catch {
    return apiError("INTERNAL_ERROR", "Не удалось обновить отзыв", 500);
  }
}
