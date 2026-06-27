import React from "react";
import { hostReviewsData } from "../../../data/reviews/reviews.data";
import HostReviewCard from "./HostReviewCard";

interface HostReviewListProps {
  hostId: string;
}

export default function HostReviewList({ hostId }: HostReviewListProps) {
  const reviews = hostReviewsData.filter((r) => r.hostId === hostId);

  if (reviews.length === 0) {
    return (
      <div className="text-center py-10 bg-surface border border-border border-dashed rounded-card">
        <p className="font-sans text-sm text-text-muted">
          This host has no reviews yet.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {reviews.map((review) => (
        <HostReviewCard key={review.id} review={review} />
      ))}
    </div>
  );
}
