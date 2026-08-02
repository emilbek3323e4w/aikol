import { NextRequest } from "next/server";
import { z } from "zod";
import { getGalleryPhotos, createGalleryPhoto } from "@/entities/gallery-photo";
import { auth } from "@/shared/lib/auth";
import type { EventType } from "@/entities/gallery-photo";
import { apiError, apiSuccess } from "@/shared/lib/apiResponse";

const createSchema = z.object({
  url: z.string().url(),
  publicId: z.string(),
  eventType: z
    .enum(["TOI", "CORPORATE", "QURAN", "KIDS", "OTHER"])
    .optional(),
});

export async function GET(request: NextRequest) {
  const eventType = request.nextUrl.searchParams.get("eventType") as
    | EventType
    | null;

  try {
    const photos = await getGalleryPhotos(eventType ?? undefined);
    return apiSuccess(photos);
  } catch {
    return apiError("INTERNAL_ERROR", "Не удалось загрузить галерею", 500);
  }
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session) return apiError("UNAUTHORIZED", "Требуется вход", 401);

  const body = await request.json().catch(() => null);
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return apiError("VALIDATION_ERROR", "Некорректные данные фото", 400);
  }

  try {
    const photo = await createGalleryPhoto(parsed.data);
    return apiSuccess(photo, { status: 201 });
  } catch {
    return apiError("INTERNAL_ERROR", "Не удалось добавить фото", 500);
  }
}
