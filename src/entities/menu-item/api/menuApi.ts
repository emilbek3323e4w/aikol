import { unstable_cache, revalidateTag } from "next/cache";
import { prisma } from "@/shared/lib/prisma";
import type { MenuCategory, MenuItem } from "../model/types";

function serializeCategory(category: {
  id: string;
  name: string;
  nameKg: string;
  image: string | null;
  order: number;
  items: {
    id: string;
    name: string;
    nameKg: string;
    image: string | null;
    isAvailable: boolean;
    isFeatured: boolean;
    order: number;
    categoryId: string;
  }[];
}): MenuCategory {
  return {
    id: category.id,
    name: category.name,
    nameKg: category.nameKg,
    image: category.image,
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

async function fetchFeaturedMenuItems(): Promise<MenuItem[]> {
  return prisma.menuItem.findMany({
    where: { isFeatured: true, isAvailable: true },
    orderBy: { order: "asc" },
  });
}

export const getFeaturedMenuItems = unstable_cache(
  fetchFeaturedMenuItems,
  ["featured-menu-items"],
  { tags: ["menu"], revalidate: 3600 },
);

interface MenuCategoryInput {
  name: string;
  nameKg: string;
  image?: string;
}

export async function createMenuCategory(
  input: MenuCategoryInput,
): Promise<MenuCategory> {
  const count = await prisma.menuCategory.count();
  const category = await prisma.menuCategory.create({
    data: { ...input, order: count },
    include: { items: true },
  });
  revalidateTag("menu", { expire: 0 });
  return serializeCategory(category);
}

export async function updateMenuCategory(
  id: string,
  input: Partial<MenuCategoryInput>,
): Promise<MenuCategory> {
  const category = await prisma.menuCategory.update({
    where: { id },
    data: input,
    include: { items: { orderBy: { order: "asc" } } },
  });
  revalidateTag("menu", { expire: 0 });
  return serializeCategory(category);
}

export async function deleteMenuCategory(id: string): Promise<void> {
  await prisma.menuCategory.delete({ where: { id } });
  revalidateTag("menu", { expire: 0 });
}

interface MenuItemInput {
  name: string;
  nameKg: string;
  image?: string;
  isFeatured?: boolean;
  categoryId: string;
}

export async function createMenuItem(input: MenuItemInput): Promise<MenuItem> {
  const count = await prisma.menuItem.count({
    where: { categoryId: input.categoryId },
  });
  const item = await prisma.menuItem.create({ data: { ...input, order: count } });
  revalidateTag("menu", { expire: 0 });
  return item;
}

export async function updateMenuItem(
  id: string,
  input: Partial<MenuItemInput> & { isAvailable?: boolean },
): Promise<MenuItem> {
  const item = await prisma.menuItem.update({ where: { id }, data: input });
  revalidateTag("menu", { expire: 0 });
  return item;
}

export async function deleteMenuItem(id: string): Promise<void> {
  await prisma.menuItem.delete({ where: { id } });
  revalidateTag("menu", { expire: 0 });
}
