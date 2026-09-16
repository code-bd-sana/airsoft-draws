"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import WebsiteNavbar from "../../components/website/layout/WebsiteNavbar";
import WebsiteFooter from "../../components/website/layout/WebsiteFooter";
import { useBasket } from "../../features/basket/BasketContext";

export default function BasketPage() {
  const {
    items,
    itemCount,
    ticketCount,
    totalAmount,
    hasRifItems,
    isHydrated,
    updateQuantity,
    removeFromBasket,
    clearBasket,
  } = useBasket();

  return (
    <>
      <WebsiteNavbar />

      <main className="min-h-screen bg-[#0D0D0B] text-[#E8EDD4] pt-28 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto flex flex-col gap-8">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#2D3C13]">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="font-heading font-bold text-2xl sm:text-3xl text-[#E8EDD4]">
                  Shopping Basket
                </h1>
                {isHydrated && ticketCount > 0 && (
                  <span className="px-3 py-1 bg-[#1A230A] border border-[#8CB34A] text-[#8CB34A] rounded-full text-xs font-semibold">
                    {ticketCount} {ticketCount === 1 ? "Ticket" : "Tickets"}
                  </span>
                )}
              </div>
              <p className="font-sans text-xs sm:text-sm text-[#72943A] mt-1">
                Review your competition entries before completing checkout
              </p>
            </div>

            {items.length > 0 && (
              <button
                onClick={clearBasket}
                className="text-xs text-[#72943A] hover:text-[#F76B6B] transition-colors self-start sm:self-auto"
              >
                Clear Entire Basket
              </button>
            )}
          </div>

          {!isHydrated ? (
            <div className="py-20 text-center font-sans text-sm text-[#72943A] animate-pulse">
              Loading basket...
            </div>
          ) : items.length === 0 ? (
            /* Empty State */
            <div className="bg-[#111210] border border-[#2D3C13] rounded-2xl p-12 text-center flex flex-col items-center gap-5 max-w-xl mx-auto shadow-xl">
              <div className="w-16 h-16 rounded-full bg-[#1A230A] border border-[#2D3C13] flex items-center justify-center text-[#8CB34A]">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-8 h-8"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
                  />
                </svg>
              </div>

              <div className="flex flex-col gap-1.5">
                <h3 className="font-heading font-bold text-xl text-[#E8EDD4]">
                  Your Basket is Empty
                </h3>
                <p className="font-sans text-xs text-[#72943A] max-w-sm">
                  You have not added any competition tickets to your basket yet. Check out our active draws and gear raffles!
                </p>
              </div>

              <Link
                href="/live-raffles"
                className="mt-2 h-11 px-6 bg-[#8CB34A] hover:bg-[#A0D056] text-[#0D0D0B] font-heading font-semibold text-sm rounded-lg transition-colors flex items-center gap-2 shadow-[0_0_15px_rgba(140,179,74,0.2)]"
              >
                Browse Live Raffles →
              </Link>
            </div>
          ) : (
            /* Populated Basket Grid */
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Left Column: Item List */}
              <div className="lg:col-span-8 flex flex-col gap-4">
                {items.map((item) => {
                  const lineTotal = item.ticketPrice * item.quantity;
                  const isRif = (item.prizeClassification || "RIF") === "RIF";

                  return (
                    <div
                      key={item.raffleId}
                      className="bg-[#111210] border border-[#2D3C13] rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-colors hover:border-[#43581E]"
                    >
                      {/* Left: Thumbnail & Info */}
                      <div className="flex items-center gap-4 min-w-0 flex-1">
                        <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden bg-[#1A230A] border border-[#2D3C13] shrink-0">
                          {item.mainImage ? (
                            <Image
                              src={item.mainImage}
                              alt={item.title}
                              fill
                              className="object-cover"
                              sizes="(max-width: 640px) 64px, 80px"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-[#72943A] text-xs">
                              No image
                            </div>
                          )}
                        </div>

                        <div className="flex flex-col gap-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span
                              className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                                isRif
                                  ? "bg-amber-950/40 border-amber-800 text-amber-400"
                                  : "bg-blue-950/40 border-blue-800 text-blue-400"
                              }`}
                            >
                              {isRif ? "RIF Legal Defence" : "Non-RIF Accessory"}
                            </span>
                            {item.minTickets && item.minTickets > 1 && (
                              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full border bg-[#1A230A] border-[#2D3C13] text-[#8CB34A]">
                                Min: {item.minTickets}
                              </span>
                            )}
                            {item.maxTickets && (
                              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full border bg-[#1A230A] border-[#2D3C13] text-[#8CB34A]">
                                Max: {item.maxTickets} per person
                              </span>
                            )}
                            <span className="text-[10px] text-[#72943A]">
                              {item.remainingTickets} left
                            </span>
                          </div>

                          <Link
                            href={`/live-raffles/${item.slug}`}
                            className="font-heading font-bold text-sm sm:text-base text-[#E8EDD4] hover:text-[#8CB34A] transition-colors truncate"
                          >
                            {item.title}
                          </Link>

                          <span className="font-sans text-xs text-[#72943A]">
                            £{item.ticketPrice.toFixed(2)} per ticket
                          </span>
                        </div>
                      </div>

                      {/* Right: Quantity Controls & Subtotal */}
                      <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-[#2D3C13]/50 shrink-0">
                        {/* Quantity Counter */}
                        <div className="flex items-center h-9 bg-[#0D0D0B] border border-[#2D3C13] rounded-lg overflow-hidden">
                          <button
                            onClick={() => updateQuantity(item.raffleId, item.quantity - 1)}
                            disabled={item.quantity <= (item.minTickets || 1)}
                            className="w-8 h-full flex items-center justify-center bg-[#1A230A] text-[#8CB34A] hover:bg-[#2D3C13] disabled:text-[#43581E] disabled:hover:bg-[#1A230A] transition-colors text-sm font-bold cursor-pointer disabled:cursor-not-allowed"
                            aria-label="Decrease ticket quantity"
                          >
                            -
                          </button>
                          <span className="w-10 h-full flex items-center justify-center font-sans font-medium text-xs text-[#E8EDD4]">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.raffleId, item.quantity + 1)}
                            disabled={
                              item.quantity >=
                              (item.maxTickets
                                ? Math.min(item.remainingTickets, item.maxTickets)
                                : item.remainingTickets)
                            }
                            className="w-8 h-full flex items-center justify-center bg-[#1A230A] text-[#8CB34A] hover:bg-[#2D3C13] disabled:text-[#43581E] disabled:hover:bg-[#1A230A] transition-colors text-sm font-bold cursor-pointer disabled:cursor-not-allowed"
                            aria-label="Increase ticket quantity"
                          >
                            +
                          </button>
                        </div>

                        {/* Price */}
                        <div className="text-right min-w-[70px]">
                          <span className="font-heading font-bold text-base text-[#8CB34A]">
                            £{lineTotal.toFixed(2)}
                          </span>
                        </div>

                        {/* Delete Button */}
                        <button
                          onClick={() => removeFromBasket(item.raffleId)}
                          className="text-[#72943A] hover:text-[#F76B6B] transition-colors p-1"
                          aria-label={`Remove ${item.title}`}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-5 h-5"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  );
                })}

                <div className="flex items-center justify-between pt-4">
                  <Link
                    href="/live-raffles"
                    className="font-sans text-xs text-[#8CB34A] hover:text-[#A0D056] flex items-center gap-1.5 transition-colors"
                  >
                    <span>←</span> Add More Competition Tickets
                  </Link>
                </div>
              </div>

              {/* Right Column: Order Summary Card */}
              <div className="lg:col-span-4 bg-[#111210] border border-[#2D3C13] rounded-2xl p-6 flex flex-col gap-5 sticky top-28 shadow-xl">
                <h3 className="font-heading font-bold text-lg text-[#E8EDD4] border-b border-[#2D3C13] pb-3">
                  Order Summary
                </h3>

                <div className="flex flex-col gap-3 font-sans text-xs">
                  <div className="flex items-center justify-between text-[#72943A]">
                    <span>Competitions</span>
                    <span className="text-[#E8EDD4] font-medium">{itemCount}</span>
                  </div>

                  <div className="flex items-center justify-between text-[#72943A]">
                    <span>Total Tickets</span>
                    <span className="text-[#E8EDD4] font-medium">{ticketCount}</span>
                  </div>

                  <div className="flex items-center justify-between text-[#72943A]">
                    <span>Prize Delivery (Tracked)</span>
                    <span className="text-[#8CB34A] font-medium">Free</span>
                  </div>

                  <div className="border-t border-[#2D3C13] pt-3 flex items-center justify-between">
                    <span className="font-heading font-semibold text-sm text-[#E8EDD4]">
                      Total
                    </span>
                    <span className="font-heading font-bold text-xl text-[#8CB34A]">
                      £{totalAmount.toFixed(2)}
                    </span>
                  </div>
                </div>

                {hasRifItems && (
                  <div className="p-3 bg-amber-950/30 border border-amber-900/50 rounded-xl flex items-start gap-2.5 text-[11px] text-amber-300">
                    <span className="text-base">📌</span>
                    <p className="leading-relaxed">
                      Your basket contains Realistic Imitation Firearms (RIF). UKARA registration will be verified at checkout.
                    </p>
                  </div>
                )}

                <Link
                  href="/checkout"
                  className="w-full h-12 bg-[#8CB34A] hover:bg-[#A0D056] text-[#0D0D0B] font-heading font-semibold text-sm rounded-lg transition-colors flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(140,179,74,0.2)]"
                >
                  Proceed to Checkout →
                </Link>

                {/* Trust Badges */}
                <div className="flex flex-col gap-2 pt-2 border-t border-[#2D3C13]/60 font-sans text-[11px] text-[#72943A]">
                  <div className="flex items-center gap-2">
                    <span className="text-[#8CB34A]">✓</span>
                    <span>18+ Verified Competitions (VCRA 2006)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[#8CB34A]">✓</span>
                    <span>Fully Audited Random Draws</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[#8CB34A]">✓</span>
                    <span>Instant Wins Allocated in Real Time</span>
                  </div>
                </div>
              </div>

            </div>
          )}

        </div>
      </main>

      <WebsiteFooter />
    </>
  );
}
