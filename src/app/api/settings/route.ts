import { z } from "zod";
import { getSettingsMap, updateSettings, SETTINGS_KEYS } from "@/entities/settings";
import { auth } from "@/shared/lib/auth";
import { apiError, apiSuccess } from "@/shared/lib/apiResponse";

const patchSchema = z.object(
  Object.fromEntries(SETTINGS_KEYS.map((key) => [key, z.string().optional()])),
);

export async function GET() {
  try {
    const settings = await getSettingsMap();
    return apiSuccess(settings);
  } catch {
    return apiError("INTERNAL_ERROR", "Не удалось загрузить настройки", 500);
  }
}

export async function PATCH(request: Request) {
  const session = await auth();
  if (!session) return apiError("UNAUTHORIZED", "Требуется вход", 401);

  const body = await request.json().catch(() => null);
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) {
    return apiError("VALIDATION_ERROR", "Некорректные настройки", 400);
  }

  try {
    await updateSettings(parsed.data);
    return apiSuccess(await getSettingsMap());
  } catch {
    return apiError("INTERNAL_ERROR", "Не удалось сохранить настройки", 500);
  }
}
