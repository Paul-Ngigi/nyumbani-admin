"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { processHttpErrors } from "@/actions/ProcessHttpErrors";
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
import { toast } from "@/components/ui/use-toast";
import { ApiResponse } from "@/interfaces/api.response.interface";
import axiosClient from "@/lib/axios-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

const formSchema = z
  .object({
    email: z
      .string({ required_error: "Email is required" })
      .min(1, "Email is required")
      .email({
        message: "Invalid email address",
      }),
    telephone1: z.string().refine(
      (value) => {
        return /^\+\d{1,3}\d{6,14}$/.test(value);
      },
      {
        message:
          "Invalid phone number format. Must start with '+<country code>' followed by the number.",
      }
    ),
    authToken: z
      .string({ required_error: "Password is required" })
      .min(1, "Password is required")
      .min(8, {
        message: "Password must be at least 8 characters",
      }),
    confirm_authToken: z
      .string({
        required_error: "Password confirmation is required",
      })
      .min(1, "Password confirmation is required"),
  })
  .refine((data) => data.authToken === data.confirm_authToken, {
    message: "Passwords do not match",
    path: ["confirm_authToken"],
  });

export function RegisterForm() {
  const queryClient = useQueryClient();

  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);

  const addUser = async (data: any) => {
    let url = "/users/new";
    return await axiosClient.post(url, data);
  };

  const addOrganisation = async (data: any) => {
    let url = "/organisations/new";
    return await axiosClient.post(url, data);
  };

  const mutation = useMutation({
    mutationKey: ["register"],
    mutationFn: (values: any) => addUser(values),
    onMutate: () => {
      setIsLoading(true);
    },
    onSuccess: (data) => {
      const response: ApiResponse = data.data.data;
      if (response.Status === 200) {
        const userId: string = response.Payload._id;

        if (userId) {
          mutation2.mutate({ adminId: userId, name: "", board_no: "" });
        }
      } else {
        setIsLoading(false);
        toast({
          variant: "warning",
          title: "Oooops! We we're unable create account",
          description: response.Payload,
        });
      }
    },
    onError: (err) => {
      setIsLoading(false);
      toast({
        variant: "destructive",
        title: "Ooops! Something went wrong",
        description: processHttpErrors(err),
      });
    },
  });

  const mutation2 = useMutation({
    mutationKey: ["addOrganisation"],
    mutationFn: (values: any) => addOrganisation(values),
    onMutate: () => {
      setIsLoading(true);
    },
    onSuccess: (data) => {
      setIsLoading(false);
      const response: ApiResponse = data.data.data;
      if (response.Status === 200) {
        toast({
          variant: "success",
          title: "Account created successfully",
          description: "You may now proceed to login",
        });
        router.push("/auth/login");
      } else {
        setIsLoading(false);
        toast({
          variant: "warning",
          title: "Oooops! We we're unable create account",
          description: response.Payload,
        });
      }
    },
    onError: (err) => {
      setIsLoading(false);
      toast({
        variant: "destructive",
        title: "Ooops! Something went wrong",
        description: processHttpErrors(err),
      });
    },
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      telephone1: "",
      authToken: "",
      confirm_authToken: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    mutation.mutate(values);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-4"
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email Address</FormLabel>
              <FormControl>
                <Input
                  placeholder="paul@gmail.com"
                  className="input-field"
                  {...field}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="telephone1"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone Number</FormLabel>
              <FormControl>
                <Input
                  placeholder="+254 7** *****"
                  className="input-field"
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
        <FormField
          control={form.control}
          name="confirm_authToken"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm Password</FormLabel>
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
        <Button type="submit" className="w-full">
          {isLoading ? "Loading..." : "Sign Up"}
        </Button>

        <div>
          Already have an account?{" "}
          <Link
            href="/auth/login"
            passHref
            className="text-sm text-blue-600 hover:underline"
          >
            Login Instead
          </Link>
        </div>
      </form>
    </Form>
  );
}
