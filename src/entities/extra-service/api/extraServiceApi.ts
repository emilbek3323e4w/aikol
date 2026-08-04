import { unstable_cache, revalidateTag } from "next/cache";
import { prisma } from "@/shared/lib/prisma";
import type { ExtraService } from "../model/types";

async function fetchExtraServices(): Promise<ExtraService[]> {
  return prisma.extraService.findMany({
    where: { isAvailable: true },
    orderBy: { order: "asc" },
  });
}

export const getExtraServices = unstable_cache(
  fetchExtraServices,
  ["extra-services"],
  { tags: ["extra-services"], revalidate: 3600 },
);

export async function getAllExtraServices(): Promise<ExtraService[]> {
  return prisma.extraService.findMany({ orderBy: { order: "asc" } });
}

interface ExtraServiceInput {
  name: string;
  nameKg: string;
  price: number;
  priceNote?: string;
}

export async function createExtraService(
  input: ExtraServiceInput,
): Promise<ExtraService> {
  const count = await prisma.extraService.count();
  const service = await prisma.extraService.create({
    data: { ...input, order: count },
  });
  revalidateTag("extra-services", { expire: 0 });
  return service;
}

export async function updateExtraService(
  id: string,
  input: Partial<ExtraServiceInput> & { isAvailable?: boolean },
): Promise<ExtraService> {
  const service = await prisma.extraService.update({ where: { id }, data: input });
  revalidateTag("extra-services", { expire: 0 });
  return service;
}

export async function deleteExtraService(id: string): Promise<void> {
  await prisma.extraService.delete({ where: { id } });
  revalidateTag("extra-services", { expire: 0 });
}
