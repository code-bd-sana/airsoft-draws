import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { reviewService } from "../services/review.service";
import { CreateReviewPayload, UpdateReviewPayload } from "../types/review.types";

export function useHostReviewsQuery(
  hostIdOrSlug: string,
  params?: { page?: number; limit?: number; rating?: number }
) {
  return useQuery({
    queryKey: ["host-reviews", hostIdOrSlug, params],
    queryFn: () => reviewService.getHostReviews(hostIdOrSlug, params),
    enabled: Boolean(hostIdOrSlug),
  });
}

export function useMyReviewsQuery() {
  return useQuery({
    queryKey: ["my-reviews"],
    queryFn: () => reviewService.getMyReviews(),
  });
}

export function useHostDashboardReviewsQuery(params?: {
  page?: number;
  limit?: number;
  rating?: number;
}) {
  return useQuery({
    queryKey: ["host-dashboard-reviews", params],
    queryFn: () => reviewService.getHostDashboardReviews(params),
  });
}

export function useSubmitReviewMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateReviewPayload) =>
      reviewService.submitReview(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-winners"] });
      queryClient.invalidateQueries({ queryKey: ["my-reviews"] });
      queryClient.invalidateQueries({ queryKey: ["host-reviews"] });
      queryClient.invalidateQueries({ queryKey: ["verified-hosts"] });
    },
  });
}

export function useUpdateReviewMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateReviewPayload;
    }) => reviewService.updateReview(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-winners"] });
      queryClient.invalidateQueries({ queryKey: ["my-reviews"] });
      queryClient.invalidateQueries({ queryKey: ["host-reviews"] });
    },
  });
}
