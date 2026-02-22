"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle2, MoreHorizontal, FileText, Ban } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";

export type Tenant = {
  id: string;
  email: string | null;
  phone: string | null;
  is_active: boolean;
  onboarding_done: boolean;
  apartment: {
    id: string;
    unit_name: string;
    unit_number: string;
    type: string;
  };
  created_at: string;
};

export const columns: ColumnDef<Tenant>[] = [
  {
    accessorKey: "email",
    header: "Tenant Email",
    cell: ({ row }) => <div className="font-medium text-white">{row.getValue("email") || "—"}</div>,
  },
  {
    accessorKey: "phone",
    header: "Phone",
    cell: ({ row }) => <div className="text-slate-300">{row.getValue("phone") || "—"}</div>,
  },
  {
    accessorKey: "apartment.unit_name",
    header: "Assigned Unit",
    cell: ({ row }) => {
      const apt = row.original.apartment;
      if (!apt) return <span className="text-slate-500">None</span>;
      return (
        <div>
          <span className="font-medium text-blue-400">{apt.unit_name}</span>
          <br/>
          <span className="text-xs text-slate-500">Unit {apt.unit_number}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "is_active",
    header: "Status",
    cell: ({ row }) => {
      const isActive = row.getValue("is_active") as boolean;
      return isActive ? (
        <Badge className="bg-green-500/10 text-green-500 border-green-500/20 px-3 py-1">Active</Badge>
      ) : (
        <Badge className="bg-red-500/10 text-red-500 border-red-500/20 px-3 py-1">Inactive</Badge>
      );
    },
  },
  {
    accessorKey: "onboarding_done",
    header: "Onboarding",
    cell: ({ row }) => {
      const isDone = row.getValue("onboarding_done") as boolean;
      return (
        <div className="flex items-center gap-2">
          {isDone ? (
            <span className="flex items-center text-sm font-medium text-slate-300">
               <CheckCircle2 className="mr-1 h-4 w-4 text-green-500" /> Complete
            </span>
          ) : (
            <span className="flex items-center text-sm font-medium text-slate-500">
               <span className="w-2 h-2 rounded-full bg-amber-500 mr-2" /> Pending
            </span>
          )}
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const tenant = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-slate-900 border-slate-800 text-slate-300 rounded-xl">
            <DropdownMenuLabel className="text-slate-400">Actions</DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-slate-800" />
            <Link href={`/admin/tenants/${tenant.id}`}>
              <DropdownMenuItem className="cursor-pointer focus:bg-slate-800 focus:text-white">
                <FileText className="mr-2 h-4 w-4" />
                View Profile
              </DropdownMenuItem>
            </Link>
            <DropdownMenuSeparator className="bg-slate-800" />
            <DropdownMenuItem className="cursor-pointer text-red-400 focus:bg-red-500/10 focus:text-red-400">
              <Ban className="mr-2 h-4 w-4" />
              {tenant.is_active ? "Deactivate" : "Activate"}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
