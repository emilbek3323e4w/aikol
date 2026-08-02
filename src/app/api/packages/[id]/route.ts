import { z } from "zod";
import { getPackageById, updatePackage, deletePackage } from "@/entities/package";
import { auth } from "@/shared/lib/auth";
import { apiError, apiSuccess } from "@/shared/lib/apiResponse";

const patchSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  pricePerGuest: z.number().int().positive().optional(),
  fixedItems: z.array(z.string().min(1)).optional(),
  fixedItemsKg: z.array(z.string().min(1)).optional(),
  selections: z
    .array(
      z.object({
        categoryId: z.string(),
        quantity: z.number().int().positive(),
      }),
    )
    .optional(),
  isAvailable: z.boolean().optional(),
});

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth();
  if (!session) return apiError("UNAUTHORIZED", "Требуется вход", 401);

  const { id } = await params;
  try {
    const pkg = await getPackageById(id);
    if (!pkg) return apiError("NOT_FOUND", "Пакет не найден", 404);
    return apiSuccess(pkg);
  } catch {
    return apiError("INTERNAL_ERROR", "Не удалось загрузить пакет", 500);
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
    const pkg = await updatePackage(id, parsed.data);
    return apiSuccess(pkg);
  } catch {
    return apiError("INTERNAL_ERROR", "Не удалось обновить пакет", 500);
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
    await deletePackage(id);
    return apiSuccess({ id });
  } catch {
    return apiError("INTERNAL_ERROR", "Не удалось удалить пакет", 500);
  }
}
