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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { allTenants } from "@/data/tenants";
import { IUser } from "@/interfaces/user.interface";
import { IoCloudDownloadOutline } from "react-icons/io5";

const data: IUser[] = allTenants;

export const columns: ColumnDef<IUser>[] = [
  {
    accessorKey: "date",
    header: () => <div className="text-left">Date</div>,
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
                timestamp={user?._utimestamp ?? user?._timestamp}
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
              <span className="font-medium text-sm">Name:</span>{" "}
              <span className="text-xs capitalize">
                {user?.firstName} {user?.lastName}
              </span>
            </div>
            <div>
              <span className="font-medium text-sm">Phone:</span>{" "}
              <span className="text-xs capitalize">{user.phoneNumber}</span>
            </div>
            <div>
              <span className="font-medium text-sm">Address:</span>{" "}
              <span className="text-xs capitalize">{user.physicalAddress}</span>
            </div>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "gender",
    header: "Gender",
    cell: ({ row }) => {
      const user = row.original;
      return <div className="capitalize">{user.gender}</div>;
    },
  },
  {
    accessorKey: "houseNumber",
    header: "House Number",
    cell: ({ row }) => {
      const user = row.original;
      return <div className="capitalize">{user.unitNumber}</div>;
    },
  },
];

export default function ListTenants() {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

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
    <div className="w-full flex flex-col gap-4">
      <div className="text-lg font-bold">Tenants</div>
      <div className="flex items-center">
        <Input placeholder="Search tenant..." className="max-w-sm" />
        <Button variant="outline" className="ml-auto">
          Download Report <IoCloudDownloadOutline className="ml-2 h-4 w-4" />
        </Button>
      </div>
      <div className="rounded-md border">
        <AppTable
          data={data}
          columns={columns}
          rowNavigation={(row) => `/apartments/tenants/${row._id}`}
        />
      </div>
      <div className="flex items-center justify-end space-x-2">
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
    </div>
  );
}
