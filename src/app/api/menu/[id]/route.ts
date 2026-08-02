import { z } from "zod";
import { updateMenuItem, deleteMenuItem } from "@/entities/menu-item";
import { auth } from "@/shared/lib/auth";
import { apiError, apiSuccess } from "@/shared/lib/apiResponse";

const patchSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  nameKg: z.string().min(1).max(200).optional(),
  image: z.string().url().optional(),
  categoryId: z.string().optional(),
  isAvailable: z.boolean().optional(),
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
    return apiError("VALIDATION_ERROR", "Некорректные данные", 400);
  }

  try {
    const item = await updateMenuItem(id, parsed.data);
    return apiSuccess(item);
  } catch {
    return apiError("INTERNAL_ERROR", "Не удалось обновить блюдо", 500);
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
    await deleteMenuItem(id);
    return apiSuccess({ id });
  } catch {
    return apiError("INTERNAL_ERROR", "Не удалось удалить блюдо", 500);
  }
}
