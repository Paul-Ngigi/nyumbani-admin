"use client";

import { useAuthContext } from "@/context/auth-context/auth";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect } from "react";
import "react-toastify/dist/ReactToastify.css";

export default function AuthConfig({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loadingUser } = useAuthContext();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!user && !loadingUser) {
      router.push(`/auth/login?callbackUrl=${encodeURIComponent(pathname)}`);
    }
    router.push(pathname);
  }, [router, user, loadingUser, pathname]);

  return <>{user ? children : null}</>;
}
