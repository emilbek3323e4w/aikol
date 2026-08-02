import { NextRequest } from "next/server";
import { createReview, getApprovedReviews } from "@/entities/review";
import { createReviewSchema } from "@/features/submit-review/model/schema";
import { auth } from "@/shared/lib/auth";
import { apiError, apiSuccess } from "@/shared/lib/apiResponse";
import { prisma } from "@/shared/lib/prisma";
import { getClientIp, isRateLimited } from "@/shared/lib/rateLimit";

export async function GET(request: NextRequest) {
  const status = request.nextUrl.searchParams.get("status");

  try {
    if (status === "PENDING") {
      const session = await auth();
      if (!session) return apiError("UNAUTHORIZED", "Требуется вход", 401);
      const pending = await prisma.review.findMany({
        where: { status: "PENDING" },
        orderBy: { createdAt: "desc" },
      });
      return apiSuccess(pending);
    }

    const reviews = await getApprovedReviews();
    return apiSuccess(reviews);
  } catch {
    return apiError("INTERNAL_ERROR", "Не удалось загрузить отзывы", 500);
  }
}

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  if (isRateLimited(`reviews:${ip}`, 2, 10 * 60 * 1000)) {
    return apiError("RATE_LIMITED", "Слишком много попыток. Попробуйте позже", 429);
  }

  const body = await request.json().catch(() => null);
  const parsed = createReviewSchema.safeParse(body);

  if (!parsed.success) {
    return apiError("VALIDATION_ERROR", "Проверьте правильность заполнения формы", 400);
  }

  try {
    const review = await createReview(parsed.data);
    return apiSuccess(review, { status: 201 });
  } catch {
    return apiError("INTERNAL_ERROR", "Не удалось отправить отзыв", 500);
  }
}
