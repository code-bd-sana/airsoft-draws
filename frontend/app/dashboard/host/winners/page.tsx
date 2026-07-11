import React from "react";
import WinnersTable from "../../../../components/dashboard/host/winners/WinnersTable";

export const metadata = {
  title: "Winners & Draws | Host Dashboard",
};

export default function WinnersAndDrawsPage() {
  return (
    <div className="flex-1 w-full px-[20px] lg:px-[40px] py-[24px] lg:py-[32px] flex flex-col gap-[24px] animate-in fade-in zoom-in-95 duration-300">
      
      {/* Header */}
      <div className="flex flex-col gap-[8px]">
        <h1 className="font-heading font-medium text-[32px] text-[#e8edd4]">
          Winners & Draws
        </h1>
        <p className="font-sans font-normal text-[15px] text-[#b3b8aa]">
          Manage your upcoming competition draws and view past winners.
        </p>
      </div>

      {/* Main Table Component (includes modal state internally) */}
      <WinnersTable />

    </div>
  );
}
