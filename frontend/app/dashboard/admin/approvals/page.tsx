import React from "react";
import CompetitionApprovalQueue from "../../../../components/dashboard/admin/CompetitionApprovalQueue";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Approval Queue | Admin Dashboard",
  description: "Review and approve pending competitions.",
};

export default async function AdminApprovalsPage() {
  const cookieStore = await cookies();
  const role = cookieStore.get("demo_role")?.value;

  if (role !== "admin") {
    redirect("/dashboard");
  }

  return (
    <div className="flex flex-col gap-8 p-8 max-w-[1660px] mx-auto w-full animate-fadeIn">
      <CompetitionApprovalQueue />
    </div>
  );
}
