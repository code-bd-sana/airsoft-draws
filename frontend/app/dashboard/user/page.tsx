import React from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function UserDashboardPage() {
  const cookieStore = await cookies();
  const role = cookieStore.get("demo_role")?.value;

  if (role !== "user") {
    redirect("/dashboard");
  }

  return (
    <div className="flex flex-col gap-6 animate-fadeIn">
      <div className="bg-[#161810] border border-[#1A230A] p-6 md:p-8 rounded-card">
        <h2 className="font-heading font-bold text-2xl text-text-primary mb-2">
          Welcome back to your Demo Dashboard!
        </h2>
        <p className="font-sans text-sm text-text-muted">
          This is a placeholder for the User Dashboard overview. In a real application, this would contain your active tickets, recent draws, and account activity.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#111210] border border-[#1A230A] p-6 rounded-card">
          <h3 className="text-text-secondary font-sans text-xs font-semibold uppercase tracking-wider mb-2">Active Tickets</h3>
          <p className="font-heading font-bold text-3xl text-text-primary">12</p>
        </div>
        <div className="bg-[#111210] border border-[#1A230A] p-6 rounded-card">
          <h3 className="text-text-secondary font-sans text-xs font-semibold uppercase tracking-wider mb-2">Competitions Entered</h3>
          <p className="font-heading font-bold text-3xl text-text-primary">4</p>
        </div>
        <div className="bg-[#111210] border border-[#1A230A] p-6 rounded-card">
          <h3 className="text-text-secondary font-sans text-xs font-semibold uppercase tracking-wider mb-2">Total Wins</h3>
          <p className="font-heading font-bold text-3xl text-text-primary">1</p>
        </div>
      </div>
    </div>
  );
}
