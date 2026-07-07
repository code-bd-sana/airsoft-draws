"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../features/auth/AuthContext";

export default function DashboardRootPage() {
  const { user, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push("/login");
      } else {
        const role = user?.role?.toUpperCase();
        if (role === "ADMIN") router.push("/dashboard/admin");
        else if (role === "HOST") router.push("/dashboard/host");
        else router.push("/dashboard/user");
      }
    }
  }, [user, isLoading, isAuthenticated, router]);

  return <div className="min-h-screen bg-bg flex items-center justify-center">Loading...</div>;
}
