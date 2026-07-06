"use client";

import React from "react";
import DashboardShell from "../../components/dashboard/DashboardShell";
import ProtectedRoute from "../../features/auth/ProtectedRoute";
import { useAuth } from "../../features/auth/AuthContext";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuth();

  const account = user ? {
    id: user.id,
    name: `${user.firstName} ${user.lastName}`.trim() || user.email,
    email: user.email,
    role: (user.role === 'CLIENT' ? 'user' : user.role.toLowerCase()) as "user" | "host" | "admin",
    avatar: user.avatarUrl || "https://api.dicebear.com/7.x/avataaars/svg?seed=" + user.id,
    joinDate: "2024-01-01",
    status: "active" as const,
  } : null;

  return (
    <ProtectedRoute allowedRoles={['CLIENT', 'HOST', 'ADMIN']}>
      {account ? (
        <DashboardShell account={account}>{children}</DashboardShell>
      ) : (
        <div className="min-h-screen bg-bg flex items-center justify-center">Loading...</div>
      )}
    </ProtectedRoute>
  );
}
