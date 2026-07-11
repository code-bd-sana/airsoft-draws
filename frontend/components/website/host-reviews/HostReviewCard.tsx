"use client";

import React, { useState } from "react";
import { HostReview } from "../../../types/review.types";
import { cn } from "../../../lib/utils";

interface HostReviewCardProps {
  review: HostReview;
}

export default function HostReviewCard({ review }: HostReviewCardProps) {
  const [isFlagged, setIsFlagged] = useState(review.status === "flagged");

  const handleFlag = () => {
    setIsFlagged(true);
    // In future: call API to flag review
  };

  return (
    <div className={cn(
      "border rounded-[12px] p-5 transition-all duration-200",
      isFlagged 
        ? "bg-[#1a1412] border-[#7f1d1d] opacity-75" 
        : "bg-surface border-border hover:border-border-medium"
    )}>
      <div className="flex justify-between items-start mb-3">
        <div className="flex flex-col">
          <span className="font-heading font-semibold text-text-primary text-sm">
            {review.reviewerName}
          </span>
          <span className="font-sans text-[10px] text-text-muted mt-0.5">
            {review.createdAt}
          </span>
        </div>
        
        <div className="flex items-center gap-1 text-[#eab308] text-sm">
          {Array.from({ length: 5 }).map((_, i) => (
            <span key={i} className={i < review.rating ? "opacity-100" : "opacity-20"}>★</span>
          ))}
        </div>
      </div>
      
      {review.competitionTitle && (
        <div className="mb-3">
          <span className="text-[10px] font-semibold text-[#5a752a] uppercase tracking-wider">
            Won: {review.competitionTitle}
          </span>
        </div>
      )}

      <p className="font-sans text-sm text-text-secondary leading-relaxed mb-4">
        {isFlagged ? (
          <span className="italic text-text-muted">This review is currently under moderation.</span>
        ) : (
          review.message
        )}
      </p>

      {/* Flag Button for Hosts */}
      {review.canBeFlagged && !isFlagged && (
        <div className="flex justify-end border-t border-divider pt-3">
          <button 
            onClick={handleFlag}
            className="text-[10px] font-semibold text-text-muted hover:text-[#ef4444] transition-colors flex items-center gap-1 cursor-pointer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3 h-3">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 3v1.5M3 21v-6m0 0 2.77-.693a15.26 15.26 0 0 1 9.46 0l2.77.693M3 15V4.5A1.5 1.5 0 0 1 4.5 3h15A1.5 1.5 0 0 1 21 4.5v10.5M21 15v-6" />
            </svg>
            Flag for Review
          </button>
        </div>
      )}
    </div>
  );
}
