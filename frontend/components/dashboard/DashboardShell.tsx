"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { DashboardAccount } from "../../types/dashboard.types";
import { dashboardNavigation } from "../../config/dashboard-navigation.config";
import DashboardSidebar from "./DashboardSidebar";
import DashboardTopbar from "./DashboardTopbar";
import MobileDashboardMenu from "./MobileDashboardMenu";
import { cn } from "../../lib/utils";

interface DashboardShellProps {
  account: DashboardAccount;
  children: React.ReactNode;
}

export default function DashboardShell({ account, children }: DashboardShellProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const stored = localStorage.getItem("dashboard_sidebar_collapsed");
    if (stored === "true") {
      setIsSidebarCollapsed(true);
    }
  }, []);

  const toggleSidebar = () => {
    setIsSidebarCollapsed(prev => {
      const next = !prev;
      localStorage.setItem("dashboard_sidebar_collapsed", String(next));
      return next;
    });
  };

  // Find the matching nav item for the current route
  const currentNav = dashboardNavigation.find(item => 
    pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href) && item.href !== "/dashboard/host")
  );
  
  // Custom override for My Competitions to show as My Competitions
  let title = currentNav ? currentNav.label : "Dashboard Overview";
  if (pathname.includes("/dashboard/host/competitions")) {
    title = "My Competitions";
  } else if (pathname === "/dashboard/user" || pathname === "/dashboard/host") {
    title = "Dashboard Overview";
  }

  const isUserRoute = pathname.startsWith("/dashboard/user");
  const portalName = isUserRoute ? "User Portal" : account.role === "admin" ? "Admin Portal" : "Host Portal";
  const subtitle = `${portalName} / ${title}`;

  return (
    <div className="min-h-screen bg-[#0D0D0B] text-text-primary flex flex-col lg:flex-row w-full overflow-x-hidden relative">
      
      {/* Desktop Sidebar (hidden on mobile/tablet) */}
      <DashboardSidebar 
        account={account}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={toggleSidebar}
      />

      {/* Mobile Drawer Navigation */}
      <MobileDashboardMenu 
        account={account} 
        isOpen={mobileMenuOpen} 
        onClose={() => setMobileMenuOpen(false)} 
      />

      {/* Main Content Area - shifts dynamically based on sidebar collapse on desktop */}
      <div className={cn(
        "flex-1 flex flex-col w-full min-h-screen relative transition-all duration-300 ease-in-out min-w-0",
        isSidebarCollapsed ? "lg:ml-[72px] lg:w-[calc(100%-72px)]" : "lg:ml-[260px] lg:w-[calc(100%-260px)]"
      )}>
        
        {/* Shared Topbar */}
        <DashboardTopbar 
          account={account} 
          onMenuClick={() => setMobileMenuOpen(true)}
          title={title}
          subtitle={subtitle}
          isCollapsed={isSidebarCollapsed}
          onToggleSidebar={toggleSidebar}
        />

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden flex flex-col items-center w-full p-4 lg:p-6">
          <div className="w-full flex-1 max-w-[1660px] mx-auto min-w-0">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
