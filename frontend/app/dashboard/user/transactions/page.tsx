"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { format } from "date-fns";
import {
  useUserOrdersQuery,
  useRetryOrderPaymentMutation,
  UserOrder,
} from "../../../../hooks/useTicketHooks";

function UserTransactionsContent() {
  const searchParams = useSearchParams();
  const initialTab = searchParams.get("tab") === "pending" ? "pending" : "all";
  const [activeTab, setActiveTab] = useState<"all" | "pending" | "completed">(
    initialTab as any,
  );
  const [payingOrderId, setPayingOrderId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<{
    orderId: string;
    message: string;
  } | null>(null);

  const { data: orders = [], isLoading, isError, refetch } = useUserOrdersQuery();
  const retryPaymentMutation = useRetryOrderPaymentMutation();

  const handlePayNow = async (order: UserOrder) => {
    setPayingOrderId(order.id);
    setErrorMessage(null);
    try {
      const res = await retryPaymentMutation.mutateAsync(order.id);
      if (res?.url) {
        window.location.href = res.url;
      } else {
        setErrorMessage({
          orderId: order.id,
          message: "Payment gateway URL not received. Please try again.",
        });
        setPayingOrderId(null);
      }
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to initiate payment.";
      setErrorMessage({ orderId: order.id, message: msg });
      setPayingOrderId(null);
    }
  };

  const pendingOrders = orders.filter(
    (o) => o.status === "PENDING" || o.status === "CANCELLED",
  );
  const completedOrders = orders.filter((o) => o.status === "COMPLETED");

  const totalSpent = completedOrders.reduce((acc, o) => acc + o.amount, 0);

  const filteredOrders =
    activeTab === "pending"
      ? pendingOrders
      : activeTab === "completed"
      ? completedOrders
      : orders;

  return (
    <div className="flex flex-col gap-6 p-4 sm:p-8 max-w-[1660px] mx-auto w-full animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-[#E8EDD4]">
            Orders & Transactions
          </h1>
          <p className="font-sans text-xs sm:text-sm text-[#72943A] mt-1">
            Track order status, access verified ticket entries, and complete pending checkouts.
          </p>
        </div>

        <Link
          href="/live-raffles"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#72943A] to-[#8CB34A] hover:from-[#8CB34A] hover:to-[#A0D056] text-[#0D0D0B] font-heading font-bold text-xs sm:text-sm transition-all shadow-[0_4px_15px_rgba(140,179,74,0.25)] self-start sm:self-auto"
        >
          <span>Browse Competitions</span>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </Link>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5 w-full">
        {/* Total Spent */}
        <div className="bg-[#161810] border border-[#2D3C13] rounded-[16px] p-6 flex flex-col justify-between">
          <span className="font-sans text-[11px] font-medium uppercase tracking-[1.1px] text-[#5A752A]">
            Total Completed Purchases
          </span>
          <div className="mt-3">
            <p className="font-heading font-extrabold text-3xl sm:text-4xl text-[#E8EDD4]">
              £{totalSpent.toFixed(2)}
            </p>
            <span className="font-sans text-[11px] text-[#72943A] mt-1 block">
              Verified via Cashflows Gateway
            </span>
          </div>
        </div>

        {/* Completed Orders */}
        <div className="bg-[#161810] border border-[#2D3C13] rounded-[16px] p-6 flex flex-col justify-between">
          <span className="font-sans text-[11px] font-medium uppercase tracking-[1.1px] text-[#5A752A]">
            Completed Orders
          </span>
          <div className="mt-3">
            <p className="font-heading font-extrabold text-3xl sm:text-4xl text-[#8CB34A]">
              {completedOrders.length}
            </p>
            <span className="font-sans text-[11px] text-[#72943A] mt-1 block">
              All tickets confirmed and in active draws
            </span>
          </div>
        </div>

        {/* Pending / Incomplete Orders */}
        <div
          className={`border rounded-[16px] p-6 flex flex-col justify-between transition-colors ${
            pendingOrders.length > 0
              ? "bg-[#2A200B] border-[#F59E0B]/50 shadow-[0_0_25px_rgba(245,158,11,0.15)]"
              : "bg-[#161810] border-[#2D3C13]"
          }`}
        >
          <div className="flex items-center justify-between">
            <span
              className={`font-sans text-[11px] font-medium uppercase tracking-[1.1px] ${
                pendingOrders.length > 0 ? "text-[#FBBF24]" : "text-[#5A752A]"
              }`}
            >
              Incomplete / Pending Orders
            </span>
            {pendingOrders.length > 0 && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#F59E0B] text-black animate-pulse">
                Action Required
              </span>
            )}
          </div>
          <div className="mt-3">
            <p
              className={`font-heading font-extrabold text-3xl sm:text-4xl ${
                pendingOrders.length > 0 ? "text-[#FBBF24]" : "text-[#E8EDD4]"
              }`}
            >
              {pendingOrders.length}
            </p>
            <span
              className={`font-sans text-[11px] mt-1 block ${
                pendingOrders.length > 0 ? "text-[#FDE68A]" : "text-[#72943A]"
              }`}
            >
              {pendingOrders.length > 0
                ? "Tickets are not reserved until paid. Complete checkout now."
                : "No pending or incomplete payments."}
            </span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-[#2D3C13] pb-3 overflow-x-auto">
        <button
          onClick={() => setActiveTab("all")}
          className={`px-5 py-2 rounded-xl font-sans text-xs sm:text-sm font-semibold transition-all ${
            activeTab === "all"
              ? "bg-[#8CB34A] text-[#0D0D0B] shadow-[0_2px_10px_rgba(140,179,74,0.3)]"
              : "bg-[#161810] border border-[#2D3C13] text-[#72943A] hover:text-[#E8EDD4]"
          }`}
        >
          All Orders ({orders.length})
        </button>

        <button
          onClick={() => setActiveTab("pending")}
          className={`px-5 py-2 rounded-xl font-sans text-xs sm:text-sm font-semibold flex items-center gap-2 transition-all ${
            activeTab === "pending"
              ? "bg-[#F59E0B] text-[#0D0D0B] shadow-[0_2px_10px_rgba(245,158,11,0.3)]"
              : "bg-[#161810] border border-[#2D3C13] text-[#FBBF24] hover:bg-[#2A200B]"
          }`}
        >
          <span>Incomplete / Pending</span>
          {pendingOrders.length > 0 && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-black text-[#FBBF24]">
              {pendingOrders.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab("completed")}
          className={`px-5 py-2 rounded-xl font-sans text-xs sm:text-sm font-semibold transition-all ${
            activeTab === "completed"
              ? "bg-[#8CB34A] text-[#0D0D0B] shadow-[0_2px_10px_rgba(140,179,74,0.3)]"
              : "bg-[#161810] border border-[#2D3C13] text-[#72943A] hover:text-[#E8EDD4]"
          }`}
        >
          Completed ({completedOrders.length})
        </button>
      </div>

      {/* Orders List / Table */}
      {isLoading ? (
        <div className="py-20 text-center flex flex-col items-center justify-center bg-[#161810] border border-[#2D3C13] rounded-[16px]">
          <div className="w-10 h-10 border-3 border-[#8CB34A] border-t-transparent rounded-full animate-spin mb-3" />
          <p className="font-sans text-sm text-[#72943A]">Loading orders...</p>
        </div>
      ) : isError ? (
        <div className="py-12 px-6 text-center bg-[#161810] border border-red-900/40 rounded-[16px]">
          <p className="font-sans text-sm text-red-400 mb-3">
            Failed to load order history. Please try again.
          </p>
          <button
            onClick={() => refetch()}
            className="px-4 py-2 bg-[#1A230A] border border-[#43581E] text-[#A0D056] text-xs rounded-lg hover:bg-[#2D3C13]"
          >
            Retry
          </button>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="py-16 px-6 text-center bg-[#161810] border border-[#2D3C13] rounded-[16px] flex flex-col items-center">
          <div className="w-16 h-16 rounded-full bg-[#1A230A] border border-[#2D3C13] flex items-center justify-center text-[#72943A] mb-4">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <h3 className="font-heading font-bold text-lg text-[#E8EDD4] mb-1">
            {activeTab === "pending"
              ? "No Pending Orders"
              : activeTab === "completed"
              ? "No Completed Orders"
              : "No Orders Found"}
          </h3>
          <p className="font-sans text-xs sm:text-sm text-[#72943A] max-w-sm mb-6">
            {activeTab === "pending"
              ? "You do not have any incomplete or pending ticket checkouts waiting for payment."
              : "You have not entered any competitions yet. Explore our active airsoft draws now!"}
          </p>
          <Link
            href="/live-raffles"
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#72943A] to-[#8CB34A] text-[#0D0D0B] font-heading font-bold text-xs sm:text-sm"
          >
            Enter a Competition
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => {
            const isCompleted = order.status === "COMPLETED";
            const isPendingOrCancelled =
              order.status === "PENDING" || order.status === "CANCELLED";
            const isOrderPaying = payingOrderId === order.id;
            const currentError =
              errorMessage?.orderId === order.id ? errorMessage.message : null;

            return (
              <div
                key={order.id}
                className={`bg-[#161810] border rounded-[16px] p-5 sm:p-6 transition-all shadow-md ${
                  isPendingOrCancelled
                    ? "border-[#F59E0B]/30 hover:border-[#F59E0B]/60"
                    : "border-[#2D3C13] hover:border-[#43581E]"
                }`}
              >
                {/* Order Top Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#2D3C13] pb-4 mb-4">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="font-mono text-xs font-bold text-[#E8EDD4] bg-[#111210] px-3 py-1 rounded-md border border-[#2D3C13]">
                      {order.orderNumber}
                    </span>

                    <span className="font-sans text-xs text-[#72943A]">
                      {order.createdAt
                        ? format(
                            new Date(order.createdAt),
                            "dd MMM yyyy, HH:mm",
                          )
                        : "Recent"}
                    </span>

                    <span className="font-sans text-[11px] text-[#5A752A] bg-[#1A230A] px-2 py-0.5 rounded border border-[#2D3C13]">
                      {order.paymentGateway || "CASHFLOWS"}
                    </span>
                  </div>

                  {/* Status Badge */}
                  <div className="flex items-center gap-2">
                    {isCompleted ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#083B18] text-[#4ADE80] border border-[#166534]">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#4ADE80]" />
                        Paid & Completed
                      </span>
                    ) : order.status === "CANCELLED" ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#3B2C10] text-[#FBBF24] border border-[#78350F]">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#FBBF24]" />
                        Incomplete / Cancelled
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#3B2C10] text-[#FBBF24] border border-[#78350F]">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#FBBF24] animate-pulse" />
                        Awaiting Payment
                      </span>
                    )}
                  </div>
                </div>

                {/* Items Breakdown */}
                <div className="space-y-3">
                  {order.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#111210] p-3.5 rounded-xl border border-[#2D3C13]/60"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-14 h-14 rounded-lg bg-[#161810] border border-[#2D3C13] overflow-hidden flex-shrink-0 flex items-center justify-center">
                          {item.mainImage ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={item.mainImage}
                              alt={item.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="text-[10px] text-[#5A752A]">No Img</span>
                          )}
                        </div>

                        <div>
                          <Link
                            href={`/raffles/${item.slug || item.raffleId}`}
                            className="font-heading font-bold text-sm text-[#E8EDD4] hover:text-[#A0D056] transition-colors line-clamp-1"
                          >
                            {item.title}
                          </Link>
                          <div className="flex items-center gap-2 mt-0.5 text-xs text-[#72943A]">
                            <span>
                              {item.quantity} ticket{item.quantity > 1 ? "s" : ""}
                            </span>
                            <span>•</span>
                            <span>£{item.pricePerTicket.toFixed(2)} each</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center border-t sm:border-t-0 border-[#2D3C13]/40 pt-2 sm:pt-0">
                        <span className="font-mono text-sm font-bold text-[#E8EDD4]">
                          £{(item.pricePerTicket * item.quantity).toFixed(2)}
                        </span>

                        {isCompleted && item.ticketNumbers && item.ticketNumbers.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1 justify-end max-w-xs">
                            {item.ticketNumbers.slice(0, 5).map((num) => (
                              <span
                                key={num}
                                className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-[#162208] text-[#8CB34A] border border-[#2D3C13]"
                              >
                                #{num}
                              </span>
                            ))}
                            {item.ticketNumbers.length > 5 && (
                              <span className="text-[10px] text-[#72943A] self-center">
                                +{item.ticketNumbers.length - 5} more
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Status Notice if Sold Out or Closed */}
                {isPendingOrCancelled && order.isSoldOutOrClosed && (
                  <div className="mt-4 p-3.5 rounded-xl bg-[#3B1212]/80 border border-red-900/60 flex items-start gap-3">
                    <span className="text-lg">⚠️</span>
                    <div>
                      <p className="font-heading font-bold text-xs sm:text-sm text-red-300">
                        Oops! This competition is closed or sold out.
                      </p>
                      <p className="font-sans text-xs text-red-400 mt-0.5">
                        {order.closedReason ||
                          "Tickets for one or more draws in this order have sold out or the competition has ended. Payment can no longer be processed."}
                      </p>
                    </div>
                  </div>
                )}

                {/* Error Banner if retry failed */}
                {currentError && (
                  <div className="mt-4 p-3.5 rounded-xl bg-[#3B1212]/80 border border-red-900/60 flex items-start gap-3">
                    <span className="text-lg">⚠️</span>
                    <div>
                      <p className="font-heading font-bold text-xs sm:text-sm text-red-300">
                        Payment Failed
                      </p>
                      <p className="font-sans text-xs text-red-400 mt-0.5">
                        {currentError}
                      </p>
                    </div>
                  </div>
                )}

                {/* Order Footer Actions */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-5 pt-4 border-t border-[#2D3C13]">
                  <div className="flex items-baseline gap-2">
                    <span className="font-sans text-xs text-[#72943A]">Total:</span>
                    <span className="font-heading font-extrabold text-xl text-[#E8EDD4]">
                      £{order.amount.toFixed(2)}
                    </span>
                    <span className="font-sans text-[11px] text-[#5A752A]">
                      ({order.totalTickets} total tickets)
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    {order.canPay ? (
                      <button
                        onClick={() => handlePayNow(order)}
                        disabled={isOrderPaying}
                        className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#72943A] to-[#8CB34A] hover:from-[#8CB34A] hover:to-[#A0D056] text-[#0D0D0B] font-heading font-bold text-xs sm:text-sm shadow-[0_4px_15px_rgba(140,179,74,0.3)] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                      >
                        {isOrderPaying ? (
                          <>
                            <div className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                            <span>Connecting Gateway...</span>
                          </>
                        ) : (
                          <>
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                            <span>Pay Now (£{order.amount.toFixed(2)})</span>
                          </>
                        )}
                      </button>
                    ) : isPendingOrCancelled && order.isSoldOutOrClosed ? (
                      <div className="flex items-center gap-2">
                        <span className="px-3 py-1.5 rounded-lg bg-[#2A1616] border border-red-900/40 text-red-400 font-heading font-bold text-xs">
                          Oops! Closed or Sold Out
                        </span>
                        <Link
                          href="/live-raffles"
                          className="px-4 py-1.5 rounded-lg bg-[#161810] border border-[#2D3C13] text-[#A0D056] hover:bg-[#1A230A] text-xs font-semibold"
                        >
                          Find Active Draws
                        </Link>
                      </div>
                    ) : isCompleted ? (
                      <Link
                        href="/dashboard/user/tickets"
                        className="px-5 py-2 rounded-xl bg-[#1A230A] hover:bg-[#2D3C13] border border-[#43581E] text-[#A0D056] font-heading font-bold text-xs transition-colors"
                      >
                        View My Tickets →
                      </Link>
                    ) : null}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function UserTransactionsPage() {
  return (
    <Suspense
      fallback={
        <div className="p-8 text-center text-[#72943A]">
          <div className="w-8 h-8 border-2 border-[#8CB34A] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          <p className="text-xs">Loading orders & transactions...</p>
        </div>
      }
    >
      <UserTransactionsContent />
    </Suspense>
  );
}
