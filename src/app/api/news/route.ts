import { NextRequest } from "next/server";
import { z } from "zod";
import { getPublishedNews, getAllNews, createNews } from "@/entities/news";
import { auth } from "@/shared/lib/auth";
import { apiError, apiSuccess } from "@/shared/lib/apiResponse";

const createSchema = z.object({
  title: z.string().min(1).max(200),
  titleKg: z.string().min(1).max(200),
  body: z.string().min(1),
  bodyKg: z.string().min(1),
  image: z.string().url().optional(),
  isPublished: z.boolean().optional(),
});

export async function GET(request: NextRequest) {
  const all = request.nextUrl.searchParams.get("all") === "true";

  try {
    if (all) {
      const session = await auth();
      if (!session) return apiError("UNAUTHORIZED", "Требуется вход", 401);
      return apiSuccess(await getAllNews());
    }
    return apiSuccess(await getPublishedNews());
  } catch {
    return apiError("INTERNAL_ERROR", "Не удалось загрузить новости", 500);
  }
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session) return apiError("UNAUTHORIZED", "Требуется вход", 401);

  const body = await request.json().catch(() => null);
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return apiError("VALIDATION_ERROR", "Проверьте поля новости", 400);
  }

  try {
    const news = await createNews(parsed.data);
    return apiSuccess(news, { status: 201 });
  } catch {
    return apiError("INTERNAL_ERROR", "Не удалось создать новость", 500);
  }
}
