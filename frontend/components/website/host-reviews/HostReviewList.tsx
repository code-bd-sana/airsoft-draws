"use client";

import React, { useState } from "react";
import { useHostReviewsQuery } from "@/hooks/useReviewHooks";
import HostReviewCard from "./HostReviewCard";
import { cn } from "@/lib/utils";

interface HostReviewListProps {
  hostId: string;
}

export default function HostReviewList({ hostId }: HostReviewListProps) {
  const [selectedRating, setSelectedRating] = useState<number | undefined>(undefined);
  const [page, setPage] = useState<number>(1);

  const { data, isLoading, isError } = useHostReviewsQuery(hostId, {
    page,
    limit: 12,
    rating: selectedRating,
  });

  const reviews = data?.reviews || [];
  const stats = data?.stats;
  const totalReviews = stats?.totalReviews || 0;
  const averageRating = stats?.averageRating;

  return (
    <div className="flex flex-col gap-8 w-full animate-fadeIn">
      {/* 1. Rating Overview & Breakdown Section */}
      <div className="bg-[#111210] border border-[#2D3C13] rounded-[18px] p-6 sm:p-8 flex flex-col md:flex-row items-center md:items-stretch gap-8 justify-between">
        {/* Left: Overall Score Card */}
        <div className="flex flex-col items-center justify-center text-center p-4 md:border-r md:border-[#2D3C13] md:pr-10 shrink-0">
          <div className="flex items-baseline gap-1">
            <span className="font-heading font-black text-[48px] sm:text-[56px] text-[#E8EDD4] leading-none">
              {averageRating !== null && averageRating !== undefined
                ? Number(averageRating).toFixed(1)
                : "—"}
            </span>
            <span className="font-sans text-[16px] text-[#72943A]">/ 5.0</span>
          </div>

          <div className="flex items-center gap-1 text-[#EAB308] text-[20px] my-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                className={
                  star <= Math.round(averageRating || 0)
                    ? "opacity-100"
                    : "opacity-20 text-[#72943A]"
                }
              >
                ★
              </span>
            ))}
          </div>

          <span className="font-sans text-[13px] font-medium text-[#A0D056]">
            {totalReviews > 0
              ? `${totalReviews} Verified ${totalReviews === 1 ? "Review" : "Reviews"}`
              : "No reviews yet"}
          </span>
          <span className="font-sans text-[11px] text-[#72943A] mt-1">
            Based on genuine winners
          </span>
        </div>

        {/* Right: Star Distribution Bars */}
        <div className="flex flex-col justify-center gap-2.5 flex-1 w-full max-w-[500px]">
          {[5, 4, 3, 2, 1].map((star) => {
            const count = stats?.breakdown?.[star] || 0;
            const percent = stats?.percentages?.[star] || 0;
            const isSelected = selectedRating === star;

            return (
              <button
                key={star}
                onClick={() => {
                  setSelectedRating(isSelected ? undefined : star);
                  setPage(1);
                }}
                className={cn(
                  "flex items-center gap-3 w-full group py-1 px-2 rounded-lg transition-colors cursor-pointer text-left",
                  isSelected ? "bg-[#1A230A]" : "hover:bg-[#161810]"
                )}
              >
                <div className="flex items-center gap-1 w-12 text-[12px] font-medium font-sans text-[#E8EDD4] shrink-0">
                  <span>{star}</span>
                  <span className="text-[#EAB308]">★</span>
                </div>

                <div className="flex-1 h-2.5 bg-[#1A230A] border border-[#2D3C13] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#8CB34A] rounded-full transition-all duration-500"
                    style={{ width: `${percent}%` }}
                  />
                </div>

                <div className="w-16 text-right font-sans text-[11px] text-[#72943A] shrink-0">
                  {count} ({percent}%)
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Star Filter Pills */}
      <div className="flex flex-wrap items-center gap-2 pb-2">
        <button
          onClick={() => {
            setSelectedRating(undefined);
            setPage(1);
          }}
          className={cn(
            "h-8 px-3.5 rounded-full text-[12px] font-sans font-medium transition-colors cursor-pointer",
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
                "h-8 px-3.5 rounded-full text-[12px] font-sans font-medium transition-colors cursor-pointer flex items-center gap-1",
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

      {/* 3. Review Cards Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-[#111210] border border-[#2D3C13] rounded-[16px] p-5 h-40 animate-pulse"
            />
          ))}
        </div>
      ) : isError ? (
        <div className="text-center py-12 bg-[#111210] border border-red-900/40 rounded-[16px]">
          <p className="font-sans text-sm text-red-400">
            Failed to load reviews. Please refresh the page.
          </p>
        </div>
      ) : reviews.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center gap-3 bg-[#111210] border border-[#2D3C13] rounded-[16px] max-w-[600px] mx-auto w-full">
          <span className="text-[36px]">⭐</span>
          <h3 className="font-heading font-medium text-[18px] text-[#E8EDD4]">
            {selectedRating
              ? `No ${selectedRating}-Star Reviews`
              : "No Host Reviews Yet"}
          </h3>
          <p className="font-sans text-[13px] text-[#72943A] max-w-[360px] leading-relaxed">
            {selectedRating
              ? `This host has no reviews matching the ${selectedRating}-star filter. Try selecting "All Reviews".`
              : "Reviews are left by verified winners after winning a main draw or instant prize from this host."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((review) => (
            <HostReviewCard key={review.id} review={review} />
          ))}
        </div>
      )}

      {/* Pagination if multiple pages */}
      {data?.meta && data.meta.totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-4 pt-4 border-t border-[#2D3C13]">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-3 py-1.5 rounded-lg border border-[#2D3C13] text-[#72943A] hover:text-[#E8EDD4] disabled:opacity-30 disabled:cursor-not-allowed text-xs font-sans"
          >
            Previous
          </button>
          <span className="text-xs font-sans text-[#72943A] px-2">
            Page {page} of {data.meta.totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(data.meta.totalPages, p + 1))}
            disabled={page === data.meta.totalPages}
            className="px-3 py-1.5 rounded-lg border border-[#2D3C13] text-[#72943A] hover:text-[#E8EDD4] disabled:opacity-30 disabled:cursor-not-allowed text-xs font-sans"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
