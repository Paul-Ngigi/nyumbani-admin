"use client";

import { zodResolver } from "@hookform/resolvers/zod";
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
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useState } from "react";
import axiosClient from "@/lib/axios-client";
import { useRouter } from "next/navigation";


const formSchema = z.object({
  firstName: z.string().min(2, {
    message: "First name must be at least 2 characters.",
  }),
  lastName: z.string().min(2, {
    message: "Last name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Invalid email format.",
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
  authToken: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
});

export function AddApartmentForm() {
  const queryClient = useQueryClient();

  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);

  const mutation = useMutation({
    mutationKey: ["addUser"],
    mutationFn: (values: any) => addUser(values),
    onMutate: () => {
      setIsLoading(true);
    },
    onSuccess: () => {
      toast.success("Success");
      queryClient.invalidateQueries({ queryKey: ["listUsers"] });
      setIsLoading(false);
      router.push("/users");
    },
    onError: (err) => {
      toast.error(err.message);
      setIsLoading(false);
    },
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      telephone1: "",
      authToken: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    mutation.mutate(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
        <FormField
          control={form.control}
          name="firstName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>First Name</FormLabel>
              <FormControl>
                <Input placeholder="Paul" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="lastName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Last Name</FormLabel>
              <FormControl>
                <Input placeholder="Ngigi" className="input-field" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
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
        <Button type="submit" className="w-full">
          {isLoading ? "Loading..." : "Submit"}
        </Button>
      </form>
    </Form>
  );
}

const addUser = async (data: any) => {
  let url = "/users/new";
  return await axiosClient.post(url, data);
};
