import React from "react";
import { getAllMaintenance } from "@/actions/maintenance";
import { MaintenanceTable } from "@/components/admin/maintenance/maintenance-table";
import { columns } from "@/components/admin/maintenance/maintenance-columns";
import { Card, CardContent } from "@/components/ui/card";
import { Wrench, CheckCircle2, AlertCircle, Clock } from "lucide-react";

import { RealtimeSubscriber } from "@/components/realtime-subscriber";

export default async function MaintenanceAdminPage() {
  const maintenance = await getAllMaintenance();

  const total = maintenance.length;
  const pending = maintenance.filter((m: any) => m.status === "SUBMITTED").length;
  const inProgress = maintenance.filter((m: any) => m.status === "IN_PROGRESS").length;
  const urgent = maintenance.filter((m: any) => m.priority === "URGENT" && m.status !== "RESOLVED" && m.status !== "CLOSED").length;

  const stats = [
    {
      label: "Pending Requests",
      value: pending.toString(),
      sub: "Needs initial review",
      icon: Clock,
      color: "text-amber-500",
      bg: "bg-amber-500/10"
    },
    {
      label: "In Progress",
      value: inProgress.toString(),
      sub: "Currently being worked on",
      icon: Wrench,
      color: "text-blue-500",
      bg: "bg-blue-500/10"
    },
    {
      label: "Urgent Tickets",
      value: urgent.toString(),
      sub: "Requires immediate attention",
      icon: AlertCircle,
      color: "text-red-500",
      bg: "bg-red-500/10"
    }
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <RealtimeSubscriber table="maintenance_requests" />
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Maintenance Tracker</h1>
          <p className="text-slate-400 font-medium mt-1">
            Manage work orders, track repairs, and ensure tenant satisfaction.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <Card key={i} className={`bg-slate-900/40 border-slate-800/50 backdrop-blur-sm overflow-hidden group ${stat.label === "Urgent Tickets" && urgent > 0 ? "border-red-500/50" : ""}`}>
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-xl ${stat.bg} ${stat.color} transition-transform group-hover:scale-110 duration-300`}>
                  <stat.icon className="h-6 w-6" />
                </div>
                {stat.label === "Urgent Tickets" && urgent > 0 && (
                   <div className="flex items-center gap-1 text-[10px] font-bold text-white uppercase tracking-wider bg-red-600 px-2 py-1 rounded animate-pulse shadow-lg shadow-red-500/20">
                     Action Required
                   </div>
                )}
              </div>
              <div className="space-y-1">
                <h3 className="text-slate-400 text-sm font-medium">{stat.label}</h3>
                <div className="text-2xl font-bold text-white tracking-tight">{stat.value}</div>
                <p className="text-xs text-slate-500">{stat.sub}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-2 px-1">
          <div className="h-8 w-1 bg-indigo-600 rounded-full" />
          <h2 className="text-xl font-bold text-white">All Work Orders</h2>
        </div>
        <MaintenanceTable columns={columns} data={maintenance} />
      </div>
    </div>
  );
}
