import React from "react";

export default function DrawsInfoCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Auto Draw */}
      <div className="bg-[#111210] border border-[#2D3C13] rounded-[12px] p-5 flex items-start gap-3">
        <div className="w-8 h-8 rounded-full border border-[#2D3C13] flex items-center justify-center shrink-0 mt-0.5">
          <svg className="w-4 h-4 text-[#72943A]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
          </svg>
        </div>
        <div className="flex flex-col gap-1">
          <span className="font-heading font-medium text-[13px] text-[#E8EDD4]">Auto Draw</span>
          <span className="font-sans text-[11px] text-[#5A752A] leading-relaxed">System randomly selects winner on scheduled time.</span>
        </div>
      </div>

      {/* Manual Draw */}
      <div className="bg-[#111210] border border-[#2D3C13] rounded-[12px] p-5 flex items-start gap-3">
        <div className="w-8 h-8 rounded-full border border-[#2D3C13] flex items-center justify-center shrink-0 mt-0.5">
          <svg className="w-4 h-4 text-[#72943A]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
          </svg>
        </div>
        <div className="flex flex-col gap-1">
          <span className="font-heading font-medium text-[13px] text-[#E8EDD4]">Manual Draw</span>
          <span className="font-sans text-[11px] text-[#5A752A] leading-relaxed">Admin triggers the draw manually from ticket pool.</span>
        </div>
      </div>

      {/* Transparency */}
      <div className="bg-[#111210] border border-[#2D3C13] rounded-[12px] p-5 flex items-start gap-3">
        <div className="w-8 h-8 rounded-full border border-[#2D3C13] flex items-center justify-center shrink-0 mt-0.5">
          <svg className="w-4 h-4 text-[#72943A]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
          </svg>
        </div>
        <div className="flex flex-col gap-1">
          <span className="font-heading font-medium text-[13px] text-[#E8EDD4]">Transparency</span>
          <span className="font-sans text-[11px] text-[#5A752A] leading-relaxed">All results logged in draw history. Immutable.</span>
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-[#111210] border border-[#2D3C13] rounded-[12px] p-5 flex items-start gap-3">
        <div className="w-8 h-8 rounded-full border border-[#2D3C13] flex items-center justify-center shrink-0 mt-0.5">
          <svg className="w-4 h-4 text-[#72943A]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0M3.124 7.5A8.969 8.969 0 0 1 5.292 3m13.416 0a8.969 8.969 0 0 1 2.168 4.5" />
          </svg>
        </div>
        <div className="flex flex-col gap-1">
          <span className="font-heading font-medium text-[13px] text-[#E8EDD4]">Notifications</span>
          <span className="font-sans text-[11px] text-[#5A752A] leading-relaxed">Winners automatically notified after successful draw.</span>
        </div>
      </div>
    </div>
  );
}
