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
    <div className="min-h-screen lg:h-screen w-full flex flex-col lg:flex-row bg-bg">
      {/* Left panel - brand and status */}
      <div className="w-full lg:w-[38%] lg:h-full lg:sticky lg:top-0">
        <HostAuthBrandPanel mode={mode} currentStep={currentStep} />
      </div>

      {/* Right panel - form content card */}
      <main className="w-full lg:w-[62%] lg:h-full flex justify-center p-4 pb-28 sm:p-6 md:p-10 lg:p-16 xl:p-24 overflow-y-auto">
        <div className="w-full max-w-3xl flex flex-col my-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
