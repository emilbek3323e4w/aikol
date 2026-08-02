import { deleteGalleryPhoto } from "@/entities/gallery-photo";
import { auth } from "@/shared/lib/auth";
import { apiError, apiSuccess } from "@/shared/lib/apiResponse";

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth();
  if (!session) return apiError("UNAUTHORIZED", "Требуется вход", 401);

  const { id } = await params;
  try {
    await deleteGalleryPhoto(id);
    return apiSuccess({ id });
  } catch {
    return apiError("INTERNAL_ERROR", "Не удалось удалить фото", 500);
  }
}
