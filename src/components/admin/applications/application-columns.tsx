"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, FileText, CheckCircle2, XCircle, Clock } from "lucide-react";
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

export type Application = {
  id: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  full_name: string;
  submitted_at: string;
  tenant: {
    id: string;
    email: string | null;
    phone: string | null;
    apartment: {
      id: string;
      unit_name: string;
      unit_number: string;
    } | null;
  } | null;
};

export const columns: ColumnDef<Application>[] = [
  {
    accessorKey: "full_name",
    header: "Applicant Name",
    cell: ({ row }) => <div className="font-medium text-white">{row.getValue("full_name")}</div>,
  },
  {
    accessorKey: "tenant.apartment.unit_name",
    header: "Target Unit",
    cell: ({ row }) => {
      const apartment = row.original.tenant?.apartment;
      if (!apartment) return <span className="text-slate-500">None</span>;
      return (
        <div>
          <span className="font-medium text-blue-400">{apartment.unit_name}</span>
          <br/>
          <span className="text-xs text-slate-500">Unit {apartment.unit_number}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "submitted_at",
    header: "Submitted",
    cell: ({ row }) => {
      const submitted = row.getValue("submitted_at") as string;
      if (!submitted) return <span className="text-slate-500">Unknown</span>;
      return <div className="text-slate-300">{format(new Date(submitted), "MMM dd, yyyy")}</div>;
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      switch (status) {
        case "APPROVED":
          return <Badge className="bg-green-500/10 text-green-500 border-green-500/20 px-3 py-1 flex w-fit gap-1"><CheckCircle2 className="w-3 h-3" /> Approved</Badge>;
        case "REJECTED":
          return <Badge className="bg-red-500/10 text-red-500 border-red-500/20 px-3 py-1 flex w-fit gap-1"><XCircle className="w-3 h-3" /> Rejected</Badge>;
        case "PENDING":
        default:
          return <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/20 px-3 py-1 flex w-fit gap-1"><Clock className="w-3 h-3" /> Pending Review</Badge>;
      }
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const application = row.original;

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
            <Link href={`/admin/applications/${application.id}`}>
              <DropdownMenuItem className="cursor-pointer focus:bg-slate-800 focus:text-white lg:py-2">
                <FileText className="mr-2 h-4 w-4 text-blue-400" />
                Review Application
              </DropdownMenuItem>
            </Link>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
