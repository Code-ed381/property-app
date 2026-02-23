import React from "react";
import { ApplicationTable } from "@/components/admin/applications/application-table";
import { getApplications } from "@/actions/applications";
import { Application } from "@/components/admin/applications/application-columns";

// Mock data to show something if the DB fetch returns empty
const mockApplications: Application[] = [
  {
    id: "app1",
    status: "PENDING",
    full_name: "Michael Johnson",
    submitted_at: new Date().toISOString(),
    tenant: {
      id: "t4",
      email: "mj@example.com",
      phone: "+233 24 111 2222",
      apartment: {
        id: "a1",
        unit_name: "Ocean View Studio",
        unit_number: "101"
      }
    }
  },
  {
    id: "app2",
    status: "APPROVED",
    full_name: "Sarah Smith",
    submitted_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    tenant: {
      id: "t2",
      email: "sarah@example.com",
      phone: "+233 50 222 3333",
      apartment: {
        id: "a2",
        unit_name: "Skyloft Suite",
        unit_number: "502"
      }
    }
  },
  {
    id: "app3",
    status: "REJECTED",
    full_name: "David Lee",
    submitted_at: new Date(Date.now() - 86400000 * 5).toISOString(),
    tenant: {
      id: "t5",
      email: "david@example.com",
      phone: "+233 20 555 6666",
      apartment: {
        id: "a4",
        unit_name: "Penthouse Premium",
        unit_number: "PH-1"
      }
    }
  },
];

import { RealtimeSubscriber } from "@/components/realtime-subscriber";

export default async function ApplicationsPage() {
  const applicationsData = await getApplications();
  
  // Use real data if available, otherwise fallback to mock for demonstration
  const data = applicationsData.length > 0 ? applicationsData : mockApplications;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <RealtimeSubscriber table="applications" />
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
         <div>
           <h1 className="text-3xl font-bold text-white tracking-tight">Applications</h1>
           <p className="text-slate-400 mt-1 font-medium">Review pending tenant applications and onboarding requests.</p>
         </div>
      </div>

      <ApplicationTable data={data as any} />
    </div>
  );
}
