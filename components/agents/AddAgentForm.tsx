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
  adminId: z.string(),
  board_no: z.string(),  
  kraImage: z.string(),  
});

export function AddAgentForm() {
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
    // defaultValues: {     
    //   kraPin: "",
    //   earb_no: "",
    // },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    mutation.mutate(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
        <FormField
          control={form.control}
          name="adminId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Paul" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="earb_no"
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
          name="kraImage"
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
