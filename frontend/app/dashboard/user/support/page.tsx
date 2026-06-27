import React from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function UserSupportPage() {
  const cookieStore = await cookies();
  const role = cookieStore.get("demo_role")?.value;

  if (role !== "user") {
    redirect("/dashboard");
  }

  return (
    <div className="p-8 max-w-[1660px] mx-auto w-full animate-fadeIn">
      <div className="flex flex-col lg:flex-row gap-6 w-full">
        
        {/* Left Column: Raise a Support Ticket */}
        <div className="flex-1 bg-[#161810] border border-[#2D3C13] rounded-[16px] p-8 flex flex-col gap-6">
          <h2 className="font-heading font-medium text-[18px] text-[#E8EDD4]">
            Raise a Support Ticket
          </h2>

          <form className="flex flex-col gap-5">
            {/* Subject Field */}
            <div className="flex flex-col gap-2">
              <label className="font-sans text-[10px] font-medium text-[#5A752A] uppercase tracking-[1px]">
                Subject
              </label>
              <input 
                type="text" 
                className="w-full h-[48px] bg-[#0D0D0B] border border-[#2D3C13] rounded-[8px] px-4 text-[14px] text-[#E8EDD4] font-sans focus:outline-none focus:border-[#43581E] transition-colors"
              />
            </div>

            {/* Related Order ID Field */}
            <div className="flex flex-col gap-2">
              <label className="font-sans text-[10px] font-medium text-[#5A752A] uppercase tracking-[1px]">
                Related Order ID (Optional)
              </label>
              <input 
                type="text" 
                placeholder="e.g. #TXN-8821"
                className="w-full h-[48px] bg-[#0D0D0B] border border-[#2D3C13] rounded-[8px] px-4 text-[14px] text-[#E8EDD4] font-sans placeholder:text-[#5A752A] focus:outline-none focus:border-[#43581E] transition-colors"
              />
            </div>

            {/* Message Field */}
            <div className="flex flex-col gap-2">
              <label className="font-sans text-[10px] font-medium text-[#5A752A] uppercase tracking-[1px]">
                Message
              </label>
              <textarea 
                placeholder="Describe your issue in detail..."
                className="w-full h-[180px] bg-[#0D0D0B] border border-[#2D3C13] rounded-[8px] p-4 text-[14px] text-[#E8EDD4] font-sans placeholder:text-[#5A752A] focus:outline-none focus:border-[#43581E] transition-colors resize-none"
              />
            </div>

            {/* Submit Button */}
            <button 
              type="button" 
              className="w-full h-[48px] bg-[#A0D056] hover:bg-[#8CB34A] text-[#0D0D0B] rounded-[8px] font-heading font-medium text-[15px] flex items-center justify-center gap-2 transition-colors mt-2"
            >
              Submit
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
              </svg>
            </button>
          </form>
        </div>

        {/* Right Column: Support Tickets & Quick Answers */}
        <div className="w-full lg:w-[480px] flex flex-col gap-6 shrink-0">
          
          {/* My Support Tickets */}
          <div className="bg-[#161810] border border-[#2D3C13] rounded-[16px] p-6 flex flex-col gap-5">
            <h2 className="font-heading font-medium text-[16px] text-[#E8EDD4]">
              My Support Tickets
            </h2>
            <div className="flex flex-col gap-4">
              
              {/* Ticket 1 */}
              <div className="flex items-start justify-between pb-4 border-b border-[#2D3C13]">
                <div className="flex flex-col gap-1">
                  <span className="font-sans font-medium text-[13px] text-[#E8EDD4]">Payment not processed</span>
                  <span className="font-sans text-[11px] text-[#5A752A]">18 Jun 2025</span>
                </div>
                <div className="px-3 py-1 rounded-full border border-[#D97706]/30 bg-[#78350F]/50">
                  <span className="font-sans font-medium text-[10px] text-[#D97706]">Open</span>
                </div>
              </div>

              {/* Ticket 2 */}
              <div className="flex items-start justify-between pb-4 border-b border-[#2D3C13]">
                <div className="flex flex-col gap-1">
                  <span className="font-sans font-medium text-[13px] text-[#E8EDD4]">Raffle entry query</span>
                  <span className="font-sans text-[11px] text-[#5A752A]">10 Jun 2025</span>
                </div>
                <div className="px-3 py-1 rounded-full border border-[#4ADE80]/30 bg-[#083b18]">
                  <span className="font-sans font-medium text-[10px] text-[#4ADE80]">Resolved</span>
                </div>
              </div>

              {/* Ticket 3 */}
              <div className="flex items-start justify-between">
                <div className="flex flex-col gap-1">
                  <span className="font-sans font-medium text-[13px] text-[#E8EDD4]">Account verification</span>
                  <span className="font-sans text-[11px] text-[#5A752A]">02 Jun 2025</span>
                </div>
                <div className="px-3 py-1 rounded-full border border-[#2D3C13] bg-[#1A230A]/50">
                  <span className="font-sans font-medium text-[10px] text-[#72943A]">Closed</span>
                </div>
              </div>

            </div>
          </div>

          {/* Quick Answers */}
          <div className="bg-[#161810] border border-[#2D3C13] rounded-[16px] p-6 flex flex-col gap-5">
            <h2 className="font-heading font-medium text-[16px] text-[#E8EDD4]">
              Quick Answers
            </h2>
            <div className="flex flex-col">
              
              {["How do I claim my prize?", "Can I get a refund on tickets?", "How are winners selected?"].map((question, index) => (
                <button 
                  key={index}
                  className={`w-full flex items-center justify-between py-4 group ${index !== 2 ? 'border-b border-[#2D3C13]' : ''}`}
                >
                  <span className="font-sans text-[13px] text-[#72943A] group-hover:text-[#E8EDD4] transition-colors">
                    {question}
                  </span>
                  <svg className="w-3.5 h-3.5 text-[#5A752A] group-hover:text-[#A0D056] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              ))}

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
