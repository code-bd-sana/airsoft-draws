"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { DemoRole } from "../../types/demo-auth.types";
import { demoAccounts } from "../../data/demo-accounts.data";
import { cn } from "../../lib/utils";

export default function DemoLoginOptions() {
  const router = useRouter();
  const [loadingRole, setLoadingRole] = useState<DemoRole | null>(null);

  const handleDemoLogin = async (role: DemoRole) => {
    setLoadingRole(role);
    try {
      const res = await fetch("/api/demo-auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "login", role }),
      });
      
      const data = await res.json();
      if (data.success && data.redirectUrl) {
        router.push(data.redirectUrl);
      } else {
        console.error("Demo login failed:", data.error);
        setLoadingRole(null);
      }
    } catch (err) {
      console.error("Demo login error:", err);
      setLoadingRole(null);
    }
  };

  return (
    <div className="mt-8 border border-border bg-accent-bg/30 rounded-card p-5">
      <div className="flex flex-col items-center justify-center mb-4">
        <h3 className="font-heading font-semibold text-sm text-text-primary mb-1">
          Explore the Dashboard Demo
        </h3>
        <p className="font-sans text-[11px] text-text-muted text-center">
          Instantly log in to a demo account to view role-based features.
        </p>
      </div>
      
      <div className="flex flex-col gap-2.5">
        {demoAccounts.map((account) => (
          <button
            key={account.id}
            onClick={() => handleDemoLogin(account.role)}
            disabled={loadingRole !== null}
            className={cn(
              "w-full flex items-center justify-between bg-surface border border-border hover:bg-border/30 hover:border-border-medium rounded-button p-3 font-sans transition-all duration-200 cursor-pointer select-none group",
              loadingRole === account.role && "opacity-70 cursor-wait",
              loadingRole !== null && loadingRole !== account.role && "opacity-50 cursor-not-allowed"
            )}
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full overflow-hidden shrink-0 border border-divider shadow-sm group-hover:border-primary/30 transition-colors">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={account.avatar} alt={account.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-xs font-semibold text-text-primary group-hover:text-text-brand transition-colors">
                  Continue as {account.name}
                </span>
                <span className="text-[10px] text-text-muted">
                  {account.role.charAt(0).toUpperCase() + account.role.slice(1)} Dashboard
                </span>
              </div>
            </div>
            
            <div className="shrink-0 text-text-secondary group-hover:text-primary transition-colors">
              {loadingRole === account.role ? (
                <svg className="animate-spin w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                </svg>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
