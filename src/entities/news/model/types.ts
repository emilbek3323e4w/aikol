export interface News {
  id: string;
  title: string;
  titleKg: string;
  body: string;
  bodyKg: string;
  image: string | null;
  isPublished: boolean;
  publishedAt: string;
  updatedAt: string;
}
