import React from "react";

export default function DrawOverviewTab() {
  return (
    <div className="flex flex-col gap-6 animate-fadeIn">
      
      {/* Top Banner */}
      <div className="w-full bg-[#111210] border border-[#2D3C13] rounded-[12px] p-8 flex flex-col items-center justify-center gap-3">
        <div className="w-10 h-10 rounded-full border border-[#4ADE80] bg-[#083b18] flex items-center justify-center mb-1">
          <svg className="w-5 h-5 text-[#4ADE80]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
          </svg>
        </div>
        <span className="font-heading font-medium text-[16px] text-[#E8EDD4]">Draw Scheduled...</span>
        <span className="font-sans text-[13px] text-[#4ADE80]">Will run automatically on 30 Jun 2025 14:00</span>
      </div>

      {/* Draw Timeline */}
      <div className="w-full bg-[#161810] rounded-[12px] p-6 pt-5">
        <h3 className="font-heading font-medium text-[14px] text-[#E8EDD4] mb-6">Draw Timeline</h3>
        
        <div className="flex flex-col relative before:absolute before:inset-0 before:ml-[11px] before:w-[2px] before:bg-[#2D3C13]">
          
          {/* Step 1 */}
          <div className="relative flex items-start gap-4 mb-8">
            <div className="w-6 h-6 rounded-full bg-[#083b18] border-2 border-[#4ADE80] flex items-center justify-center shrink-0 z-10">
              <svg className="w-3 h-3 text-[#4ADE80]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
              </svg>
            </div>
            <div className="flex flex-col -mt-0.5">
              <span className="font-sans font-medium text-[13px] text-[#E8EDD4]">Competition approved & published</span>
              <span className="font-sans text-[11px] text-[#5A752A] mt-0.5">System • 10 Jun 2025 14:00</span>
            </div>
          </div>

          {/* Step 2 */}
          <div className="relative flex items-start gap-4 mb-8">
            <div className="w-6 h-6 rounded-full bg-[#083b18] border-2 border-[#4ADE80] flex items-center justify-center shrink-0 z-10">
              <svg className="w-3 h-3 text-[#4ADE80]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
              </svg>
            </div>
            <div className="flex flex-col -mt-0.5">
              <span className="font-sans font-medium text-[13px] text-[#E8EDD4]">Ticket sales started</span>
              <span className="font-sans text-[11px] text-[#5A752A] mt-0.5">System • 10 Jun 2025 14:05</span>
            </div>
          </div>

          {/* Step 3 */}
          <div className="relative flex items-start gap-4 mb-8">
            <div className="w-6 h-6 rounded-full bg-[#111210] border-2 border-[#43581E] shrink-0 z-10"></div>
            <div className="flex flex-col -mt-0.5 opacity-60">
              <span className="font-sans font-medium text-[13px] text-[#E8EDD4]">Ticket sales closed</span>
              <span className="font-sans text-[11px] text-[#5A752A] mt-0.5">Waiting...</span>
            </div>
          </div>

          {/* Step 4 */}
          <div className="relative flex items-start gap-4 mb-8">
            <div className="w-6 h-6 rounded-full bg-[#111210] border-2 border-[#43581E] shrink-0 z-10"></div>
            <div className="flex flex-col -mt-0.5 opacity-60">
              <span className="font-sans font-medium text-[13px] text-[#E8EDD4]">Auto draw process started</span>
              <span className="font-sans text-[11px] text-[#5A752A] mt-0.5">...</span>
            </div>
          </div>

          {/* Step 5 */}
          <div className="relative flex items-start gap-4 mb-8">
            <div className="w-6 h-6 rounded-full bg-[#111210] border-2 border-[#43581E] shrink-0 z-10"></div>
            <div className="flex flex-col -mt-0.5 opacity-60">
              <span className="font-sans font-medium text-[13px] text-[#E8EDD4]">Winner verification saved</span>
              <span className="font-sans text-[11px] text-[#5A752A] mt-0.5">...</span>
            </div>
          </div>

          {/* Step 6 */}
          <div className="relative flex items-start gap-4">
            <div className="w-6 h-6 rounded-full bg-[#111210] border-2 border-[#43581E] shrink-0 z-10"></div>
            <div className="flex flex-col -mt-0.5 opacity-60">
              <span className="font-sans font-medium text-[13px] text-[#E8EDD4]">Result published and notified</span>
              <span className="font-sans text-[11px] text-[#5A752A] mt-0.5">...</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
