export interface VerifiedHost {
  id: string;
  slug: string;
  name: string;
  logo?: string | null;
  banner?: string | null;
  description?: string | null;
  bio?: string | null;
  phone?: string | null;
  address?: string | null;
  vatNumber?: string | null;
  category?: string;
  competitionCount: number;
  drawsHosted?: number;
  averageRating?: number;
  rating?: number;
  totalReviews?: number;
  isVerified: boolean;
  isBlocked?: boolean;
  memberSince?: number;
}

