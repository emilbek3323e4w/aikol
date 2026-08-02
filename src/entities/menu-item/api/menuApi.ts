import { unstable_cache, revalidateTag } from "next/cache";
import { prisma } from "@/shared/lib/prisma";
import type { MenuCategory, MenuItem } from "../model/types";

function serializeCategory(category: {
  id: string;
  name: string;
  nameKg: string;
  order: number;
  items: {
    id: string;
    name: string;
    nameKg: string;
    image: string | null;
    isAvailable: boolean;
    order: number;
    categoryId: string;
  }[];
}): MenuCategory {
  return {
    id: category.id,
    name: category.name,
    nameKg: category.nameKg,
    order: category.order,
    items: category.items,
  };
}

async function fetchMenuCategories(): Promise<MenuCategory[]> {
  const categories = await prisma.menuCategory.findMany({
    orderBy: { order: "asc" },
    include: {
      items: {
        where: { isAvailable: true },
        orderBy: { order: "asc" },
      },
    },
  });
  return categories.map(serializeCategory);
}

export const getMenuCategories = unstable_cache(
  fetchMenuCategories,
  ["menu-categories"],
  { tags: ["menu"], revalidate: 3600 },
);

export async function getAllMenuCategories(): Promise<MenuCategory[]> {
  const categories = await prisma.menuCategory.findMany({
    orderBy: { order: "asc" },
    include: { items: { orderBy: { order: "asc" } } },
  });
  return categories.map(serializeCategory);
}

export async function createMenuCategory(input: {
  name: string;
  nameKg: string;
}): Promise<MenuCategory> {
  const count = await prisma.menuCategory.count();
  const category = await prisma.menuCategory.create({
    data: { ...input, order: count },
    include: { items: true },
  });
  revalidateTag("menu", "max");
  return serializeCategory(category);
}

interface MenuItemInput {
  name: string;
  nameKg: string;
  image?: string;
  categoryId: string;
}

export async function createMenuItem(input: MenuItemInput): Promise<MenuItem> {
  const count = await prisma.menuItem.count({
    where: { categoryId: input.categoryId },
  });
  const item = await prisma.menuItem.create({ data: { ...input, order: count } });
  revalidateTag("menu", "max");
  return item;
}

export async function updateMenuItem(
  id: string,
  input: Partial<MenuItemInput> & { isAvailable?: boolean },
): Promise<MenuItem> {
  const item = await prisma.menuItem.update({ where: { id }, data: input });
  revalidateTag("menu", "max");
  return item;
}

export async function deleteMenuItem(id: string): Promise<void> {
  await prisma.menuItem.delete({ where: { id } });
  revalidateTag("menu", "max");
}
