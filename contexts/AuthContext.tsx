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

export const AuthContext = createContext({
  login: (authTokens: AuthTokens) => {},
  logout: () => {},
});

export default function AuthContextProvider({
  children,
}: {
  children: ReactNode;
}) {
  const login = useCallback(function (authTokens: AuthTokens) {
    Cookies.set("authTokens", JSON.stringify(authTokens));
  }, []);

  const logout = useCallback(function () {
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

  const getUserData = useCallback(() => {
    const authToken = Cookies.get("authTokens");
    if (authToken) {
      const parsedToken = JSON.parse(authToken);
      return parsedToken.data || {};
    }
    return {};
  }, []);

  const userData = getUserData();

  return {
    ...context,
    userData,
  };
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
