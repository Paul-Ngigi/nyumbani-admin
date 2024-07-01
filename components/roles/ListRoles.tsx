"use client";

import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import * as React from "react";

import { processHttpErrors } from "@/actions/ProcessHttpErrors";
import AppTable from "@/components/shared/AppTable";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { baseUrl } from "@/constants/urls";
import { IPagination } from "@/interfaces/pagination.interface";
import { IRbacRole } from "@/interfaces/roles.interface";
import axiosClient from "@/lib/axios-client";
import { useMutation } from "@tanstack/react-query";
import { signOut } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";
import { IoIosAddCircle } from "react-icons/io";
import { MdDelete } from "react-icons/md";
import PaginationComponent from "../shared/Pagination";
import Search from "../shared/Search";
import { Button } from "../ui/button";
import { toast } from "../ui/use-toast";
import { AddRoleForm } from "./AddRoleForm";

/* eslint-disable react-hooks/exhaustive-deps */

export default function ListRoles() {
  const columns: ColumnDef<IRbacRole>[] = [
    {
      accessorKey: "role",
      header: "Role",
      cell: ({ row }) => {
        const role = row.original;
        return <div className="flex">{role.role}</div>;
      },
    },
    {
      accessorKey: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const role = row.original;
        return (
          <Button
            variant={"destructive"}
            onClick={() => handleDelete(role._id)}
          >
            <MdDelete />
          </Button>
        );
      },
    },
  ];

  const [data, setData] = useState<IRbacRole[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [pagination, setPagination] = useState<IPagination>({
    limit: 10,
    skip: 0,
    sort: {
      _timestamp: -1,
    },
  });
  const [fields, setFields] = useState<string[]>(["_id", "role"]);

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

  const fetchRoles = async (data: any) => {
    let url = "/roles";
    return await axiosClient.post(url, data);
  };

  const [searchParams, setSearchParams] = useState<any>({
    url: `${baseUrl}/listroles`,
    searchFields: ["_id", "task"],
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
    mutationKey: ["listRoles"],
    mutationFn: (values) => fetchRoles(values),
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

  const handlePageChange = (newSkip: number) => {
    setPagination((prevPagination) => ({
      ...prevPagination,
      skip: newSkip,
    }));
  };

  const handleDelete = (_id: string) => {};

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
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
    <div className="flex flex-col gap-3">
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
                Add Role <IoIosAddCircle className="ml-2 h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Add Role</DialogTitle>
                <DialogDescription>Add a new role</DialogDescription>
              </DialogHeader>
              <AddRoleForm />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="rounded-md border">
        <AppTable
          data={data}
          columns={columns}
          rowNavigation={(row) => `/rbac/${row._id}`}
          isLoading={isLoading}
        />
      </div>

      <div className="flex items-center justify-center">
        <PaginationComponent
          skip={pagination.skip}
          limit={pagination.limit}
          dataLoading={isLoading}
          dataLength={data.length}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
}
