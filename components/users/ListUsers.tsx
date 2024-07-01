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

import { currentUserOrganisationID, currentUserRoles, isAdmin, isAgent, isClient, isSuperAdmin } from "@/actions/AppService";
import { processHttpErrors } from "@/actions/ProcessHttpErrors";
import AppTable from "@/components/shared/AppTable";
import UseMoment from "@/components/shared/use-moment";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { baseUrl } from "@/constants/urls";
import { ApiResponse } from "@/interfaces/api.response.interface";
import { IPagination } from "@/interfaces/pagination.interface";
import { IUser } from "@/interfaces/user.interface";
import axiosClient from "@/lib/axios-client";
import { useMutation } from "@tanstack/react-query";
import { ArrowUpDown } from "lucide-react";
import { signOut } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";
import { IoCloudDownloadOutline, IoPersonAddSharp } from "react-icons/io5";
import PaginationComponent from "../shared/Pagination";
import Search from "../shared/Search";
import { toast } from "../ui/use-toast";
import { AddUserForm } from "./AddUserForm";
import { UsersReportForm } from "./UsersReportForm";

/* eslint-disable react-hooks/exhaustive-deps */

export default function ListUsers() {
  const [data, setData] = useState<IUser[]>([]);
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
    "userName",
    "firstName",
    "lastName",
    "email",
    "phoneNumber",
    "_timestamp",
    "roles",
  ]);  

  const organisationID = currentUserOrganisationID();
  const rolesArray = currentUserRoles() || [];

  const superAdmin = isSuperAdmin(rolesArray);
  const admin = isAdmin(rolesArray);
  const agent = isAgent(rolesArray);
  const client = isClient(rolesArray);

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

  const fetchUsers = async (data: any) => {
    let url = "/users";
    return await axiosClient.post(url, data);
  };

  const [searchParams, setSearchParams] = useState<any>({
    url: `${baseUrl}/listusers`,
    searchFields: [
      "_id",
      "firstName",
      "lastName",
      "email",
      "phoneNumber",
      "idNumber",
      "kraPin",
      "_timestamp",
    ],
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
    mutationKey: ["listUsers"],
    mutationFn: (values) => fetchUsers(values),
    onMutate: () => {
      setIsLoading(true);
    },
    onSuccess: (data) => {
      setIsLoading(false);
      const res: ApiResponse = data.data.data;
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

  const updateFields = () => {
    if (superAdmin) {
      setPayload({
        fields: fields,
        pagination: pagination,
      });
    } else if (admin) {
      setPayload({
        fields: fields,
        pagination: pagination,
        organisationID: organisationID,
      });
    }
  };

  useEffect(() => {
    updateFields();
    mutation.mutate(payload);
  }, []);

  useEffect(() => {
    updateFields();
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
                Add User <IoPersonAddSharp className="ml-2 h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Add User</DialogTitle>
                <DialogDescription>Register a new user</DialogDescription>
              </DialogHeader>
              <AddUserForm />
            </DialogContent>
          </Dialog>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">
                Download Report{" "}
                <IoCloudDownloadOutline className="ml-2 h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Download report</DialogTitle>                
              </DialogHeader>
              <UsersReportForm />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="rounded-md border">
        <AppTable
          data={data}
          columns={columns}
          rowNavigation={(row) => `/users/${row._id}`}
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
    </>
  );
}
const getTrueRoles = (userRoles: any[]): string[] => {
  if (userRoles && userRoles.length > 0) {
    const trueRoles = userRoles
      .filter((role) => Object.values(role)[0] === true)
      .map((role) => Object.keys(role)[0]);

    return trueRoles;
  } else {
    return [];
  }
};

const columns: ColumnDef<IUser>[] = [
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
      const user = row.original;
      return (
        <div className="flex flex-col gap-2">
          <div>
            <span className="font-medium text-sm">Created On:</span>{" "}
            <span className="text-xs">
              <UseMoment format="DATE" timestamp={user?._timestamp} />
            </span>
          </div>
          <div>
            <span className="font-medium text-sm">Updated On:</span>{" "}
            <span className="text-xs">
              <UseMoment
                format="DATE"
                timestamp={user?._timestamp ?? user?._timestamp}
              />
            </span>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "userDetails",
    header: "User Details",
    cell: ({ row }) => {
      const user = row.original;
      return (
        <div className="flex">
          <div className="flex flex-col gap-2">
            <div>
              <span className="font-medium text-sm">Full Name:</span>{" "}
              <span className="text-xs capitalize">
                {user?.firstName ?? ""} {user?.lastName ?? ""}
              </span>
            </div>
            <div>
              <span className="font-medium text-sm">Email:</span>{" "}
              <span className="text-xs">{user?.email ?? "N/A"}</span>
            </div>
            <div>
              <span className="font-medium text-sm">Phone Number:</span>{" "}
              <span className="text-xs">{user?.telephone1 ?? "N/A"}</span>
            </div>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "roles",
    header: "Roles",
    cell: ({ row }) => {
      const user = row.original;
      const roles: string[] = getTrueRoles(user.roles);
      return (
        <div className="flex gap-2 items-center">
          {roles.map((role, index) => (
            <Badge key={index} variant="outline">
              {role}
            </Badge>
          ))}
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const user = row.original;
      return (
        <Badge variant={user.active ? "outline" : "destructive"}>
          {user.active ? "Active" : "Deactived"}
        </Badge>
      );
    },
  },
];
