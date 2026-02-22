import React from "react";
import { notFound } from "next/navigation";
import { getAgreementById } from "@/actions/agreements";
import { AgreementDocument } from "@/components/admin/agreements/AgreementDocument";
import { TenantExecutionBlock } from "@/components/tenant/agreements/TenantExecutionBlock";
import { Building2 } from "lucide-react";

export default async function TenantAgreementExecutionPage(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;
  const agreement = await getAgreementById(id);

  if (!agreement) {
    notFound();
  }

  // To secure this page effectively, we would enforce the logged in tenant's ID
  // via Supabase Auth here to ensure they are the ones accessing the agreement.

  return (
    <div className="min-h-screen bg-slate-950 pb-20">
      
      {/* Premium Header */}
      <div className="w-full bg-slate-900 border-b border-slate-800 py-6 px-4 md:px-8 mb-8 sticky top-0 z-50 backdrop-blur-xl bg-slate-900/80">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
           <div className="flex items-center gap-4">
              <div className="h-12 w-12 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                <Building2 className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white tracking-tight">PILAS Properties</h1>
                <p className="text-slate-400 text-sm font-medium">Digital Tenancy Contract Execution Portal</p>
              </div>
           </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto space-y-12 px-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
        
        {/* Important Warning Banner if pending */}
        {agreement.status === "PENDING_SIGNATURE" && (
           <div className="bg-amber-900/20 border border-amber-500/30 rounded-2xl p-6 text-amber-200">
              <h2 className="text-lg font-bold text-amber-500 mb-2">Attention Required</h2>
              <p>Your physical move-in is strictly blocked until this official Tenancy Agreement is digitally executed below. Please review the contents thoroughly prior to appending your signature.</p>
           </div>
        )}

        {/* The generated agreement document instance (in ReadOnly/Tenant Mode) */}
        <div className="wrapper-shadow shadow-2xl rounded-sm">
           <AgreementDocument agreement={agreement} role="TENANT" />
        </div>

        {/* Execution Block specific to tenants */}
        <TenantExecutionBlock agreementId={id} status={agreement.status} />

      </div>
    </div>
  );
}
