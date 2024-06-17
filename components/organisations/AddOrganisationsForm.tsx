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
import { useState } from "react";
import axiosClient from "@/lib/axios-client";
import { useRouter } from "next/navigation";
import { toast } from "../ui/use-toast";
import { processHttpErrors } from "@/actions/ProcessHttpErrors";

interface AddOrganisationsFormProps {
  onClose?: () => void;
}


const formSchema = z.object({
  name: z.string(),
  adminId: z.string(),
  board_no: z.string(),    
});

export function AddOrganisationsForm({ onClose = () => {} }: AddOrganisationsFormProps) {
  const queryClient = useQueryClient();

  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);

  const mutation = useMutation({
    mutationKey: ["addOrganisation"],
    mutationFn: (values: any) => addOrganisation(values),
    onMutate: () => {
      setIsLoading(true);
    },
    onSuccess: () => {      
      setIsLoading(false);
      toast({
        variant: "success",
        title: "Success",
        description: "Organisation created successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["listOrganisations"] });
      onClose();            
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
      name: "",
      adminId: "",
      board_no: ""
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
                <Input placeholder="Organisation Name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="board_no"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Board Number</FormLabel>
              <FormControl>
                <Input placeholder="Board Number" className="input-field" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="adminId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Admin Id</FormLabel>
              <FormControl>
                <Input
                  placeholder="Organisation Admin Id"
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

const addOrganisation = async (data: any) => {
  let url = "/organisations/new";
  return await axiosClient.post(url, data);
};
