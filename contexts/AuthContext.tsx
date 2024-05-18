"use client";

import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import Cookies from "js-cookie";

type AuthTokens = {
  token: string;
  refresh_token: string;
};

type AuthContextType = {
  login: (authTokens: AuthTokens) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export default function AuthContextProvider({
  children,
}: {
  children: ReactNode;
}) {
  const login = useCallback((authTokens: AuthTokens) => {
    Cookies.set("authTokens", JSON.stringify(authTokens));
  }, []);

  const logout = useCallback(() => {
    Cookies.remove("authTokens");
  }, []);

  const value = useMemo(
    () => ({
      login,
      logout,
    }),
    [login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error(
      "useAuthContext must be used within an AuthContextProvider"
    );
  }
  return context;
}

export function useAuthToken() {
  const [token, setToken] = useState<string>("");

  const getToken = useCallback(() => {
    const authToken = Cookies.get("authTokens");
    if (authToken) {
      const parsedToken = JSON.parse(authToken);
      const tokenFromData = parsedToken?.token;
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
