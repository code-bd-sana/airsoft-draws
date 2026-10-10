export type ReviewStatus =
  | "approved"
  | "flagged"
  | "under_review"
  | "removed"
  | "APPROVED"
  | "FLAGGED"
  | "HIDDEN";

export interface HostReview {
  id: string;
  hostId: string;
  raffleId?: string;
  winnerId?: string;
  reviewerName: string;
  avatarUrl?: string | null;
  rating: number;
  message?: string;
  comment?: string;
  competitionTitle?: string;
  competitionSlug?: string;
  prizeName?: string;
  winType?: "INSTANT_WIN" | "MAIN_DRAW" | string;
  createdAt: string;
  status: ReviewStatus;
  canBeFlagged?: boolean;
}

export interface HostReviewsResponse {
  reviews: HostReview[];
  stats: {
    averageRating: number | null;
    totalReviews: number;
    breakdown: Record<number, number>;
    percentages: Record<number, number>;
  };
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface CreateReviewPayload {
  winnerId: string;
  rating: number;
  comment?: string;
}

export interface UpdateReviewPayload {
  rating?: number;
  comment?: string;
}

export interface UserReviewItem {
  id: string;
  rating: number;
  comment: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
  winnerId: string;
  prizeName: string;
  winType: string;
  competition: {
    id: string;
    title: string;
    slug: string;
  };
  host: {
    id: string;
    name: string;
    slug: string;
  };
}
