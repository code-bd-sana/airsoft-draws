"use client";

import React from "react";
import HostProfileForm from "../../../../components/dashboard/host/profile/HostProfileForm";

export default function HostProfilePage() {
  return (
    <div className="flex-1 w-full px-[20px] lg:px-[40px] py-[24px] lg:py-[32px] flex flex-col gap-[24px] animate-in fade-in zoom-in-95 duration-300">
      <HostProfileForm />
    </div>
  );
}
