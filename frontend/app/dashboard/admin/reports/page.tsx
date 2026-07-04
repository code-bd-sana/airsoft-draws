import React from "react";
import ReportsAnalyticsDashboard from "../../../../components/dashboard/admin/ReportsAnalyticsDashboard";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reports & Analytics | Admin Dashboard",
  description: "View platform statistics, revenue trends, and demographics.",
};

export default function AdminReportsPage() {
  return (
    <div className="flex flex-col gap-6 p-8 max-w-[1660px] mx-auto w-full">
      <ReportsAnalyticsDashboard />
    </div>
  );
}
