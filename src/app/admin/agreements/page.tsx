import React from "react";
import { AgreementTable } from "@/components/admin/agreements/agreement-table";
import { getAgreements } from "@/actions/agreements";
import { Agreement } from "@/components/admin/agreements/agreement-columns";

// Mock data to show something if the DB fetch returns empty
const mockAgreements: Agreement[] = [
  {
    id: "agr1",
    status: "SIGNED",
    lease_start: new Date(Date.now() - 30 * 86400000).toISOString(),
    lease_end: new Date(Date.now() + 335 * 86400000).toISOString(),
    monthly_rent: 4500,
    tenant: {
      id: "t4",
      email: "mj@example.com",
      apartment: {
        id: "a1",
        unit_name: "Ocean View Studio",
        room_number: "OCE-101"
      }
    }
  },
  {
    id: "agr2",
    status: "PENDING_SIGNATURE",
    lease_start: new Date(Date.now() + 5 * 86400000).toISOString(),
    lease_end: new Date(Date.now() + 370 * 86400000).toISOString(),
    monthly_rent: 7200,
    tenant: {
      id: "t2",
      email: "sarah@example.com",
      apartment: {
        id: "a2",
        unit_name: "Skyloft Suite",
        room_number: "SKY-502"
      }
    }
  },
  {
    id: "agr3",
    status: "DRAFT",
    lease_start: new Date(Date.now() + 15 * 86400000).toISOString(),
    lease_end: new Date(Date.now() + 380 * 86400000).toISOString(),
    monthly_rent: 6100,
    tenant: {
      id: "t5",
      email: "david@example.com",
      apartment: {
        id: "a4",
        unit_name: "Penthouse Premium",
        room_number: "PH-1"
      }
    }
  },
];

export default async function AgreementsPage() {
  const agreementsData = await getAgreements();
  
  // Use real data if available, otherwise fallback to mock for demonstration
  const data = agreementsData.length > 0 ? agreementsData : mockAgreements;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
         <div>
           <h1 className="text-3xl font-bold text-white tracking-tight">Tenancy Agreements</h1>
           <p className="text-slate-400 mt-1 font-medium">Manage lease drafts and monitor signature statuses.</p>
         </div>
      </div>

      <AgreementTable data={data as any} />
    </div>
  );
}
