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

import { listUsers } from "@/actions/UsersActions";
import AppTable from "@/components/shared/AppTable";
import UseMoment from "@/components/shared/use-moment";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { baseUrl } from "@/constants/urls";
import { useAuthContext } from "@/context/auth-context/auth";
import { IPagination } from "@/interfaces/pagination.interface";
import { IUser } from "@/interfaces/user.interface";
import axiosClient from "@/lib/axios-client";
import { useMutation } from "@tanstack/react-query";
import { ArrowUpDown } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { IoCloudDownloadOutline, IoPersonAddSharp } from "react-icons/io5";
import { processHttpErrors } from "@/actions/ProcessHttpErrors";
import Search from "../shared/Search";
import { toast } from "../ui/use-toast";
import { signOut } from "next-auth/react";
import { IApartment } from "@/interfaces/apartment.interface";
import PaginationComponent from "../shared/Pagination";

/* eslint-disable react-hooks/exhaustive-deps */

export default function ListRepairs({ _id }: { _id?: string }) {
  const router = useRouter();

  const { logOut } = useAuthContext();

  const [data, setData] = useState<IApartment[]>([]); // Apartments data

  const [isLoading, setIsLoading] = useState<boolean>(false); // Loader state

  const [pagination, setPagination] = useState<IPagination>({
    limit: 4,
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

  const fetchApartments = async (data: any) => {
    let url = "/apartments";
    return await axiosClient.post(url, data);
  };

  const [searchParams, setSearchParams] = useState<any>({
    url: `${baseUrl}/listapartments`,
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
    mutationKey: ["listApartments"],
    mutationFn: (values) => fetchApartments(values),
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
    if (_id) {
      setPayload({ ...payload, ...{ _id } });
    }

    mutation.mutate(payload);
  }, []);

  useEffect(() => {
    if (_id) {
      setPayload({ ...payload, ...{ _id } });
    }

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
    <div className="flex flex-col gap-3">
      <div className="flex justify-between items-center">
        <Search
          searchParams={searchParams}
          onSearchResults={handleSearchResults}
          onInputEmpty={handleInputEmpty}
        />
        <div className="flex items-center gap-3">
          <Button variant="outline" className="ml-auto">
            Download Report <IoCloudDownloadOutline className="ml-2 h-4 w-4" />
          </Button>
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
    </div>
  );
}

const getTrueRoles = (userRoles: any[]): string[] => {
  const trueRoles = userRoles
    .filter((role) => Object.values(role)[0] === true)
    .map((role) => Object.keys(role)[0]);

  return trueRoles;
};

const columns: ColumnDef<IApartment>[] = [
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
                {/* {user?.firstName ?? ""} {user?.lastName ?? ""} */}
              </span>
            </div>
            <div>
              <span className="font-medium text-sm">Email:</span>{" "}
              {/* <span className="text-xs">{user?.email ?? "N/A"}</span> */}
            </div>
            <div>
              <span className="font-medium text-sm">Phone Number:</span>{" "}
              {/* <span className="text-xs">{user?.telephone1 ?? "N/A"}</span> */}
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
      // const user = row.original;
      // const roles: string[] = getTrueRoles(user.roles);
      return (
        <div className="flex gap-2 items-center">
          {/* {roles.map((role, index) => (
            <Badge key={index} variant="outline">
              {role}
            </Badge>
          ))} */}
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
        <></>
        // <Badge variant={user.active ? "outline" : "destructive"}>
        //   {user.active ? "Active" : "Deactived"}
        // </Badge>
      );
    },
  },
];
