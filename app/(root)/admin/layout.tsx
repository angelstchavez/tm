"use client";

import { ReactNode } from "react";
import Header from "@/components/utils/Header";
import HeaderMobile from "@/components/utils/HeaderMobile";
import MarginWidthWrapper from "@/components/utils/MarginWifthWrapper";
import PageWrapper from "@/components/utils/PageWrapper";
import SideNav from "@/components/utils/Sidenav";

function Layout({ children }: { children: ReactNode }) {
  return (
    <div>
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
