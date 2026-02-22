"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, FileText, CheckCircle2, Send, Clock, Edit } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { format } from "date-fns";

export type Agreement = {
  id: string;
  status: "DRAFT" | "PENDING_SIGNATURE" | "SIGNED" | "EXPIRED";
  lease_start: string;
  lease_end: string;
  monthly_rent: number;
  tenant: {
    id: string;
    email: string | null;
    apartment: {
      id: string;
      unit_name: string;
      room_number: string;
    } | null;
  } | null;
};

export const columns: ColumnDef<Agreement>[] = [
  {
    accessorKey: "tenant.email",
    header: "Tenant Email",
    cell: ({ row }) => <div className="font-medium text-white">{row.original.tenant?.email || "Unknown"}</div>,
  },
  {
    accessorKey: "tenant.apartment.unit_name",
    header: "Assigned Unit",
    cell: ({ row }) => {
      const apartment = row.original.tenant?.apartment;
      if (!apartment) return <span className="text-slate-500">None</span>;
      return (
        <div>
          <span className="font-medium text-blue-400">{apartment.unit_name}</span>
          <br/>
          <span className="text-xs text-slate-500">{apartment.room_number}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "lease_start",
    header: "Lease Period",
    cell: ({ row }) => {
      const start = row.getValue("lease_start") as string;
      const end = row.original.lease_end;
      if (!start || !end) return <span className="text-slate-500">Not set</span>;
      return (
        <div className="text-sm">
           <span className="text-slate-300">{format(new Date(start), "MMM yyyy")}</span>
           <span className="text-slate-500 mx-1">→</span>
           <span className="text-slate-300">{format(new Date(end), "MMM yyyy")}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "monthly_rent",
    header: "Rent Amount",
    cell: ({ row }) => {
      const val = row.getValue("monthly_rent") as number;
      if (!val) return <span className="text-slate-500">N/A</span>;
      return <div className="font-semibold text-emerald-400 tracking-wide">GH₵ {val.toLocaleString()}</div>;
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      switch (status) {
        case "SIGNED":
          return <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 px-3 py-1 flex w-fit gap-1"><CheckCircle2 className="w-3 h-3" /> Signed Active</Badge>;
        case "PENDING_SIGNATURE":
          return <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/20 px-3 py-1 flex w-fit gap-1"><Clock className="w-3 h-3" /> Awaiting Signature</Badge>;
        case "EXPIRED":
           return <Badge className="bg-red-500/10 text-red-500 border-red-500/20 px-3 py-1 flex w-fit gap-1">Expired</Badge>;
        case "DRAFT":
        default:
          return <Badge className="bg-slate-500/10 text-slate-400 border-slate-500/20 px-3 py-1 flex w-fit gap-1"><Edit className="w-3 h-3" /> Draft</Badge>;
      }
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const agreement = row.original;

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
            <Link href={`/admin/agreements/${agreement.id}`}>
              <DropdownMenuItem className="cursor-pointer focus:bg-slate-800 focus:text-white py-2">
                <FileText className="mr-2 h-4 w-4 text-blue-400" />
                View Document
              </DropdownMenuItem>
            </Link>
            {agreement.status === 'DRAFT' && (
              <DropdownMenuItem className="cursor-pointer focus:bg-slate-800 focus:text-white py-2">
                <Send className="mr-2 h-4 w-4 text-emerald-400" />
                Dispatch Email
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
