"use client";

import React, { useState, useEffect } from "react";
import { useAuthUser } from "@/hooks/useAuthHooks";
import {
  useUnclaimedInstantWinsQuery,
  useClaimInstantWinsMutation,
} from "@/hooks/useUserHooks";
import WinAnimationModal, { WinPrizeItem } from "@/components/ui/WinAnimationModal";
import { toast } from "sonner";

export default function InstantWinCelebrationManager() {
  const { data: user } = useAuthUser();
  const { data: unclaimedWins = [] } = useUnclaimedInstantWinsQuery(!!user?.id);
  const claimMutation = useClaimInstantWinsMutation();

  const [isOpen, setIsOpen] = useState(false);
  const [hasDismissedSession, setHasDismissedSession] = useState(false);

  useEffect(() => {
    if (unclaimedWins.length > 0 && !hasDismissedSession) {
      setIsOpen(true);
    } else if (unclaimedWins.length === 0) {
      setIsOpen(false);
    }
  }, [unclaimedWins, hasDismissedSession]);

  const handleClaim = async () => {
    if (unclaimedWins.length === 0) return;
    try {
      const winnerIds = unclaimedWins.map((w) => w.id);
      await claimMutation.mutateAsync(winnerIds);
      setIsOpen(false);
      toast.success(
        unclaimedWins.length > 1
          ? `🎉 ${unclaimedWins.length} Instant Win prizes claimed!`
          : "🎉 Instant Win prize claimed!",
        {
          description:
            "Your prize has been recorded. Check your Dashboard > Winnings for delivery and verification status.",
          duration: 6000,
        }
      );
    } catch (err: any) {
      toast.error("Could not claim instant win", {
        description: err?.message || "Please try again or contact support.",
      });
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setHasDismissedSession(true);
  };

  if (!user || unclaimedWins.length === 0) {
    return null;
  }

  const prizes: WinPrizeItem[] = unclaimedWins.map((w) => ({
    id: w.id,
    title: w.prizeName,
    ticketNumber: w.ticketNumber,
    image: w.prizeImage,
    rrpValue: w.rrpValue,
    raffleTitle: w.raffleTitle,
  }));

  return (
    <WinAnimationModal
      isOpen={isOpen}
      onClose={handleClose}
      onClaim={handleClaim}
      isClaiming={claimMutation.isPending}
      prizes={prizes}
    />
  );
}
