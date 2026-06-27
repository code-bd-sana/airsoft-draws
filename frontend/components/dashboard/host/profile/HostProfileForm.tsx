"use client";

import React, { useState } from "react";
import { cn } from "../../../../lib/utils";

export default function HostProfileForm() {
  const [formData, setFormData] = useState({
    brandName: "",
    bio: "",
    email: "",
    phone: "",
    address: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Profile saved successfully!");
  };

  return (
    <div className="bg-[#161810] border border-[#2d3c13] rounded-[16px] p-[24px] lg:p-[48px] flex flex-col lg:flex-row gap-[48px] lg:gap-[80px]">
      
      {/* Left Column: Avatar & Membership */}
      <div className="flex flex-col items-center gap-[32px] w-full lg:w-[280px] shrink-0">
        
        {/* Avatar Area */}
        <div className="flex flex-col items-center gap-[16px]">
          <div className="relative w-[160px] h-[160px] rounded-full border-2 border-dashed border-[#2d3c13] flex items-center justify-center bg-[#0d0d0b]">
            <span className="font-heading font-bold text-[48px] text-[#8cb34a]">TG</span>
            
            {/* Camera Icon Button */}
            <button className="absolute bottom-2 right-2 w-[32px] h-[32px] rounded-full bg-[#8cb34a] flex items-center justify-center hover:bg-[#a0d056] transition-colors border-2 border-[#161810]">
              <svg fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="#0d0d0b" className="w-[16px] h-[16px]">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z" />
              </svg>
            </button>
          </div>
          <button className="font-sans font-medium text-[12px] text-[#5a752a] hover:text-[#8cb34a] transition-colors">
            Upload Logo
          </button>
        </div>

        {/* Membership Status Box */}
        <div className="w-full bg-[#1a230a] border border-[#2d3c13] rounded-[12px] p-[24px] flex flex-col items-center justify-center gap-[16px]">
          <h4 className="font-sans font-medium text-[13px] text-[#e8edd4]">
            Membership Status
          </h4>
          <div className="px-[16px] py-[6px] rounded-full border border-[#8cb34a] bg-transparent">
            <span className="font-sans font-medium text-[10px] text-[#8cb34a] uppercase tracking-wider">
              PREMIUM HOST
            </span>
          </div>
          <button className="font-sans font-medium text-[12px] text-[#8cb34a] hover:text-[#a0d056] transition-colors flex items-center gap-[4px] mt-[4px]">
            Manage Subscription
            <svg fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-[12px] h-[12px]">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
            </svg>
          </button>
        </div>

      </div>

      {/* Right Column: Form */}
      <form onSubmit={handleSubmit} className="flex-1 flex flex-col gap-[24px]">
        
        <div className="flex flex-col gap-[8px]">
          <label className="font-sans font-medium text-[11px] text-[#5a752a] uppercase tracking-wider">
            Host / Brand Name
          </label>
          <input 
            type="text"
            name="brandName"
            value={formData.brandName}
            onChange={handleChange}
            placeholder="e.g. Tactical Gear UK"
            className="w-full h-[44px] px-[16px] bg-[#0d0d0b] border border-[#2d3c13] rounded-[8px] font-sans text-[14px] text-[#e8edd4] placeholder:text-[#5a752a] focus:outline-none focus:border-[#8cb34a] transition-colors"
          />
        </div>

        <div className="flex flex-col gap-[8px]">
          <label className="font-sans font-medium text-[11px] text-[#5a752a] uppercase tracking-wider">
            Bio / Description
          </label>
          <textarea 
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            placeholder="Tell entrants about your brand..."
            className="w-full h-[120px] p-[16px] bg-[#0d0d0b] border border-[#2d3c13] rounded-[8px] font-sans text-[14px] text-[#e8edd4] placeholder:text-[#5a752a] focus:outline-none focus:border-[#8cb34a] transition-colors resize-none"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-[24px]">
          <div className="flex flex-col gap-[8px]">
            <label className="font-sans font-medium text-[11px] text-[#5a752a] uppercase tracking-wider">
              Contact Email
            </label>
            <input 
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="host@example.com"
              className="w-full h-[44px] px-[16px] bg-[#0d0d0b] border border-[#2d3c13] rounded-[8px] font-sans text-[14px] text-[#e8edd4] placeholder:text-[#5a752a] focus:outline-none focus:border-[#8cb34a] transition-colors"
            />
          </div>
          <div className="flex flex-col gap-[8px]">
            <label className="font-sans font-medium text-[11px] text-[#5a752a] uppercase tracking-wider">
              Phone Number
            </label>
            <input 
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+44 7700 900000"
              className="w-full h-[44px] px-[16px] bg-[#0d0d0b] border border-[#2d3c13] rounded-[8px] font-sans text-[14px] text-[#e8edd4] placeholder:text-[#5a752a] focus:outline-none focus:border-[#8cb34a] transition-colors"
            />
          </div>
        </div>

        <div className="flex flex-col gap-[8px]">
          <label className="font-sans font-medium text-[11px] text-[#5a752a] uppercase tracking-wider">
            Business Address
          </label>
          <textarea 
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="123 Street, City, Postcode"
            className="w-full h-[120px] p-[16px] bg-[#0d0d0b] border border-[#2d3c13] rounded-[8px] font-sans text-[14px] text-[#e8edd4] placeholder:text-[#5a752a] focus:outline-none focus:border-[#8cb34a] transition-colors resize-none"
          />
        </div>

        <div className="flex justify-end mt-[8px]">
          <button 
            type="submit"
            className="h-[44px] px-[24px] bg-[#8cb34a] hover:bg-[#72943a] transition-colors rounded-[8px] flex items-center justify-center shrink-0 font-heading font-medium text-[14px] text-[#0d0d0b]"
          >
            Save Changes
          </button>
        </div>

      </form>
    </div>
  );
}
