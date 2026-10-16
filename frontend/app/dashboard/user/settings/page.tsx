"use client";

import React, { useState } from "react";
import { toast } from "sonner";

export default function UserSettingsPage() {
  const [showNameOnWinners, setShowNameOnWinners] = useState(true);
  const [allowHostMessages, setAllowHostMessages] = useState(false);
  const [twoFactorAuth, setTwoFactorAuth] = useState(false);
  const [otherSessions, setOtherSessions] = useState([
    { id: "iphone-14", name: "iPhone 14 — Safari", location: "Manchester, UK" },
  ]);

  const toggleShowName = () => {
    setShowNameOnWinners((prev) => {
      const next = !prev;
      toast.success(next ? "Name is now visible on Winners page" : "Name hidden on Winners page");
      return next;
    });
  };

  const toggleHostMessages = () => {
    setAllowHostMessages((prev) => {
      const next = !prev;
      toast.success(next ? "Host messages enabled" : "Host messages disabled");
      return next;
    });
  };

  const toggle2FA = () => {
    setTwoFactorAuth((prev) => {
      const next = !prev;
      toast.success(next ? "Two-Factor Authentication enabled" : "Two-Factor Authentication disabled");
      return next;
    });
  };

  const handleLogoutSession = (sessionId: string) => {
    setOtherSessions((prev) => prev.filter((s) => s.id !== sessionId));
    toast.success("Remote session logged out successfully");
  };

  const handleDeleteAccount = () => {
    if (window.confirm("Are you sure you want to delete your account? This action is permanent and cannot be undone.")) {
      toast.info("Please contact customer support at support@airsoftdraws.com to complete account deletion.");
    }
  };

  return (
    <div className="flex flex-col items-center gap-6 p-4 sm:p-6 lg:p-8 max-w-[800px] mx-auto w-full animate-fadeIn">
      {/* Privacy Card */}
      <div className="w-full bg-[#161810] border border-[#2D3C13] rounded-[16px] p-6 flex flex-col gap-6">
        <h2 className="font-heading font-medium text-[16px] text-[#E8EDD4]">
          Privacy
        </h2>

        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-1">
              <span className="font-sans font-medium text-[13px] text-[#E8EDD4]">
                Show my name on public Winners page
              </span>
              <span className="font-sans text-[11px] text-[#5A752A]">
                Your name will be visible in the Winners gallery
              </span>
            </div>
            {/* Toggle */}
            <button
              type="button"
              onClick={toggleShowName}
              className={`w-10 h-6 rounded-full relative cursor-pointer shrink-0 transition-colors ${
                showNameOnWinners ? "bg-[#8CB34A]" : "bg-[#1A230A] border border-[#2D3C13]"
              }`}
            >
              <div
                className={`absolute top-[2px] w-5 h-5 rounded-full shadow-sm transition-transform ${
                  showNameOnWinners
                    ? "right-[2px] bg-[#0D0D0B]"
                    : "left-[2px] bg-[#5A752A]"
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-1">
              <span className="font-sans font-medium text-[13px] text-[#E8EDD4]">
                Allow host messages
              </span>
              <span className="font-sans text-[11px] text-[#5A752A]">
                Raffle hosts can send you messages about their raffles
              </span>
            </div>
            {/* Toggle */}
            <button
              type="button"
              onClick={toggleHostMessages}
              className={`w-10 h-6 rounded-full relative cursor-pointer shrink-0 transition-colors ${
                allowHostMessages ? "bg-[#8CB34A]" : "bg-[#1A230A] border border-[#2D3C13]"
              }`}
            >
              <div
                className={`absolute top-[2px] w-5 h-5 rounded-full shadow-sm transition-transform ${
                  allowHostMessages
                    ? "right-[2px] bg-[#0D0D0B]"
                    : "left-[2px] bg-[#5A752A]"
                }`}
              />
            </button>
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
            <span className="font-sans font-medium text-[13px] text-[#E8EDD4]">
              Two-Factor Authentication
            </span>
            <span className="font-sans text-[11px] text-[#5A752A]">
              Add an extra layer of security to your account
            </span>
          </div>
          {/* Toggle */}
          <button
            type="button"
            onClick={toggle2FA}
            className={`w-10 h-6 rounded-full relative cursor-pointer shrink-0 transition-colors ${
              twoFactorAuth ? "bg-[#8CB34A]" : "bg-[#1A230A] border border-[#2D3C13]"
            }`}
          >
            <div
              className={`absolute top-[2px] w-5 h-5 rounded-full shadow-sm transition-transform ${
                twoFactorAuth
                  ? "right-[2px] bg-[#0D0D0B]"
                  : "left-[2px] bg-[#5A752A]"
              }`}
            />
          </button>
        </div>

        <div className="flex flex-col gap-5">
          <span className="font-sans text-[11px] font-medium text-[#5A752A] uppercase tracking-[1px]">
            Active Sessions
          </span>

          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-1">
              <span className="font-sans font-medium text-[13px] text-[#E8EDD4]">
                Current Browser Session
              </span>
              <span className="font-sans text-[11px] text-[#8CB34A]">
                Active now • Current session
              </span>
            </div>
          </div>

          {otherSessions.map((session) => (
            <div key={session.id} className="flex items-center justify-between">
              <div className="flex flex-col gap-1">
                <span className="font-sans font-medium text-[13px] text-[#E8EDD4]">
                  {session.name}
                </span>
                <span className="font-sans text-[11px] text-[#5A752A]">
                  {session.location}
                </span>
              </div>
              <button
                type="button"
                onClick={() => handleLogoutSession(session.id)}
                className="font-sans font-medium text-[13px] text-[#EF4444] hover:text-[#DC2626] transition-colors"
              >
                Log out
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Delete My Account Card */}
      <div className="w-full bg-[#161810] border border-[#7F1D1D]/50 rounded-[16px] p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-2">
        <div className="flex flex-col gap-1">
          <span className="font-sans font-medium text-[13px] text-[#EF4444]">
            Delete My Account
          </span>
          <span className="font-sans text-[11px] text-[#5A752A]">
            This action is permanent and cannot be undone
          </span>
        </div>

        <button
          type="button"
          onClick={handleDeleteAccount}
          className="px-6 py-2.5 rounded-[8px] bg-[#7F1D1D] hover:bg-[#991B1B] border border-[#DC2626]/20 text-[#FEF2F2] font-sans font-medium text-[13px] transition-colors shrink-0"
        >
          Delete Account
        </button>
      </div>
    </div>
  );
}
