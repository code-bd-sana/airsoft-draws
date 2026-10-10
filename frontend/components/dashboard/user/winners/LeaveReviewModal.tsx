"use client";

import React, { useState } from "react";
import { useSubmitReviewMutation, useUpdateReviewMutation } from "@/hooks/useReviewHooks";
import { UserWinner } from "@/services/user.service";
import { toast } from "sonner";

interface LeaveReviewModalProps {
  winner: UserWinner;
  isOpen: boolean;
  onClose: () => void;
}

const RATING_LABELS: Record<number, string> = {
  1: "Poor experience",
  2: "Fair, needs improvement",
  3: "Good & satisfactory",
  4: "Very good experience",
  5: "Excellent! Fast & transparent",
};

export default function LeaveReviewModal({
  winner,
  isOpen,
  onClose,
}: LeaveReviewModalProps) {
  const isEditing = Boolean(winner.hasReviewed && winner.review);
  const [rating, setRating] = useState<number>(winner.review?.rating || 5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [comment, setComment] = useState<string>(winner.review?.comment || "");

  const submitMutation = useSubmitReviewMutation();
  const updateMutation = useUpdateReviewMutation();
  const isPending = submitMutation.isPending || updateMutation.isPending;

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!rating || rating < 1 || rating > 5) {
      toast.error("Please select a star rating between 1 and 5.");
      return;
    }

    try {
      if (isEditing && winner.review?.id) {
        await updateMutation.mutateAsync({
          id: winner.review.id,
          payload: { rating, comment },
        });
        toast.success("Review updated successfully!");
      } else {
        await submitMutation.mutateAsync({
          winnerId: winner.id,
          rating,
          comment,
        });
        toast.success("Thank you! Your verified review has been published.");
      }
      onClose();
    } catch (err: any) {
      toast.error("Failed to submit review", {
        description: err?.response?.data?.message || err?.message || "Please try again.",
      });
    }
  };

  const activeStarRating = hoverRating || rating;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div
        className="bg-[#141512] border border-[#2D3C13] rounded-[20px] max-w-[540px] w-full p-6 sm:p-8 flex flex-col gap-6 shadow-2xl relative animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-[#72943A] hover:text-[#E8EDD4] transition-colors p-1"
          aria-label="Close dialog"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Header */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2">
            <span className="text-[20px]">⭐</span>
            <h2 className="font-heading font-bold text-xl sm:text-2xl text-[#E8EDD4]">
              {isEditing ? "Edit Your Review" : "Rate & Review Host"}
            </h2>
          </div>
          <p className="font-sans text-[13px] text-[#72943A]">
            Leave your verified winner feedback for{" "}
            <strong className="text-[#A0D056] font-medium">
              {winner.raffle?.hostBusinessName || "the competition host"}
            </strong>
            .
          </p>
        </div>

        {/* Won Product Details Preview Box */}
        <div className="bg-[#111210] border border-[#2D3C13] rounded-[12px] p-4 flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-[10px] bg-[#1A230A] border border-[#43581E] flex items-center justify-center text-[22px] shrink-0">
            {winner.winType === "INSTANT_WIN" ? "⚡" : "🏆"}
          </div>
          <div className="flex flex-col min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="font-sans text-[10px] uppercase font-bold tracking-wider text-[#8CB34A]">
                {winner.winType === "INSTANT_WIN" ? "Instant Win Prize" : "Grand Prize Win"}
              </span>
              <span className="text-[10px] text-[#5A752A]">• Ticket #{winner.ticketNumber}</span>
            </div>
            <span className="font-heading font-semibold text-[15px] text-[#E8EDD4] truncate mt-0.5">
              {winner.prizeName}
            </span>
            <span className="font-sans text-[12px] text-[#72943A] truncate">
              {winner.raffle?.title}
            </span>
          </div>
        </div>

        {/* Review Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* Star Rating Selector */}
          <div className="flex flex-col items-center justify-center gap-2 py-3 bg-[#111210] border border-[#2D3C13]/60 rounded-[14px]">
            <span className="font-sans text-[11px] uppercase tracking-wider text-[#72943A] font-semibold">
              Select Your Rating
            </span>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="p-1 cursor-pointer transition-transform duration-150 hover:scale-125 focus:outline-none"
                >
                  <svg
                    className={`w-8 h-8 transition-colors ${
                      star <= activeStarRating
                        ? "text-[#EAB308] fill-[#EAB308] drop-shadow-[0_0_8px_rgba(234,179,8,0.4)]"
                        : "text-[#2D3C13] fill-transparent"
                    }`}
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M11.48 3.499c.195-.39.771-.39.966 0l2.484 4.969 5.433.791c.42.061.587.576.283.876l-3.93 3.83 1.026 5.405c.08.423-.365.747-.738.547L12 18.254l-4.864 2.563c-.372.2-.818-.124-.738-.547l1.026-5.405-3.93-3.83c-.304-.3-.138-.815.283-.876l5.433-.791 2.484-4.969Z"
                    />
                  </svg>
                </button>
              ))}
            </div>
            <span className="font-sans text-[13px] font-medium text-[#A0D056] min-h-[20px]">
              {RATING_LABELS[activeStarRating] || "Click to rate"}
            </span>
          </div>

          {/* Feedback Text Area */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label htmlFor="review-comment" className="font-sans text-[12px] font-medium text-[#E8EDD4]">
                Your Review & Experience (Optional)
              </label>
              <span className="font-sans text-[10px] text-[#72943A]">
                {comment.length} / 1000 characters
              </span>
            </div>
            <textarea
              id="review-comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              maxLength={1000}
              rows={4}
              placeholder="Tell other players how your prize experience was (e.g. delivery speed, communication, packaging, item condition)..."
              className="w-full bg-[#111210] border border-[#2D3C13] rounded-[10px] p-3 text-[13px] text-[#E8EDD4] placeholder-[#5A752A] focus:outline-none focus:border-[#8CB34A] transition-colors resize-none"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-2 border-t border-[#2D3C13]/60">
            <button
              type="button"
              onClick={onClose}
              disabled={isPending}
              className="px-4 py-2.5 rounded-[10px] bg-transparent border border-[#2D3C13] hover:border-[#43581E] text-[#72943A] hover:text-[#E8EDD4] font-sans font-medium text-[13px] transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="px-6 py-2.5 rounded-[10px] bg-[#8CB34A] hover:bg-[#A0D056] disabled:opacity-50 text-[#0D0D0B] font-heading font-semibold text-[13px] transition-all flex items-center gap-2 cursor-pointer shadow-[0_0_15px_rgba(140,179,74,0.2)]"
            >
              {isPending && (
                <div className="w-4 h-4 border-2 border-[#0D0D0B] border-t-transparent rounded-full animate-spin" />
              )}
              {isEditing ? "Save Review" : "Publish Review"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
