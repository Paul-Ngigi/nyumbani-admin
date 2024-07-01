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
import { useEffect, useState } from "react";
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

const baseSchema = z.object({
  purpose: z.string().min(1, {
    message: "Purpose for payment is required.",
  }),
  method: z.string().min(1, {
    message: "Method of payment is required",
  }),
  accountNo: z
    .string()
    .min(1, {
      message: "Account number is required",
    })
    .min(4, {
      message: "Invalid account number",
    }),
});

const bankSchema = baseSchema.extend({
  bank_name: z.string().min(1, {
    message: "Bank name is required.",
  }),
});

interface PaymentDetail {
  purpose: string;
  method: string;
  bank_name?: string;
  accountNo: string;
}

export function ApartmentPaymentDetailsForm() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetail[]>([]);

  const mutation = useMutation({
    mutationKey: ["addApartment"],
    mutationFn: (values) => addApartment(values),
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

  const form = useForm({
    resolver: zodResolver(paymentMethod === "bank" ? bankSchema : baseSchema),
    defaultValues: {
      purpose: "",
      bank_name: "",
      method: "",
      accountNo: "",
    },
  });

  const { watch, setValue, reset } = form;

  useEffect(() => {
    const subscription = watch((value: any) => {
      if (value.method !== paymentMethod) {
        setPaymentMethod(value.method);
        if (value.method !== "bank") {
          setValue("bank_name", "");  
        }
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, setValue, paymentMethod]);


  function onAdd(values: PaymentDetail) {
    setPaymentDetails((prevDetails) => [...prevDetails, values]);
    reset({
      purpose: "",
      bank_name: "",
      method: "",
      accountNo: "",
    });
  }

  function onSubmit(values: any) {
    mutation.mutate(values);
  }

  function handleDelete(index: number) {
    setPaymentDetails((prevDetails) =>
      prevDetails.filter((_, i) => i !== index)
    );
  }

  const addApartment = async (data: any) => {
    let url = "/apartments/new";
    return await axiosClient.post(url, data);
  };

  const columns: ColumnDef<PaymentDetail>[] = [
    {
      accessorKey: "purpose",
      header: "Purpose",
      cell: ({ row }) => {
        const detail = row.original;
        return <div>{detail.purpose}</div>;
      },
    },
    {
      accessorKey: "method",
      header: "Method",
      cell: ({ row }) => {
        const detail = row.original;
        return <div>{detail.method}</div>;
      },
    },
    {
      accessorKey: "bank_name",
      header: "Bank Name",
      cell: ({ row }) => {
        const detail = row.original;
        return <div>{detail.bank_name}</div>;
      },
    },
    {
      accessorKey: "accountNo",
      header: "Account Number",
      cell: ({ row }) => {
        const detail = row.original;
        return <div>{detail.accountNo}</div>;
      },
    },
    {
      accessorKey: "actions",
      header: "",
      cell: ({ row }) => {
        const detail = row.original;
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
          <div className="grid md:grid-cols-2 lg:grid-cols-5 items-center gap-2">
            <FormField
              control={form.control}
              name="purpose"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Purpose</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select the purpose intended" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="rent">Rent</SelectItem>
                      <SelectItem value="water">Water</SelectItem>
                      <SelectItem value="electricity">Electricity</SelectItem>
                      <SelectItem value="garbage">Garbage</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="method"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Payment Method</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a payment method" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="bank">Bank</SelectItem>
                      <SelectItem value="mpesa">M-Pesa</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            {paymentMethod === "bank" && (
              <FormField
                control={form.control}
                name="bank_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bank Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Name of the bank"
                        className="input-field"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            <FormField
              control={form.control}
              name="accountNo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Account Number</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Account Number"
                      className="input-field"
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

      <AppTable data={paymentDetails} columns={columns} />
    </>
  );
}
