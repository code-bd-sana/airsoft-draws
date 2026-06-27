"use client";

import React from "react";

export default function NotificationsPage() {
  return (
    <div className="flex-1 w-full px-[20px] lg:px-[40px] py-[24px] lg:py-[32px] flex flex-col items-center justify-center animate-in fade-in zoom-in-95 duration-300 min-h-[calc(100vh-100px)]">
      
      <div className="bg-[#161810] border border-[#2d3c13] rounded-[16px] w-full h-[300px] flex flex-col items-center justify-center p-[48px] gap-[15px]">
        {/* Bell Icon Placeholder */}
        <div className="w-[48px] h-[48px] flex items-center justify-center opacity-70">
          <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#8cb34a" className="w-[32px] h-[32px]">
            <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
          </svg>
        </div>

        <div className="flex flex-col items-center justify-center gap-[8px]">
          <h2 className="font-heading font-medium text-[16px] text-[#e8edd4]">
            Notifications
          </h2>
          <p className="font-sans font-normal text-[13px] text-[#5a752a]">
            This section is coming soon.
          </p>
        </div>
      </div>

    </div>
  );
}
