import { api } from "./api";
import {
  CreateReviewPayload,
  HostReviewsResponse,
  HostReview,
  UpdateReviewPayload,
  UserReviewItem,
} from "../types/review.types";

export const reviewService = {
  async submitReview(payload: CreateReviewPayload): Promise<HostReview> {
    const res = await api.post("/reviews", payload);
    return res.data;
  },

  async getHostReviews(
    hostIdOrSlug: string,
    params?: { page?: number; limit?: number; rating?: number }
  ): Promise<HostReviewsResponse> {
    const res = await api.get(`/reviews/host/${hostIdOrSlug}`, { params });
    return res.data;
  },

  async getMyReviews(): Promise<UserReviewItem[]> {
    const res = await api.get("/reviews/my-reviews");
    return res.data;
  },

  async getHostDashboardReviews(params?: {
    page?: number;
    limit?: number;
    rating?: number;
  }): Promise<HostReviewsResponse> {
    const res = await api.get("/reviews/host-dashboard", { params });
    return res.data;
  },

  async updateReview(
    reviewId: string,
    payload: UpdateReviewPayload
  ): Promise<HostReview> {
    const res = await api.patch(`/reviews/${reviewId}`, payload);
    return res.data;
  },

  async flagReview(reviewId: string): Promise<{ message: string }> {
    const res = await api.post(`/reviews/${reviewId}/flag`);
    return res.data;
  },
};
