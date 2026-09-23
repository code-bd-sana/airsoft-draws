"use client";

import React, { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import WebsiteNavbar from "../../../components/website/layout/WebsiteNavbar";
import WebsiteFooter from "../../../components/website/layout/WebsiteFooter";
import { useBasket } from "../../../features/basket/BasketContext";
import { useAuthUser } from "../../../hooks/useAuthHooks";
import {
  useUnclaimedInstantWinsQuery,
  useClaimInstantWinsMutation,
} from "../../../hooks/useUserHooks";
import WinAnimationModal, {
  WinPrizeItem,
} from "../../../components/ui/WinAnimationModal";
import { toast } from "sonner";
import { api } from "../../../services/api";

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const { clearBasket, removeFromBasket } = useBasket();
  const { data: user } = useAuthUser();

  const isHost = user?.role?.toUpperCase() === "HOST";

  const orderNumber =
    searchParams.get("ordernumber") ||
    searchParams.get("order") ||
    searchParams.get("orderNumber") ||
    "";
  const paymentJobRef =
    searchParams.get("paymentjobref") ||
    searchParams.get("paymentJobRef") ||
    searchParams.get("ref") ||
    searchParams.get("reference") ||
    "";
  const paymentType = searchParams.get("type") || "";
  const raffleParam = searchParams.get("raffle") || "";

  const isSubscription =
    paymentType === "subscription" || orderNumber.startsWith("SUB_");

  const [isConfirming, setIsConfirming] = useState(false);
  const [confirmResult, setConfirmResult] = useState<any>(null);

  const [showWinModal, setShowWinModal] = useState(false);
  const [hasTriggeredModal, setHasTriggeredModal] = useState(false);

  // Fetch unclaimed instant wins from DB for normal users
  const { data: dbUnclaimedWins = [] } = useUnclaimedInstantWinsQuery(
    Boolean(user?.id && !isHost)
  );
  const claimMutation = useClaimInstantWinsMutation();

  // Combine order instant wins with DB unclaimed wins
  const orderInstantWins = confirmResult?.instantWins;
  const rawWins =
    orderInstantWins !== undefined && orderInstantWins !== null
      ? orderInstantWins
      : dbUnclaimedWins;

  const modalPrizes: WinPrizeItem[] = (rawWins || []).map((w: any) => ({
    id: w.id,
    title: w.prizeName || w.title || "Instant Win Prize",
    ticketNumber: w.ticketNumber,
    image: w.prizeImage || w.image || null,
    rrpValue: w.rrpValue ? Number(w.rrpValue) : null,
    raffleTitle: w.raffleTitle,
  }));


  const handleClaimPrizes = async () => {
    if (modalPrizes.length === 0) {
      setShowWinModal(false);
      return;
    }
    try {
      const winnerIds = modalPrizes
        .map((p) => p.id)
        .filter(Boolean) as string[];
      await claimMutation.mutateAsync(
        winnerIds.length > 0 ? winnerIds : undefined
      );
      setShowWinModal(false);
      toast.success(
        modalPrizes.length > 1
          ? `🎉 ${modalPrizes.length} Instant Win prizes claimed!`
          : "🎉 Instant Win prize claimed!",
        {
          description:
            "Your prize has been recorded. Check your Dashboard > Winnings for delivery and verification status.",
          duration: 6000,
        }
      );
      queryClient.invalidateQueries({ queryKey: ["unclaimed-instant-wins"] });
      queryClient.invalidateQueries({ queryKey: ["my-winners"] });
      queryClient.invalidateQueries({ queryKey: ["my-tickets"] });
    } catch (err: any) {
      toast.error("Could not claim instant win", {
        description: err?.message || "Please try again or contact support.",
      });
    }
  };

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
          if (res.data?.success) {
            // Trigger instant win check & celebration
            queryClient.invalidateQueries({ queryKey: ["unclaimed-instant-wins"] });
            if (res.data?.instantWins && res.data.instantWins.length > 0) {
              queryClient.setQueryData(["unclaimed-instant-wins"], res.data.instantWins);
            }

            const isDirectPending =
              typeof window !== "undefined" &&
              localStorage.getItem("direct_checkout_pending") === "true";

            if (isDirectPending) {
              const directRaffleId = localStorage.getItem("direct_checkout_raffle_id");
              localStorage.removeItem("direct_checkout_pending");
              if (directRaffleId) {
                removeFromBasket(directRaffleId);
                localStorage.removeItem("direct_checkout_raffle_id");
              }
            } else {
              clearBasket();
            }
          }
        }
      } catch (err: any) {
        if (isMounted) {
          setConfirmResult({
            success: false,
            error:
              err.response?.data?.message ||
              err.message ||
              "Could not verify order status",
          });
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
  }, [orderNumber, paymentJobRef, clearBasket, queryClient, removeFromBasket]);

  const dashboardUrl = isSubscription
    ? "/dashboard/host/billing"
    : isHost
    ? "/dashboard/host"
    : "/dashboard/user/tickets";

  const isCancelled =
    confirmResult?.status === "CANCELLED" ||
    (confirmResult && !confirmResult.success && !confirmResult.pending);
  const isPending = isConfirming || confirmResult?.pending;
  const isSuccess =
    confirmResult?.success || (!confirmResult && !isConfirming);

  // Auto-open win animation modal when page is loaded for regular users with successful payment
  useEffect(() => {
    // If actively confirming with payment gateway, wait until confirmation completes
    if (isConfirming) return;
    // If payment was cancelled or pending gateway clearance, do not open
    if (isCancelled || isPending) return;
    // Do not show for host accounts or subscription payments
    if (isHost || isSubscription) return;
    // Only auto-trigger once per page visit
    if (hasTriggeredModal) return;

    // Auto-open modal smoothly after brief mount delay
    const timer = setTimeout(() => {
      setShowWinModal(true);
      setHasTriggeredModal(true);
    }, 350);

    return () => clearTimeout(timer);
  }, [isConfirming, isCancelled, isPending, isHost, isSubscription, hasTriggeredModal]);

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-16 sm:py-24 text-center flex flex-col items-center">
      {/* Dynamic Status Badge */}
      {isCancelled ? (
        <div className="relative mb-6">
          <div className="w-24 h-24 rounded-full bg-[#2A0E0E] border-2 border-[#E05252] flex items-center justify-center shadow-[0_0_50px_rgba(224,82,82,0.3)]">
            <svg
              className="w-12 h-12 text-[#FF6B6B]"
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
        </div>
      ) : isPending ? (
        <div className="relative mb-6">
          <div className="w-24 h-24 rounded-full bg-[#261E09] border-2 border-[#D97706] flex items-center justify-center shadow-[0_0_50px_rgba(217,119,6,0.3)]">
            <svg
              className="w-12 h-12 text-[#F59E0B] animate-spin"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          </div>
        </div>
      ) : (
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
      )}

      <h1 className="font-heading font-extrabold text-3xl sm:text-4xl text-[#E8EDD4] mb-3">
        {isCancelled
          ? "Payment Cancelled or Declined"
          : isPending
          ? "Awaiting Gateway Confirmation"
          : "Payment Successful!"}
      </h1>
      <p className="font-sans text-sm sm:text-base text-[#B3B8AA] max-w-md mb-8">
        {isCancelled
          ? confirmResult?.message ||
            "Your transaction was not completed. No tickets have been allocated to your account."
          : isPending
          ? "We are verifying your transaction with Cashflows. Your tickets will be allocated as soon as payment is confirmed."
          : "Thank you for your transaction. Your payment has been securely confirmed via Cashflows Gateway."}
      </p>

      {/* Transaction Details Card */}
      <div className="w-full bg-[#161810] border border-[#2D3C13] rounded-2xl p-6 sm:p-8 text-left mb-8 space-y-4 shadow-xl">
        <div className="flex items-center justify-between border-b border-[#2D3C13] pb-4">
          <span className="text-xs font-semibold text-[#72943A] uppercase tracking-wider">
            Payment Status
          </span>
          {isCancelled ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#2A0E0E] border border-[#8A2323] text-[#FF6B6B]">
              <span className="h-2 w-2 rounded-full bg-[#E05252]" />
              Cancelled / Declined
            </span>
          ) : isPending ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#261E09] border border-[#784A0E] text-[#F59E0B]">
              <span className="h-2 w-2 rounded-full bg-[#D97706] animate-pulse" />
              Verifying Payment...
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#1A230A] border border-[#43581E] text-[#A0D056]">
              <span className="h-2 w-2 rounded-full bg-[#8CB34A] animate-pulse" />
              Completed &amp; Verified
            </span>
          )}
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
            <span
              className={`w-2 h-2 rounded-full ${
                isCancelled ? "bg-[#E05252]" : isPending ? "bg-[#D97706]" : "bg-[#A0D056]"
              }`}
            ></span>
            Cashflows (GBP)
          </span>
        </div>

        <div className="pt-2">
          <p className="text-xs sm:text-sm text-[#B3B8AA] leading-relaxed bg-[#111210] p-4 rounded-xl border border-[#2D3C13]">
            {isCancelled ? (
              <span>
                ⚠️ No charges were completed. If this was intentional, you can browse other
                raffles or retry payment when ready.
              </span>
            ) : isSubscription ? (
              <span>
                🎉 Your host subscription plan is now active. You can start
                creating competitions and enjoying all host features.
              </span>
            ) : isPending ? (
              <span>
                ⏳ We are awaiting confirmation from the payment provider. As soon as payment
                clears, your tickets will automatically appear in your account.
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

      {/* Instant Win Banner (User Role Only) */}
      {!isCancelled && !isPending && !isHost && !isSubscription && (
        modalPrizes.length > 0 ? (
          <div className="w-full bg-gradient-to-r from-[#1A230A] via-[#263510] to-[#1A230A] border-2 border-[#8CB34A] rounded-2xl p-5 sm:p-6 text-left mb-8 shadow-[0_0_30px_rgba(140,179,74,0.25)] flex flex-col sm:flex-row items-center justify-between gap-4 animate-in fade-in duration-500">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-[#2D3C13] border border-[#8CB34A] flex items-center justify-center text-2xl flex-shrink-0 animate-bounce">
                🎉
              </div>
              <div>
                <h3 className="font-heading font-bold text-lg text-[#E8EDD4]">
                  You Won {modalPrizes.length} Instant Win Prize{modalPrizes.length > 1 ? "s" : ""}!
                </h3>
                <p className="font-sans text-xs text-[#B3B8AA]">
                  Click below to view details and claim your prize{modalPrizes.length > 1 ? "s" : ""}.
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowWinModal(true)}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#72943A] to-[#8CB34A] hover:from-[#8CB34A] hover:to-[#A0D056] text-[#0D0D0B] font-heading font-bold text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all cursor-pointer whitespace-nowrap text-center"
            >
              View &amp; Claim Prizes
            </button>
          </div>
        ) : (
          <div className="w-full bg-[#161810] border border-[#2D3C13] rounded-2xl p-4 text-left mb-8 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="text-xl">🎯</span>
              <div>
                <span className="font-heading font-semibold text-xs text-[#E8EDD4] block">
                  Instant Win Result
                </span>
                <span className="font-sans text-[11px] text-[#72943A]">
                  All tickets are active and entered in the Grand Prize draw.
                </span>
              </div>
            </div>
            <button
              onClick={() => setShowWinModal(true)}
              className="px-3.5 py-1.5 rounded-lg bg-[#1A230A] hover:bg-[#2D3C13] border border-[#43581E] text-[#A0D056] font-heading font-semibold text-xs transition-colors cursor-pointer"
            >
              Check Draw Result
            </button>
          </div>
        )
      )}

      {/* Action Buttons */}
      <div className="w-full flex flex-col sm:flex-row items-center justify-center gap-4">
        {!isCancelled && (
          <Link
            href={dashboardUrl}
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#72943A] to-[#8CB34A] hover:from-[#8CB34A] hover:to-[#A0D056] text-[#0D0D0B] font-heading font-bold text-sm sm:text-base shadow-[0_4px_20px_rgba(140,179,74,0.3)] transition-all transform hover:-translate-y-0.5 text-center"
          >
            Go to Dashboard
          </Link>
        )}

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

      {/* Instant Win Modal (User role only) */}
      {!isHost && !isSubscription && (
        <WinAnimationModal
          isOpen={showWinModal}
          onClose={() => setShowWinModal(false)}
          prizes={modalPrizes}
          onClaim={handleClaimPrizes}
          isClaiming={claimMutation.isPending}
        />
      )}
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
