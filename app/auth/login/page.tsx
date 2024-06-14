"use server"

import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import LoginForm from "../components/LoginForm";

export default async function page() {
  const session = await getServerSession();
  console.log({ session });

  if (session) {
    redirect("/");
  }

  return <LoginForm />;
}
