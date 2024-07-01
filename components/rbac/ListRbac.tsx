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
import { Badge } from "@/components/ui/badge";
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
import { IRbac } from "@/interfaces/rbac.interface";
import axiosClient from "@/lib/axios-client";
import { useMutation } from "@tanstack/react-query";
import { signOut } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";
import { MdAssignmentAdd } from "react-icons/md";
import PaginationComponent from "../shared/Pagination";
import Search from "../shared/Search";
import { Button } from "../ui/button";
import { toast } from "../ui/use-toast";
import { AssignRbacForm } from "./AssignRbacForm";

/* eslint-disable react-hooks/exhaustive-deps */

export default function ListRbacs() {
  const columns: ColumnDef<IRbac>[] = [
    {
      accessorKey: "task",
      header: "Task",
      cell: ({ row }) => {
        const task = row.original;
        return <div className="flex">{task.task}</div>;
      },
    },
    {
      accessorKey: "organisation",
      header: "Organisation ID",
      cell: ({ row }) => {
        const task = row.original;
        return <div className="flex">{task.organisationId}</div>;
      },
    },
    {
      accessorKey: "roles",
      header: "Roles",
      cell: ({ row }) => {
        const task = row.original;
        return (
          <div className="flex gap-2 items-center">
            {task.roles.map((role, index) => (
              <Badge key={index} variant={"outline"}>
                {role}
              </Badge>
            ))}
          </div>
        );
      },
    },
    {
      accessorKey: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const task = row.original;
        return (
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">
                Assign
                <MdAssignmentAdd className="ml-2 h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Assign Permissions</DialogTitle>
                <DialogDescription>
                  Assign task permissions to roles
                </DialogDescription>
              </DialogHeader>
              <AssignRbacForm />
            </DialogContent>
          </Dialog>
        );
      },
    },
  ];

  const [data, setData] = useState<IRbac[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [pagination, setPagination] = useState<IPagination>({
    limit: 10,
    skip: 0,
    sort: {
      _timestamp: -1,
    },
  });
  const [fields, setFields] = useState<string[]>([
    "_id",
    "task",
    "organisationId",
    "roles",
  ]);

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

  const fetchRbac = async (data: any) => {
    let url = "/rbac";
    return await axiosClient.post(url, data);
  };

  const [searchParams, setSearchParams] = useState<any>({
    url: `${baseUrl}/adminlistrbactasks`,
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
    mutationKey: ["listRbac"],
    mutationFn: (values) => fetchRbac(values),
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
      </div>

      <div className="rounded-md border">
        <AppTable
          data={data}
          columns={columns}          
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
