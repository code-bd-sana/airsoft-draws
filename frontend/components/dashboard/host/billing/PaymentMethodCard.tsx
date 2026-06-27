"use client";

import React from "react";

export default function PaymentMethodCard() {
  return (
    <div className="w-full bg-[#161810] border border-[#2d3c13] rounded-[16px] p-[24px] lg:p-[32px] flex flex-col gap-[24px]">
      
      <h3 className="font-heading font-medium text-[16px] text-[#e8edd4]">
        Payment Method
      </h3>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-[16px]">
        
        {/* Card Details */}
        <div className="flex items-center gap-[16px]">
          {/* Card Icon Container */}
          <div className="w-[48px] h-[32px] bg-[#1a230a] border border-[#2d3c13] rounded-[4px] flex items-center justify-center">
            <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#8cb34a" className="w-[20px] h-[20px]">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z" />
            </svg>
          </div>
          
          <div className="flex items-center gap-[12px]">
            <span className="font-sans font-medium text-[14px] text-[#e8edd4] tracking-widest mt-1">
              **** **** **** 4242
            </span>
            <span className="font-sans font-normal text-[12px] text-[#72943a]">
              Expires 12/26
            </span>
          </div>
        </div>

        {/* Action */}
        <button className="h-[40px] px-[24px] bg-transparent border border-[#2d3c13] hover:border-[#8cb34a] rounded-[8px] font-sans font-medium text-[13px] text-[#e8edd4] transition-colors shrink-0 w-fit">
          Update Card
        </button>

      </div>
      
    </div>
  );
}
