"use client";

import * as React from "react";
import Link from "next/link";
import { FaBusAlt } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";

const Navbar: React.FC = () => {
  const router = useRouter();

  const handleLoginClick = () => {
    router.push("/login");
  };

  return (
    <nav className="flex items-center justify-between fixed z-50 w-full bg-travely-400 px-6 py-4 lg:px-10">
      <Link href="/" className="flex items-center gap-1">
        <FaBusAlt color="#fff" size={25} />
        <p className="text-[26px] font-extrabold text-white max-sm:hidden">
          Travely Manager
        </p>
      </Link>
      <div className="ml-auto">
        <Button variant={"travely"} onClick={handleLoginClick}>Iniciar sesión</Button>
      </div>
    </nav>
  );
};

export default Navbar;
