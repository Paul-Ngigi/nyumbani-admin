"use client";

import MainSkeleton from "@/components/main-skeleton";
/* eslint-disable react-hooks/exhaustive-deps */
import { IUser } from "@/interfaces/user.interface";
import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import React, { useContext, useEffect, useState } from "react";
import { signOut } from 'next-auth/react';

interface IAuthContext {
  user: IUser | null;
  accessToken: string;
  loadingUser: boolean;
  logOut: () => void;
  authenticate: () => void;
  updateUser: (user: IUser, token: string) => Promise<void>;
}

export const AuthContext = React.createContext<IAuthContext>(
  {} as IAuthContext
);

export function AuthContextProvider(props: { children: React.ReactNode }) { 
  const { data: session, status } = useSession();

  const router = useRouter();

  const pathname = usePathname();

  const [user, setUser] = useState<any | null>(null);

  const [accessToken, setAccessToken] = useState<string>("");

  const [loadingUser, setLoadingUser] = useState(false);

  useEffect(() => {
    if (status === "loading") {
      setLoadingUser(true);
      const handleBeforeUnload = (event: BeforeUnloadEvent) => {      
        signOut({ callbackUrl: '/auth/login' });
      };
  
      window.addEventListener('beforeunload', handleBeforeUnload);
  
      return () => {
        window.removeEventListener('beforeunload', handleBeforeUnload);
      };
    }

    if (session && status === "authenticated") {
      setUser(session.user);
      if (user?.token) {
        sessionStorage.setItem("skey", user.token);        
      }      
      setLoadingUser(false);
    }

    if (status === "unauthenticated") {
      setUser(null);
      setLoadingUser(false);
    }
  }, [session, status]);

  const updateUser = async (user: IUser, token: string) => {
    setAccessToken(token);
    setUser(user);
  };

  const logOut = async () => {
    await sessionStorage.removeItem("user");
    router.replace("auth/login");
  };

  const authenticate = () => {
    router.replace(`/auth/login?callbackUrl=${encodeURIComponent(pathname)}`);
  };

  return (
    <AuthContext.Provider
      value={{
        updateUser,
        user,
        accessToken,
        logOut,
        authenticate,
        loadingUser,
      }}
    >
      {loadingUser && <MainSkeleton />}
      {!loadingUser && props.children}
    </AuthContext.Provider>
  );
}

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error(`AuthContext not found`);
  } else {
    return context;
  }
};
