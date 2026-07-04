import React from "react";
import WinnersStatsCards from "../../../../components/dashboard/admin/WinnersStatsCards";
import WinnersTrackingTable from "../../../../components/dashboard/admin/WinnersTrackingTable";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Winners | Admin Dashboard",
  description: "Track competition winners, prize delivery, and verifications.",
};

export default function AdminTrackingPage() {
  return (
    <div className="flex flex-col gap-6 p-8 max-w-[1660px] mx-auto w-full animate-fadeIn">
      <div>
        <h1 className="font-heading font-bold text-2xl text-[#E8EDD4] mb-2">Winners</h1>
        <p className="font-sans text-sm text-[#72943A]">
          Manage and track competition winners, perform verifications, and monitor prize deliveries.
        </p>
      </div>
      
      <WinnersStatsCards />
      <WinnersTrackingTable />
    </div>
  );
}
