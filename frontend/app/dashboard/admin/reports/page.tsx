import React from "react";
import ReportsAnalyticsDashboard from "../../../../components/dashboard/admin/ReportsAnalyticsDashboard";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reports & Analytics | Admin Dashboard",
  description: "View platform statistics, revenue trends, and demographics.",
};

export default async function AdminReportsPage() {
  const cookieStore = await cookies();
  const role = cookieStore.get("demo_role")?.value;

  if (role !== "admin") {
    redirect("/dashboard");
  }

  return (
    <div className="flex flex-col gap-6 p-8 max-w-[1660px] mx-auto w-full">
      <ReportsAnalyticsDashboard />
    </div>
  );
}
