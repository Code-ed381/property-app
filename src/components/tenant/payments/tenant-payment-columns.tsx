"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  CreditCard,
  CreditCardIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export const tenantColumns: ColumnDef<any>[] = [
  {
    accessorKey: "type",
    header: "Invoice Type",
    cell: ({ row }) => {
      const type = row.getValue("type") as string;
      return (
        <Badge variant="outline" className="bg-slate-900 border-slate-800 text-slate-400 font-medium tracking-wider text-[10px] uppercase">
          {type}
        </Badge>
      );
    },
  },
  {
    accessorKey: "notes",
    header: "Description",
    cell: ({ row }) => {
      return (
        <span className="text-sm font-medium text-white max-w-[200px] truncate block">
          {row.getValue("notes") || "Payment"}
        </span>
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
        <div className="text-sm text-slate-400 font-medium">
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
            <Badge className="bg-red-500/10 text-red-500 border-red-500/20 px-2 py-0.5 flex w-fit gap-1 items-center animate-pulse">
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
    id: "actions",
    cell: ({ row }) => {
      const payment = row.original;

      if (payment.status === "PAID") {
        return (
          <div className="flex justify-end">
             <Button variant="ghost" disabled className="text-slate-500 border border-slate-800 bg-slate-900/50 h-8 text-xs font-semibold px-4 w-[100px] hover:bg-slate-900/50 hover:text-slate-500 cursor-not-allowed">
               Settled
             </Button>
          </div>
        );
      }

      return (
        <div className="flex justify-end">
          <Dialog>
            <DialogTrigger asChild>
              <Button className="h-8 text-xs font-bold px-4 bg-blue-600 hover:bg-blue-500 text-white w-[100px] shadow-lg shadow-blue-500/20 transition-all hover:-translate-y-0.5 hover:shadow-blue-500/40">
                Pay Now
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-slate-950 border-slate-800 sm:max-w-md p-0 overflow-hidden text-center">
              
              <div className="relative pt-12 pb-6 px-6">
                <div className="absolute top-0 right-0 -m-32 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px] pointer-events-none" />
                <div className="absolute bottom-0 left-0 -m-32 w-64 h-64 bg-amber-500/10 rounded-full blur-[80px] pointer-events-none" />
                
                <div className="mx-auto w-16 h-16 bg-blue-500/20 flex items-center justify-center rounded-full mb-6 relative">
                  <CreditCardIcon className="h-8 w-8 text-blue-500" />
                  <div className="absolute bottom-0 right-0 w-5 h-5 bg-amber-500 rounded-full border-2 border-slate-950 flex items-center justify-center">
                     <Clock className="h-3 w-3 text-slate-950" />
                  </div>
                </div>
                
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold text-white tracking-tight mb-2">
                    Online Payments Coming Soon
                  </DialogTitle>
                  <DialogDescription className="text-slate-400 text-base max-w-sm mx-auto">
                    We&apos;re currently integrating our secure online payment gateway. 
                    In the meantime, please contact your property manager to arrange a manual bank transfer or cash payment for this invoice.
                  </DialogDescription>
                </DialogHeader>

                <div className="bg-slate-900 rounded-xl p-4 mt-8 border border-slate-800/80 flex justify-between items-center text-left">
                   <div>
                      <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-1">Invoice Amount</p>
                      <p className="text-xl font-bold text-white">GH₵ {payment.amount.toLocaleString()}</p>
                   </div>
                   <Badge variant="outline" className="bg-amber-500/10 border-amber-500/20 text-amber-500 py-1">
                      {payment.status}
                   </Badge>
                </div>
              </div>

            </DialogContent>
          </Dialog>
        </div>
      );
    },
  },
];
