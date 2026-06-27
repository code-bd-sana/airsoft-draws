"use client";

import React, { useState } from "react";
import { DemoAccount } from "../../types/demo-auth.types";
import DashboardSidebar from "./DashboardSidebar";
import DashboardTopbar from "./DashboardTopbar";
import MobileDashboardMenu from "./MobileDashboardMenu";

interface DashboardShellProps {
  account: DemoAccount;
  children: React.ReactNode;
}

export default function DashboardShell({ account, children }: DashboardShellProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
