import React from "react";
import WithdrawalsStatsCards from "../../../../components/dashboard/admin/WithdrawalsStatsCards";
import WithdrawalsTable from "../../../../components/dashboard/admin/WithdrawalsTable";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Withdraw Requests | Admin Dashboard",
  description: "Manage and process host withdrawal requests.",
};

export default async function AdminWithdrawalsPage() {
  const cookieStore = await cookies();
  const role = cookieStore.get("demo_role")?.value;

  if (role !== "admin") {
    redirect("/dashboard");
  }

  return (
    <div className="flex flex-col gap-6 p-8 max-w-[1660px] mx-auto w-full animate-fadeIn">
      <div>
        <h1 className="font-heading font-bold text-2xl text-[#E8EDD4] mb-2">Withdraw Requests</h1>
        <p className="font-sans text-sm text-[#72943A]">
          Review and process payout requests from competition hosts.
        </p>
      </div>
      
      <WithdrawalsStatsCards />
      <WithdrawalsTable />
    </div>
  );
}
