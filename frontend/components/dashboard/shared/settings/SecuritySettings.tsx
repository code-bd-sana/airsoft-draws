"use client";

import React from "react";

export default function SecuritySettings() {
  return (
    <div className="bg-[#161810] border border-[#2D3C13] rounded-[16px] p-8 flex flex-col gap-8 animate-fadeIn">
      <div>
        <h2 className="font-heading font-medium text-[20px] text-[#E8EDD4]">Security</h2>
        <p className="font-sans text-[13px] text-[#72943A] mt-1">Keep your account secure with a strong password and two-factor authentication.</p>
      </div>

      <div className="h-px w-full bg-[#2D3C13]/50" />

      {/* Password Change Form */}
      <div className="flex flex-col gap-5">
        <h3 className="font-heading font-medium text-[16px] text-[#E8EDD4]">Change Password</h3>
        
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label className="font-sans font-medium text-[12px] text-[#A0D056] uppercase tracking-[0.5px]">Current Password</label>
            <input 
              type="password" 
              placeholder="••••••••" 
              className="w-full h-[44px] bg-[#111210] border border-[#2D3C13] rounded-[8px] px-4 text-[14px] text-[#E8EDD4] outline-none focus:border-[#43581E] transition-colors"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className="font-sans font-medium text-[12px] text-[#A0D056] uppercase tracking-[0.5px]">New Password</label>
              <input 
                type="password" 
                placeholder="••••••••" 
                className="w-full h-[44px] bg-[#111210] border border-[#2D3C13] rounded-[8px] px-4 text-[14px] text-[#E8EDD4] outline-none focus:border-[#43581E] transition-colors"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="font-sans font-medium text-[12px] text-[#A0D056] uppercase tracking-[0.5px]">Confirm Password</label>
              <input 
                type="password" 
                placeholder="••••••••" 
                className="w-full h-[44px] bg-[#111210] border border-[#2D3C13] rounded-[8px] px-4 text-[14px] text-[#E8EDD4] outline-none focus:border-[#43581E] transition-colors"
              />
            </div>
          </div>
        </div>
        
        <div className="flex justify-start mt-1">
          <button className="h-[36px] px-5 rounded-[8px] bg-transparent border border-[#8CB34A] hover:bg-[#8CB34A]/10 text-[#8CB34A] font-sans font-medium text-[13px] transition-colors">
            Update Password
          </button>
        </div>
      </div>

      <div className="h-px w-full bg-[#2D3C13]/50" />
      
      {/* 2FA Section */}
      <div className="flex flex-col gap-5">
        <h3 className="font-heading font-medium text-[16px] text-[#E8EDD4]">Two-Factor Authentication (2FA)</h3>
        
        <div className="flex items-center justify-between p-5 rounded-[12px] bg-[#111210] border border-[#2D3C13]">
          <div className="flex flex-col gap-1 pr-4">
            <span className="font-sans font-medium text-[14px] text-[#E8EDD4]">Authenticator App</span>
            <span className="font-sans text-[12px] text-[#72943A]">Use an app like Google Authenticator or Authy to generate verification codes.</span>
          </div>
          <button className="h-[36px] px-4 shrink-0 rounded-[8px] bg-[#8CB34A] hover:bg-[#A0D056] text-[#0D0D0B] font-sans font-medium text-[12px] transition-colors">
            Enable 2FA
          </button>
        </div>
      </div>

    </div>
  );
}
