import React from "react";
import AdminDrawsManager from "../../../../components/dashboard/admin/draws/AdminDrawsManager";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Draws | Admin Dashboard",
  description: "Manage upcoming, live, and completed competition draws.",
};

export default function AdminDrawsPage() {
  return (
    <div className="flex flex-col gap-6 p-8 max-w-[1660px] mx-auto w-full">
      <AdminDrawsManager />
    </div>
  );
}
