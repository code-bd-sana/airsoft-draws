"use client";

import React from "react";
import Link from "next/link";
import { useUserOrdersQuery } from "@/hooks/useTicketHooks";

export default function IncompleteOrdersBanner() {
  const { data: orders = [] } = useUserOrdersQuery();

  const pendingOrders = orders.filter(
    (o) => o.status === "PENDING" || o.status === "CANCELLED",
  );

  if (pendingOrders.length === 0) {
    return null;
  }

  const payableOrders = pendingOrders.filter((o) => o.canPay);

  return (
    <div className="w-full bg-gradient-to-r from-[#2A200B] to-[#1E1707] border border-[#F59E0B]/50 rounded-[14px] p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-[0_4px_20px_rgba(245,158,11,0.15)] animate-fadeIn">
      <div className="flex items-start gap-3.5">
        <div className="w-10 h-10 rounded-xl bg-[#3B2C10] border border-[#78350F] flex items-center justify-center flex-shrink-0 text-[#FBBF24]">
          <svg
            className="w-5 h-5 animate-pulse"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>

        <div>
          <div className="flex items-center gap-2">
            <h4 className="font-heading font-bold text-sm sm:text-base text-[#FDE68A]">
              You have {pendingOrders.length} Incomplete Order
              {pendingOrders.length > 1 ? "s" : ""}
            </h4>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#F59E0B] text-black">
              Unpaid
            </span>
          </div>
          <p className="font-sans text-xs sm:text-sm text-[#D1D5DB] mt-0.5">
            Tickets are only reserved in competitions once payment is completed.
            {payableOrders.length > 0
              ? " Complete payment now before remaining tickets sell out!"
              : " Check your dashboard to view status."}
          </p>
        </div>
      </div>

      <Link
        href="/dashboard/user/transactions?tab=pending"
        className="self-start sm:self-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#F59E0B] to-[#D97706] hover:from-[#FBBF24] hover:to-[#F59E0B] text-[#0D0D0B] font-heading font-bold text-xs sm:text-sm shadow-[0_2px_10px_rgba(245,158,11,0.3)] transition-all whitespace-nowrap flex items-center gap-2"
      >
        <span>Complete Payment</span>
        <svg
          className="w-4 h-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2.5}
            d="M14 5l7 7m0 0l-7 7m7-7H3"
          />
        </svg>
      </Link>
    </div>
  );
}
