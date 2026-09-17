"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import WebsiteNavbar from "../../../components/website/layout/WebsiteNavbar";
import WebsiteFooter from "../../../components/website/layout/WebsiteFooter";

function PaymentFailedContent() {
  const searchParams = useSearchParams();
  const orderNumber =
    searchParams.get("order") ||
    searchParams.get("ordernumber") ||
    searchParams.get("orderNumber") ||
    "";
  const errorMessage =
    searchParams.get("message") ||
    searchParams.get("error") ||
    "The transaction could not be processed by your card issuer or payment gateway.";

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-16 sm:py-24 text-center flex flex-col items-center">
      {/* Alert Icon */}
      <div className="relative mb-6">
        <div className="w-24 h-24 rounded-full bg-[#3B1212] border-2 border-[#EF4444] flex items-center justify-center shadow-[0_0_50px_rgba(239,68,68,0.3)]">
          <svg
            className="w-12 h-12 text-[#F87171]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={3}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </div>
        <span className="absolute -top-1 -right-1 flex h-6 w-6">
          <span className="relative inline-flex rounded-full h-6 w-6 bg-[#EF4444] items-center justify-center text-[10px] text-white font-bold">
            !
          </span>
        </span>
      </div>

      <h1 className="font-heading font-extrabold text-3xl sm:text-4xl text-[#E8EDD4] mb-3">
        Payment Failed
      </h1>
      <p className="font-sans text-sm sm:text-base text-[#B3B8AA] max-w-md mb-8">
        We were unable to complete your transaction via Cashflows. No charges
        have been applied to your account.
      </p>

      {/* Details / Guidance Card */}
      <div className="w-full bg-[#161810] border border-[#3B1212] rounded-2xl p-6 sm:p-8 text-left mb-8 space-y-4 shadow-xl">
        <div className="flex items-center justify-between border-b border-[#2D3C13] pb-4">
          <span className="text-xs font-semibold text-[#EF4444] uppercase tracking-wider">
            Transaction Status
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#3B1212] border border-[#7F1D1D] text-[#F87171]">
            <span className="h-2 w-2 rounded-full bg-[#EF4444]" />
            Declined / Unsuccessful
          </span>
        </div>

        {orderNumber && (
          <div className="flex items-center justify-between text-sm py-1 border-b border-[#2D3C13]/50">
            <span className="text-[#888D82]">Order Reference:</span>
            <span className="font-mono text-xs sm:text-sm font-semibold text-[#E8EDD4] break-all">
              {orderNumber}
            </span>
          </div>
        )}

        <div className="flex items-center justify-between text-sm py-1 border-b border-[#2D3C13]/50">
          <span className="text-[#888D82]">Reason:</span>
          <span className="text-xs sm:text-sm text-[#F87171] font-medium text-right max-w-[280px]">
            {errorMessage}
          </span>
        </div>

        <div className="pt-2">
          <div className="text-xs sm:text-sm text-[#B3B8AA] leading-relaxed bg-[#111210] p-4 rounded-xl border border-[#2D3C13] space-y-2">
            <p className="font-semibold text-[#E8EDD4]">Common reasons for payment issues:</p>
            <ul className="list-disc pl-5 space-y-1 text-[#888D82]">
              <li>3D Secure authentication was cancelled or timed out.</li>
              <li>Incorrect card details, expiry date, or CVV code.</li>
              <li>Insufficient funds or international transaction block from bank.</li>
              <li>Cashflows supports UK and Ireland cards for GBP payments.</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="w-full flex flex-col sm:flex-row items-center justify-center gap-4">
        <Link
          href="/basket"
          className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#EF4444] to-[#DC2626] hover:from-[#DC2626] hover:to-[#B91C1C] text-white font-heading font-bold text-sm sm:text-base shadow-[0_4px_20px_rgba(239,68,68,0.3)] transition-all transform hover:-translate-y-0.5 text-center"
        >
          Return to Basket & Retry
        </Link>

        <Link
          href="/dashboard"
          className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-[#1A230A] hover:bg-[#2D3C13] border border-[#43581E] text-[#A0D056] font-heading font-bold text-sm sm:text-base transition-colors text-center"
        >
          Go to Dashboard
        </Link>

        <Link
          href="/contact"
          className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-[#161810] hover:bg-[#1E2117] border border-[#2D3C13] text-[#E8EDD4] font-heading font-semibold text-sm sm:text-base transition-colors text-center"
        >
          Contact Support
        </Link>

        <Link
          href="/"
          className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-[#111210] hover:bg-[#161810] border border-[#2D3C13] text-[#888D82] hover:text-[#E8EDD4] font-sans text-sm sm:text-base transition-colors text-center"
        >
          Home Page
        </Link>
      </div>
    </div>
  );
}

export default function PaymentFailedPage() {
  return (
    <>
      <WebsiteNavbar />
      <main className="min-h-screen bg-[#0D0D0B] text-[#E8EDD4] pt-24 pb-16 flex items-center justify-center">
        <Suspense
          fallback={
            <div className="text-center py-20">
              <div className="w-12 h-12 border-4 border-[#EF4444] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-sm text-[#B3B8AA]">Loading...</p>
            </div>
          }
        >
          <PaymentFailedContent />
        </Suspense>
      </main>
      <WebsiteFooter />
    </>
  );
}
