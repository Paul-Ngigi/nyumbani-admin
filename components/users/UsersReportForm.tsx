"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { processHttpErrors } from "@/actions/ProcessHttpErrors";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import axiosClient from "@/lib/axios-client";
import { CalendarIcon } from "@radix-ui/react-icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addDays, format } from "date-fns";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { DateRange } from "react-day-picker";
import { toast } from "../ui/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { AppEnums } from "@/enums/app.enum";

const formSchema = z.object({
  reciepient: z.array(z.string().email({
    message: "Invalid email format.",
  })),
  role: z.string().min(2, {
    message: "First name must be at least 2 characters.",
  }),
});

export function UsersReportForm() {
  const queryClient = useQueryClient();

  const {data:session} = useSession();

  const currentUserEmail = session?.user?.email ?? ""  

  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);

  const addUser = async (data: any) => {
    let url = "/users/new";
    return await axiosClient.post(url, data);
  };

  const mutation = useMutation({
    mutationKey: ["addUser"],
    mutationFn: (values: any) => addUser(values),
    onMutate: () => {
      setIsLoading(true);
    },
    onSuccess: () => {
      setIsLoading(false);
      toast({
        variant: "success",
        title: "Success",
        description: "User created successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["listUsers"] });
      setIsLoading(false);
      router.push("/users");
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
      reciepient: [currentUserEmail],
      role: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    mutation.mutate(values);
  }

  const [date, setDate] = React.useState<DateRange | undefined>({
    from: new Date(),
    to: addDays(new Date(), 30),
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
        <FormItem className="flex flex-col gap-1">
          <FormLabel>Select Period</FormLabel>
          <Popover>
            <PopoverTrigger asChild>
              <Button id="date" variant={"outline"}>
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date?.from ? (
                  date.to ? (
                    <>
                      {format(date.from, "LLL dd, y")} -{" "}
                      {format(date.to, "LLL dd, y")}
                    </>
                  ) : (
                    format(date.from, "LLL dd, y")
                  )
                ) : (
                  <span>Pick a date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={date?.from}
                selected={date}
                onSelect={setDate}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>
          <FormMessage />
        </FormItem>
        <FormField
          control={form.control}
          name="reciepient"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Send To</FormLabel>
              <FormControl>
                <Input
                  placeholder="email@gmail.com"
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
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select the users role" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value={AppEnums.RoleSuperAdmin}>Super Administrators</SelectItem>
                      <SelectItem value={AppEnums.RoleAdmin}>Administrators</SelectItem>
                      <SelectItem value={AppEnums.RoleAgent}>Agents</SelectItem>
                      <SelectItem value={AppEnums.RoleClient}>Tenants</SelectItem>
                    </SelectContent>
                  </Select>
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
