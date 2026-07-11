"use client";

import React from "react";
import CurrentPlanCard from "../../../../components/dashboard/host/billing/CurrentPlanCard";
import PaymentMethodCard from "../../../../components/dashboard/host/billing/PaymentMethodCard";
import BillingHistoryTable from "../../../../components/dashboard/host/billing/BillingHistoryTable";
import { mockBillingHistory } from "../../../../data/dashboard/host-dashboard.data";

export default function SubscriptionBillingPage() {
  return (
    <div className="flex-1 w-full px-[20px] lg:px-[40px] py-[24px] lg:py-[32px] flex flex-col gap-[24px] animate-in fade-in zoom-in-95 duration-300">
      <CurrentPlanCard />
      <PaymentMethodCard />
      <BillingHistoryTable history={mockBillingHistory || []} />
    </div>
  );
}
