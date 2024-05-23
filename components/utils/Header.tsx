"use client";

import React from "react";

import Link from "next/link";
import { useSelectedLayoutSegment } from "next/navigation";

import useScroll from "@/hooks/UseScroll";
import { cn } from "@/lib/utils";

const Header = () => {
  const scrolled = useScroll(5);
  const selectedLayout = useSelectedLayoutSegment();

  return (
    <div
      className={cn(
        `sticky inset-x-0 top-0 z-30 w-full transition-all bg-travely-400`,
        {
          " bg-travely-400/75 backdrop-blur-lg": scrolled,
          " bg-travely-400": selectedLayout,
        }
      )}
    >
      <div className="flex h-[47px] items-center justify-between px-4">
        <div className="flex items-center space-x-4">
          <Link
            href="/admin"
            className="flex flex-row space-x-3 items-center justify-center md:hidden"
          >
            <span className="font-bold text-xl flex text-white">
              Travely Manager
            </span>
          </Link>
        </div>

        <div className="hidden md:block">
          <div className="h-8 w-8 rounded-full bg-travely-300 flex items-center justify-center text-center">
            <span className="font-semibold text-sm text-white">TM</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
