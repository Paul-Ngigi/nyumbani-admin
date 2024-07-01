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
import axiosClient from "@/lib/axios-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { IoAddOutline } from "react-icons/io5";
import { MdDelete } from "react-icons/md";
import { toast } from "sonner";
import AppTable from "../shared/AppTable";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Textarea } from "../ui/textarea";

const formSchema = z.object({
  unit: z.string().min(1, {
    message: "House number is required",
  }),
  type: z.string().min(1, {
    message: "House type is required.",
  }),
  rent: z.coerce.number(),
  description: z.string(),
});

interface House {
  unit: string;
  type: string;
  rent: number;
  description?: string;
}

export function ApartmentHouseForm() {
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
      unit: "",
      type: "",
      rent: 0,
      description: "",
    },
  });

  function onAdd(values: any) {
    console.log({ values });

    // mutation.mutate(values);
  }

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);

    // mutation.mutate(values);
  }

  function handleDelete(index: number) {
    // setPaymentDetails((prevDetails) =>
    //   prevDetails.filter((_, i) => i !== index)
    // );
  }

  const addApartment = async (data: any) => {
    let url = "/apartments/new";
    return await axiosClient.post(url, data);
  };

  const columns: ColumnDef<House>[] = [
    {
      accessorKey: "unit",
      header: "House Number",
      cell: ({ row }) => {
        const house = row.original;
        return <div>{house.unit}</div>;
      },
    },
    {
      accessorKey: "type",
      header: "Type",
      cell: ({ row }) => {
        const house = row.original;
        return <div>{house.type}</div>;
      },
    },
    {
      accessorKey: "description",
      header: "Description",
      cell: ({ row }) => {
        const house = row.original;
        return <div>{house.description}</div>;
      },
    },
    {
      accessorKey: "rent",
      header: "Rent Amount",
      cell: ({ row }) => {
        const house = row.original;
        return <div>{house.rent}</div>;
      },
    },
    {
      accessorKey: "actions",
      header: "",
      cell: ({ row }) => {
        const house = row.original;
        return (
          <Button
            onClick={() => handleDelete(row.index)}
            className="w-16"
            variant={"destructive"}
          >
            <MdDelete />
          </Button>
        );
      },
    },
  ];

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 items-center gap-4">
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select the type of the house" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="studio">Studio</SelectItem>
                      <SelectItem value="bedsitter">Bedsitter</SelectItem>
                      <SelectItem value="one_bedroom">One Bedroom</SelectItem>
                      <SelectItem value="two_bedroom">Two Bedroom</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="unit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>House Number(s)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Separate using comas"
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
              name="rent"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rent Amount</FormLabel>
                  <FormControl>
                    <Input className="input-field" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="More details about the house(s)"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex flex-col gap-4">
              <FormLabel>Add</FormLabel>
              <Button
                className="w-16"
                variant={"default"}
                onClick={form.handleSubmit(onAdd)}
              >
                <IoAddOutline />
              </Button>
            </div>
          </div>

          <Button type="submit" size={"lg"}>
            {isLoading ? "Loading..." : "Submit"}
          </Button>
        </form>
      </Form>

      {/* <AppTable data={paymentDetails} columns={columns} /> */}
    </>
  );
}
