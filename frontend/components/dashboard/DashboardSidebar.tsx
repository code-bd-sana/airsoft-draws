"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { DashboardAccount } from "../../types/dashboard.types";
import { dashboardNavigation } from "../../config/dashboard-navigation.config";
import { cn } from "../../lib/utils";
import Image from "next/image";
import logo from '../../public/logo2.png';
import { useLogout } from "../../hooks/useAuthHooks";
import { useAdminOverviewStats } from "../../hooks/useAdminHooks";

interface DashboardSidebarProps {
  account: DashboardAccount;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export default function DashboardSidebar({ account, isCollapsed = false, onToggleCollapse }: DashboardSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  // Filter nav items by role
  const navItems = dashboardNavigation.filter(item => item.roles.includes(account.role));

  const { data: overviewStats } = useAdminOverviewStats({
    enabled: account.role === "admin",
  });

  const logout = useLogout();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <aside className={cn(
      "hidden lg:flex flex-col h-screen bg-[#111210] border-r border-[#2D3C13] fixed left-0 top-0 z-40 transition-all duration-300 ease-in-out",
      isCollapsed ? "w-[72px]" : "w-[260px]"
    )}>

      {/* Brand / Logo Area */}
      <div className={cn(
        "h-[88px] flex items-center border-b border-[#2D3C13] shrink-0 w-full px-4 transition-all duration-300",
        isCollapsed ? "justify-center" : "justify-between"
      )}>
        {!isCollapsed ? (
          <Link href="/" className="relative h-[44px] w-[140px] shrink-0 select-none block">
            <Image
              alt="Airsoft Draws Logo"
              src={logo}
              fill
              className="object-contain"
              priority
            />
          </Link>
        ) : (
          <Link href="/" className="relative w-9 h-9 shrink-0 flex items-center justify-center bg-[#1A230A] border border-[#8CB34A]/40 rounded-xl text-[#8CB34A] font-heading font-black text-sm shadow-sm hover:border-[#8CB34A] transition-colors" title="Home">
            AD
          </Link>
        )}

        {/* Collapse Toggle Button */}
        {onToggleCollapse && (
          <button
            onClick={onToggleCollapse}
            className={cn(
              "p-1.5 rounded-lg text-[#72943A] hover:bg-[#161810] hover:text-[#8CB34A] transition-colors",
              isCollapsed && "mt-1"
            )}
            title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              {isCollapsed ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
              )}
            </svg>
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1 scrollbar-hide flex flex-col gap-1 w-full">
        {navItems.map((item) => {
          const isDashboardRoot = item.href === "/dashboard" || item.href === "/dashboard/admin" || item.href === "/dashboard/host" || item.href === "/dashboard/user";
          const isActive = isDashboardRoot
            ? pathname === item.href
            : pathname.startsWith(item.href);

          let displayBadge = item.badge;
          if (item.href === "/dashboard/admin/approvals" && overviewStats?.awaitingReview.count !== undefined) {
            displayBadge = overviewStats.awaitingReview.count > 0 ? overviewStats.awaitingReview.count : undefined;
          }

          return (
            <Link
              key={item.label}
              href={item.href}
              title={isCollapsed ? item.label : undefined}
              className={cn(
                "flex items-center h-[40px] rounded-[8px] transition-all duration-200 group font-sans w-full relative",
                isCollapsed ? "justify-center px-0" : "gap-[12px] pl-[19px] pr-[16px]",
                isActive
                  ? "bg-[#1A230A] border-l-3 border-[#8CB34A]"
                  : "bg-transparent border-l-3 border-transparent hover:bg-[#161810]"
              )}
            >
              <item.icon className={cn("w-5 h-5 shrink-0 transition-colors", isActive ? "text-[#8CB34A]" : "text-[#72943A]")} />
              
              {!isCollapsed && (
                <span className={cn(
                  "text-[14px] font-medium leading-[normal] truncate",
                  isActive ? "text-[#8CB34A]" : "text-[#72943A]"
                )}>
                  {item.label}
                </span>
              )}

              {displayBadge !== undefined && (
                displayBadge === true ? (
                  <span className={cn(
                    "rounded-full bg-[#f76b6b]",
                    isCollapsed ? "absolute top-2 right-2 w-2 h-2" : "ml-auto w-2 h-2"
                  )} />
                ) : (
                  <span className={cn(
                    "font-bold px-1.5 py-0.5 rounded-badge min-w-[18px] text-center",
                    isCollapsed ? "absolute -top-1 -right-1 text-[9px] bg-[#f76b6b] text-white" : "ml-auto text-[10px]",
                    !isCollapsed && (isActive ? "bg-primary text-[#0D0D0B]" : "bg-[#2D3C13] text-[#A0D056]")
                  )}>
                    {displayBadge}
                  </span>
                )
              )}
            </Link>
          );
        })}

        {/* Divider */}
        <div className="w-full px-2 pt-2">
          <div className="h-px bg-[#1A230A] w-full" />
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          title={isCollapsed ? "Log Out" : undefined}
          className={cn(
            "flex items-center h-[40px] rounded-[8px] transition-colors duration-200 w-full hover:bg-[#161810] group",
            isCollapsed ? "justify-center px-0" : "gap-[12px] px-[16px]"
          )}
        >
          <svg className="w-5 h-5 shrink-0 text-[#f76b6b]/70 group-hover:text-[#f76b6b]" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75" />
          </svg>
          {!isCollapsed && (
            <span className="text-[14px] font-medium text-[#f76b6b] ml-1">Log Out</span>
          )}
        </button>
      </nav>

      {/* Profile Section (Bottom) */}
      <div className="border-t border-[#2D3C13] w-full shrink-0">
        <div 
          title={isCollapsed ? `${account.name} (${account.role})` : undefined}
          className={cn(
            "flex items-center pb-[17px] pt-[16px] w-full cursor-pointer hover:bg-[#161810] transition-colors",
            isCollapsed ? "justify-center px-2" : "gap-[12px] px-[20px]"
          )}
        >
          <div className="w-[40px] h-[40px] shrink-0 rounded-full border border-[#43581E] bg-[#1A230A] flex items-center justify-center relative overflow-hidden">
             {/* eslint-disable-next-line @next/next/no-img-element */}
             <img src={account.avatar} alt="Profile" className="w-full h-full object-cover" />
          </div>

          {!isCollapsed && (
            <>
              <div className="flex flex-col min-w-0 flex-1">
                <span className="font-heading font-medium text-[14px] text-[#E8EDD4] truncate leading-tight">
                  {account.name}
                </span>
                <div className="mt-1">
                  <span className="inline-flex items-center justify-center px-[8px] h-[18px] rounded-full border border-[#8CB34A] bg-[#1A230A] text-[#A0D056] text-[10px] font-medium font-sans uppercase tracking-wide">
                    {account.role === "host" ? "Premium Host" : `${account.role} Account`}
                  </span>
                </div>
              </div>
              <svg className="w-4 h-4 shrink-0 text-[#B3B8AA]" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
              </svg>
            </>
          )}
        </div>
      </div>
    </aside>
  );
}
