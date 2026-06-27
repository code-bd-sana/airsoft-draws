export interface VerifiedHost {
  id: string;
  slug: string;
  name: string;
  logo?: string;
  description?: string;
  category?: string;
  competitionCount: number;
  averageRating?: number;
  totalReviews?: number;
  isVerified: boolean;
}
