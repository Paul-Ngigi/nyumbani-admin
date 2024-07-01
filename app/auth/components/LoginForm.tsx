"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginForm() {
  const router = useRouter();

  const { toast } = useToast();

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const formSchema = z.object({
    email: z.string().min(1, { message: "Email is required" }).email({
      message: "Invalid email address",
    }),
    authToken: z.string().min(1, { message: "Password is required" }).min(3, {
      message: "Password must be at least 3 characters",
    }),
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      authToken: "",
    },
  });

  const { handleSubmit } = form;

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const { email, authToken } = values;
    try {
      setIsLoading(true);
      const response: any = await signIn("credentials", {
        email,
        authToken,
        redirect: false,
      });
      setIsLoading(false);

      if (!response.ok) {        
        return toast({
          variant: "destructive",
          title: "Ooops! Something went wrong",
          description: "Invalid email/password",
        });
      } else {
        router.push("/");
        router.refresh();
      }
    } catch (error: any) {
      setIsLoading(false);
      toast({
        variant: "destructive",
        title: "Ooops! Something went wrong",
        description: "Something went wrong trying to process your request",
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  placeholder="example@example.com"
                  className="input-field w-full"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="authToken"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="Password"
                  className="input-field"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end">
          <Link
            href="/auth/reset-password"
            passHref
            className="text-sm text-blue-600 hover:underline"
          >
            Forgot password
          </Link>
        </div>

        <Button type="submit" size="lg" className="w-full">
          {isLoading ? "Loading..." : "Sign In"}
        </Button>

        <div>
          Don&apos;t have an account yet?{" "}
          <Link
            href="/auth/register"
            passHref
            className="text-sm text-blue-600 hover:underline"
          >
            Sign Up
          </Link>
        </div>
      </form>
    </Form>
  );
}
