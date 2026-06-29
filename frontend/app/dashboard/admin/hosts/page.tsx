import React from "react";
import HostsStatsCards from "../../../../components/dashboard/admin/HostsStatsCards";
import HostsTable from "../../../../components/dashboard/admin/HostsTable";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function AdminHostsManagementPage() {
  const cookieStore = await cookies();
  const role = cookieStore.get("demo_role")?.value;

  if (role !== "admin") {
    redirect("/dashboard");
  }

  return (
    <div className="flex flex-col gap-8 p-8 max-w-[1660px] mx-auto w-full animate-fadeIn">
      <HostsStatsCards />
      <HostsTable />
    </div>
  );
}
