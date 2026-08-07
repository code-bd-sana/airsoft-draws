"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { DashboardAccount } from "../../types/dashboard.types";
import { cn } from "../../lib/utils";
import NotificationsDropdown from "./NotificationsDropdown";
import { useLogout } from "../../hooks/useAuthHooks";

interface DashboardTopbarProps {
  account: DashboardAccount;
  onMenuClick: () => void;
  title?: string;
  subtitle?: string;
  isCollapsed?: boolean;
  onToggleSidebar?: () => void;
}

export default function DashboardTopbar({
  account,
  onMenuClick,
  title = "Dashboard Overview",
  subtitle = "Host Portal / Dashboard Overview",
  isCollapsed = false,
  onToggleSidebar,
}: DashboardTopbarProps) {
  const router = useRouter();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  const logout = useLogout();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <header className="h-[88px] w-full bg-[#0D0D0B] border-b border-[#2D3C13] flex items-center justify-between px-[20px] lg:px-[40px] shrink-0 sticky top-0 z-30">
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Mobile menu trigger */}
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 -ml-2 text-[#E8EDD4] hover:bg-[#161810] rounded-md transition-colors"
          title="Open Menu"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          </svg>
        </button>

        {/* Desktop Sidebar Toggle Button */}
        {onToggleSidebar && (
          <button
            onClick={onToggleSidebar}
            className="hidden lg:flex items-center justify-center p-2 rounded-lg bg-[#161810] border border-[#2D3C13] text-[#72943A] hover:text-[#8CB34A] hover:bg-[#1A230A] transition-colors"
            title={isCollapsed ? "Expand Sidebar Menu" : "Collapse Sidebar Menu"}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.75} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>
        )}

        {/* 1-Tap Quick Switcher to Public Website */}
        <Link
          href="/live-raffles"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#1A230A] border border-[#8CB34A]/50 text-[#8CB34A] hover:bg-[#2D3C13] hover:text-[#A0D056] text-xs font-sans font-bold transition-all shadow-sm"
        >
          <svg className="w-4 h-4 text-[#8CB34A]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m-17.432-6A8.959 8.959 0 0 0 3 12c0 .778.099 1.533.284 2.253" />
          </svg>
          <span className="whitespace-nowrap">Public Site</span>
        </Link>

        {/* Page Title & Subtitle */}
        <div className="flex flex-col">
          <h1 className="font-heading font-medium text-[24px] text-[#E8EDD4] leading-tight m-0 p-0 hidden md:block">
            {title}
          </h1>
          <p className="font-sans font-normal text-[16px] text-[#B3B8AA] leading-none m-0 p-0 hidden md:block mt-1">
            {subtitle}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-[16px]">
        {/* Search Input (Hidden on mobile for now to save space) */}
        <div className="hidden md:flex items-center h-[40px] w-[280px] bg-[#161810] border border-[#2D3C13] rounded-[8px] px-[13px]">
          <svg className="w-4 h-4 text-[#B3B8AA] shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
          </svg>
          <input
            type="text"
            placeholder="Search competitions, orders..."
            className="bg-transparent border-none outline-none text-[#E8EDD4] text-[13px] placeholder:text-[#E8EDD4]/50 w-full ml-2 font-sans"
          />
        </div>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
            className="relative w-[40px] h-[40px] bg-[#161810] border border-[#2D3C13] rounded-[8px] flex items-center justify-center shrink-0 hover:bg-[#1A230A] transition-colors"
          >
            <svg className="w-[18px] h-[18px] text-[#B3B8AA]" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
            </svg>
            {/* Notification Dot */}
            <span className="absolute top-[8px] right-[8px] w-[6px] h-[6px] bg-[#f76b6b] rounded-[3px]" />
          </button>

          <NotificationsDropdown
            isOpen={isNotificationsOpen}
            onClose={() => setIsNotificationsOpen(false)}
          />
        </div>

        {/* Divider */}
        <div className="w-[1px] h-[32px] bg-[#2D3C13] shrink-0" />

        {/* Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-[8px] hover:opacity-80 transition-opacity"
          >
            <div className="w-[32px] h-[32px] shrink-0 rounded-full border border-[#43581E] bg-[#1A230A] flex items-center justify-center overflow-hidden">
               {/* eslint-disable-next-line @next/next/no-img-element */}
               <img src={account.avatar} alt="Profile" className="w-full h-full object-cover" />
            </div>
            <span className="font-sans text-[14px] text-[#E8EDD4] hidden lg:block">
              {account.name}
            </span>
            <svg className="w-[14px] h-[14px] text-[#B3B8AA] hidden lg:block" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
            </svg>
          </button>

          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-[#161810] border border-[#2D3C13] rounded-md shadow-lg py-1 z-50">
              <div className="px-4 py-2 border-b border-[#2D3C13] lg:hidden">
                <p className="text-sm font-medium text-[#E8EDD4] truncate">{account.name}</p>
                <p className="text-xs text-[#B3B8AA] truncate capitalize">{account.role} Account</p>
              </div>
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-sm text-[#f76b6b] hover:bg-[#1A230A] transition-colors"
              >
                Log Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
