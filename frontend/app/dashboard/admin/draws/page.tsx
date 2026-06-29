import React from "react";
import AdminDrawsManager from "../../../../components/dashboard/admin/draws/AdminDrawsManager";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Draws | Admin Dashboard",
  description: "Manage upcoming, live, and completed competition draws.",
};

export default async function AdminDrawsPage() {
  const cookieStore = await cookies();
  const role = cookieStore.get("demo_role")?.value;

  if (role !== "admin") {
    redirect("/dashboard");
  }

  return (
    <div className="flex flex-col gap-6 p-8 max-w-[1660px] mx-auto w-full">
      <AdminDrawsManager />
    </div>
  );
}
