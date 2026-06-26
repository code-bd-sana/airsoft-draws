import React from "react";
import type { Metadata } from "next";
import { cookies } from "next/headers";
import WebsiteNavbar from "../../components/website/layout/WebsiteNavbar";
import WebsiteFooter from "../../components/website/layout/WebsiteFooter";
import AdminLoginForm from "../../components/admin/AdminLoginForm";
import LeadsTable from "../../components/admin/LeadsTable";
import { verifyToken } from "../../lib/auth";
import { prisma } from "../../lib/db";
import { LeadItem } from "../../types/lead.types";

export const metadata: Metadata = {
  title: "Admin Dashboard | Airsoft Draws",
  description: "Manage registered waiting list leads.",
};

// Force dynamic execution since we inspect cookies and fetch dynamic database records
export const dynamic = "force-dynamic";

/**
 * Server Component `/admin` route.
 * Reads HTTP-only cookie and either displays the LoginForm or fetches and renders LeadsTable.
 */
export default async function AdminPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_session")?.value;
  const sessionSecret = process.env.ADMIN_SESSION_SECRET || "";

  let isAuthenticated = false;

  if (token && sessionSecret) {
    const payload = verifyToken(token, sessionSecret);
    if (payload && payload.isAdmin === true) {
      isAuthenticated = true;
    }
  }

  // Fetch leads from database if authenticated
  let leads: LeadItem[] = [];
  if (isAuthenticated) {
    try {
      const dbLeads = await prisma.lead.findMany({
        orderBy: {
          createdAt: "desc",
        },
      });

      leads = dbLeads.map((lead) => ({
        id: lead.id,
        fullName: lead.fullName,
        email: lead.email,
        role: lead.role,
        createdAt: lead.createdAt.toISOString(),
      }));
    } catch (err) {
      console.error("Failed to load leads from database:", err);
    }
  }

  return (
    <>
      <WebsiteNavbar />

      <main className="min-h-screen flex flex-col bg-bg pt-20 lg:pt-[66px] pb-12 relative">
        <div className="container-custom flex-1 flex flex-col justify-center">
          {isAuthenticated ? (
            <LeadsTable initialLeads={leads} />
          ) : (
            <AdminLoginForm />
          )}
        </div>
      </main>

      <WebsiteFooter />
    </>
  );
}
