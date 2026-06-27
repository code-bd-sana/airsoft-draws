export type ReviewStatus = "approved" | "flagged" | "under_review" | "removed";

export interface HostReview {
  id: string;
  hostId: string;
  reviewerName: string;
  rating: number;
  message: string;
  competitionTitle?: string;
  createdAt: string;
  status: ReviewStatus;
  canBeFlagged?: boolean;
}
