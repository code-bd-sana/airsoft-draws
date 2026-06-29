"use client";

import React, { useState } from "react";

interface Notification {
  id: string;
  type: "win" | "payment" | "draw-start" | "draw-completed" | "launch";
  title: string;
  subtitle: string;
  timeAgo: string;
  isRead: boolean;
}

const DUMMY_NOTIFICATIONS: Notification[] = [
  {
    id: "1",
    type: "win",
    title: "You won the VFC HK416 Bundle raffle!",
    subtitle: "Draw completed 2 hours ago — claim your prize",
    timeAgo: "2h ago",
    isRead: false,
  },
  {
    id: "2",
    type: "payment",
    title: "Payment confirmed — £12.50",
    subtitle: "5 tickets purchased for VFC HK416 Bundle",
    timeAgo: "2h ago",
    isRead: false,
  },
  {
    id: "3",
    type: "draw-start",
    title: "Draw starting soon — Tokyo Marui MWS",
    subtitle: "Draw begins in 30 minutes",
    timeAgo: "6h ago",
    isRead: false,
  },
  {
    id: "4",
    type: "draw-completed",
    title: "Draw completed — Sniper Precision Set",
    subtitle: "Unfortunately you didn't win this time",
    timeAgo: "1d ago",
    isRead: true,
  },
  {
    id: "5",
    type: "payment",
    title: "Payment confirmed — £9.00",
    subtitle: "3 tickets purchased for Tokyo Marui MWS",
    timeAgo: "2d ago",
    isRead: true,
  },
  {
    id: "6",
    type: "win",
    title: "You won! Tokyo Marui MWS GBBR",
    subtitle: "Congratulations! Contact support to claim your prize",
    timeAgo: "3d ago",
    isRead: true,
  },
  {
    id: "7",
    type: "launch",
    title: "New raffle launched — G36 Competition Bundle",
    subtitle: "Be among the first to enter!",
    timeAgo: "5d ago",
    isRead: true,
  },
];

interface NotificationsDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function NotificationsDropdown({ isOpen, onClose }: NotificationsDropdownProps) {
  const [activeFilter, setActiveFilter] = useState("All");

  if (!isOpen) return null;

  const filters = ["All", "Unread", "Wins", "Payments", "Draws"];

  const getIconForType = (type: string) => {
    switch (type) {
      case "win":
        return (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
             <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 01-.982-3.172M9.497 14.25a7.454 7.454 0 00.981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 007.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 002.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 012.916.52 6.003 6.003 0 01-5.395 4.972m0 0a6.726 6.726 0 01-2.749 1.35m0 0a6.772 6.772 0 01-3.044 0" />
          </svg>
        );
      case "payment":
        return (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
          </svg>
        );
      case "draw-start":
      case "launch":
        return (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
          </svg>
        );
      case "draw-completed":
        return (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
          </svg>
        );
      default:
        return null;
    }
  };

  const getIconColors = (type: string) => {
    switch(type) {
      case "win": return "text-[#4ADE80] bg-[#083b18]";
      case "payment": return "text-[#E8EDD4] bg-[#2D3C13]";
      case "draw-start": return "text-[#D97706] bg-[#78350F]";
      case "draw-completed": return "text-[#E8EDD4] bg-[#2D3C13]";
      case "launch": return "text-[#D97706] bg-[#78350F]";
      default: return "text-[#E8EDD4] bg-[#1A230A]";
    }
  };

  return (
    <>
      <div 
        className="fixed inset-0 z-40 bg-transparent" 
        onClick={onClose} 
      />
      <div className="absolute top-[52px] right-0 w-[440px] max-w-[calc(100vw-40px)] bg-[#0D0D0B] border border-[#2D3C13] rounded-[16px] shadow-2xl flex flex-col z-50 animate-fadeIn overflow-hidden">
        
        {/* Header Row */}
        <div className="flex items-center justify-between p-4 border-b border-[#2D3C13]">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
            {filters.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-3 py-1 rounded-full text-[11px] font-sans font-medium transition-colors whitespace-nowrap ${
                  activeFilter === filter 
                    ? 'border border-[#8CB34A] text-[#8CB34A]' 
                    : 'border border-[#2D3C13] text-[#72943A] hover:border-[#43581E] hover:text-[#E8EDD4]'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
          <button className="text-[11px] font-sans font-medium text-[#72943A] hover:text-[#E8EDD4] transition-colors whitespace-nowrap ml-4 shrink-0">
            Mark all as read
          </button>
        </div>

        {/* Notifications List */}
        <div className="flex flex-col max-h-[500px] overflow-y-auto">
          {DUMMY_NOTIFICATIONS.map((notification) => (
            <div 
              key={notification.id}
              className={`flex items-start gap-4 p-4 border-b border-[#2D3C13] hover:bg-[#161810] transition-colors cursor-pointer relative ${
                !notification.isRead ? 'border-l-2 border-l-[#8CB34A]' : 'border-l-2 border-l-transparent'
              }`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${getIconColors(notification.type)}`}>
                {getIconForType(notification.type)}
              </div>
              <div className="flex flex-col gap-1 flex-1">
                <span className="font-sans text-[13px] font-medium text-[#E8EDD4] leading-tight">
                  {notification.title}
                </span>
                <span className={`font-sans text-[11px] ${notification.type === 'win' || notification.type === 'launch' ? 'text-[#8CB34A]' : 'text-[#5A752A]'} leading-snug`}>
                  {notification.subtitle}
                </span>
              </div>
              <span className="font-sans text-[10px] text-[#5A752A] shrink-0 mt-1">
                {notification.timeAgo}
              </span>
            </div>
          ))}
        </div>

      </div>
    </>
  );
}
