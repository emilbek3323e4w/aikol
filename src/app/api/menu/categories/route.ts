import { z } from "zod";
import { createMenuCategory } from "@/entities/menu-item";
import { auth } from "@/shared/lib/auth";
import { apiError, apiSuccess } from "@/shared/lib/apiResponse";

const schema = z.object({
  name: z.string().min(1).max(100),
  nameKg: z.string().min(1).max(100),
});

export async function POST(request: Request) {
  const session = await auth();
  if (!session) return apiError("UNAUTHORIZED", "Требуется вход", 401);

  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return apiError("VALIDATION_ERROR", "Проверьте название категории", 400);
  }

  try {
    const category = await createMenuCategory(parsed.data);
    return apiSuccess(category, { status: 201 });
  } catch {
    return apiError("INTERNAL_ERROR", "Не удалось создать категорию", 500);
  }
}
