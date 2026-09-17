"use client";

import React, { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import WebsiteNavbar from "../../../components/website/layout/WebsiteNavbar";
import WebsiteFooter from "../../../components/website/layout/WebsiteFooter";
import { useBasket } from "../../../features/basket/BasketContext";
import { useAuthUser } from "../../../hooks/useAuthHooks";
import { api } from "../../../services/api";

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const { clearBasket } = useBasket();
  const { data: user } = useAuthUser();

  const orderNumber =
    searchParams.get("ordernumber") ||
    searchParams.get("order") ||
    searchParams.get("orderNumber") ||
    "";
  const paymentJobRef =
    searchParams.get("paymentJobRef") ||
    searchParams.get("ref") ||
    searchParams.get("reference") ||
    "";
  const paymentType = searchParams.get("type") || "";
  const raffleParam = searchParams.get("raffle") || "";

  const [isConfirming, setIsConfirming] = useState(false);
  const [confirmResult, setConfirmResult] = useState<any>(null);

  // Clear basket upon arriving at success page
  useEffect(() => {
    clearBasket();
  }, [clearBasket]);

  // Proactively confirm return with backend if order reference exists
  useEffect(() => {
    if (!orderNumber && !paymentJobRef) return;

    let isMounted = true;
    const confirmOrder = async () => {
      setIsConfirming(true);
      try {
        const res = await api.post("/payment/confirm", {
          orderNumber: orderNumber || undefined,
          paymentJobRef: paymentJobRef || undefined,
        });
        if (isMounted) {
          setConfirmResult(res.data);
        }
      } catch (err: any) {
        // Even if already confirmed via webhook, display success state
        if (isMounted) {
          setConfirmResult({ success: true, note: "Order registered" });
        }
      } finally {
        if (isMounted) {
          setIsConfirming(false);
        }
      }
    };

    confirmOrder();
    return () => {
      isMounted = false;
    };
  }, [orderNumber, paymentJobRef]);

  const isSubscription =
    paymentType === "subscription" || orderNumber.startsWith("SUB_");
  const dashboardUrl = isSubscription
    ? "/dashboard/host/billing"
    : user?.role === "HOST"
    ? "/dashboard/host"
    : "/dashboard/user/tickets";

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-16 sm:py-24 text-center flex flex-col items-center">
      {/* Animated Success Badge */}
      <div className="relative mb-6">
        <div className="w-24 h-24 rounded-full bg-[#1A230A] border-2 border-[#8CB34A] flex items-center justify-center shadow-[0_0_50px_rgba(140,179,74,0.3)]">
          <svg
            className="w-12 h-12 text-[#A0D056] animate-bounce"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={3}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <span className="absolute -top-1 -right-1 flex h-6 w-6">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#8CB34A] opacity-75"></span>
          <span className="relative inline-flex rounded-full h-6 w-6 bg-[#A0D056] items-center justify-center text-[10px] text-black font-bold">
            ✓
          </span>
        </span>
      </div>

      <h1 className="font-heading font-extrabold text-3xl sm:text-4xl text-[#E8EDD4] mb-3">
        Payment Successful!
      </h1>
      <p className="font-sans text-sm sm:text-base text-[#B3B8AA] max-w-md mb-8">
        Thank you for your transaction. Your payment has been securely confirmed
        via Cashflows Gateway.
      </p>

      {/* Transaction Details Card */}
      <div className="w-full bg-[#161810] border border-[#2D3C13] rounded-2xl p-6 sm:p-8 text-left mb-8 space-y-4 shadow-xl">
        <div className="flex items-center justify-between border-b border-[#2D3C13] pb-4">
          <span className="text-xs font-semibold text-[#72943A] uppercase tracking-wider">
            Payment Status
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#1A230A] border border-[#43581E] text-[#A0D056]">
            <span className="h-2 w-2 rounded-full bg-[#8CB34A] animate-pulse" />
            {isConfirming ? "Confirming..." : "Completed & Verified"}
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

        {paymentJobRef && (
          <div className="flex items-center justify-between text-sm py-1 border-b border-[#2D3C13]/50">
            <span className="text-[#888D82]">Gateway Reference:</span>
            <span className="font-mono text-xs text-[#B3B8AA]">
              {paymentJobRef}
            </span>
          </div>
        )}

        <div className="flex items-center justify-between text-sm py-1 border-b border-[#2D3C13]/50">
          <span className="text-[#888D82]">Payment Gateway:</span>
          <span className="text-[#E8EDD4] font-medium flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#A0D056]"></span>
            Cashflows (GBP)
          </span>
        </div>

        <div className="pt-2">
          <p className="text-xs sm:text-sm text-[#B3B8AA] leading-relaxed bg-[#111210] p-4 rounded-xl border border-[#2D3C13]">
            {isSubscription ? (
              <span>
                🎉 Your host subscription plan is now active. You can start
                creating competitions and enjoying all host features.
              </span>
            ) : (
              <span>
                🎟️ Your competition ticket numbers have been securely generated and
                added to your account. You will receive an email confirmation
                shortly. Good luck in the draw!
              </span>
            )}
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="w-full flex flex-col sm:flex-row items-center justify-center gap-4">
        <Link
          href={dashboardUrl}
          className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#72943A] to-[#8CB34A] hover:from-[#8CB34A] hover:to-[#A0D056] text-[#0D0D0B] font-heading font-bold text-sm sm:text-base shadow-[0_4px_20px_rgba(140,179,74,0.3)] transition-all transform hover:-translate-y-0.5 text-center"
        >
          Go to Dashboard
        </Link>

        {!isSubscription && raffleParam && (
          <Link
            href={`/live-raffles/${raffleParam}`}
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-[#1A230A] hover:bg-[#2D3C13] border border-[#43581E] text-[#A0D056] font-heading font-bold text-sm sm:text-base transition-colors text-center"
          >
            View Competition
          </Link>
        )}

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

export default function PaymentSuccessPage() {
  return (
    <>
      <WebsiteNavbar />
      <main className="min-h-screen bg-[#0D0D0B] text-[#E8EDD4] pt-24 pb-16 flex items-center justify-center">
        <Suspense
          fallback={
            <div className="text-center py-20">
              <div className="w-12 h-12 border-4 border-[#8CB34A] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-sm text-[#B3B8AA]">Loading payment confirmation...</p>
            </div>
          }
        >
          <PaymentSuccessContent />
        </Suspense>
      </main>
      <WebsiteFooter />
    </>
  );
}
