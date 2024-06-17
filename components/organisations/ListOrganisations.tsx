"use client";

import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import * as React from "react";

import { processHttpErrors } from "@/actions/ProcessHttpErrors";
import AppTable from "@/components/shared/AppTable";
import UseMoment from "@/components/shared/use-moment";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { baseUrl } from "@/constants/urls";
import { useAuthContext } from "@/context/auth-context/auth";
import { IPagination } from "@/interfaces/pagination.interface";
import axiosClient from "@/lib/axios-client";
import { useMutation } from "@tanstack/react-query";
import { ArrowUpDown } from "lucide-react";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { IoIosAddCircleOutline } from "react-icons/io";
import { IoCloudDownloadOutline } from "react-icons/io5";
import Search from "../shared/Search";
import { toast } from "../ui/use-toast";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { IOrganisation } from "@/interfaces/organisation.interface";
import { AddOrganisationsForm } from "./AddOrganisationsForm";

export default function ListOrganisations() {
  const router = useRouter();

  const { logOut } = useAuthContext();

  const [data, setData] = useState<IOrganisation[]>([]); // Organisations data

  const [isLoading, setIsLoading] = useState<boolean>(false); // Loader state

  const [pagination, setPagination] = useState<IPagination>({
    limit: 10,
    skip: 0,
    sort: {
      _timestamp: -1,
    },
  });

  const [fields, setFields] = useState<string[]>([]);

  const [payload, setPayload] = useState<any>({
    fields: fields,
    pagination: pagination,
  });

  // Search
  const handleSearchResults = (results: any[]) => {
    setData(results);
  };

  const handleInputEmpty = useCallback(
    (isEmpty: boolean) => {
      if (isEmpty) {
        mutation.mutate(payload);
      }
    },
    [payload]
  );

  const fetchOrganisations = async (data: any) => {
    let url = "/organisations";
    return await axiosClient.post(url, data);
  };

  const [searchParams, setSearchParams] = useState<any>({
    url: `${baseUrl}/listorganisations`,
    searchFields: ["_id"],
    customQuery: {
      fields: fields,
      pagination: pagination,
    },
  });

  const [sorting, setSorting] = React.useState<SortingState>([]);

  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );

  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});

  const [rowSelection, setRowSelection] = useState({});

  const mutation: any = useMutation({
    mutationKey: ["listOrganisations"],
    mutationFn: (values) => fetchOrganisations(values),
    onMutate: () => {
      setIsLoading(true);
    },
    onSuccess: (data) => {
      setIsLoading(false);
      const res = data.data.data;
      if (res.Status === 200) {
        setData(res.Payload);
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
    onError: (err: any) => {
      setIsLoading(false);
      toast({
        variant: "destructive",
        title: "Ooops! Something went wrong",
        description: processHttpErrors(err),
      });
    },
  });

  useEffect(() => {
    mutation.mutate(payload);
  }, []);

  useEffect(() => {
    mutation.mutate(payload);
  }, [pagination]);

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <>
      <div className="flex justify-between items-center">
        <Search
          searchParams={searchParams}
          onSearchResults={handleSearchResults}
          onInputEmpty={handleInputEmpty}
        />
        <div className="flex items-center gap-3">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">
                Add Organisation{" "}
                <IoIosAddCircleOutline className="ml-2 h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Add Organisation</DialogTitle>
                <DialogDescription>
                  Register a new organisation
                </DialogDescription>
              </DialogHeader>
              <AddOrganisationsForm />
            </DialogContent>
          </Dialog>
          <Button variant="outline" className="ml-auto">
            Download Report <IoCloudDownloadOutline className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="rounded-md border">
        <AppTable
          data={data}
          columns={columns}
          rowNavigation={(row) => `/organisations/${row._id}`}
          isLoading={isLoading}
        />
      </div>

      <div className="flex items-center justify-center space-x-2">
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </>
  );
}

const columns: ColumnDef<IOrganisation>[] = [
  {
    accessorKey: "date",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const organisation = row.original;
      return (
        <div className="flex flex-col gap-2">
          <div>
            <span className="font-medium text-sm">Created On:</span>{" "}
            <span className="text-xs">
              <UseMoment format="DATE" timestamp={organisation._timestamp} />
            </span>
          </div>
          <div>
            <span className="font-medium text-sm">Updated On:</span>{" "}
            <span className="text-xs">
              <UseMoment
                format="DATE"
                timestamp={organisation?._timestamp ?? organisation?._timestamp}
              />
            </span>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "founderDetails",
    header: "Founder Details",
    cell: ({ row }) => {
      const organisation = row.original;
      return (
        <div className="flex">
          <div className="flex flex-col gap-2">
            <div>
              <span className="font-medium text-sm">Full Name:</span>{" "}
              <span className="text-xs capitalize">
                {organisation?.founder?.firstName ?? ""}{" "}
                {organisation?.founder?.lastName ?? ""}
              </span>
            </div>
            <div>
              <span className="font-medium text-sm">Email:</span>{" "}
              <span className="text-xs">
                {organisation?.founder?.email ?? "N/A"}
              </span>
            </div>
            <div>
              <span className="font-medium text-sm">Phone Number:</span>{" "}
              <span className="text-xs">
                {organisation?.founder?.telephone1 ?? "N/A"}
              </span>
            </div>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "boardNo",
    header: "Board Number",
    cell: ({ row }) => {
      const organisation = row.original;

      return <div className="">{organisation.board_no}</div>;
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const organisation = row.original;
      return (
        <Badge variant={organisation.isActive ? "outline" : "destructive"}>
          {organisation.isActive ? "Active" : "Deactived"}
        </Badge>
      );
    },
  },
];
