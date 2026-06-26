"use client";

import React from "react";
import HostAuthBrandPanel from "./HostAuthBrandPanel";

interface HostAuthLayoutProps {
  children: React.ReactNode;
  mode: "login" | "register";
  currentStep?: number;
}

export default function HostAuthLayout({
  children,
  mode,
  currentStep = 1,
}: HostAuthLayoutProps) {
  return (
    <div className="min-h-screen w-full flex flex-col lg:grid lg:grid-cols-[38%_62%] bg-bg">
      {/* Left panel - brand and status */}
      <div className="w-full lg:h-screen lg:sticky lg:top-0">
        <HostAuthBrandPanel mode={mode} currentStep={currentStep} />
      </div>

      {/* Right panel - form content card */}
      <main className="w-full flex items-center justify-center p-4 sm:p-6 md:p-10 lg:p-16 xl:p-24 overflow-y-auto">
        <div className="w-full max-w-3xl flex flex-col justify-center">
          {children}
        </div>
      </main>
    </div>
  );
}
