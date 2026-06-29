import React from "react";
import LogsActivityTable from "../../../../components/dashboard/admin/LogsActivityTable";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Logs & Activity | Admin Dashboard",
  description: "Monitor system events, admin actions, and user activities.",
};

export default async function AdminLogsPage() {
  const cookieStore = await cookies();
  const role = cookieStore.get("demo_role")?.value;

  if (role !== "admin") {
    redirect("/dashboard");
  }

  return (
    <div className="flex flex-col gap-6 p-8 max-w-[1660px] mx-auto w-full animate-fadeIn">
      <div>
        <h1 className="font-heading font-bold text-2xl text-[#E8EDD4] mb-2">Logs & Activity</h1>
        <p className="font-sans text-sm text-[#72943A]">
          Detailed audit trail of all system, admin, and user activities.
        </p>
      </div>
      
      <LogsActivityTable />
    </div>
  );
}
