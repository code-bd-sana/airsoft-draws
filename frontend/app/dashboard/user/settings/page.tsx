import React from "react";

export default function UserSettingsPage() {
  return (
    <div className="flex flex-col items-center gap-6 p-8 max-w-[800px] mx-auto w-full animate-fadeIn">
      
      {/* Privacy Card */}
      <div className="w-full bg-[#161810] border border-[#2D3C13] rounded-[16px] p-6 flex flex-col gap-6">
        <h2 className="font-heading font-medium text-[16px] text-[#E8EDD4]">
          Privacy
        </h2>
        
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-1">
              <span className="font-sans font-medium text-[13px] text-[#E8EDD4]">Show my name on public Winners page</span>
              <span className="font-sans text-[11px] text-[#5A752A]">Your name will be visible in the Winners gallery</span>
            </div>
            {/* Active Toggle */}
            <div className="w-9 h-5 bg-[#8CB34A] rounded-full relative cursor-pointer shrink-0 transition-colors">
              <div className="absolute top-[2px] right-[2px] w-4 h-4 bg-[#0D0D0B] rounded-full shadow-sm transition-transform" />
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-1">
              <span className="font-sans font-medium text-[13px] text-[#E8EDD4]">Allow host messages</span>
              <span className="font-sans text-[11px] text-[#5A752A]">Raffle hosts can send you messages about their raffles</span>
            </div>
            {/* Inactive Toggle */}
            <div className="w-9 h-5 bg-[#1A230A] border border-[#2D3C13] rounded-full relative cursor-pointer shrink-0 transition-colors">
              <div className="absolute top-[1.5px] left-[2px] w-4 h-4 bg-[#5A752A] rounded-full shadow-sm transition-transform" />
            </div>
          </div>
        </div>
      </div>

      {/* Security Card */}
      <div className="w-full bg-[#161810] border border-[#2D3C13] rounded-[16px] p-6 flex flex-col gap-6">
        <h2 className="font-heading font-medium text-[16px] text-[#E8EDD4]">
          Security
        </h2>
        
        <div className="flex items-center justify-between pb-6 border-b border-[#2D3C13]">
          <div className="flex flex-col gap-1">
            <span className="font-sans font-medium text-[13px] text-[#E8EDD4]">Two-Factor Authentication</span>
            <span className="font-sans text-[11px] text-[#5A752A]">Add an extra layer of security to your account</span>
          </div>
          {/* Inactive Toggle */}
          <div className="w-9 h-5 bg-[#1A230A] border border-[#2D3C13] rounded-full relative cursor-pointer shrink-0 transition-colors">
            <div className="absolute top-[1.5px] left-[2px] w-4 h-4 bg-[#5A752A] rounded-full shadow-sm transition-transform" />
          </div>
        </div>

        <div className="flex flex-col gap-5">
          <span className="font-sans text-[11px] font-medium text-[#5A752A] uppercase tracking-[1px]">
            Active Sessions
          </span>
          
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-1">
              <span className="font-sans font-medium text-[13px] text-[#E8EDD4]">MacBook Pro — Chrome</span>
              <span className="font-sans text-[11px] text-[#8CB34A]">Manchester, UK • Current session</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-1">
              <span className="font-sans font-medium text-[13px] text-[#E8EDD4]">iPhone 14 — Safari</span>
              <span className="font-sans text-[11px] text-[#5A752A]">Manchester, UK</span>
            </div>
            <button className="font-sans font-medium text-[13px] text-[#EF4444] hover:text-[#DC2626] transition-colors">
              Log out
            </button>
          </div>
        </div>
      </div>

      {/* Delete My Account Card */}
      <div className="w-full bg-[#161810] border border-[#7F1D1D]/50 rounded-[16px] p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-2">
        <div className="flex flex-col gap-1">
          <span className="font-sans font-medium text-[13px] text-[#EF4444]">Delete My Account</span>
          <span className="font-sans text-[11px] text-[#5A752A]">This action is permanent and cannot be undone</span>
        </div>
        
        <button className="px-6 py-2.5 rounded-[8px] bg-[#7F1D1D] hover:bg-[#991B1B] border border-[#DC2626]/20 text-[#FEF2F2] font-sans font-medium text-[13px] transition-colors shrink-0">
          Delete Account
        </button>
      </div>

    </div>
  );
}
