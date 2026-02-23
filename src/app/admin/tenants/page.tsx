import React from "react";
import { TenantTable } from "@/components/admin/tenants/tenant-table";
import { getTenants } from "@/actions/tenants";
import { Button } from "@/components/ui/button";
import { Download, Plus } from "lucide-react";
import { Tenant } from "@/components/admin/tenants/tenant-columns";
import Link from "next/link";

// Mock data to show something if the DB fetch returns empty
const mockTenants: Tenant[] = [
  {
    id: "t1",
    email: "john.doe@example.com",
    phone: "+233 50 123 4567",
    is_active: true,
    onboarding_done: true,
    apartment: {
      id: "a1",
      unit_name: "Ocean View Studio",
      unit_number: "101",
      type: "STUDIO",
    },
    created_at: new Date().toISOString(),
  },
  {
    id: "t2",
    email: "sarah.smith@example.com",
    phone: "+233 24 987 6543",
    is_active: true,
    onboarding_done: false,
    apartment: {
      id: "a2",
      unit_name: "Skyloft Suite",
      unit_number: "502",
      type: "TWO_BEDROOM",
    },
    created_at: new Date().toISOString(),
  },
  {
    id: "t3",
    email: "legacy.user@example.com",
    phone: null,
    is_active: false,
    onboarding_done: true,
    apartment: {
      id: "a3",
      unit_name: "Greenery One-Bed",
      unit_number: "204",
      type: "ONE_BEDROOM",
    },
    created_at: new Date().toISOString(),
  },
];

export default async function TenantsPage() {
  const tenantsData = await getTenants();
  
  // Use real data if available, otherwise fallback to mock for demonstration
  const data = tenantsData.length > 0 ? tenantsData : mockTenants;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
         <div>
           <h1 className="text-3xl font-bold text-white tracking-tight">Tenants</h1>
           <p className="text-slate-400 mt-1 font-medium">Manage all registered tenants and their onboarding status.</p>
         </div>
         <div className="flex items-center gap-3">
           <Button variant="outline" className="border-slate-800 bg-slate-900/50 hover:bg-slate-900 text-slate-300 rounded-xl px-4 h-11">
             <Download className="mr-2 h-4 w-4" />
             Export CSV
           </Button>
           <Link href="/admin/tenants/new">
             <Button className="bg-blue-600 hover:bg-blue-500 text-white rounded-xl px-6 h-11 shadow-lg shadow-blue-500/20 transition-all hover:scale-105 active:scale-95">
               <Plus className="mr-2 h-4 w-4" />
               New Tenant
             </Button>
           </Link>
         </div>
      </div>

      <TenantTable data={data as any} />
    </div>
  );
}
