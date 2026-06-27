"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import { DemoAccount } from "../../types/demo-auth.types";
import { dashboardNavigation } from "../../config/dashboard-navigation.config";
import DashboardSidebar from "./DashboardSidebar";
import DashboardTopbar from "./DashboardTopbar";
import MobileDashboardMenu from "./MobileDashboardMenu";

interface DashboardShellProps {
  account: DemoAccount;
  children: React.ReactNode;
}

export default function DashboardShell({ account, children }: DashboardShellProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  // Find the matching nav item for the current route
  const currentNav = dashboardNavigation.find(item => 
    pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href) && item.href !== "/dashboard/host")
  );
  
  // Custom override for My Competitions to show as My Raffles as per Figma
  let title = currentNav ? currentNav.label : "Dashboard Overview";
  if (pathname.includes("/dashboard/host/competitions")) {
    title = "My Raffles";
  }
  const subtitle = `Host Portal / ${title}`;

  return (
    <div className="min-h-screen bg-[#0D0D0B] text-text-primary flex flex-col lg:flex-row w-full overflow-hidden">
      
      {/* Desktop Sidebar (hidden on mobile/tablet) */}
      <DashboardSidebar account={account} />

      {/* Mobile Drawer Navigation */}
      <MobileDashboardMenu 
        account={account} 
        isOpen={mobileMenuOpen} 
        onClose={() => setMobileMenuOpen(false)} 
      />

      {/* Main Content Area - shifts based on sidebar on desktop */}
      <div className="flex-1 flex flex-col w-full lg:ml-[260px] min-h-screen relative">
        
        {/* Shared Topbar */}
        <DashboardTopbar 
          account={account} 
          onMenuClick={() => setMobileMenuOpen(true)}
          title={title}
          subtitle={subtitle}
        />

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden flex flex-col items-center">
          <div className="w-full flex-1">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
