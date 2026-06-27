import React from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function AdminDashboardPage() {
  const cookieStore = await cookies();
  const role = cookieStore.get("demo_role")?.value;

  if (role !== "admin") {
    redirect("/dashboard");
  }

  return (
    <div className="flex flex-col gap-6 animate-fadeIn">
      <div className="bg-[#161810] border border-[#1A230A] p-6 md:p-8 rounded-card">
        <h2 className="font-heading font-bold text-2xl text-text-primary mb-2">
          Platform Administration
        </h2>
        <p className="font-sans text-sm text-text-muted">
          Welcome to the Demo Admin Dashboard. You have full platform visibility over all hosts, users, competitions, and flagged reviews.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-[#111210] border border-[#1A230A] p-6 rounded-card relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4">
            <span className="flex h-3 w-3 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ef4444] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-[#ef4444]"></span>
            </span>
          </div>
          <h3 className="text-text-secondary font-sans text-xs font-semibold uppercase tracking-wider mb-2">Pending Verifications</h3>
          <p className="font-heading font-bold text-3xl text-text-primary">12</p>
        </div>
        <div className="bg-[#111210] border border-[#1A230A] p-6 rounded-card">
          <h3 className="text-text-secondary font-sans text-xs font-semibold uppercase tracking-wider mb-2">Total Platform Hosts</h3>
          <p className="font-heading font-bold text-3xl text-text-primary">45</p>
        </div>
        <div className="bg-[#111210] border border-[#1A230A] p-6 rounded-card">
          <h3 className="text-text-secondary font-sans text-xs font-semibold uppercase tracking-wider mb-2">Platform Revenue</h3>
          <p className="font-heading font-bold text-3xl text-text-primary">£12,450</p>
        </div>
        <div className="bg-[#111210] border border-[#1A230A] p-6 rounded-card">
          <h3 className="text-text-secondary font-sans text-xs font-semibold uppercase tracking-wider mb-2">Active Disputes</h3>
          <p className="font-heading font-bold text-3xl text-text-primary">0</p>
        </div>
      </div>
    </div>
  );
}
