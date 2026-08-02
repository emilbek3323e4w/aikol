import { NextRequest } from "next/server";
import { z } from "zod";
import {
  getMenuCategories,
  getAllMenuCategories,
  createMenuItem,
} from "@/entities/menu-item";
import { auth } from "@/shared/lib/auth";
import { apiError, apiSuccess } from "@/shared/lib/apiResponse";

const createItemSchema = z.object({
  name: z.string().min(1).max(200),
  nameKg: z.string().min(1).max(200),
  image: z.string().url().optional(),
  categoryId: z.string(),
});

export async function GET(request: NextRequest) {
  const isAdmin = request.nextUrl.searchParams.get("all") === "true";

  try {
    if (isAdmin) {
      const session = await auth();
      if (!session) return apiError("UNAUTHORIZED", "Требуется вход", 401);
      const categories = await getAllMenuCategories();
      return apiSuccess(categories);
    }

    const categories = await getMenuCategories();
    return apiSuccess(categories);
  } catch {
    return apiError("INTERNAL_ERROR", "Не удалось загрузить меню", 500);
  }
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session) return apiError("UNAUTHORIZED", "Требуется вход", 401);

  const body = await request.json().catch(() => null);
  const parsed = createItemSchema.safeParse(body);
  if (!parsed.success) {
    return apiError("VALIDATION_ERROR", "Проверьте поля блюда", 400);
  }

  try {
    const item = await createMenuItem(parsed.data);
    return apiSuccess(item, { status: 201 });
  } catch {
    return apiError("INTERNAL_ERROR", "Не удалось добавить блюдо", 500);
  }
}
