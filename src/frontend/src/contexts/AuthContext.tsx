import { createContext, useCallback, useContext, useMemo } from "react";
import type { ReactNode } from "react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

type AuthContextType = {
  isAuthenticated: boolean;
  isInitializing: boolean;
  isLoggingIn: boolean;
  loginError?: Error;
  principal: string | null;
  userName: string | null;
  setUserName: (name: string) => void;
  login: () => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { identity, login, clear, isInitializing, isLoggingIn, loginError } =
    useInternetIdentity();

  const principal = useMemo(() => {
    if (!identity) return null;
    const p = identity.getPrincipal();
    if (p.isAnonymous()) return null;
    return p.toString();
  }, [identity]);

  const isAuthenticated = principal !== null;

  const userName = useMemo(() => {
    if (!principal) return null;
    return localStorage.getItem(`medyai_name_${principal}`);
  }, [principal]);

  const setUserName = useCallback(
    (name: string) => {
      if (!principal) return;
      localStorage.setItem(`medyai_name_${principal}`, name);
    },
    [principal],
  );

  const logout = useCallback(() => {
    clear();
  }, [clear]);

  const value = useMemo<AuthContextType>(
    () => ({
      isAuthenticated,
      isInitializing,
      isLoggingIn,
      loginError,
      principal,
      userName,
      setUserName,
      login,
      logout,
    }),
    [
      isAuthenticated,
      isInitializing,
      isLoggingIn,
      loginError,
      principal,
      userName,
      setUserName,
      login,
      logout,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
