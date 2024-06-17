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
  unit: z.string().min(2, {
    message: "First name must be at least 2 characters.",
  }),
  rooms: z.string().min(2, {
    message: "Last name must be at least 2 characters.",
  }),
  description: z.string().min(2, {
    message: "Last name must be at least 2 characters.",
  }),
  rent: z.string().min(2, {
    message: "Last name must be at least 2 characters.",
  }),
  status: z.string().min(2, {
    message: "Last name must be at least 2 characters.",
  }),
});

export function AddUnitForm() {
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
      name: "",
      location: "",
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
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Apartment name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Location</FormLabel>
              <FormControl>
                <Input placeholder="Apartment Location" className="input-field" {...field} />
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
