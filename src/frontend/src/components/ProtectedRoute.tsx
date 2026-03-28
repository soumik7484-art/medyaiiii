import { useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import type { ReactNode } from "react";
import { useAuth } from "../contexts/AuthContext";

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated, isInitializing, userName } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isInitializing) return;
    if (!isAuthenticated) {
      void navigate({ to: "/" });
    } else if (!userName) {
      void navigate({ to: "/setup" });
    }
  }, [isAuthenticated, isInitializing, userName, navigate]);

  if (isInitializing) return null;
  if (!isAuthenticated || !userName) return null;

  return <>{children}</>;
}
