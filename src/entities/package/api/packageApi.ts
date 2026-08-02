import { unstable_cache, revalidateTag } from "next/cache";
import { prisma } from "@/shared/lib/prisma";
import type { Package } from "../model/types";

function serializePackage(pkg: {
  id: string;
  name: string;
  pricePerGuest: number;
  fixedItems: string[];
  fixedItemsKg: string[];
  isAvailable: boolean;
  order: number;
  selections: {
    id: string;
    packageId: string;
    categoryId: string;
    quantity: number;
    category: { id: string; name: string; nameKg: string };
  }[];
}): Package {
  return {
    id: pkg.id,
    name: pkg.name,
    pricePerGuest: pkg.pricePerGuest,
    fixedItems: pkg.fixedItems,
    fixedItemsKg: pkg.fixedItemsKg,
    isAvailable: pkg.isAvailable,
    order: pkg.order,
    selections: pkg.selections,
  };
}

const includeSelections = {
  selections: { include: { category: true } },
} as const;

async function fetchPackages(): Promise<Package[]> {
  const packages = await prisma.package.findMany({
    where: { isAvailable: true },
    orderBy: [{ order: "asc" }, { pricePerGuest: "asc" }],
    include: includeSelections,
  });
  return packages.map(serializePackage);
}

export const getPackages = unstable_cache(fetchPackages, ["packages"], {
  tags: ["packages"],
  revalidate: 3600,
});

export async function getAllPackages(): Promise<Package[]> {
  const packages = await prisma.package.findMany({
    orderBy: { pricePerGuest: "asc" },
    include: includeSelections,
  });
  return packages.map(serializePackage);
}

export async function getPackageById(id: string): Promise<Package | null> {
  const pkg = await prisma.package.findUnique({
    where: { id },
    include: includeSelections,
  });
  return pkg ? serializePackage(pkg) : null;
}

interface PackageSelectionInput {
  categoryId: string;
  quantity: number;
}

interface PackageInput {
  name: string;
  pricePerGuest: number;
  fixedItems: string[];
  fixedItemsKg: string[];
  selections: PackageSelectionInput[];
}

export async function createPackage(input: PackageInput): Promise<Package> {
  const count = await prisma.package.count();
  const pkg = await prisma.package.create({
    data: {
      name: input.name,
      pricePerGuest: input.pricePerGuest,
      fixedItems: input.fixedItems,
      fixedItemsKg: input.fixedItemsKg,
      order: count,
      selections: { create: input.selections },
    },
    include: includeSelections,
  });
  revalidateTag("packages", "max");
  return serializePackage(pkg);
}

export async function updatePackage(
  id: string,
  input: Partial<PackageInput> & { isAvailable?: boolean },
): Promise<Package> {
  const { selections, ...rest } = input;
  const pkg = await prisma.package.update({
    where: { id },
    data: {
      ...rest,
      ...(selections
        ? { selections: { deleteMany: {}, create: selections } }
        : {}),
    },
    include: includeSelections,
  });
  revalidateTag("packages", "max");
  return serializePackage(pkg);
}

export async function deletePackage(id: string): Promise<void> {
  await prisma.package.delete({ where: { id } });
  revalidateTag("packages", "max");
}

export async function getPackagesCount(): Promise<number> {
  return prisma.package.count();
}
