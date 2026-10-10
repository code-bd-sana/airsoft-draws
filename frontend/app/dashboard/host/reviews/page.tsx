"use client";

import React, { useState } from "react";
import { useHostDashboardReviewsQuery } from "@/hooks/useReviewHooks";
import HostReviewCard from "@/components/website/host-reviews/HostReviewCard";
import { cn } from "@/lib/utils";

export default function HostCustomerReviewsPage() {
  const [selectedRating, setSelectedRating] = useState<number | undefined>(undefined);
  const [page, setPage] = useState<number>(1);

  const { data, isLoading, isError } = useHostDashboardReviewsQuery({
    page,
    limit: 12,
    rating: selectedRating,
  });

  const reviews = data?.reviews || [];
  const stats = data?.stats;
  const totalReviews = stats?.totalReviews || 0;
  const averageRating = stats?.averageRating;

  const fiveStarCount = stats?.breakdown?.[5] || 0;
  const fourStarCount = stats?.breakdown?.[4] || 0;
  const positiveCount = fiveStarCount + fourStarCount;
  const satisfactionRate = totalReviews > 0 ? Math.round((positiveCount / totalReviews) * 100) : 100;

  return (
    <div className="flex-1 w-full px-[20px] lg:px-[40px] py-[24px] lg:py-[32px] flex flex-col gap-[28px] animate-in fade-in duration-300 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="font-heading font-medium text-[28px] sm:text-[32px] text-[#e8edd4]">
            Customer Reviews & Ratings
          </h1>
          <p className="font-sans font-normal text-[14px] text-[#b3b8aa]">
            Monitor winner feedback, host reputation metrics, and prize delivery reviews.
          </p>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
        {/* Average Rating */}
        <div className="bg-[#161810] border border-[#2D3C13] rounded-[16px] p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="font-sans text-[11px] uppercase tracking-wider text-[#72943A] font-semibold">
              Average Rating
            </span>
            <span className="text-[18px] text-[#EAB308]">★</span>
          </div>
          <div className="flex items-baseline gap-2 mt-3">
            <span className="font-heading font-bold text-[34px] text-[#E8EDD4] leading-none">
              {averageRating !== null && averageRating !== undefined
                ? Number(averageRating).toFixed(1)
                : "—"}
            </span>
            <span className="font-sans text-[13px] text-[#72943A]">/ 5.0</span>
          </div>
          <span className="font-sans text-[11px] text-[#8CB34A] mt-2">
            Public reputation score
          </span>
        </div>

        {/* Total Reviews */}
        <div className="bg-[#161810] border border-[#2D3C13] rounded-[16px] p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="font-sans text-[11px] uppercase tracking-wider text-[#72943A] font-semibold">
              Total Reviews
            </span>
            <span className="text-[18px]">🏆</span>
          </div>
          <div className="mt-3">
            <span className="font-heading font-bold text-[34px] text-[#E8EDD4] leading-none">
              {totalReviews}
            </span>
          </div>
          <span className="font-sans text-[11px] text-[#72943A] mt-2">
            Verified competition winners
          </span>
        </div>

        {/* 5-Star Reviews */}
        <div className="bg-[#161810] border border-[#2D3C13] rounded-[16px] p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="font-sans text-[11px] uppercase tracking-wider text-[#72943A] font-semibold">
              5-Star Feedback
            </span>
            <span className="text-[18px]">🌟</span>
          </div>
          <div className="flex items-baseline gap-2 mt-3">
            <span className="font-heading font-bold text-[34px] text-[#EAB308] leading-none">
              {fiveStarCount}
            </span>
            <span className="font-sans text-[13px] text-[#72943A]">
              ({stats?.percentages?.[5] || 0}%)
            </span>
          </div>
          <span className="font-sans text-[11px] text-[#EAB308] mt-2">
            Perfect ratings received
          </span>
        </div>

        {/* Satisfaction Rate */}
        <div className="bg-[#161810] border border-[#2D3C13] rounded-[16px] p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="font-sans text-[11px] uppercase tracking-wider text-[#72943A] font-semibold">
              Satisfaction Rate
            </span>
            <span className="text-[18px]">👍</span>
          </div>
          <div className="mt-3">
            <span className="font-heading font-bold text-[34px] text-[#4ADE80] leading-none">
              {satisfactionRate}%
            </span>
          </div>
          <span className="font-sans text-[11px] text-[#4ADE80] mt-2">
            4 & 5-star positive ratings
          </span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 bg-[#161810] border border-[#2D3C13] p-3 rounded-[12px]">
        <button
          onClick={() => {
            setSelectedRating(undefined);
            setPage(1);
          }}
          className={cn(
            "h-8 px-4 rounded-[8px] text-[12px] font-sans font-medium transition-colors cursor-pointer",
            selectedRating === undefined
              ? "bg-[#8CB34A] text-[#0D0D0B] font-semibold"
              : "bg-[#111210] border border-[#2D3C13] text-[#72943A] hover:text-[#E8EDD4]"
          )}
        >
          All Reviews ({totalReviews})
        </button>
        {[5, 4, 3, 2, 1].map((star) => {
          const count = stats?.breakdown?.[star] || 0;
          return (
            <button
              key={star}
              onClick={() => {
                setSelectedRating(selectedRating === star ? undefined : star);
                setPage(1);
              }}
              className={cn(
                "h-8 px-4 rounded-[8px] text-[12px] font-sans font-medium transition-colors cursor-pointer flex items-center gap-1.5",
                selectedRating === star
                  ? "bg-[#8CB34A] text-[#0D0D0B] font-semibold"
                  : "bg-[#111210] border border-[#2D3C13] text-[#72943A] hover:text-[#E8EDD4]"
              )}
            >
              <span>{star} ★</span>
              <span className="opacity-70">({count})</span>
            </button>
          );
        })}
      </div>

      {/* Reviews List */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-[#161810] border border-[#2D3C13] rounded-[16px] p-5 h-40 animate-pulse"
            />
          ))}
        </div>
      ) : isError ? (
        <div className="text-center py-12 bg-[#161810] border border-red-900/40 rounded-[16px]">
          <p className="font-sans text-sm text-red-400">
            Failed to load reviews. Please refresh the page.
          </p>
        </div>
      ) : reviews.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center gap-3 bg-[#161810] border border-[#2D3C13] rounded-[16px]">
          <span className="text-[36px]">⭐</span>
          <h3 className="font-heading font-medium text-[18px] text-[#E8EDD4]">
            {selectedRating ? `No ${selectedRating}-Star Reviews` : "No Reviews Received Yet"}
          </h3>
          <p className="font-sans text-[13px] text-[#72943A] max-w-[360px] leading-relaxed">
            {selectedRating
              ? `No reviews found for ${selectedRating} stars.`
              : "When players win prizes in your competitions, they can leave verified reviews and ratings here."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {reviews.map((review) => (
            <HostReviewCard key={review.id} review={review} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {data?.meta && data.meta.totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 pt-4 border-t border-[#2D3C13]">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 rounded-lg border border-[#2D3C13] text-[#72943A] hover:text-[#E8EDD4] disabled:opacity-30 disabled:cursor-not-allowed text-xs font-sans"
          >
            Previous
          </button>
          <span className="text-xs font-sans text-[#72943A] px-2">
            Page {page} of {data.meta.totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(data.meta.totalPages, p + 1))}
            disabled={page === data.meta.totalPages}
            className="px-4 py-2 rounded-lg border border-[#2D3C13] text-[#72943A] hover:text-[#E8EDD4] disabled:opacity-30 disabled:cursor-not-allowed text-xs font-sans"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
