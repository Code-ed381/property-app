"use client";

import { ColumnDef } from "@tanstack/react-table";
import { MarkPaidAction } from "@/components/admin/payments/mark-paid-action";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  CreditCard,
  User,
  Building
} from "lucide-react";

export const columns: ColumnDef<any>[] = [
  {
    accessorKey: "tenant",
    header: "Tenant",
    cell: ({ row }) => {
      const tenant = row.original.tenant;
      return (
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-400">
            <User className="h-4 w-4" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-white truncate max-w-[150px]">
              {tenant?.email || "Unknown Tenant"}
            </span>
            <span className="text-[10px] text-slate-500 uppercase tracking-tighter">
              {tenant?.apartment?.unit_number || "No Unit"}
            </span>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => {
      const type = row.getValue("type") as string;
      return (
        <Badge variant="outline" className="bg-slate-900 border-slate-800 text-slate-400 font-medium">
          {type}
        </Badge>
      );
    },
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount"));
      const formatted = new Intl.NumberFormat("en-GH", {
        style: "currency",
        currency: "GHS",
      }).format(amount);
      return <div className="font-semibold text-white">{formatted}</div>;
    },
  },
  {
    accessorKey: "due_date",
    header: "Due Date",
    cell: ({ row }) => {
      return (
        <div className="text-sm text-slate-400">
          {format(new Date(row.getValue("due_date")), "MMM dd, yyyy")}
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      
      switch (status) {
        case "PAID":
          return (
            <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 px-2 py-0.5 flex w-fit gap-1 items-center">
              <CheckCircle2 className="w-3 h-3" /> Paid
            </Badge>
          );
        case "OVERDUE":
          return (
            <Badge className="bg-red-500/10 text-red-500 border-red-500/20 px-2 py-0.5 flex w-fit gap-1 items-center">
              <AlertCircle className="w-3 h-3" /> Overdue
            </Badge>
          );
        default:
          return (
            <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/20 px-2 py-0.5 flex w-fit gap-1 items-center">
              <Clock className="w-3 h-3" /> Pending
            </Badge>
          );
      }
    },
  },
  {
    accessorKey: "method",
    header: "Method",
    cell: ({ row }) => {
      const method = row.getValue("method") as string;
      return (
        <div className="flex items-center gap-2 text-slate-500 text-sm">
          {method ? (
            <>
              <CreditCard className="h-3 w-3" />
              {method}
            </>
          ) : (
            "—"
          )}
        </div>
      );
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      return (
        <div className="flex justify-end pr-4">
          <MarkPaidAction payment={row.original} />
        </div>
      );
    },
  },
];
