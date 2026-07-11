import React from "react";

export default function HostRevenueChart() {
  return (
    <div className="bg-[#161810] border border-[#2d3c13] rounded-[16px] p-[25px] w-full flex flex-col h-full min-h-[362px]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="font-heading font-bold text-[16px] leading-[normal] text-[#e8edd4]">
          Earnings Overview
        </h2>
        
        {/* Time filters */}
        <div className="flex gap-[6px]">
          {["7D", "1M", "3M", "1Y"].map((filter) => (
            <button
              key={filter}
              className={`rounded-[99px] px-[11px] py-[5px] flex items-center justify-center transition-colors ${
                filter === "1M"
                  ? "bg-[#1a230a] border border-[#8cb34a] text-[#8cb34a]"
                  : "border border-[#2d3c13] text-[#5a752a] hover:bg-[#1a230a]/50"
              }`}
            >
              <span className="font-sans font-medium text-[12px] leading-[18px]">
                {filter}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-[12px] pt-[16px]">
        <p className="font-heading font-bold text-[32px] leading-[48px] text-[#e8edd4]">
          £4,999.95
        </p>
        <div className="bg-[#083b18] rounded-[99px] h-[24px] px-[10px] flex items-center justify-center">
          <p className="font-sans font-normal text-[12px] leading-[18px] text-[#4ade80]">
            ▲ 20%
          </p>
        </div>
      </div>

      <div className="flex-1 w-full pt-[20px] relative min-h-[200px]">
        {/* Placeholder SVG matching Figma's design intent for the Area Chart */}
        <div className="absolute inset-0 w-full h-full">
          <svg preserveAspectRatio="none" viewBox="0 0 875 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full text-[#8CB34A]">
            {/* Grid lines */}
            <path d="M47.5 170H875" stroke="#2D3C13" strokeDasharray="4 4" />
            <path d="M47.5 127.5H875" stroke="#2D3C13" strokeDasharray="4 4" />
            <path d="M47.5 85H875" stroke="#2D3C13" strokeDasharray="4 4" />
            <path d="M47.5 42.5H875" stroke="#2D3C13" strokeDasharray="4 4" />
            <path d="M47.5 0H875" stroke="#2D3C13" strokeDasharray="4 4" />
            
            {/* Area Fill */}
            <path d="M47.5 150.5C124.5 150.5 201.5 120 278.5 120C355.5 120 432.5 70.5 509.5 70.5C586.5 70.5 663.5 130 740.5 130C817.5 130 875 42.5 875 42.5V170H47.5V150.5Z" fill="url(#paint0_linear)" fillOpacity="0.2" />
            
            {/* Line Path */}
            <path d="M47.5 150.5C124.5 150.5 201.5 120 278.5 120C355.5 120 432.5 70.5 509.5 70.5C586.5 70.5 663.5 130 740.5 130C817.5 130 875 42.5 875 42.5" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            
            <defs>
              <linearGradient id="paint0_linear" x1="461.25" y1="42.5" x2="461.25" y2="170" gradientUnits="userSpaceOnUse">
                <stop stopColor="#8CB34A" />
                <stop offset="1" stopColor="#8CB34A" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>
    </div>
  );
}
