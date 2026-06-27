import React from "react";
import SubscriptionStatsCards from "../../../../components/dashboard/admin/SubscriptionStatsCards";
import PlanDistributionChart from "../../../../components/dashboard/admin/PlanDistributionChart";
import SubscriptionTable from "../../../../components/dashboard/admin/SubscriptionTable";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function AdminSubscriptionsManagementPage() {
  const cookieStore = await cookies();
  const role = cookieStore.get("demo_role")?.value;

  if (role !== "admin") {
    redirect("/dashboard");
  }

  return (
    <div className="flex flex-col gap-6 p-8 max-w-[1660px] mx-auto w-full animate-fadeIn">
      {/* Top Stats Cards */}
      <SubscriptionStatsCards />

      {/* Middle Layout: Donut Chart & Table */}
      <div className="grid grid-cols-1 xl:grid-cols-[400px_1fr] gap-6">
        <PlanDistributionChart />
        <SubscriptionTable />
      </div>
    </div>
  );
}
