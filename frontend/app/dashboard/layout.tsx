import React from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import DashboardShell from "../../components/dashboard/DashboardShell";
import { demoAccounts } from "../../data/demo-accounts.data";
import { DemoRole } from "../../types/demo-auth.types";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const demoRoleCookie = cookieStore.get("demo_role")?.value as DemoRole | undefined;

  if (!demoRoleCookie || !["user", "host", "admin"].includes(demoRoleCookie)) {
    redirect("/login");
  }

  const account = demoAccounts.find((acc) => acc.role === demoRoleCookie);

  if (!account) {
    redirect("/login");
  }

  return <DashboardShell account={account}>{children}</DashboardShell>;
}
