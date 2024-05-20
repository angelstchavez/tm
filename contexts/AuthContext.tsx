"use client"

import { ReactNode, createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import Cookies from "js-cookie";

type AuthTokens = {
  token: string;
  refresh_token: string;
};

type AuthContextType = {
  login: (authTokens: AuthTokens, role: string) => void;
  logout: () => void;
  role: string | null;
};

export const AuthContext = createContext<AuthContextType>({
  login: (authTokens: AuthTokens, role: string) => {},
  logout: () => {},
  role: null,
});

export default function AuthContextProvider({ children }: { children: ReactNode; }) {
  const [role, setRole] = useState<string | null>(null);

  const login = useCallback(function (authTokens: AuthTokens, role: string) {
    Cookies.set("authTokens", JSON.stringify(authTokens));
    Cookies.set("role", role);
    setRole(role);
  }, []);

  const logout = useCallback(function () {
    Cookies.remove("authTokens");
    Cookies.remove("role");
    setRole(null);
  }, []);

  const value = useMemo(
    () => ({
      login,
      logout,
      role,
    }),
    [login, logout, role]
  );

  useEffect(() => {
    const roleFromCookie = Cookies.get("role");
    if (roleFromCookie) {
      setRole(roleFromCookie);
    }
  }, []);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  return useContext(AuthContext);
}

export function useAuthToken() {
  const [token, setToken] = useState<string>("");

  const getToken = useCallback(() => {
    const authToken = Cookies.get("authTokens");
    if (authToken) {
      const parsedToken = JSON.parse(authToken);
      const tokenFromData = parsedToken.data?.token;
      if (tokenFromData) {
        setToken(tokenFromData);
      }
    }
  }, []);

  useEffect(() => {
    getToken();
  }, [getToken]);

  return token;
}
