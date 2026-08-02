export interface PackageSelectionCategory {
  id: string;
  name: string;
  nameKg: string;
}

export interface PackageSelection {
  id: string;
  packageId: string;
  categoryId: string;
  quantity: number;
  category: PackageSelectionCategory;
}

export interface Package {
  id: string;
  name: string;
  pricePerGuest: number;
  fixedItems: string[];
  fixedItemsKg: string[];
  selections: PackageSelection[];
  isAvailable: boolean;
  order: number;
}
