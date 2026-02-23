import React from "react";
import { getTenantMaintenance } from "@/actions/maintenance";
import { NewMaintenanceModal } from "@/components/tenant/maintenance/new-maintenance-modal";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { RealtimeSubscriber } from "@/components/realtime-subscriber";

export default async function TenantMaintenancePage() {
  const maintenance = await getTenantMaintenance();

  const activeTickets = maintenance.filter((req: any) => req.status !== "RESOLVED" && req.status !== "CLOSED");
  const historicalTickets = maintenance.filter((req: any) => req.status === "RESOLVED" || req.status === "CLOSED");

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <RealtimeSubscriber table="maintenance_requests" />
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Maintenance Portal</h1>
          <p className="text-slate-400 font-medium mt-1">
            Submit and track work orders for your apartment.
          </p>
        </div>
        <NewMaintenanceModal />
      </div>

      {activeTickets.length === 0 ? (
        <div className="bg-slate-900/40 border-slate-800/50 p-12 text-center rounded-3xl backdrop-blur-sm">
           <h2 className="text-xl text-slate-300 font-medium mb-2">No Active Tickets</h2>
           <p className="text-slate-500 max-w-sm mx-auto">
              You currently have no open maintenance requests. Click below to submit a new work order.
           </p>
           <div className="mt-8 flex justify-center">
             <NewMaintenanceModal />
           </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeTickets.map((req: any) => (
             <div key={req.id} className="bg-slate-900/40 border border-slate-800/50 p-6 rounded-2xl flex flex-col justify-between">
                <div>
                   <div className="flex justify-between items-start mb-4">
                      <Badge variant="outline" className={`
                        ${req.status === 'SUBMITTED' ? 'text-amber-500 border-amber-500/30 bg-amber-500/10' : ''}
                        ${req.status === 'IN_PROGRESS' ? 'text-blue-500 border-blue-500/30 bg-blue-500/10' : ''}
                      `}>
                         {req.status}
                      </Badge>
                      <span className="text-xs text-slate-500 font-medium">{format(new Date(req.created_at), "MMM dd")}</span>
                   </div>
                   <h3 className="text-lg font-bold text-white mb-2">{req.title}</h3>
                   <p className="text-slate-400 text-sm line-clamp-3 mb-4">{req.description}</p>
                </div>
                <div className="pt-4 border-t border-slate-800/80 mt-auto">
                   <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Priority: <span className="text-slate-300">{req.priority}</span></p>
                </div>
             </div>
          ))}
        </div>
      )}

      {historicalTickets.length > 0 && (
        <div className="space-y-4 pt-8 border-t border-slate-800/50">
          <h3 className="text-lg font-bold text-white pl-2 border-l-2 border-slate-700">Historical Requests</h3>
          <div className="space-y-3">
            {historicalTickets.map((req: any) => (
              <div key={req.id} className="p-4 bg-slate-900/30 border border-slate-800 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h4 className="font-medium text-white">{req.title}</h4>
                  <p className="text-xs text-slate-500 line-clamp-1 mt-1 max-w-xl">{req.description}</p>
                </div>
                <div className="flex items-center gap-4 text-sm font-medium">
                   <span className="text-slate-500">{format(new Date(req.created_at), "MMM dd, yyyy")}</span>
                   <Badge className={`${req.status === 'RESOLVED' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-slate-500/10 text-slate-500 border-slate-500/20'}`}>
                      {req.status}
                   </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
