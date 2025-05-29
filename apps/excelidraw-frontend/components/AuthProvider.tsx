"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface AuthProviderProps {
  children: React.ReactNode;
  requireAuth?: boolean;
}

export function AuthProvider({
  children,
  requireAuth = false,
}: AuthProviderProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const authenticated = !!token;

    setIsAuthenticated(authenticated);

    if (requireAuth && !authenticated) {
      router.push("/signin");
    }
  }, [requireAuth, router]);

  // Show loading state while checking authentication
  if (requireAuth && isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-lg">Checking authentication...</div>
      </div>
    );
  }

  // Don't render children if auth is required but user is not authenticated
  if (requireAuth && !isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    window.location.href = "/";
  };

  return { isAuthenticated, logout };
}
