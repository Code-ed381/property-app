"use client";

import React, { useState } from "react";
import {
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronLeft, ChevronRight, SlidersHorizontal, Search } from "lucide-react";
import { columns, Tenant } from "./tenant-columns";

interface TenantTableProps {
  data: Tenant[];
}

export function TenantTable({ data }: TenantTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

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
    <div className="w-full space-y-4">
      <div className="flex flex-col md:flex-row items-center gap-4 justify-between">
        <div className="relative w-full md:max-w-sm group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 group-focus-within:text-blue-500 transition-colors" />
          <Input
            placeholder="Search email..."
            value={(table.getColumn("email")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("email")?.setFilterValue(event.target.value)
            }
            className="pl-10 bg-slate-900/50 border-slate-800 text-slate-300 placeholder:text-slate-600 focus-visible:ring-blue-500/10 focus-visible:border-blue-500 transition-all rounded-xl"
          />
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto border-slate-800 bg-slate-900/50 hover:bg-slate-900 text-slate-300 transition-all rounded-xl">
                <SlidersHorizontal className="mr-2 h-4 w-4" /> Columns
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-slate-900 border-slate-800 text-slate-300">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize focus:bg-slate-800 focus:text-white"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                         column.toggleVisibility(!!value)
                      }
                    >
                      {column.id.replace("_", " ")}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-800/50 bg-slate-950/40 backdrop-blur-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-900/50">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="border-slate-800 hover:bg-transparent">
                {headerGroup.headers.map((header) => {
                   return (
                     <TableHead key={header.id} className="text-slate-400 font-bold text-xs uppercase tracking-widest py-4 bg-transparent border-0 first:pl-6 last:pr-6">
                       {header.isPlaceholder
                         ? null
                         : flexRender(
                             header.column.columnDef.header,
                             header.getContext()
                           )}
                     </TableHead>
                   );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="border-slate-800/50 hover:bg-slate-800/30 transition-colors first:border-0"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="py-4 first:pl-6 last:pr-6">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
               <TableRow>
                 <TableCell
                   colSpan={columns.length}
                   className="h-32 text-center text-slate-500 font-medium"
                 >
                   No tenants found.
                 </TableCell>
               </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between px-2">
        <div className="text-xs text-slate-500 font-medium">
          Showing {table.getFilteredRowModel().rows.length} tenants
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="border-slate-800 bg-slate-900/50 hover:bg-slate-900 text-slate-400 disabled:opacity-30 rounded-lg h-9 w-9 p-0"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-1">
             <span className="text-xs font-bold text-slate-300 bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700/50">
               {table.getState().pagination.pageIndex + 1}
             </span>
          </div>
          <Button
             variant="outline"
             size="sm"
             onClick={() => table.nextPage()}
             disabled={!table.getCanNextPage()}
             className="border-slate-800 bg-slate-900/50 hover:bg-slate-900 text-slate-400 disabled:opacity-30 rounded-lg h-9 w-9 p-0"
          >
             <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
