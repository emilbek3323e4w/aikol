import { unstable_cache, revalidateTag } from "next/cache";
import { prisma } from "@/shared/lib/prisma";
import { cloudinary } from "@/shared/lib/cloudinary";
import type { EventType, GalleryPhoto } from "../model/types";

function serialize(photo: {
  id: string;
  url: string;
  publicId: string;
  eventType: string | null;
  order: number;
  createdAt: Date;
}): GalleryPhoto {
  return {
    id: photo.id,
    url: photo.url,
    publicId: photo.publicId,
    eventType: photo.eventType as EventType | null,
    order: photo.order,
    createdAt: photo.createdAt.toISOString(),
  };
}

async function fetchGalleryPhotos(
  eventType?: EventType,
): Promise<GalleryPhoto[]> {
  const photos = await prisma.galleryPhoto.findMany({
    where: eventType ? { eventType } : undefined,
    orderBy: { order: "asc" },
  });
  return photos.map(serialize);
}

export const getGalleryPhotos = unstable_cache(
  fetchGalleryPhotos,
  ["gallery-photos"],
  { tags: ["gallery"], revalidate: 3600 },
);

export async function createGalleryPhoto(input: {
  url: string;
  publicId: string;
  eventType?: EventType;
}): Promise<GalleryPhoto> {
  const count = await prisma.galleryPhoto.count();
  const photo = await prisma.galleryPhoto.create({
    data: { ...input, order: count },
  });
  revalidateTag("gallery", { expire: 0 });
  return serialize(photo);
}

export async function deleteGalleryPhoto(id: string): Promise<void> {
  const photo = await prisma.galleryPhoto.findUnique({ where: { id } });
  if (!photo) return;
  await prisma.galleryPhoto.delete({ where: { id } });
  await cloudinary.uploader.destroy(photo.publicId).catch(() => {});
  revalidateTag("gallery", { expire: 0 });
}
