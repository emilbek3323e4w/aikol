import { unstable_cache, revalidateTag } from "next/cache";
import { prisma } from "@/shared/lib/prisma";
import type { Review } from "../model/types";

function serialize(review: {
  id: string;
  clientName: string;
  rating: number;
  comment: string;
  status: string;
  createdAt: Date;
}): Review {
  return {
    id: review.id,
    clientName: review.clientName,
    rating: review.rating,
    comment: review.comment,
    status: review.status as Review["status"],
    createdAt: review.createdAt.toISOString(),
  };
}

async function fetchApprovedReviews(): Promise<Review[]> {
  const reviews = await prisma.review.findMany({
    where: { status: "APPROVED" },
    orderBy: { createdAt: "desc" },
  });
  return reviews.map(serialize);
}

export const getApprovedReviews = unstable_cache(
  fetchApprovedReviews,
  ["approved-reviews"],
  { tags: ["reviews"], revalidate: 3600 },
);

interface CreateReviewInput {
  clientName: string;
  rating: number;
  comment: string;
}

export async function createReview(input: CreateReviewInput): Promise<Review> {
  const review = await prisma.review.create({ data: input });
  return serialize(review);
}

export async function moderateReview(
  id: string,
  status: Review["status"],
): Promise<Review> {
  const review = await prisma.review.update({ where: { id }, data: { status } });
  revalidateTag("reviews", "max");
  return serialize(review);
}

export async function getPendingReviewsCount(): Promise<number> {
  return prisma.review.count({ where: { status: "PENDING" } });
}
