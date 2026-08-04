export interface MenuItem {
  id: string;
  name: string;
  nameKg: string;
  image: string | null;
  isAvailable: boolean;
  isFeatured: boolean;
  order: number;
  categoryId: string;
}

export interface MenuCategory {
  id: string;
  name: string;
  nameKg: string;
  image: string | null;
  order: number;
  items: MenuItem[];
}
