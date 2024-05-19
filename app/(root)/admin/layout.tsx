"use client";

import Header from "@/components/Header";
import HeaderMobile from "@/components/HeaderMobile";
import MarginWidthWrapper from "@/components/MarginWifthWrapper";
import PageWrapper from "@/components/PageWrapper";
import SideNav from "@/components/Sidenav";
import { ReactNode } from "react";

function Layout({ children }: { children: ReactNode }) {
  return (
    <div>
      {" "}
      <div className="flex">
        <SideNav />
        <main className="flex-1">
          <MarginWidthWrapper>
            <Header />
            <HeaderMobile />
            <PageWrapper>{children}</PageWrapper>
          </MarginWidthWrapper>
        </main>
      </div>
    </div>
  );
}

export default Layout;
