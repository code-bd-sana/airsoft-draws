"use client";

import React, { useState } from "react";
import DrawCard from "../shared/DrawCard";

interface HostProfileTabsProps {
  host?: {
    id: string;
    slug?: string;
    name: string;
    bio?: string | null;
    phone?: string | null;
    address?: string | null;
    vatNumber?: string | null;
    isVerified?: boolean;
    memberSince?: number;
    drawsHosted?: number;
  };
  raffles?: any[];
}

export default function HostProfileTabs({ host, raffles = [] }: HostProfileTabsProps) {
  const [activeTab, setActiveTab] = useState<"active" | "past" | "reviews" | "about">("active");

  const liveDraws = raffles.filter((r) => r.status === "ACTIVE");
  const pastDraws = raffles.filter((r) => r.status === "ENDED" || r.status === "COMPLETED");

  return (
    <div className="flex flex-col mt-8">
      {/* Tabs Row */}
      <div className="flex items-center gap-8 border-b border-[#2D3C13] mb-8 overflow-x-auto scrollbar-none">
        <button
          onClick={() => setActiveTab("active")}
          className={`pb-4 text-[14px] font-medium transition-colors border-b-[2px] -mb-[1px] whitespace-nowrap cursor-pointer ${
            activeTab === "active"
              ? "border-[#8CB34A] text-[#8CB34A]"
              : "border-transparent text-[#72943A] hover:text-[#E8EDD4]"
          }`}
        >
          Active Draws {liveDraws.length > 0 && `(${liveDraws.length})`}
        </button>
        <button
          onClick={() => setActiveTab("past")}
          className={`pb-4 text-[14px] font-medium transition-colors border-b-[2px] -mb-[1px] whitespace-nowrap cursor-pointer ${
            activeTab === "past"
              ? "border-[#8CB34A] text-[#8CB34A]"
              : "border-transparent text-[#72943A] hover:text-[#E8EDD4]"
          }`}
        >
          Past Draws {pastDraws.length > 0 && `(${pastDraws.length})`}
        </button>
        <button
          onClick={() => setActiveTab("reviews")}
          className={`pb-4 text-[14px] font-medium transition-colors border-b-[2px] -mb-[1px] whitespace-nowrap cursor-pointer ${
            activeTab === "reviews"
              ? "border-[#8CB34A] text-[#8CB34A]"
              : "border-transparent text-[#72943A] hover:text-[#E8EDD4]"
          }`}
        >
          Reviews
        </button>
        <button
          onClick={() => setActiveTab("about")}
          className={`pb-4 text-[14px] font-medium transition-colors border-b-[2px] -mb-[1px] whitespace-nowrap cursor-pointer ${
            activeTab === "about"
              ? "border-[#8CB34A] text-[#8CB34A]"
              : "border-transparent text-[#72943A] hover:text-[#E8EDD4]"
          }`}
        >
          About
        </button>
      </div>

      {/* Tab Panels */}
      <div className="min-h-[350px]">
        {activeTab === "active" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-in fade-in duration-300">
            {liveDraws.length > 0 ? (
              liveDraws.map((draw) => <DrawCard key={draw.id} draw={draw} />)
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center gap-3 w-full col-span-full bg-[#111210] border border-[#2D3C13] rounded-[16px]">
                <span className="text-[32px]">🎯</span>
                <h3 className="font-heading font-medium text-[18px] text-[#E8EDD4]">No Active Draws</h3>
                <p className="font-sans text-[13px] text-[#72943A] max-w-[320px]">
                  This host does not have any active competitions right now. Check back soon!
                </p>
              </div>
            )}
          </div>
        )}

        {activeTab === "past" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-in fade-in duration-300">
            {pastDraws.length > 0 ? (
              pastDraws.map((draw) => <DrawCard key={draw.id} draw={draw} />)
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center gap-3 w-full col-span-full bg-[#111210] border border-[#2D3C13] rounded-[16px]">
                <span className="text-[32px]">🏆</span>
                <h3 className="font-heading font-medium text-[18px] text-[#E8EDD4]">No Past Draws</h3>
                <p className="font-sans text-[13px] text-[#72943A] max-w-[320px]">
                  This host hasn&apos;t completed any draws yet. Check back later to see their history of winners!
                </p>
              </div>
            )}
          </div>
        )}

        {activeTab === "reviews" && (
          <div className="flex flex-col items-center justify-center py-20 text-center gap-3 bg-[#111210] border border-[#2D3C13] rounded-[16px] max-w-[600px] mx-auto animate-in fade-in duration-300">
            <span className="text-[32px]">⭐</span>
            <h3 className="font-heading font-medium text-[18px] text-[#E8EDD4]">Host Reviews</h3>
            <p className="font-sans text-[13px] text-[#72943A] max-w-[340px]">
              Reviews are left by verified ticket buyers after a competition draw concludes.
            </p>
          </div>
        )}

        {activeTab === "about" && (
          <div className="animate-in fade-in duration-300 flex flex-col gap-6 max-w-[850px]">
            <div>
              <h3 className="font-heading font-bold text-[20px] text-[#E8EDD4] mb-2">
                About {host?.name || "Host"}
              </h3>
              <p className="font-sans text-[14px] sm:text-[15px] text-[#A6C47A] leading-relaxed whitespace-pre-line">
                {host?.bio || "This host has not provided an extended bio yet."}
              </p>
            </div>

            {/* Host Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
              {host?.address && (
                <div className="bg-[#111210] border border-[#2D3C13] rounded-[12px] p-4 flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-[8px] bg-[#1A230A] border border-[#43581E] flex items-center justify-center text-[18px] shrink-0">
                    📍
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-[11px] uppercase tracking-wider text-[#72943A] font-semibold">
                      Location / Address
                    </span>
                    <span className="text-[14px] text-[#E8EDD4] font-medium truncate">
                      {host.address}
                    </span>
                  </div>
                </div>
              )}

              {host?.phone && (
                <div className="bg-[#111210] border border-[#2D3C13] rounded-[12px] p-4 flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-[8px] bg-[#1A230A] border border-[#43581E] flex items-center justify-center text-[18px] shrink-0">
                    📞
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-[11px] uppercase tracking-wider text-[#72943A] font-semibold">
                      Contact Phone
                    </span>
                    <a
                      href={`tel:${host.phone}`}
                      className="text-[14px] text-[#8CB34A] hover:underline font-medium truncate"
                    >
                      {host.phone}
                    </a>
                  </div>
                </div>
              )}

              {host?.vatNumber && (
                <div className="bg-[#111210] border border-[#2D3C13] rounded-[12px] p-4 flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-[8px] bg-[#1A230A] border border-[#43581E] flex items-center justify-center text-[18px] shrink-0">
                    🏢
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-[11px] uppercase tracking-wider text-[#72943A] font-semibold">
                      VAT / Tax ID
                    </span>
                    <span className="text-[14px] text-[#E8EDD4] font-medium truncate">
                      {host.vatNumber}
                    </span>
                  </div>
                </div>
              )}

              <div className="bg-[#111210] border border-[#2D3C13] rounded-[12px] p-4 flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-[8px] bg-[#1A230A] border border-[#43581E] flex items-center justify-center text-[18px] shrink-0">
                  🛡️
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-[11px] uppercase tracking-wider text-[#72943A] font-semibold">
                    Verification
                  </span>
                  <span className="text-[14px] text-[#8CB34A] font-medium">
                    {host?.isVerified ? "Verified Partner" : "Standard Host"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
