"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  useNotificationsQuery,
  useUnreadNotificationCountQuery,
  useMarkNotificationAsReadMutation,
  useMarkAllNotificationsAsReadMutation,
} from "../../../../hooks/useNotificationHooks";
import { NotificationItem } from "../../../../services/notification.service";

function formatFullDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const diffMs = Date.now() - date.getTime();
  const diffMinutes = Math.floor(diffMs / 60000);

  if (diffMinutes < 1) return "Just now";
  if (diffMinutes < 60) return `${diffMinutes}m ago`;
  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays}d ago`;
  return formatFullDate(dateString);
}

export default function NotificationsPage() {
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const filters = [
    "All",
    "Unread",
    "Wins",
    "Payments",
    "Draws",
    "Approvals",
    "Withdrawals",
  ];

  const queryParams = useMemo(() => {
    let typeParam: string | undefined = undefined;
    let unreadOnlyParam: boolean | undefined = undefined;

    if (activeFilter === "Unread") {
      unreadOnlyParam = true;
    } else if (activeFilter === "Wins") {
      typeParam = "WIN";
    } else if (activeFilter === "Payments") {
      typeParam = "PAYMENT";
    } else if (activeFilter === "Draws") {
      typeParam = "DRAW";
    } else if (activeFilter === "Approvals") {
      typeParam = "APPROVAL";
    } else if (activeFilter === "Withdrawals") {
      typeParam = "WITHDRAWAL";
    }

    return {
      page: currentPage,
      limit: pageSize,
      type: typeParam,
      unreadOnly: unreadOnlyParam,
    };
  }, [activeFilter, currentPage]);

  const { data, isLoading } = useNotificationsQuery(queryParams);
  const { data: unreadCountData } = useUnreadNotificationCountQuery();
  const markAsReadMutation = useMarkNotificationAsReadMutation();
  const markAllMutation = useMarkAllNotificationsAsReadMutation();

  const totalUnread = unreadCountData?.count ?? 0;
  const rawNotifications = data?.notifications || [];
  const total = data?.total || 0;
  const totalPages = data?.totalPages || 1;

  // Filter in memory by searchTerm if provided
  const notifications = useMemo(() => {
    if (!searchTerm.trim()) return rawNotifications;
    const lower = searchTerm.toLowerCase();
    return rawNotifications.filter(
      (n) =>
        n.title.toLowerCase().includes(lower) ||
        (n.subtitle && n.subtitle.toLowerCase().includes(lower)),
    );
  }, [rawNotifications, searchTerm]);

  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter);
    setCurrentPage(1);
  };

  const handleNotificationClick = (item: NotificationItem) => {
    if (!item.isRead) {
      markAsReadMutation.mutate(item.id);
    }
    if (item.link) {
      router.push(item.link);
    }
  };

  const getIconForType = (type: string) => {
    const normalized = (type || "").toUpperCase();
    switch (normalized) {
      case "WIN":
        return (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 01-.982-3.172M9.497 14.25a7.454 7.454 0 00.981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 007.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 002.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 012.916.52 6.003 6.003 0 01-5.395 4.972m0 0a6.726 6.726 0 01-2.749 1.35m0 0a6.772 6.772 0 01-3.044 0" />
          </svg>
        );
      case "PAYMENT":
        return (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
          </svg>
        );
      case "DRAW":
        return (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 0 1 0 5.198v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-3.026a2.999 2.999 0 0 1 0-5.198V6.375c0-.621-.504-1.125-1.125-1.125H3.375Z" />
          </svg>
        );
      case "APPROVAL":
        return (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
          </svg>
        );
      case "WITHDRAWAL":
        return (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
          </svg>
        );
      default:
        return (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
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
    <div className="flex-1 w-full px-[20px] lg:px-[40px] py-[24px] lg:py-[32px] flex flex-col gap-[24px] animate-in fade-in zoom-in-95 duration-300">
      {/* Top Banner Header */}
      <div className="w-full bg-[#161f08] border border-[#2d3c13] rounded-[16px] p-[24px] flex flex-col sm:flex-row sm:items-center justify-between gap-[16px]">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-[8px]">
            <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#8cb34a" className="w-[20px] h-[20px]">
              <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
            </svg>
            <h1 className="font-heading font-medium text-[20px] text-[#e8edd4]">
              Notifications & Alerts
            </h1>
            {totalUnread > 0 && (
              <span className="ml-2 px-2.5 py-0.5 rounded-full bg-[#f76b6b]/20 border border-[#f76b6b]/40 text-[#f76b6b] text-xs font-bold">
                {totalUnread} Unread
              </span>
            )}
          </div>
          <p className="font-sans text-[13px] text-[#8cb34a] pl-[28px]">
            Review all competition sales, instant wins, raffle draw results, payouts, and system alerts.
          </p>
        </div>

        <div className="flex items-center gap-3 sm:shrink-0 pl-[28px] sm:pl-0">
          <button
            onClick={() => markAllMutation.mutate()}
            disabled={markAllMutation.isPending || totalUnread === 0}
            className="px-4 py-2 rounded-xl bg-[#2D3C13] hover:bg-[#43581E] text-[#E8EDD4] border border-[#43581E] font-sans font-medium text-xs transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <svg className="w-4 h-4 text-[#8CB34A]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
            </svg>
            {markAllMutation.isPending ? "Marking..." : "Mark All as Read"}
          </button>
        </div>
      </div>

      {/* Main Content Card */}
      <div className="bg-[#161810] border border-[#2d3c13] rounded-[16px] flex flex-col overflow-hidden shadow-xl">
        {/* Controls Bar: Filters & Search */}
        <div className="p-4 border-b border-[#2d3c13] flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 md:pb-0">
            {filters.map((filter) => (
              <button
                key={filter}
                onClick={() => handleFilterChange(filter)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-sans font-medium transition-all whitespace-nowrap ${
                  activeFilter === filter
                    ? "bg-[#8cb34a] text-[#0d0d0b] font-bold shadow-md"
                    : "border border-[#2d3c13] text-[#72943a] hover:border-[#43581e] hover:text-[#e8edd4] bg-[#0d0d0b]"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="flex items-center h-[38px] w-full md:w-[260px] bg-[#0d0d0b] border border-[#2d3c13] rounded-[8px] px-3">
            <svg className="w-4 h-4 text-[#72943a] shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            </svg>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search notifications..."
              className="bg-transparent border-none outline-none text-[#e8edd4] text-xs placeholder:text-[#72943a] w-full ml-2 font-sans"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="text-[#72943a] hover:text-[#e8edd4] text-xs"
              >
                ×
              </button>
            )}
          </div>
        </div>

        {/* Notifications List Table / Row View */}
        <div className="flex flex-col divide-y divide-[#2d3c13]/60 min-h-[300px]">
          {isLoading ? (
            <div className="py-20 flex flex-col items-center justify-center text-[#8cb34a] text-sm font-sans gap-3">
              <div className="w-6 h-6 border-2 border-[#8cb34a] border-t-transparent rounded-full animate-spin" />
              <span>Loading notification records...</span>
            </div>
          ) : notifications.length === 0 ? (
            <div className="py-20 flex flex-col items-center justify-center text-center p-6 gap-3">
              <div className="w-14 h-14 rounded-2xl bg-[#0d0d0b] border border-[#2d3c13] flex items-center justify-center text-[#72943a]">
                <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
                </svg>
              </div>
              <h3 className="font-heading font-medium text-base text-[#e8edd4]">
                No notifications found
              </h3>
              <p className="font-sans text-xs text-[#72943a] max-w-sm">
                {searchTerm
                  ? `No results matching "${searchTerm}". Try a different keyword.`
                  : activeFilter === "All"
                  ? "You have no notification events recorded yet."
                  : `No ${activeFilter.toLowerCase()} notifications found.`}
              </p>
            </div>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors ${
                  !notification.isRead
                    ? "bg-[#161f08]/40 border-l-4 border-l-[#8cb34a]"
                    : "hover:bg-[#0d0d0b]/40 border-l-4 border-l-transparent"
                }`}
              >
                <div
                  onClick={() => handleNotificationClick(notification)}
                  className="flex items-start gap-4 flex-1 cursor-pointer min-w-0"
                >
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${getIconColors(
                      notification.type,
                    )}`}
                  >
                    {getIconForType(notification.type)}
                  </div>

                  <div className="flex flex-col gap-1 min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className={`font-sans text-sm ${
                          !notification.isRead
                            ? "font-bold text-[#e8edd4]"
                            : "font-medium text-[#b3b8aa]"
                        }`}
                      >
                        {notification.title}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-[#0d0d0b] border border-[#2d3c13] text-[#72943a]">
                        {notification.type}
                      </span>
                      {!notification.isRead && (
                        <span className="w-2 h-2 rounded-full bg-[#8cb34a]" />
                      )}
                    </div>

                    {notification.subtitle && (
                      <p className="font-sans text-xs text-[#8cb34a] leading-relaxed">
                        {notification.subtitle}
                      </p>
                    )}

                    <div className="flex items-center gap-3 text-[11px] font-sans text-[#5a752a] mt-0.5">
                      <span>{formatTimeAgo(notification.createdAt)}</span>
                      <span>•</span>
                      <span>{formatFullDate(notification.createdAt)}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 sm:shrink-0 self-end sm:self-center pl-14 sm:pl-0">
                  {!notification.isRead && (
                    <button
                      onClick={() => markAsReadMutation.mutate(notification.id)}
                      disabled={markAsReadMutation.isPending}
                      className="px-3 py-1.5 rounded-lg bg-[#0d0d0b] border border-[#2d3c13] hover:border-[#8cb34a] text-[#8cb34a] text-xs font-sans font-medium transition-colors"
                    >
                      Mark Read
                    </button>
                  )}
                  {notification.link && (
                    <Link
                      href={notification.link}
                      onClick={() => {
                        if (!notification.isRead) {
                          markAsReadMutation.mutate(notification.id);
                        }
                      }}
                      className="px-3 py-1.5 rounded-lg bg-[#8cb34a]/10 border border-[#8cb34a]/40 hover:bg-[#8cb34a] hover:text-[#0d0d0b] text-[#8cb34a] text-xs font-sans font-bold transition-all flex items-center gap-1.5"
                    >
                      View
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                      </svg>
                    </Link>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pagination Footer */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-[#2d3c13] flex items-center justify-between bg-[#0d0d0b]/40">
            <span className="font-sans text-xs text-[#72943a]">
              Showing {notifications.length} of {total} notifications
            </span>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1 || isLoading}
                className="px-3 py-1 rounded-lg bg-[#161810] border border-[#2d3c13] text-xs font-sans text-[#e8edd4] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#2d3c13] transition-colors"
              >
                Previous
              </button>

              <span className="font-sans text-xs font-medium text-[#e8edd4] px-2">
                Page {currentPage} of {totalPages}
              </span>

              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage >= totalPages || isLoading}
                className="px-3 py-1 rounded-lg bg-[#161810] border border-[#2d3c13] text-xs font-sans text-[#e8edd4] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#2d3c13] transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
