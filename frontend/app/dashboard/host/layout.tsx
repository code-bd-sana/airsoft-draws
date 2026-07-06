import React from "react";
import ProtectedRoute from "../../../features/auth/ProtectedRoute";

export default function HostDashboardLayout({ children }: { children: React.ReactNode }) {
  return <ProtectedRoute allowedRoles={['HOST']}>{children}</ProtectedRoute>;
}
