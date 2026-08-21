import React from "react";
import SubscriptionStatsCards from "../../../../components/dashboard/admin/SubscriptionStatsCards";
import PlanDistributionChart from "../../../../components/dashboard/admin/PlanDistributionChart";
import SubscriptionTable from "../../../../components/dashboard/admin/SubscriptionTable";
import SubscriptionRequestsTable from "../../../../components/dashboard/admin/SubscriptionRequestsTable";

export default function AdminSubscriptionsManagementPage() {
  return (
    <div className="flex flex-col gap-8 p-8 max-w-[1660px] mx-auto w-full animate-fadeIn">
      {/* Top Stats Cards */}
      <SubscriptionStatsCards />

      {/* Manual Subscription Requests Section */}
      <SubscriptionRequestsTable />

      {/* Active Subscriptions & Analytics */}
      <div className="grid grid-cols-1 xl:grid-cols-[400px_1fr] gap-6">
        <PlanDistributionChart />
        <SubscriptionTable />
      </div>
    </div>
  );
}
