"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { User, AlignLeft, AlertTriangle } from "lucide-react";
import { UpdateStatusAction } from "@/components/admin/maintenance/update-status-action";

export const columns: ColumnDef<any>[] = [
  {
    accessorKey: "tenant",
    header: "Tenant / Unit",
    cell: ({ row }) => {
      const tenant = row.original.tenant;
      return (
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-400">
            <User className="h-4 w-4" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-white max-w-[150px] truncate">
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
    accessorKey: "title",
    header: "Issue Title",
    cell: ({ row }) => {
      return (
        <div className="max-w-[200px]">
          <span className="text-sm font-semibold text-white truncate block">
            {row.getValue("title")}
          </span>
          <span className="text-xs text-slate-500 line-clamp-1 truncate mt-0.5">
            {row.original.description}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "priority",
    header: "Priority",
    cell: ({ row }) => {
      const priority = row.getValue("priority") as string;
      const getsColor = () => {
        switch (priority) {
          case "URGENT": return "text-red-500 border-red-500/30 bg-red-500/10";
          case "HIGH": return "text-orange-500 border-orange-500/30 bg-orange-500/10";
          case "MEDIUM": return "text-blue-500 border-blue-500/30 bg-blue-500/10";
          default: return "text-slate-400 border-slate-700 bg-slate-800/50";
        }
      };
      return (
        <Badge variant="outline" className={`text-[10px] uppercase font-bold tracking-wider ${getsColor()}`}>
          {priority === "URGENT" && <AlertTriangle className="mr-1 h-3 w-3" />}
          {priority}
        </Badge>
      );
    },
  },
  {
    accessorKey: "created_at",
    header: "Submitted",
    cell: ({ row }) => {
      return (
        <div className="text-sm text-slate-400">
          {format(new Date(row.getValue("created_at")), "MMM dd, yyyy")}
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return (
        <Badge variant="outline" className={`
          ${status === 'SUBMITTED' ? 'text-amber-500 border-amber-500/30 bg-amber-500/10' : ''}
          ${status === 'IN_PROGRESS' ? 'text-blue-500 border-blue-500/30 bg-blue-500/10' : ''}
          ${status === 'RESOLVED' ? 'text-emerald-500 border-emerald-500/30 bg-emerald-500/10' : ''}
          ${status === 'CLOSED' ? 'text-slate-500 border-slate-500/30 bg-slate-500/10' : ''}
        `}>
           {status.replace("_", " ")}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      return (
        <div className="flex justify-end pr-4">
           <UpdateStatusAction ticket={row.original} />
        </div>
      );
    },
  },
];
