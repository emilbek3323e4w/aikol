export type ReviewStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface Review {
  id: string;
  clientName: string;
  rating: number;
  comment: string;
  status: ReviewStatus;
  createdAt: string;
}
