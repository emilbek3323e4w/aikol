import type { Metadata } from "next";
import { getApprovedReviews } from "@/entities/review";
import { ReviewsPage } from "@/views/reviews";
import { buildMetadata } from "@/shared/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return buildMetadata({
    locale,
    path: "/reviews",
    title: locale === "kg" ? "Пикирлер" : "Отзывы",
    description:
      locale === "kg"
        ? "«Айкөл» ресторону жөнүндө пикирлер"
        : "Отзывы клиентов о ресторане «Айкөл»",
  });
}

export default async function Reviews() {
  const reviews = await getApprovedReviews().catch(() => []);
  return <ReviewsPage reviews={reviews} />;
}
