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

import AppTable from "@/components/shared/AppTable";
import UseMoment from "@/components/shared/use-moment";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { IPagination } from "@/interfaces/pagination.interface";
import { IUser } from "@/interfaces/user.interface";
import axiosClient from "@/lib/axios-client";
import { useQuery } from "@tanstack/react-query";
import { ArrowUpDown } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { IoCloudDownloadOutline, IoPersonAddSharp } from "react-icons/io5";
import { toast } from "sonner";
import AgentsTable from "./ApartmentsTable";
import ApartmentsTable from "./ApartmentsTable";

export default function ListApartments() {
  const router = useRouter();

  const [data, setData] = useState<IUser[]>([]);
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

  const [searchItem, setSearchItem] = useState<string>("");

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const { data: resp, isLoading } = useQuery({
    queryKey: ["listApartments"],
    queryFn: () => fetchApartments(payload),
  });

  const initiateSearch = (e: React.FormEvent) => {
    e.preventDefault();
  };

  useEffect(() => {
    if (resp) {
      const response = resp.data.data;
      if (response.Status === 200) {
        setData(response.Payload);
      } else {
        toast.warning(response.Payload);
      }
    }
  });

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
      <div className="flex flex-col md:flex-row md:justify-between items-center">
        <Input placeholder="Search user..." className="max-w-sm" />
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            className="ml-auto"
            onClick={() => router.push("users/add-user")}
          >
            Add Apartment(s) <IoPersonAddSharp className="ml-2 h-4 w-4" />
          </Button>
          <Button variant="outline" className="ml-auto">
            Download Report <IoCloudDownloadOutline className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="rounded-md border">
        <ApartmentsTable
          data={data}
          columns={columns}
          rowNavigation={(row) => `/apartments/${row._id}`}
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

const getTrueRoles = (userRoles: any[]): string[] => {
  const trueRoles = userRoles
    .filter((role) => Object.values(role)[0] === true)
    .map((role) => Object.keys(role)[0]);

  return trueRoles;
};

const fetchApartments = async (data: any) => {
  let url = "/apartments";
  return await axiosClient.post(url, data);
};

export const columns: ColumnDef<IUser>[] = [
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
            <Badge key={index} variant="default">
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
        <Badge variant={user.active ? "default" : "destructive"}>
          {user.active ? "Active" : "Deactivated"}
        </Badge>
      );
    },
  },
];
