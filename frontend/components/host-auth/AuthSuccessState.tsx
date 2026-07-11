"use client";

import React from "react";
import Link from "next/link";
import PrimaryButton from "../website/shared/PrimaryButton";

interface AuthSuccessStateProps {
  title: string;
  description: string;
  buttonText?: string;
  buttonHref?: string;
}

export default function AuthSuccessState({
  title,
  description,
  buttonText = "Back to Homepage",
  buttonHref = "/",
}: AuthSuccessStateProps) {
  return (
    <div className="bg-surface border border-border p-6 md:p-12 rounded-card shadow-card flex flex-col items-center text-center animate-fadeIn max-w-xl mx-auto">
      {/* Animated Success Circle Icon */}
      <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-success-bg border border-success flex items-center justify-center mb-6 text-success-text shadow-glow">
        <svg
          className="w-8 h-8 md:w-10 md:h-10 animate-scaleIn"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
        </svg>
      </div>

      {/* Success Text */}
      <h2 className="font-heading font-bold text-2xl md:text-3xl text-text-primary mb-4">
        {title}
      </h2>
      <p className="font-sans text-sm md:text-base text-text-muted leading-relaxed mb-8">
        {description}
      </p>

      {/* Action Button */}
      <PrimaryButton href={buttonHref} className="w-full sm:w-auto px-8">
        {buttonText}
      </PrimaryButton>
    </div>
  );
}
