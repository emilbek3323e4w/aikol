import { z } from "zod";
import { getNewsById, updateNews, deleteNews } from "@/entities/news";
import { auth } from "@/shared/lib/auth";
import { apiError, apiSuccess } from "@/shared/lib/apiResponse";

const patchSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  titleKg: z.string().min(1).max(200).optional(),
  body: z.string().min(1).optional(),
  bodyKg: z.string().min(1).optional(),
  image: z.string().url().optional(),
  isPublished: z.boolean().optional(),
});

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  try {
    const news = await getNewsById(id);
    if (!news) return apiError("NOT_FOUND", "Новость не найдена", 404);
    return apiSuccess(news);
  } catch {
    return apiError("INTERNAL_ERROR", "Не удалось загрузить новость", 500);
  }
}

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
    return apiError("VALIDATION_ERROR", "Некорректные данные", 400);
  }

  try {
    const news = await updateNews(id, parsed.data);
    return apiSuccess(news);
  } catch {
    return apiError("INTERNAL_ERROR", "Не удалось обновить новость", 500);
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth();
  if (!session) return apiError("UNAUTHORIZED", "Требуется вход", 401);

  const { id } = await params;
  try {
    await deleteNews(id);
    return apiSuccess({ id });
  } catch {
    return apiError("INTERNAL_ERROR", "Не удалось удалить новость", 500);
  }
}
