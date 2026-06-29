"use client";

import React, { useState } from "react";
import ProfileSettings from "./ProfileSettings";
import SecuritySettings from "./SecuritySettings";
import NotificationSettings from "./NotificationSettings";

type SettingsTab = "profile" | "security" | "notifications" | "billing";

export default function SettingsManager() {
  const [activeTab, setActiveTab] = useState<SettingsTab>("profile");

  return (
    <div className="flex flex-col md:flex-row gap-8 w-full max-w-[1200px] animate-fadeIn">
      
      {/* Settings Sidebar */}
      <div className="w-full md:w-[240px] shrink-0">
        <div className="bg-[#111210] border border-[#2D3C13] rounded-[16px] overflow-hidden flex flex-col p-2">
          
          <button 
            onClick={() => setActiveTab("profile")}
            className={`flex items-center gap-3 w-full h-[48px] px-4 rounded-[8px] font-sans font-medium text-[13px] transition-colors ${
              activeTab === "profile" 
                ? "bg-[#1A230A] text-[#8CB34A]" 
                : "text-[#72943A] hover:bg-[#161810] hover:text-[#E8EDD4]"
            }`}
          >
            <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
            </svg>
            Profile Details
          </button>
          
          <button 
            onClick={() => setActiveTab("security")}
            className={`flex items-center gap-3 w-full h-[48px] px-4 rounded-[8px] font-sans font-medium text-[13px] transition-colors ${
              activeTab === "security" 
                ? "bg-[#1A230A] text-[#8CB34A]" 
                : "text-[#72943A] hover:bg-[#161810] hover:text-[#E8EDD4]"
            }`}
          >
            <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
            </svg>
            Security
          </button>
          
          <button 
            onClick={() => setActiveTab("notifications")}
            className={`flex items-center gap-3 w-full h-[48px] px-4 rounded-[8px] font-sans font-medium text-[13px] transition-colors ${
              activeTab === "notifications" 
                ? "bg-[#1A230A] text-[#8CB34A]" 
                : "text-[#72943A] hover:bg-[#161810] hover:text-[#E8EDD4]"
            }`}
          >
            <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
            </svg>
            Notifications
          </button>

          {/* Spacer */}
          <div className="w-full px-2 py-2">
            <div className="h-px bg-[#1A230A] w-full" />
          </div>

          <button 
            onClick={() => setActiveTab("billing")}
            className={`flex items-center gap-3 w-full h-[48px] px-4 rounded-[8px] font-sans font-medium text-[13px] transition-colors ${
              activeTab === "billing" 
                ? "bg-[#1A230A] text-[#8CB34A]" 
                : "text-[#72943A] hover:bg-[#161810] hover:text-[#E8EDD4]"
            }`}
          >
            <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z" />
            </svg>
            Billing
          </button>
          
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 min-w-0">
        {activeTab === "profile" && <ProfileSettings />}
        {activeTab === "security" && <SecuritySettings />}
        {activeTab === "notifications" && <NotificationSettings />}
        {activeTab === "billing" && (
          <div className="bg-[#161810] border border-[#2D3C13] rounded-[16px] p-8 flex flex-col gap-6 items-center justify-center min-h-[400px]">
             <svg className="w-12 h-12 text-[#2D3C13] mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z" />
             </svg>
             <h3 className="font-heading font-medium text-[18px] text-[#E8EDD4]">Billing coming soon</h3>
             <p className="font-sans text-[13px] text-[#72943A] text-center max-w-[300px]">
               Payment methods and invoices will be available in the upcoming release.
             </p>
          </div>
        )}
      </div>

    </div>
  );
}
