export type EventType = "TOI" | "CORPORATE" | "QURAN" | "KIDS" | "OTHER";

export interface GalleryPhoto {
  id: string;
  url: string;
  publicId: string;
  eventType: EventType | null;
  order: number;
  createdAt: string;
}
