import React from "react";
import ProtectedRoute from "../../../features/auth/ProtectedRoute";

export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  return <ProtectedRoute allowedRoles={['ADMIN']}>{children}</ProtectedRoute>;
}
