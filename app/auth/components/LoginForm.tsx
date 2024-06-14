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
      console.log({ response });
      if (!response?.error) {
        router.push("/");
        router.refresh();
      }

      if (!response.ok) {
        toast({
          variant: "destructive",
          title: "Invalid Credentials",
          description: "Invalid email/password.",
        });
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Ooops! Something went wrong",
        description: "Something went wrong trying to process your request",
      });
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6 max-w-md mx-auto"
      >
        <div className="text-2xl font-bold mb-4">Login</div>
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
          {isLoading ? "loading..." : "Login"}
        </Button>
      </form>
    </Form>
  );
}
