"use client";

import React, { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import CurrentPlanCard from "../../../../components/dashboard/host/billing/CurrentPlanCard";
import PaymentMethodCard from "../../../../components/dashboard/host/billing/PaymentMethodCard";
import BillingHistoryTable from "../../../../components/dashboard/host/billing/BillingHistoryTable";
import { useMyBillingHistory } from "../../../../hooks/useSubscriptionHooks";
import { toast } from "sonner";

export default function SubscriptionBillingPage() {
  const searchParams = useSearchParams();
  const { data: rawHistory, isLoading } = useMyBillingHistory();

  useEffect(() => {
    const status = searchParams.get("status");
    if (status === "success") {
      toast.success("Payment successful! Your subscription is now active.");
    } else if (status === "cancel") {
      toast.error("Payment was cancelled.");
    }
  }, [searchParams]);

  const history = rawHistory?.map((tx: any) => ({
    id: tx.id,
    date: new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(tx.createdAt)),
    description: tx.type === 'SUBSCRIPTION_FEE' ? 'Subscription Payment' : tx.type,
    amount: Number(tx.amount),
    invoice: tx.gatewayTransactionId,
    status: (tx.status === 'COMPLETED' ? 'Paid' : tx.status === 'FAILED' ? 'Failed' : 'Pending') as 'Paid' | 'Pending' | 'Failed'
  })) || [];

  return (
    <div className="flex-1 w-full px-[20px] lg:px-[40px] py-[24px] lg:py-[32px] flex flex-col gap-[24px] animate-in fade-in zoom-in-95 duration-300">
      <CurrentPlanCard />
      <PaymentMethodCard />
      {isLoading ? (
        <div className="text-white p-4">Loading billing history...</div>
      ) : (
        <BillingHistoryTable history={history} />
      )}
    </div>
  );
}
