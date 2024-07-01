"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { processHttpErrors } from "@/actions/ProcessHttpErrors";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { IRbacRole } from "@/interfaces/roles.interface";
import axiosClient from "@/lib/axios-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "../ui/use-toast";

/* eslint-disable react-hooks/exhaustive-deps */

const formSchema = z.object({
  roles: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: "You have to select at least one role.",
  }),
});

export function AssignRbacForm() {
  const queryClient = useQueryClient();

  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);

  const [roles, setRoles] = useState<IRbacRole[]>([]);

  const assignRbac = async (data: any) => {
    let url = "/rbac/new";
    return await axiosClient.post(url, data);
  };

  const fetchRoles = async (data: any) => {
    let url = "/roles";
    return await axiosClient.post(url, data);
  };

  const rolesMutation = useMutation({
    mutationKey: ["listAllRoles"],
    mutationFn: (values: any) => fetchRoles(values),
    onMutate: () => {
      setIsLoading(true);
    },
    onSuccess: (data) => {
      setIsLoading(false);
      const res = data.data.data;
      if (res.Status === 200) {
        setRoles(res.Payload);
      } else {
        if (res.Status === 401) {
          toast({
            variant: "destructive",
            title: "Invalid token",
            description: "User token has expired",
          });
          signOut({ callbackUrl: "/auth/login" });
        } else {
          toast({
            variant: "warning",
            title: res.Message,
            description: res.Payload,
          });
        }
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

  const assignRbacMutation = useMutation({
    mutationKey: ["assignRbac"],
    mutationFn: (values: any) => assignRbac(values),
    onMutate: () => {
      setIsLoading(true);
    },
    onSuccess: () => {
      setIsLoading(false);
      toast({
        variant: "success",
        title: "Success",
        description: "Permissions set successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["listRbac"] });
      setIsLoading(false);
      router.push("/rbac");
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
      roles: [],
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    assignRbacMutation.mutate(values);
  }

  useEffect(() => {
    const payload: { fields: string[] } = { fields: ["_id", "role"] };
    rolesMutation.mutate(payload);
  }, []);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
        <FormField
          control={form.control}
          name="roles"
          render={() => (
            <FormItem>
              <div className="mb-4">
                <FormLabel className="text-base">Select Role(s)</FormLabel>
              </div>
              {roles.map((role) => (
                <FormField
                  key={role._id}
                  control={form.control}
                  name="roles"
                  render={({ field }) => {
                    return (
                      <FormItem
                        key={role._id}
                        className="flex flex-row items-start space-x-3 space-y-0"
                      >
                        <FormControl>
                          <Checkbox
                            checked={field.value?.includes(role._id)}
                            onCheckedChange={(checked) => {
                              return checked
                                ? field.onChange([...field.value, role._id])
                                : field.onChange(
                                    field.value?.filter(
                                      (value) => value !== role._id
                                    )
                                  );
                            }}
                          />
                        </FormControl>
                        <FormLabel className="text-sm font-normal">
                          {role.role}
                        </FormLabel>
                      </FormItem>
                    );
                  }}
                />
              ))}
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
