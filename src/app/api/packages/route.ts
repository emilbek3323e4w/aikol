import { NextRequest } from "next/server";
import { z } from "zod";
import { getPackages, getAllPackages, createPackage } from "@/entities/package";
import { auth } from "@/shared/lib/auth";
import { apiError, apiSuccess } from "@/shared/lib/apiResponse";

const createSchema = z.object({
  name: z.string().min(1).max(200),
  pricePerGuest: z.number().int().positive(),
  fixedItems: z.array(z.string().min(1)).default([]),
  fixedItemsKg: z.array(z.string().min(1)).default([]),
  selections: z
    .array(
      z.object({
        categoryId: z.string(),
        quantity: z.number().int().positive(),
      }),
    )
    .default([]),
});

export async function GET(request: NextRequest) {
  const isAdmin = request.nextUrl.searchParams.get("all") === "true";

  try {
    if (isAdmin) {
      const session = await auth();
      if (!session) return apiError("UNAUTHORIZED", "Требуется вход", 401);
      const packages = await getAllPackages();
      return apiSuccess(packages);
    }

    const packages = await getPackages();
    return apiSuccess(packages);
  } catch {
    return apiError("INTERNAL_ERROR", "Не удалось загрузить пакеты", 500);
  }
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session) return apiError("UNAUTHORIZED", "Требуется вход", 401);

  const body = await request.json().catch(() => null);
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return apiError("VALIDATION_ERROR", "Проверьте поля пакета", 400);
  }

  try {
    const pkg = await createPackage(parsed.data);
    return apiSuccess(pkg, { status: 201 });
  } catch {
    return apiError("INTERNAL_ERROR", "Не удалось добавить пакет", 500);
  }
}
