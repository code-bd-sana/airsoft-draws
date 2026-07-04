import React from "react";
import ProtectedRoute from "../../../features/auth/ProtectedRoute";

export default function UserDashboardLayout({ children }: { children: React.ReactNode }) {
  return <ProtectedRoute allowedRoles={['CLIENT']}>{children}</ProtectedRoute>;
}
