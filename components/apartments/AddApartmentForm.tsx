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
  name: z.string().min(2, {
    message: "First name must be at least 2 characters.",
  }),
  location: z.string().min(2, {
    message: "Last name must be at least 2 characters.",
  }),
});

export function AddApartmentForm() {
  const queryClient = useQueryClient();

  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);

  const mutation = useMutation({
    mutationKey: ["addApartment"],
    mutationFn: (values: any) => addApartment(values),
    onMutate: () => {
      setIsLoading(true);
    },
    onSuccess: () => {
      toast.success("Success");
      queryClient.invalidateQueries({ queryKey: ["listApartments"] });
      setIsLoading(false);
      router.push("/apartments");
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
    console.log({values});
    
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

const addApartment = async (data: any) => {
  let url = "/apartments/new";
  return await axiosClient.post(url, data);
};
