"use client";

import MainSkeleton from "@/components/main-skeleton";
import { AuthContextProvider } from "@/context/auth-context/auth";
import { SessionProvider } from "next-auth/react";
import React, { Suspense } from "react";
import ReactQueryProvider from "./tensatck-provider/ReactQueryProvider";

export const AppContext: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  return (
    <Suspense fallback={<MainSkeleton />}>
      <ReactQueryProvider>
        <SessionProvider>
          <AuthContextProvider>{children}</AuthContextProvider>
        </SessionProvider>
      </ReactQueryProvider>
    </Suspense>
  );
};
