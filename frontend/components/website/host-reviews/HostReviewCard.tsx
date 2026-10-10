"use client";

import React, { useState } from "react";
import { HostReview } from "@/types/review.types";
import { reviewService } from "@/services/review.service";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface HostReviewCardProps {
  review: HostReview;
}

export default function HostReviewCard({ review }: HostReviewCardProps) {
  const [isFlagged, setIsFlagged] = useState(
    review.status === "flagged" || review.status === "FLAGGED"
  );
  const [flagging, setFlagging] = useState(false);

  const handleFlag = async () => {
    try {
      setFlagging(true);
      await reviewService.flagReview(review.id);
      setIsFlagged(true);
      toast.success("Review flagged for moderator review.");
    } catch {
      toast.error("Failed to flag review.");
    } finally {
      setFlagging(false);
    }
  };

  const formattedDate = review.createdAt
    ? new Date(review.createdAt).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "";

  const displayMessage = review.message || review.comment;
  const wonItem = review.prizeName || review.competitionTitle;

  const initials = review.reviewerName
    ? review.reviewerName
        .split(" ")
        .map((n) => n[0])
        .filter(Boolean)
        .join("")
        .substring(0, 2)
        .toUpperCase()
    : "W";

  return (
    <div
      className={cn(
        "border rounded-[16px] p-5 transition-all duration-300 flex flex-col justify-between",
        isFlagged
          ? "bg-[#1a1412] border-[#7f1d1d] opacity-75"
          : "bg-[#111210] border-[#2D3C13] hover:border-[#43581E] hover:bg-[#151711]"
      )}
    >
      <div>
        {/* Top Header: Reviewer Info + Star Rating */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#1A230A] border border-[#43581E] flex items-center justify-center shrink-0 overflow-hidden text-[13px] font-heading font-bold text-[#8CB34A]">
              {review.avatarUrl ? (
                <img
                  src={review.avatarUrl}
                  alt={review.reviewerName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span>{initials}</span>
              )}
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-heading font-semibold text-[#E8EDD4] text-[14px]">
                  {review.reviewerName}
                </span>
                <span className="bg-[#1A230A] border border-[#8CB34A]/40 text-[#8CB34A] text-[9px] font-bold px-1.5 py-0.5 rounded-[4px] uppercase tracking-wide">
                  Verified Winner
                </span>
              </div>
              <span className="font-sans text-[11px] text-[#72943A] mt-0.5">
                {formattedDate}
              </span>
            </div>
          </div>

          {/* Stars */}
          <div className="flex items-center gap-1 text-[#EAB308] text-[15px] shrink-0">
            {Array.from({ length: 5 }).map((_, i) => (
              <span
                key={i}
                className={i < review.rating ? "opacity-100" : "opacity-20 text-[#72943A]"}
              >
                ★
              </span>
            ))}
          </div>
        </div>

        {/* Won Prize Badge */}
        {wonItem && (
          <div className="mb-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[6px] bg-[#161B0E] border border-[#2D3C13]">
            <span className="text-[11px]">
              {review.winType === "INSTANT_WIN" ? "⚡" : "🏆"}
            </span>
            <span className="text-[11px] font-sans font-medium text-[#A0D056] truncate max-w-[320px]">
              Won: {wonItem}
            </span>
          </div>
        )}

        {/* Comment Text */}
        <p className="font-sans text-[13px] text-[#D5DCBE] leading-relaxed mb-4">
          {isFlagged ? (
            <span className="italic text-[#72943A]">
              This review has been flagged and is currently under moderation.
            </span>
          ) : displayMessage ? (
            displayMessage
          ) : (
            <span className="italic text-[#72943A]">
              No written feedback provided.
            </span>
          )}
        </p>
      </div>

      {/* Footer / Flag for review */}
      {!isFlagged && review.canBeFlagged !== false && (
        <div className="flex justify-end border-t border-[#2D3C13]/60 pt-3 mt-1">
          <button
            onClick={handleFlag}
            disabled={flagging}
            className="text-[10px] font-semibold text-[#72943A] hover:text-[#ef4444] transition-colors flex items-center gap-1 cursor-pointer"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-3 h-3"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 3v1.5M3 21v-6m0 0 2.77-.693a15.26 15.26 0 0 1 9.46 0l2.77.693M3 15V4.5A1.5 1.5 0 0 1 4.5 3h15A1.5 1.5 0 0 1 21 4.5v10.5M21 15v-6"
              />
            </svg>
            Flag Review
          </button>
        </div>
      )}
    </div>
  );
}
