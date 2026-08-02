import type { MenuItem } from "@/entities/menu-item";

export const SEED_POPULAR_DISHES: MenuItem[] = [
  {
    id: "seed-1",
    name: "Плов по-узбекски",
    nameKg: "Өзбекче палоо",
    image: null,
    isAvailable: true,
    order: 0,
    categoryId: "seed-cat-1",
  },
  {
    id: "seed-2",
    name: "Манты",
    nameKg: "Манты",
    image: null,
    isAvailable: true,
    order: 1,
    categoryId: "seed-cat-1",
  },
  {
    id: "seed-3",
    name: "Шашлык из баранины",
    nameKg: "Кой этинен шашлык",
    image: null,
    isAvailable: true,
    order: 2,
    categoryId: "seed-cat-1",
  },
  {
    id: "seed-4",
    name: "Салат «Ачичук»",
    nameKg: "«Ачичук» салаты",
    image: null,
    isAvailable: true,
    order: 3,
    categoryId: "seed-cat-2",
  },
];
