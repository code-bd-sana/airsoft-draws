"use client";

import React, { useState } from "react";
import DrawCard from "../shared/DrawCard";
import { liveRafflesData } from "../../../data/live-raffles.data";

export default function HostProfileTabs() {
  const [activeTab, setActiveTab] = useState<"active" | "past" | "reviews" | "about">("active");

  return (
    <div className="flex flex-col mt-8">
      {/* Tabs Row */}
      <div className="flex items-center gap-8 border-b border-[#2D3C13] mb-8 overflow-x-auto scrollbar-none">
        <button
          onClick={() => setActiveTab("active")}
          className={`pb-4 text-[14px] font-medium transition-colors border-b-[2px] -mb-[1px] whitespace-nowrap ${
            activeTab === "active" 
              ? "border-[#8CB34A] text-[#8CB34A]" 
              : "border-transparent text-[#72943A] hover:text-[#E8EDD4]"
          }`}
        >
          Active Draws
        </button>
        <button
          onClick={() => setActiveTab("past")}
          className={`pb-4 text-[14px] font-medium transition-colors border-b-[2px] -mb-[1px] whitespace-nowrap ${
            activeTab === "past" 
              ? "border-[#8CB34A] text-[#8CB34A]" 
              : "border-transparent text-[#72943A] hover:text-[#E8EDD4]"
          }`}
        >
          Past Draws
        </button>
        <button
          onClick={() => setActiveTab("reviews")}
          className={`pb-4 text-[14px] font-medium transition-colors border-b-[2px] -mb-[1px] whitespace-nowrap ${
            activeTab === "reviews" 
              ? "border-[#8CB34A] text-[#8CB34A]" 
              : "border-transparent text-[#72943A] hover:text-[#E8EDD4]"
          }`}
        >
          Reviews
        </button>
        <button
          onClick={() => setActiveTab("about")}
          className={`pb-4 text-[14px] font-medium transition-colors border-b-[2px] -mb-[1px] whitespace-nowrap ${
            activeTab === "about" 
              ? "border-[#8CB34A] text-[#8CB34A]" 
              : "border-transparent text-[#72943A] hover:text-[#E8EDD4]"
          }`}
        >
          About
        </button>
      </div>

      {/* Tab Panels */}
      <div className="min-h-[400px]">
        {activeTab === "active" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-in fade-in duration-300">
            {liveRafflesData.slice(0, 4).map((draw) => (
              <DrawCard key={draw.id} draw={draw} />
            ))}
          </div>
        )}

        {activeTab === "past" && (
          <div className="flex flex-col items-center justify-center py-20 text-center gap-3 animate-in fade-in duration-300">
            <span className="text-[32px]">🏆</span>
            <h3 className="font-heading font-medium text-[18px] text-[#E8EDD4]">No Past Draws</h3>
            <p className="font-sans text-[13px] text-[#72943A] max-w-[300px]">
              This host hasn&apos;t completed any draws yet. Check back later to see their history of winners!
            </p>
          </div>
        )}

        {activeTab === "reviews" && (
          <div className="flex flex-col items-center justify-center py-20 text-center gap-3 animate-in fade-in duration-300">
            <span className="text-[32px]">⭐</span>
            <h3 className="font-heading font-medium text-[18px] text-[#E8EDD4]">Host Reviews</h3>
            <p className="font-sans text-[13px] text-[#72943A] max-w-[300px]">
              Reviews are left by verified ticket buyers after a draw completes.
            </p>
          </div>
        )}

        {activeTab === "about" && (
          <div className="animate-in fade-in duration-300 flex flex-col gap-4 max-w-[800px]">
            <h3 className="font-heading font-medium text-[18px] text-[#E8EDD4]">About TacticalGear UK</h3>
            <p className="font-sans text-[14px] text-[#72943A] leading-relaxed">
              We are a premium airsoft retailer based in Manchester, supplying the community with the highest quality gear, from rare gas blowback rifles to tactical apparel. 
              Our competitions give you the chance to win top-tier equipment for a fraction of the cost, fully audited and guaranteed.
            </p>
            <div className="flex gap-4 mt-2">
              <span className="font-sans text-[13px] text-[#A0D056]">🔗 www.tacticalgear.co.uk</span>
              <span className="font-sans text-[13px] text-[#A0D056]">📍 Manchester, UK</span>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
