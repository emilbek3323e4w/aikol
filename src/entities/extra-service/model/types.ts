export interface ExtraService {
  id: string;
  name: string;
  nameKg: string;
  price: number;
  priceNote: string | null;
  isAvailable: boolean;
  order: number;
}
