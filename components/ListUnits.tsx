"use client";

import { DotsHorizontalIcon } from "@radix-ui/react-icons";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { IoCloudDownloadOutline } from "react-icons/io5";
import { IUnit } from "@/interfaces/unit.interface";
import allUnits from "@/data/units";

const data: IUnit[] = allUnits;

export const columns: ColumnDef<IUnit>[] = [
  {
    accessorKey: "date",
    header: () => <div className="text-left">Date</div>,
    cell: ({ row }) => {
      const unit = row.original;
      return (
        <div className="flex flex-col gap-2">
          <div>
            <span className="font-medium text-sm">Created On:</span>{" "}
            <span className="text-xs">
              <UseMoment format="DATE" timestamp={unit?._timestamp} />
            </span>
          </div>
          <div>
            <span className="font-medium text-sm">Updated On:</span>{" "}
            <span className="text-xs">
              <UseMoment
                format="DATE"
                timestamp={unit?._utimestamp ?? unit?._timestamp}
              />
            </span>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "tenant",
    header: "Tenant",
    cell: ({ row }) => {
      const unit = row.original;
      return (
        <span className="text-xs capitalize">
          {unit.occupant.firstName} {unit.occupant.lastName}
        </span>
      );
    },
  },
  {
    accessorKey: "occupants",
    header: "Total Occupants",
    cell: ({ row }) => {
      const unit = row.original;
      return <div className="capitalize">{unit.totalOccupants}</div>;
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const unit = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <DotsHorizontalIcon className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <Link href={`/units/${unit._id}`}>
              <DropdownMenuItem>View unit details</DropdownMenuItem>
            </Link>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export default function ListUnits() {
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
      <div className="text-lg font-bold">Units</div>
      <div className="flex items-center">
        <Input placeholder="Search unit..." className="max-w-sm" />
        <Button variant="outline" className="ml-auto">
          Download Report <IoCloudDownloadOutline className="ml-2 h-4 w-4" />
        </Button>
      </div>
      <div className="rounded-md border">
        <AppTable
          data={data}
          columns={columns}
          rowNavigation={(row) => `/apartments/units/${row._id}`}
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
