"use server";

import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { RegisterForm } from "../components/RegisterForm";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default async function page() {
  const session = await getServerSession();

  if (session) {
    redirect("/");
  }

  return (
    <Card>
      <CardHeader>
        <div className="text-2xl font-bold">Create an account</div>
      </CardHeader>
      <CardContent>
        <RegisterForm />
      </CardContent>
    </Card>
  );
}
