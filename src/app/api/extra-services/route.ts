import { NextRequest } from "next/server";
import { z } from "zod";
import {
  getExtraServices,
  getAllExtraServices,
  createExtraService,
} from "@/entities/extra-service";
import { auth } from "@/shared/lib/auth";
import { apiError, apiSuccess } from "@/shared/lib/apiResponse";

const createSchema = z.object({
  name: z.string().min(1).max(200),
  nameKg: z.string().min(1).max(200),
  price: z.number().int().positive(),
  priceNote: z.string().max(100).optional(),
});

export async function GET(request: NextRequest) {
  const isAdmin = request.nextUrl.searchParams.get("all") === "true";

  try {
    if (isAdmin) {
      const session = await auth();
      if (!session) return apiError("UNAUTHORIZED", "Требуется вход", 401);
      const services = await getAllExtraServices();
      return apiSuccess(services);
    }

    const services = await getExtraServices();
    return apiSuccess(services);
  } catch {
    return apiError("INTERNAL_ERROR", "Не удалось загрузить услуги", 500);
  }
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session) return apiError("UNAUTHORIZED", "Требуется вход", 401);

  const body = await request.json().catch(() => null);
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return apiError("VALIDATION_ERROR", "Проверьте поля услуги", 400);
  }

  try {
    const service = await createExtraService(parsed.data);
    return apiSuccess(service, { status: 201 });
  } catch {
    return apiError("INTERNAL_ERROR", "Не удалось добавить услугу", 500);
  }
}
