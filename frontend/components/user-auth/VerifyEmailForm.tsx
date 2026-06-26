"use client";

import React, { useState } from "react";
import Link from "next/link";
import PrimaryButton from "../website/shared/PrimaryButton";

export default function VerifyEmailForm() {
  const [isResending, setIsResending] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleResend = () => {
    setIsResending(true);
    setTimeout(() => {
      setIsResending(false);
      setToastMessage("Verification link resent! Please check your inbox.");
      setTimeout(() => setToastMessage(null), 3000);
    }, 1500);
  };

  return (
    <div className="bg-surface border border-divider p-6 md:p-10 rounded-card shadow-card w-full max-w-xl mx-auto flex flex-col items-center text-center animate-fadeIn select-none">
      {/* Toast popup */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 bg-accent-bg border border-primary text-text-brand px-4 py-3 rounded-button shadow-card text-xs md:text-sm animate-fadeIn">
          {toastMessage}
        </div>
      )}

      {/* Envelope Icon */}
      <div className="w-12 h-12 rounded-full bg-accent-bg border border-primary flex items-center justify-center mb-6">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="w-6 h-6 text-text-brand"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
        </svg>
      </div>

      {/* Header */}
      <h2 className="font-heading font-normal text-2xl md:text-3xl text-text-primary mb-3">
        Verify Your Email
      </h2>

      {/* Explanation */}
      <p className="font-sans text-xs md:text-sm text-text-secondary leading-relaxed mb-6 max-w-sm">
        We&apos;ve sent a verification link to your email address. Please click the link inside the email to activate and verify your account.
      </p>

      {/* Resend Button */}
      <div className="w-full mb-8">
        <PrimaryButton
          type="button"
          onClick={handleResend}
          disabled={isResending}
          className="w-full py-3.5 uppercase tracking-wider font-heading font-semibold text-sm"
        >
          {isResending ? "Resending..." : "Resend Verification Email"}
        </PrimaryButton>
      </div>

      {/* Footer link */}
      <Link
        href="/login"
        className="font-sans font-semibold text-xs text-text-brand hover:text-primary-hover uppercase tracking-wider transition-colors duration-200"
      >
        &larr; Back to Login
      </Link>
    </div>
  );
}
