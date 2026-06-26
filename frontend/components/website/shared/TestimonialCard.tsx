import React from "react";
import { Testimonial } from "../../../types/testimonial.types";

interface TestimonialCardProps {
  testimonial: Testimonial;
}

/**
 * Reusable Card component for customer reviews and testimonials.
 */
export default function TestimonialCard({ testimonial }: TestimonialCardProps) {
  const { name, role, quote, rating, location } = testimonial;

  // Render a star SVG icon
  const StarIcon = ({ filled }: { filled: boolean }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth={2}
      className={`w-4 h-4 ${filled ? "text-primary" : "text-divider"}`}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M11.48 3.499c.195-.39.771-.39.966 0l2.484 4.969 5.433.791c.42.061.587.576.283.876l-3.93 3.83 1.026 5.405c.08.423-.365.747-.738.547L12 18.254l-4.864 2.563c-.372.2-.818-.124-.738-.547l1.026-5.405-3.93-3.83c-.304-.3-.138-.815.283-.876l5.433-.791 2.484-4.969Z"
      />
    </svg>
  );

  // Extract initials
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <div className="flex flex-col bg-surface border border-border rounded-card p-6 md:p-8 shadow-card transition-all duration-300 hover:border-border-medium hover:shadow-glow">
      {/* Stars row */}
      <div className="flex items-center gap-1.5 mb-5">
        {[...Array(5)].map((_, i) => (
          <StarIcon key={i} filled={i < rating} />
        ))}
      </div>

      {/* Quote */}
      <blockquote className="font-sans text-sm md:text-base text-text-muted leading-relaxed mb-6 italic">
        &ldquo;{quote}&rdquo;
      </blockquote>

      {/* Author block */}
      <div className="flex items-center gap-4 mt-auto">
        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-accent-bg border border-primary text-text-brand text-xs font-bold font-heading">
          {initials}
        </div>
        <div className="flex flex-col">
          <cite className="font-heading font-bold text-sm text-text-primary not-italic">
            {name}
          </cite>
          <span className="font-sans text-[10px] text-text-muted font-medium">
            {role} {location && `• ${location}`}
          </span>
        </div>
      </div>
    </div>
  );
}
