"use client";

import React from "react";

export default function AdminSettings() {
  return (
    <div className="flex flex-col gap-8 w-full max-w-[800px] animate-fadeIn">
      
      {/* Profile Settings */}
      <div className="bg-[#161810] border border-[#2D3C13] rounded-[16px] p-8 flex flex-col gap-6">
        <div>
          <h2 className="font-heading font-medium text-[18px] text-[#E8EDD4]">Profile Details</h2>
          <p className="font-sans text-[13px] text-[#72943A] mt-1">Update your basic profile information.</p>
        </div>
        
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label className="font-sans font-medium text-[13px] text-[#A0D056]">Full Name</label>
            <input 
              type="text" 
              defaultValue="Admin Sarah K." 
              className="w-full h-[44px] bg-[#111210] border border-[#2D3C13] rounded-[8px] px-4 text-[14px] text-[#E8EDD4] outline-none focus:border-[#43581E] transition-colors"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="font-sans font-medium text-[13px] text-[#A0D056]">Email Address</label>
            <input 
              type="email" 
              defaultValue="admin@airsoftdraws.co.uk" 
              className="w-full h-[44px] bg-[#111210] border border-[#2D3C13] rounded-[8px] px-4 text-[14px] text-[#E8EDD4] outline-none focus:border-[#43581E] transition-colors"
            />
          </div>
        </div>
        
        <div className="flex justify-end mt-2">
          <button className="h-[40px] px-6 rounded-[8px] bg-[#8CB34A] hover:bg-[#A0D056] text-[#0D0D0B] font-heading font-medium text-[13px] transition-colors">
            Save Changes
          </button>
        </div>
      </div>

      {/* Password Change */}
      <div className="bg-[#161810] border border-[#2D3C13] rounded-[16px] p-8 flex flex-col gap-6">
        <div>
          <h2 className="font-heading font-medium text-[18px] text-[#E8EDD4]">Change Password</h2>
          <p className="font-sans text-[13px] text-[#72943A] mt-1">Ensure your account is using a long, random password to stay secure.</p>
        </div>
        
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label className="font-sans font-medium text-[13px] text-[#A0D056]">Current Password</label>
            <input 
              type="password" 
              placeholder="••••••••" 
              className="w-full h-[44px] bg-[#111210] border border-[#2D3C13] rounded-[8px] px-4 text-[14px] text-[#E8EDD4] outline-none focus:border-[#43581E] transition-colors"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="font-sans font-medium text-[13px] text-[#A0D056]">New Password</label>
            <input 
              type="password" 
              placeholder="••••••••" 
              className="w-full h-[44px] bg-[#111210] border border-[#2D3C13] rounded-[8px] px-4 text-[14px] text-[#E8EDD4] outline-none focus:border-[#43581E] transition-colors"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="font-sans font-medium text-[13px] text-[#A0D056]">Confirm New Password</label>
            <input 
              type="password" 
              placeholder="••••••••" 
              className="w-full h-[44px] bg-[#111210] border border-[#2D3C13] rounded-[8px] px-4 text-[14px] text-[#E8EDD4] outline-none focus:border-[#43581E] transition-colors"
            />
          </div>
        </div>
        
        <div className="flex justify-end mt-2">
          <button className="h-[40px] px-6 rounded-[8px] bg-transparent border border-[#8CB34A] hover:bg-[#8CB34A]/10 text-[#8CB34A] font-heading font-medium text-[13px] transition-colors">
            Update Password
          </button>
        </div>
      </div>
      
    </div>
  );
}
