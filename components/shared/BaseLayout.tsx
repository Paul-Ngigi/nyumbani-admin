"use client";

import React, { useEffect, useState } from "react";
import Header from "./header";
import HeaderMobile from "./header-mobile";
import MarginWidthWrapper from "./margin-width-wrapper";
import PageWrapper from "./page-wrapper";
import SideNav from "./side-nav";
import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import MainSkeleton from "../main-skeleton";
import SideNavbar from "./SideNavbar";

export default function BaseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // const router = useRouter();
  // const { data: session, status } = useSession();

  // const [user, setUser] = useState<any>(null);

  // useEffect(() => {
  //   if (session && status === "authenticated") {
  //     setUser(session.user);
  //     if (user) {
  //       console.log({ user: user });
  //       sessionStorage.setItem("SKEY", user.token);
  //     }
  //   }
  // }, [user]);

  // console.log(session);
  // console.log(status);

  // const pathname = usePathname();

  // if (status === "loading") {
  //   return <MainSkeleton />;
  // }

  // if (!session && status === "unauthenticated") {
  //   router.push(`/auth/login?callbackUrl=${encodeURIComponent(pathname)}`);
  // }

  // if (session && status === "authenticated") {
    
  // }

  return (    
    <div className="flex">
       {/* <SideNavbar />        
      <div className="p-8 w-full">{children}</div> */}
      <SideNav />
      <main className="flex-1">
        <MarginWidthWrapper>
          <Header />
          <HeaderMobile />
          <PageWrapper>{children}</PageWrapper>
        </MarginWidthWrapper>
      </main>
    </div>
  );
}
