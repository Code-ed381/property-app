import React from "react";
import { getTenantDashboard } from "@/actions/tenant-dashboard";
import { Card, CardContent } from "@/components/ui/card";
import { FileSignature, Calendar, Stamp, FileText, Download } from "lucide-react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default async function TenantAgreementPage() {
  const data = await getTenantDashboard();
  const { agreement, profile } = data;

  if (!agreement) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4">
        <FileSignature className="h-16 w-16 text-slate-700" />
        <h1 className="text-2xl font-bold text-white">No Agreement Found</h1>
        <p className="text-slate-400 max-w-md">
          We couldn't find an active tenancy agreement for your account. Please contact your property manager.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500 max-w-4xl mx-auto">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Tenancy Agreement</h1>
          <p className="text-slate-400 font-medium mt-1">
            Review the terms of your lease at {profile?.apartment?.unit_name}.
          </p>
        </div>
        <Button asChild variant="outline" className="border-indigo-500/30 text-indigo-400 bg-indigo-500/10 hover:bg-indigo-500 hover:text-white group">
          <a href={`/api/pdf/agreement?id=${agreement.id}`} target="_blank" rel="noopener noreferrer">
            <Download className="mr-2 h-4 w-4 group-hover:-translate-y-0.5 transition-transform" />
            Download PDF
          </a>
        </Button>
      </div>

      <Card className="bg-slate-900/40 border-slate-800/50 backdrop-blur-sm shadow-2xl overflow-hidden">
        {/* Decorative Header */}
        <div className="h-32 bg-indigo-600/10 border-b border-indigo-500/20 relative overflow-hidden flex items-center px-8">
           <div className="absolute -right-16 -top-16 opacity-10">
              <Stamp className="h-64 w-64" />
           </div>
           <div>
              <h2 className="text-xl font-bold text-indigo-100 mb-1">PILAS Properties LLC</h2>
              <p className="text-indigo-300 font-medium text-sm">Official Tenancy Agreement</p>
           </div>
        </div>

        <CardContent className="p-8 space-y-10 relative">
           
           {/* Header Info */}
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pb-8 border-b border-slate-800">
              <div>
                 <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">Tenant Details</p>
                 <p className="text-white font-medium text-lg">{profile?.email}</p>
                 <p className="text-slate-400">{profile?.phone || "No phone provided"}</p>
              </div>
              <div>
                 <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">Property Details</p>
                 <p className="text-white font-medium text-lg">{profile?.apartment?.unit_name}</p>
                 <p className="text-slate-400">Unit {profile?.apartment?.unit_number} • {profile?.apartment?.type.replace("_", " ")}</p>
              </div>
           </div>

           {/* Key Terms */}
           <div>
              <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                 <FileText className="h-5 w-5 text-indigo-500" />
                 Lease Terms
              </h3>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                 <div className="bg-slate-800/30 p-4 rounded-xl border border-slate-800/50">
                    <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Start Date</p>
                    <p className="text-white font-medium flex items-center gap-2">
                       <Calendar className="h-4 w-4 text-slate-400" />
                       {format(new Date(agreement.lease_start), "MMM dd, yyyy")}
                    </p>
                 </div>
                 <div className="bg-slate-800/30 p-4 rounded-xl border border-slate-800/50">
                    <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">End Date</p>
                    <p className="text-white font-medium flex items-center gap-2">
                       <Calendar className="h-4 w-4 text-slate-400" />
                       {format(new Date(agreement.lease_end), "MMM dd, yyyy")}
                    </p>
                 </div>
                 <div className="bg-slate-800/30 p-4 rounded-xl border border-slate-800/50">
                    <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Rent Amount</p>
                    <p className="text-white font-medium text-lg">
                       GH₵ {agreement.rent_amount} <span className="text-xs text-slate-500 font-normal">/mo</span>
                    </p>
                 </div>
                 <div className="bg-slate-800/30 p-4 rounded-xl border border-slate-800/50">
                    <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Status</p>
                    <Badge variant="outline" className={`mt-1 font-bold ${agreement.status === "ACTIVE" || agreement.status === "SIGNED" ? "text-emerald-500 bg-emerald-500/10 border-emerald-500/30" : "text-amber-500 bg-amber-500/10 border-amber-500/30"}`}>
                       {agreement.status}
                    </Badge>
                 </div>
              </div>
           </div>

           {/* Rules */}
           <div>
              <h3 className="text-lg font-bold text-white mb-4">Apartment Rules</h3>
              <ul className="list-disc pl-5 space-y-2 text-slate-300">
                 <li>Rent is due on the 1st of every month. Late fees may apply after the 5th.</li>
                 <li>All maintenance requests must be submitted through the official portal.</li>
                 <li>Any structural alterations or painting require prior written consent.</li>
                 <li>Subletting is strictly prohibited without authorization.</li>
                 <li>Tenants must adhere to all building quiet hours (10:00 PM to 7:00 AM).</li>
              </ul>
           </div>
           
           {/* Signatures */}
           <div className="mt-12 pt-8 border-t border-slate-800/50">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                 <div>
                    <h4 className="text-sm font-semibold text-slate-400 mb-6 uppercase tracking-wider">Tenant Signature</h4>
                    <div className="h-20 bg-slate-800/20 rounded border border-dashed border-slate-700 flex items-center justify-center p-2 relative">
                        {agreement.tenant_signature_url ? (
                           // eslint-disable-next-line @next/next/no-img-element
                           <img src={agreement.tenant_signature_url} alt="Tenant Signature" className="max-h-full max-w-full opacity-80 mix-blend-screen invert" />
                        ) : (
                           <span className="text-slate-500 font-medium font-serif italic">Awaiting Signature</span>
                        )}
                    </div>
                    <div className="mt-2 text-xs text-slate-500 text-center">{profile?.email} - {format(new Date(agreement.created_at), "MMM dd, yyyy")}</div>
                 </div>
                 <div>
                    <h4 className="text-sm font-semibold text-slate-400 mb-6 uppercase tracking-wider">Manager Signature</h4>
                    <div className="h-20 bg-slate-800/20 rounded border border-dashed border-slate-700 flex items-center justify-center p-2 relative overflow-hidden">
                        <span className="text-blue-500/60 font-bold font-serif text-3xl opacity-80 tracking-widest italic -rotate-6">PILAS MGT</span>
                    </div>
                    <div className="mt-2 text-xs text-slate-500 text-center">PILAS Properties Admin - {format(new Date(agreement.created_at), "MMM dd, yyyy")}</div>
                 </div>
              </div>
           </div>

        </CardContent>
      </Card>
    </div>
  );
}
