import { z } from "zod";
import { updateExtraService, deleteExtraService } from "@/entities/extra-service";
import { auth } from "@/shared/lib/auth";
import { apiError, apiSuccess } from "@/shared/lib/apiResponse";

const patchSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  nameKg: z.string().min(1).max(200).optional(),
  price: z.number().int().positive().optional(),
  priceNote: z.string().max(100).optional(),
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
    const service = await updateExtraService(id, parsed.data);
    return apiSuccess(service);
  } catch {
    return apiError("INTERNAL_ERROR", "Не удалось обновить услугу", 500);
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
    await deleteExtraService(id);
    return apiSuccess({ id });
  } catch {
    return apiError("INTERNAL_ERROR", "Не удалось удалить услугу", 500);
  }
}
