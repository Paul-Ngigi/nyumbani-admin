"use server";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import LoginForm from "../components/LoginForm";

export default async function page() {
  const session = await getServerSession();

  if (session) {
    redirect("/");
  }

  return (
    <Card>
      <CardHeader>
        <div className="text-2xl font-bold">Login to your account</div>
      </CardHeader>
      <CardContent>
        <LoginForm />
      </CardContent>
    </Card>
  );
}
