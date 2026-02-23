"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { ChevronDown, Loader2 } from "lucide-react";
import { updateMaintenanceStatus } from "@/actions/maintenance";
import { toast } from "sonner";

export function UpdateStatusAction({ ticket }: { ticket: any }) {
  const [isUpdating, setIsUpdating] = useState(false);

  const statuses = [
    { value: "SUBMITTED", label: "Submitted", color: "text-amber-500" },
    { value: "IN_PROGRESS", label: "In Progress", color: "text-blue-500" },
    { value: "RESOLVED", label: "Resolved", color: "text-emerald-500" },
    { value: "CLOSED", label: "Closed", color: "text-slate-500" },
  ];

  const handleUpdate = async (newStatus: string) => {
    if (ticket.status === newStatus) return;
    try {
      setIsUpdating(true);
      await updateMaintenanceStatus(ticket.id, newStatus);
      toast.success(`Ticket marked as ${newStatus.replace("_", " ")}.`);
    } catch (e: any) {
      toast.error(e.message || "Failed to update ticket status.");
    } finally {
      setIsUpdating(false);
    }
  };

  const currentStatus = statuses.find(s => s.value === ticket.status);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          disabled={isUpdating}
          className="h-8 text-xs font-semibold bg-slate-900/50 border-slate-800"
        >
          {isUpdating ? (
            <Loader2 className="mr-2 h-3 w-3 animate-spin" />
          ) : (
            <span className={`mr-2 flex h-2 w-2 rounded-full ${currentStatus?.value === 'PENDING' ? 'bg-amber-500' : currentStatus?.value === 'IN_PROGRESS' ? 'bg-blue-500' : 'bg-emerald-500'}`} />
          )}
          {currentStatus?.label || "Status"}
          <ChevronDown className="ml-2 h-3 w-3 text-slate-500" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[160px] bg-slate-950 border-slate-800 text-slate-300">
        {statuses.map((status) => (
          <DropdownMenuItem
            key={status.value}
            onClick={() => handleUpdate(status.value)}
            disabled={ticket.status === status.value}
            className={`focus:bg-slate-900 focus:text-white cursor-pointer ${ticket.status === status.value ? "opacity-50" : ""}`}
          >
            <span className={`mr-2 flex h-2 w-2 rounded-full ${status.value === 'PENDING' ? 'bg-amber-500' : status.value === 'IN_PROGRESS' ? 'bg-blue-500' : 'bg-emerald-500'}`} />
            {status.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
