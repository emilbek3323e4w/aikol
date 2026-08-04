import { z } from "zod";
import { Prisma } from "@prisma/client";
import { updateMenuCategory, deleteMenuCategory } from "@/entities/menu-item";
import { auth } from "@/shared/lib/auth";
import { apiError, apiSuccess } from "@/shared/lib/apiResponse";

const patchSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  nameKg: z.string().min(1).max(100).optional(),
  image: z.string().url().optional(),
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
    const category = await updateMenuCategory(id, parsed.data);
    return apiSuccess(category);
  } catch {
    return apiError("INTERNAL_ERROR", "Не удалось обновить категорию", 500);
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
    await deleteMenuCategory(id);
    return apiSuccess({ id });
  } catch (error) {
    const isForeignKeyViolation =
      (error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2003") ||
      (error instanceof Prisma.PrismaClientUnknownRequestError &&
        /foreign key|RESTRICT/i.test(error.message));

    if (isForeignKeyViolation) {
      return apiError(
        "CONFLICT",
        "Нельзя удалить категорию — она используется в банкетном пакете (блок «на выбор»)",
        409,
      );
    }
    return apiError("INTERNAL_ERROR", "Не удалось удалить категорию", 500);
  }
}
