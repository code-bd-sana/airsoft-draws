import React from "react";
import UsersStatsCards from "../../../../components/dashboard/admin/UsersStatsCards";
import UsersTable from "../../../../components/dashboard/admin/UsersTable";

export default function AdminUsersManagementPage() {
  return (
    <div className="flex flex-col gap-8 p-8 max-w-[1660px] mx-auto w-full animate-fadeIn">
      <UsersStatsCards />
      <UsersTable />
    </div>
  );
}
