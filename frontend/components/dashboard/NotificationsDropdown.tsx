"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  useNotificationsQuery,
  useMarkNotificationAsReadMutation,
  useMarkAllNotificationsAsReadMutation,
} from "../../hooks/useNotificationHooks";
import { NotificationItem } from "../../services/notification.service";

interface NotificationsDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMinutes = Math.floor(diffMs / 60000);

  if (diffMinutes < 1) return "Just now";
  if (diffMinutes < 60) return `${diffMinutes}m ago`;
  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
  });
}

export default function NotificationsDropdown({
  isOpen,
  onClose,
}: NotificationsDropdownProps) {
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState("All");

  const filters = ["All", "Unread", "Wins", "Payments", "Draws"];

  const queryParams = useMemo(() => {
    switch (activeFilter) {
      case "Unread":
        return { unreadOnly: true, limit: 15 };
      case "Wins":
        return { type: "WIN", limit: 15 };
      case "Payments":
        return { type: "PAYMENT", limit: 15 };
      case "Draws":
        return { type: "DRAW", limit: 15 };
      default:
        return { limit: 15 };
    }
  }, [activeFilter]);

  const { data, isLoading } = useNotificationsQuery(queryParams, {
    enabled: isOpen,
  });

  const markAsReadMutation = useMarkNotificationAsReadMutation();
  const markAllMutation = useMarkAllNotificationsAsReadMutation();

  const notifications = data?.notifications || [];

  if (!isOpen) return null;

  const handleNotificationClick = (item: NotificationItem) => {
    if (!item.isRead) {
      markAsReadMutation.mutate(item.id);
    }
    onClose();
    if (item.link) {
      router.push(item.link);
    }
  };

  const handleMarkAllAsRead = () => {
    markAllMutation.mutate();
  };

  const getIconForType = (type: string) => {
    const normalized = (type || "").toUpperCase();
    switch (normalized) {
      case "WIN":
        return (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 01-.982-3.172M9.497 14.25a7.454 7.454 0 00.981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 007.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 002.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 012.916.52 6.003 6.003 0 01-5.395 4.972m0 0a6.726 6.726 0 01-2.749 1.35m0 0a6.772 6.772 0 01-3.044 0" />
          </svg>
        );
      case "PAYMENT":
        return (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
          </svg>
        );
      case "DRAW":
        return (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 0 1 0 5.198v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-3.026a2.999 2.999 0 0 1 0-5.198V6.375c0-.621-.504-1.125-1.125-1.125H3.375Z" />
          </svg>
        );
      case "APPROVAL":
        return (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
          </svg>
        );
      case "WITHDRAWAL":
        return (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
          </svg>
        );
      default:
        return (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
          </svg>
        );
    }
  };

  const getIconColors = (type: string) => {
    const normalized = (type || "").toUpperCase();
    switch (normalized) {
      case "WIN":
        return "text-[#4ADE80] bg-[#083b18] border border-[#4ADE80]/30";
      case "PAYMENT":
        return "text-[#E8EDD4] bg-[#2D3C13] border border-[#8CB34A]/30";
      case "DRAW":
        return "text-[#D97706] bg-[#78350F] border border-[#D97706]/30";
      case "APPROVAL":
        return "text-[#38BDF8] bg-[#0C4A6E] border border-[#38BDF8]/30";
      case "WITHDRAWAL":
        return "text-[#34D399] bg-[#064E3B] border border-[#34D399]/30";
      default:
        return "text-[#E8EDD4] bg-[#1A230A] border border-[#2D3C13]";
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
                    ? "border border-[#8CB34A] text-[#8CB34A] bg-[#161810]"
                    : "border border-[#2D3C13] text-[#72943A] hover:border-[#43581E] hover:text-[#E8EDD4]"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
          <button
            onClick={handleMarkAllAsRead}
            disabled={markAllMutation.isPending}
            className="text-[11px] font-sans font-medium text-[#72943A] hover:text-[#E8EDD4] transition-colors whitespace-nowrap ml-4 shrink-0 disabled:opacity-50"
          >
            {markAllMutation.isPending ? "Marking..." : "Mark all as read"}
          </button>
        </div>

        {/* Notifications List */}
        <div className="flex flex-col max-h-[460px] overflow-y-auto divide-y divide-[#2D3C13]/60">
          {isLoading ? (
            <div className="p-8 text-center text-[#B3B8AA] text-xs font-sans">
              Loading notifications...
            </div>
          ) : notifications.length === 0 ? (
            <div className="p-10 flex flex-col items-center justify-center text-center gap-2">
              <div className="w-10 h-10 rounded-full bg-[#161810] border border-[#2D3C13] flex items-center justify-center text-[#72943A]">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
                </svg>
              </div>
              <p className="text-sm font-sans font-medium text-[#E8EDD4]">
                No notifications found
              </p>
              <p className="text-xs font-sans text-[#72943A]">
                {activeFilter === "All"
                  ? "You have no notifications right now."
                  : `No ${activeFilter.toLowerCase()} notifications found.`}
              </p>
            </div>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification.id}
                onClick={() => handleNotificationClick(notification)}
                className={`flex items-start gap-3 p-4 hover:bg-[#161810] transition-colors cursor-pointer relative ${
                  !notification.isRead
                    ? "border-l-4 border-l-[#8CB34A] bg-[#161810]/40"
                    : "border-l-4 border-l-transparent"
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${getIconColors(
                    notification.type,
                  )}`}
                >
                  {getIconForType(notification.type)}
                </div>
                <div className="flex flex-col gap-1 flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`font-sans text-[13px] leading-tight truncate ${
                        !notification.isRead
                          ? "font-semibold text-[#E8EDD4]"
                          : "font-normal text-[#B3B8AA]"
                      }`}
                    >
                      {notification.title}
                    </span>
                    <span className="font-sans text-[10px] text-[#5A752A] shrink-0 whitespace-nowrap">
                      {formatTimeAgo(notification.createdAt)}
                    </span>
                  </div>
                  {notification.subtitle && (
                    <span className="font-sans text-[11px] text-[#72943A] leading-snug line-clamp-2">
                      {notification.subtitle}
                    </span>
                  )}
                </div>
                {!notification.isRead && (
                  <span className="w-2 h-2 rounded-full bg-[#8CB34A] shrink-0 mt-1.5" />
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}
