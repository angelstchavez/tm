"use client";

import { useEffect } from "react";
import { useAuthContext } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import Loading from "@/components/Loading";

export default function Page() {
  const { logout } = useAuthContext();
  const router = useRouter();

  useEffect(() => {
    logout();
    router.push("/");
  }, [logout, router]);

  return (
    <div className="flex flex-col items-center justify-center h-screen space-y-4 bg-travely-300">
      <div className="text-lg font-semibold text-white">Cerrando sesión...</div>
      <Loading />
    </div>
  );
}
