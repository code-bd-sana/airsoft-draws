"use client";

import React from "react";

export default function ProfileSettings() {
  return (
    <div className="bg-[#161810] border border-[#2D3C13] rounded-[16px] p-8 flex flex-col gap-8 animate-fadeIn">
      <div>
        <h2 className="font-heading font-medium text-[20px] text-[#E8EDD4]">Profile Details</h2>
        <p className="font-sans text-[13px] text-[#72943A] mt-1">Manage your public profile and contact information.</p>
      </div>

      <div className="h-px w-full bg-[#2D3C13]/50" />

      {/* Avatar Section */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
        <div className="w-[80px] h-[80px] rounded-full bg-[#1A230A] border border-[#43581E] flex items-center justify-center shrink-0">
          <span className="font-heading font-medium text-[24px] text-[#8CB34A]">A</span>
        </div>
        <div className="flex flex-col gap-3">
          <div className="flex gap-3">
            <button className="h-[36px] px-4 rounded-[8px] bg-[#8CB34A] hover:bg-[#A0D056] text-[#0D0D0B] font-sans font-medium text-[12px] transition-colors">
              Upload New
            </button>
            <button className="h-[36px] px-4 rounded-[8px] bg-transparent border border-[#2D3C13] hover:border-[#43581E] text-[#E8EDD4] font-sans font-medium text-[12px] transition-colors">
              Remove
            </button>
          </div>
          <p className="font-sans text-[11px] text-[#72943A]">Recommended: Square JPG, PNG. Max 2MB.</p>
        </div>
      </div>

      <div className="h-px w-full bg-[#2D3C13]/50" />
      
      {/* Form Fields */}
      <div className="flex flex-col gap-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="flex flex-col gap-2">
            <label className="font-sans font-medium text-[12px] text-[#A0D056] uppercase tracking-[0.5px]">First Name</label>
            <input 
              type="text" 
              defaultValue="Admin" 
              className="w-full h-[44px] bg-[#111210] border border-[#2D3C13] rounded-[8px] px-4 text-[14px] text-[#E8EDD4] outline-none focus:border-[#43581E] transition-colors"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="font-sans font-medium text-[12px] text-[#A0D056] uppercase tracking-[0.5px]">Last Name</label>
            <input 
              type="text" 
              defaultValue="User" 
              className="w-full h-[44px] bg-[#111210] border border-[#2D3C13] rounded-[8px] px-4 text-[14px] text-[#E8EDD4] outline-none focus:border-[#43581E] transition-colors"
            />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="font-sans font-medium text-[12px] text-[#A0D056] uppercase tracking-[0.5px]">Email Address</label>
          <input 
            type="email" 
            defaultValue="hello@airsoftdraws.co.uk" 
            className="w-full h-[44px] bg-[#111210] border border-[#2D3C13] rounded-[8px] px-4 text-[14px] text-[#E8EDD4] outline-none focus:border-[#43581E] transition-colors"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="font-sans font-medium text-[12px] text-[#A0D056] uppercase tracking-[0.5px]">Phone Number</label>
          <input 
            type="tel" 
            placeholder="+44 7700 900077"
            className="w-full h-[44px] bg-[#111210] border border-[#2D3C13] rounded-[8px] px-4 text-[14px] text-[#E8EDD4] outline-none focus:border-[#43581E] transition-colors"
          />
        </div>
      </div>
      
      <div className="flex justify-end pt-2 border-t border-[#2D3C13]/50">
        <button className="h-[44px] px-6 rounded-[8px] bg-[#8CB34A] hover:bg-[#A0D056] text-[#0D0D0B] font-heading font-medium text-[14px] transition-colors shadow-[0_0_15px_rgba(140,179,74,0.15)]">
          Save Changes
        </button>
      </div>
    </div>
  );
}
