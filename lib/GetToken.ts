
import Cookies from "js-cookie";

export function getToken(): string {
  const cookieValue = decodeURIComponent(Cookies.get("authTokens") || "");
  const cookieData: { data: { token?: string } } = JSON.parse(cookieValue);
  const token = cookieData.data.token;

  if (!token) {
    throw new Error("No se encontró el token en el cookie.");
  }

  return token;
}

export function camelCase(str: string): string {
  return str.replace(/-([a-z])/g, function (g) {
    return g[1].toUpperCase();
  });
}
