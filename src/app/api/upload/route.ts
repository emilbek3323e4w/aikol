import { NextRequest } from "next/server";
import { cloudinary } from "@/shared/lib/cloudinary";
import { auth } from "@/shared/lib/auth";
import { apiError, apiSuccess } from "@/shared/lib/apiResponse";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_SIZE = 10 * 1024 * 1024;

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session) return apiError("UNAUTHORIZED", "Требуется вход", 401);

  const formData = await request.formData().catch(() => null);
  const file = formData?.get("file");

  if (!(file instanceof File)) {
    return apiError("VALIDATION_ERROR", "Файл не передан", 400);
  }
  if (!ALLOWED_TYPES.includes(file.type)) {
    return apiError("VALIDATION_ERROR", "Разрешены только jpg, png, webp", 400);
  }
  if (file.size > MAX_SIZE) {
    return apiError("VALIDATION_ERROR", "Максимальный размер файла 10MB", 400);
  }

  try {
    const bytes = await file.arrayBuffer();
    const base64 = Buffer.from(bytes).toString("base64");
    const dataUri = `data:${file.type};base64,${base64}`;

    const result = await cloudinary.uploader.upload(dataUri, {
      folder: "aikol",
    });

    return apiSuccess({ url: result.secure_url, publicId: result.public_id });
  } catch {
    return apiError("INTERNAL_ERROR", "Не удалось загрузить файл", 500);
  }
}
