"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import WebsiteNavbar from "../../../components/website/layout/WebsiteNavbar";
import WebsiteFooter from "../../../components/website/layout/WebsiteFooter";

function PaymentCancelContent() {
  const searchParams = useSearchParams();
  const orderNumber =
    searchParams.get("order") ||
    searchParams.get("ordernumber") ||
    searchParams.get("orderNumber") ||
    "";
  const paymentType = searchParams.get("type") || "";

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-16 sm:py-24 text-center flex flex-col items-center">
      {/* Warning/Cancel Badge */}
      <div className="relative mb-6">
        <div className="w-24 h-24 rounded-full bg-[#3B2C10] border-2 border-[#F59E0B] flex items-center justify-center shadow-[0_0_50px_rgba(245,158,11,0.3)]">
          <svg
            className="w-12 h-12 text-[#FBBF24]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
      </div>

      <h1 className="font-heading font-extrabold text-3xl sm:text-4xl text-[#E8EDD4] mb-3">
        Payment Cancelled
      </h1>
      <p className="font-sans text-sm sm:text-base text-[#B3B8AA] max-w-md mb-8">
        You have cancelled your checkout session. No charges were made to your
        card, and your tickets remain available to enter.
      </p>

      {/* Details Card */}
      <div className="w-full bg-[#161810] border border-[#2D3C13] rounded-2xl p-6 sm:p-8 text-left mb-8 space-y-4 shadow-xl">
        <div className="flex items-center justify-between border-b border-[#2D3C13] pb-4">
          <span className="text-xs font-semibold text-[#F59E0B] uppercase tracking-wider">
            Session Status
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#3B2C10] border border-[#78350F] text-[#FBBF24]">
            Cancelled by User
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

        <div className="pt-2">
          <p className="text-xs sm:text-sm text-[#B3B8AA] leading-relaxed bg-[#111210] p-4 rounded-xl border border-[#2D3C13]">
            💡 {paymentType === "subscription" ? (
              <span>
                Your host subscription checkout was cancelled. You can review our
                pricing tiers and subscribe whenever you are ready.
              </span>
            ) : (
              <span>
                Your selected tickets are still in your basket. If you would like
                to proceed, simply return to your basket and complete checkout.
              </span>
            )}
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="w-full flex flex-col sm:flex-row items-center justify-center gap-4">
        <Link
          href={paymentType === "subscription" ? "/pricing" : "/basket"}
          className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#72943A] to-[#8CB34A] hover:from-[#8CB34A] hover:to-[#A0D056] text-[#0D0D0B] font-heading font-bold text-sm sm:text-base shadow-[0_4px_20px_rgba(140,179,74,0.3)] transition-all transform hover:-translate-y-0.5 text-center"
        >
          {paymentType === "subscription" ? "View Pricing Plans" : "Return to Basket"}
        </Link>

        <Link
          href="/dashboard"
          className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-[#1A230A] hover:bg-[#2D3C13] border border-[#43581E] text-[#A0D056] font-heading font-bold text-sm sm:text-base transition-colors text-center"
        >
          Go to Dashboard
        </Link>

        <Link
          href="/live-raffles"
          className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-[#161810] hover:bg-[#1E2117] border border-[#2D3C13] text-[#E8EDD4] font-heading font-semibold text-sm sm:text-base transition-colors text-center"
        >
          Browse Raffles
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

export default function PaymentCancelPage() {
  return (
    <>
      <WebsiteNavbar />
      <main className="min-h-screen bg-[#0D0D0B] text-[#E8EDD4] pt-24 pb-16 flex items-center justify-center">
        <Suspense
          fallback={
            <div className="text-center py-20">
              <div className="w-12 h-12 border-4 border-[#F59E0B] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-sm text-[#B3B8AA]">Loading...</p>
            </div>
          }
        >
          <PaymentCancelContent />
        </Suspense>
      </main>
      <WebsiteFooter />
    </>
  );
}
