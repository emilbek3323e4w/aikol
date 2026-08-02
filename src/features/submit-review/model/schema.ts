import { z } from "zod";

export const createReviewSchema = z.object({
  clientName: z.string().min(2).max(100),
  rating: z.number().int().min(1).max(5),
  comment: z.string().min(5).max(1000),
});

export type CreateReviewInput = z.infer<typeof createReviewSchema>;
