"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuthUser, useLogout } from '../../hooks/useAuthHooks';
import { User } from '../../services/auth.service';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { data: user, isLoading: isUserLoading } = useAuthUser();
  const logoutAction = useLogout();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Initial mount check for hydration
    setIsLoading(isUserLoading);
  }, [isUserLoading]);

  const value = {
    user: user || null,
    isAuthenticated: !!user,
    isLoading,
    logout: logoutAction,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
