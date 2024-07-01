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
    message: "Apartment name must be at least 2 characters.",
  }),
  caretaker_name: z.string().min(2, {
    message: "Caretaker's name must be at least 2 characters.",
  }),
  caretaker_phone: z.string().refine(
    (value) => {
      return /^\+\d{1,3}\d{6,14}$/.test(value);
    },
    {
      message:
        "Invalid phone number format. Must start with '+<country code>' followed by the number.",
    }
  ),
  location: z.string().min(2, {
    message: "Last name must be at least 2 characters.",
  }),
  garbage_charge: z.coerce.number(),
  service_charge: z.coerce.number(),
  water_cost_unit: z.coerce.number(),
});

export function ApartmentBasicDetailsForm() {
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
      caretaker_name: "",
      location: "",
      garbage_charge: 0,
      service_charge: 0,
      water_cost_unit: 0,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log({ values });

    // mutation.mutate(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid lg:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Apartment Name</FormLabel>
                <FormControl>
                  <Input placeholder="Name of apartment" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="caretaker_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Name of caretaker" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="caretaker_phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Caretaker&apos;s Phone Number</FormLabel>
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
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Location</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Apartment's Location"
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
            name="garbage_charge"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Garbage Charge</FormLabel>
                <FormControl>
                  <Input className="input-field" {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="service_charge"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Service Charge</FormLabel>
                <FormControl>
                  <Input className="input-field" {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="water_cost_unit"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Water Cost Per Unit</FormLabel>
                <FormControl>
                  <Input className="input-field" {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button type="submit" size={"lg"}>
          {isLoading ? "Loading..." : "Next"}
        </Button>
      </form>
    </Form>
  );
}

const addApartment = async (data: any) => {
  let url = "/apartments/new";
  return await axiosClient.post(url, data);
};
