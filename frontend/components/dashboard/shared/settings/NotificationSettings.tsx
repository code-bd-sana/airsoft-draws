"use client";

import React, { useState } from "react";

export default function NotificationSettings() {
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [marketing, setMarketing] = useState(false);
  const [newCompetitions, setNewCompetitions] = useState(true);

  return (
    <div className="bg-[#161810] border border-[#2D3C13] rounded-[16px] p-8 flex flex-col gap-8 animate-fadeIn">
      <div>
        <h2 className="font-heading font-medium text-[20px] text-[#E8EDD4]">Notifications</h2>
        <p className="font-sans text-[13px] text-[#72943A] mt-1">Manage how and when you receive alerts from Airsoft Draws.</p>
      </div>

      <div className="h-px w-full bg-[#2D3C13]/50" />

      <div className="flex flex-col gap-6">
        
        {/* Toggle 1 */}
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-1 pr-6">
            <span className="font-sans font-medium text-[14px] text-[#E8EDD4]">Essential Account Alerts</span>
            <span className="font-sans text-[12px] text-[#72943A]">Receive emails about password changes, successful purchases, and active ticket numbers.</span>
          </div>
          <button 
            onClick={() => setEmailAlerts(!emailAlerts)}
            className={`w-[44px] h-[24px] rounded-full p-[2px] transition-colors shrink-0 ${emailAlerts ? 'bg-[#8CB34A]' : 'bg-[#2D3C13]'}`}
          >
            <div className={`w-[20px] h-[20px] rounded-full bg-[#111210] transition-transform ${emailAlerts ? 'translate-x-[20px]' : 'translate-x-0'}`} />
          </button>
        </div>

        {/* Toggle 2 */}
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-1 pr-6">
            <span className="font-sans font-medium text-[14px] text-[#E8EDD4]">New Competitions & Draws</span>
            <span className="font-sans text-[12px] text-[#72943A]">Get notified when new competitions drop or when live draws are about to begin.</span>
          </div>
          <button 
            onClick={() => setNewCompetitions(!newCompetitions)}
            className={`w-[44px] h-[24px] rounded-full p-[2px] transition-colors shrink-0 ${newCompetitions ? 'bg-[#8CB34A]' : 'bg-[#2D3C13]'}`}
          >
            <div className={`w-[20px] h-[20px] rounded-full bg-[#111210] transition-transform ${newCompetitions ? 'translate-x-[20px]' : 'translate-x-0'}`} />
          </button>
        </div>

        {/* Toggle 3 */}
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-1 pr-6">
            <span className="font-sans font-medium text-[14px] text-[#E8EDD4]">Marketing & Promotions</span>
            <span className="font-sans text-[12px] text-[#72943A]">Receive special offers, discount codes, and platform news.</span>
          </div>
          <button 
            onClick={() => setMarketing(!marketing)}
            className={`w-[44px] h-[24px] rounded-full p-[2px] transition-colors shrink-0 ${marketing ? 'bg-[#8CB34A]' : 'bg-[#2D3C13]'}`}
          >
            <div className={`w-[20px] h-[20px] rounded-full bg-[#111210] transition-transform ${marketing ? 'translate-x-[20px]' : 'translate-x-0'}`} />
          </button>
        </div>

      </div>

    </div>
  );
}
