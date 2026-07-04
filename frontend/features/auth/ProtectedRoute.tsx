"use client";

import { useAuth } from "./AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        // Not logged in, redirect to login page
        // Determine whether to go to host or user login based on intended route
        const currentPath = window.location.pathname;
        if (currentPath.startsWith('/host')) {
          router.push('/host/login');
        } else {
          router.push('/login');
        }
      } else if (allowedRoles && user && !allowedRoles.includes(user.role)) {
        // Logged in but wrong role
        if (user.role === 'HOST') {
          router.push('/host/overview');
        } else {
          router.push('/dashboard');
        }
      }
    }
  }, [isAuthenticated, isLoading, user, router, allowedRoles]);

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-bg"><div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div></div>;
  }

  if (!isAuthenticated || (allowedRoles && user && !allowedRoles.includes(user.role))) {
    return null; // Will redirect in useEffect
  }

  return <>{children}</>;
}
