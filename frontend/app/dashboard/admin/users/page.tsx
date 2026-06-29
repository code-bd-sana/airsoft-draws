import React from "react";
import UsersStatsCards from "../../../../components/dashboard/admin/UsersStatsCards";
import UsersTable from "../../../../components/dashboard/admin/UsersTable";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function AdminUsersManagementPage() {
  const cookieStore = await cookies();
  const role = cookieStore.get("demo_role")?.value;

  if (role !== "admin") {
    redirect("/dashboard");
  }

  return (
    <div className="flex flex-col gap-8 p-8 max-w-[1660px] mx-auto w-full animate-fadeIn">
      <UsersStatsCards />
      <UsersTable />
    </div>
  );
}
