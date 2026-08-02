import type { Metadata } from "next";
import { getGalleryPhotos } from "@/entities/gallery-photo";
import { GalleryPage } from "@/views/gallery";
import { buildMetadata } from "@/shared/lib/seo";

export const revalidate = 3600;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return buildMetadata({
    locale,
    path: "/gallery",
    title: locale === "kg" ? "Галерея" : "Галерея",
    description:
      locale === "kg"
        ? "«Айкөл» ресторонунун сүрөт галереясы"
        : "Фотогалерея ресторана «Айкөл»",
  });
}

export default async function Gallery() {
  const photos = await getGalleryPhotos().catch(() => []);
  return <GalleryPage photos={photos} />;
}
