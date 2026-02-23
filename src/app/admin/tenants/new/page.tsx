import React from "react";
import { TenantForm } from "@/components/admin/tenants/tenant-form";
import { getVacantApartments } from "@/actions/apartments";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

export default async function NewTenantPage() {
  const vacantApartments = await getVacantApartments();

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500 max-w-4xl mx-auto">
      <div className="flex items-center gap-4">
        <Link href="/admin/tenants" className="p-2 hover:bg-slate-800 rounded-full transition-colors text-slate-400 hover:text-white">
          <ChevronLeft className="h-6 w-6" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Add New Tenant</h1>
          <p className="text-slate-400 mt-1 font-medium">Assign a tenant to a vacant apartment and generate their onboarding credentials.</p>
        </div>
      </div>

      <TenantForm vacantApartments={vacantApartments} />
    </div>
  );
}
