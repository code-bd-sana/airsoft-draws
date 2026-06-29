"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { DemoAccount } from "../../types/demo-auth.types";
import { dashboardNavigation } from "../../config/dashboard-navigation.config";
import { cn } from "../../lib/utils";
import Image from "next/image";
import logo from '../../public/logo2.png';

interface MobileDashboardMenuProps {
  account: DemoAccount;
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileDashboardMenu({ account, isOpen, onClose }: MobileDashboardMenuProps) {
  const pathname = usePathname();
  const router = useRouter();
  const navItems = dashboardNavigation.filter(item => item.roles.includes(account.role));

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/demo-auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "logout" }),
      });
      const data = await res.json();
      if (data.success) {
        router.push(data.redirectUrl || "/login");
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/60 z-50 lg:hidden animate-fadeIn backdrop-blur-sm"
        onClick={onClose}
      />

      <div className={cn(
        "fixed inset-y-0 left-0 w-[280px] bg-[#111210] border-r border-[#2D3C13] z-50 flex flex-col transform transition-transform duration-300 ease-in-out lg:hidden shadow-card",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="h-[88px] flex items-center justify-between px-6 border-b border-[#2D3C13] shrink-0">
          <Link href="/" onClick={onClose} className="relative h-[36px] w-[120px] select-none block">
            <Image
              alt="Airsoft Draws Logo"
              src={logo}
              fill
              className="object-contain"
              priority
            />
          </Link>
          <button
            onClick={onClose}
            className="p-1 text-[#B3B8AA] hover:text-[#E8EDD4] rounded-md transition-colors"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1 scrollbar-hide flex flex-col gap-1 w-full">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href) && item.href !== "/dashboard/host");
            return (
              <Link
                key={item.label}
                href={item.href}
                onClick={onClose}
                className={cn(
                  "flex items-center gap-[12px] h-[40px] pl-[19px] pr-[16px] rounded-[8px] transition-colors duration-200 group font-sans w-full",
                  isActive
                    ? "bg-[#1A230A] border-l-3 border-[#8CB34A]"
                    : "bg-transparent border-l-3 border-transparent hover:bg-[#161810]"
                )}
              >
                <item.icon className={cn("w-5 h-5 shrink-0", isActive ? "text-[#8CB34A]" : "text-[#72943A]")} />
                <span className={cn(
                  "text-[14px] font-medium leading-[normal] truncate",
                  isActive ? "text-[#8CB34A]" : "text-[#72943A]"
                )}>
                  {item.label}
                </span>

                {item.badge && (
                  <span className={cn(
                    "ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded-badge min-w-[20px] text-center",
                    isActive ? "bg-primary text-[#0D0D0B]" : "bg-[#2D3C13] text-[#A0D056]"
                  )}>
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}

          <div className="w-full px-2 pt-2">
            <div className="h-px bg-[#1A230A] w-full" />
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-[12px] h-[40px] px-[16px] rounded-[8px] transition-colors duration-200 w-full hover:bg-[#161810] group"
          >
            <svg className="w-5 h-5 shrink-0 text-[#f76b6b]/70 group-hover:text-[#f76b6b]" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75" />
            </svg>
            <span className="text-[14px] font-medium text-[#f76b6b] ml-1">Log Out</span>
          </button>
        </nav>

        <div className="border-t border-[#2D3C13] w-full shrink-0 bg-[#111210]">
          <div className="flex items-center gap-[12px] pb-[17px] pt-[16px] px-[20px] w-full">
            <div className="w-[44px] h-[44px] shrink-0 rounded-full border border-[#43581E] bg-[#1A230A] flex items-center justify-center overflow-hidden">
               {/* eslint-disable-next-line @next/next/no-img-element */}
               <img src={account.avatar} alt="Profile" className="w-full h-full object-cover" />
            </div>
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
          </div>
        </div>
      </div>
    </>
  );
}
