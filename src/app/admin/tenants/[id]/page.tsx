import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getTenantById } from "@/actions/tenants";
import { ChevronLeft, User, Mail, Phone, Calendar, Building2, FileText, CheckCircle2, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TenantActions } from "@/components/admin/tenants/tenant-actions";
import { format } from "date-fns";

export default async function TenantDetailsPage(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;
  const tenant = await getTenantById(id);

  if (!tenant) {
    notFound();
  }

  const registeredDate = tenant.created_at ? format(new Date(tenant.created_at), "MMM dd, yyyy") : 'Unknown';

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl" asChild>
            <Link href="/admin/tenants">
              <ChevronLeft className="h-6 w-6" />
            </Link>
          </Button>
          <div className="flex items-center gap-3">
             <div className="h-12 w-12 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400 text-xl font-bold shadow-inner">
               {tenant.email?.charAt(0).toUpperCase() || 'T'}
             </div>
             <div>
               <div className="flex items-center gap-3">
                 <h1 className="text-3xl font-bold text-white tracking-tight">Tenant Profile</h1>
                 {tenant.is_active ? (
                   <Badge className="bg-green-500/10 text-green-500 border-green-500/20 px-3">Active Account</Badge>
                 ) : (
                   <Badge className="bg-red-500/10 text-red-500 border-red-500/20 px-3">Deactivated</Badge>
                 )}
               </div>
               <p className="text-slate-400 mt-1 font-medium">{tenant.email}</p>
             </div>
          </div>
        </div>
        
        <TenantActions tenantId={tenant.id} isActive={tenant.is_active} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Contact & Security */}
        <div className="space-y-6 lg:col-span-2">
          
          <Card className="bg-slate-900/40 border-slate-800/50 backdrop-blur-sm relative overflow-hidden">
             <div className="absolute top-0 right-0 p-8 opacity-5">
               <User className="w-48 h-48" />
             </div>
             <CardHeader>
               <CardTitle className="text-xl font-bold text-white flex items-center gap-2">
                 <User className="h-5 w-5 text-blue-500" /> Contact Details
               </CardTitle>
             </CardHeader>
             <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                   <p className="text-sm font-medium text-slate-500 mb-1">Email Address</p>
                   <div className="flex items-center gap-2">
                     <Mail className="h-4 w-4 text-slate-400" />
                     <p className="text-white font-medium">{tenant.email || 'Not provided'}</p>
                   </div>
                </div>
                <div>
                   <p className="text-sm font-medium text-slate-500 mb-1">Phone Number</p>
                   <div className="flex items-center gap-2">
                     <Phone className="h-4 w-4 text-slate-400" />
                     <p className="text-white font-medium">{tenant.phone || 'Not provided'}</p>
                   </div>
                </div>
                <div>
                   <p className="text-sm font-medium text-slate-500 mb-1">Registered Since</p>
                   <div className="flex items-center gap-2">
                     <Calendar className="h-4 w-4 text-slate-400" />
                     <p className="text-white font-medium">{registeredDate}</p>
                   </div>
                </div>
             </CardContent>
          </Card>

          <Card className="bg-slate-900/40 border-slate-800/50 backdrop-blur-sm">
             <CardHeader>
               <CardTitle className="text-xl font-bold text-white flex items-center gap-2">
                 <ShieldAlert className="h-5 w-5 text-blue-500" /> Onboarding & Security
               </CardTitle>
             </CardHeader>
             <CardContent className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-slate-950/50 rounded-xl border border-slate-800/50">
                   <div>
                     <p className="text-white font-medium">Onboarding Process</p>
                     <p className="text-sm text-slate-500">Full basic profile setup and ID verification.</p>
                   </div>
                   {tenant.onboarding_done ? (
                     <Badge className="bg-green-500/10 text-green-500 border-green-500/20 px-3 py-1 text-sm flex gap-1">
                       <CheckCircle2 className="h-4 w-4" /> Completed
                     </Badge>
                   ) : (
                     <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/20 px-3 py-1 text-sm">
                       Pending Input
                     </Badge>
                   )}
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-950/50 rounded-xl border border-slate-800/50">
                   <div>
                     <p className="text-white font-medium">Default Passcode Reset</p>
                     <p className="text-sm text-slate-500">Tenant needs to change default assigned PIN.</p>
                   </div>
                   {tenant.must_change_pass ? (
                     <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/20 px-3 py-1 text-sm">
                       Required at next login
                     </Badge>
                   ) : (
                     <Badge className="bg-green-500/10 text-green-500 border-green-500/20 px-3 py-1 text-sm flex gap-1">
                       <CheckCircle2 className="h-4 w-4" /> Secured
                     </Badge>
                   )}
                </div>
             </CardContent>
          </Card>

        </div>

        {/* Right Column: Linked Items */}
        <div className="space-y-6">
          
          <Card className="bg-slate-900/40 border-slate-800/50 backdrop-blur-sm">
             <CardHeader>
               <CardTitle className="text-xl font-bold text-white flex items-center gap-2">
                 <Building2 className="h-5 w-5 text-blue-500" /> Currently Placed In
               </CardTitle>
             </CardHeader>
             <CardContent>
               {tenant.apartment ? (
                 <div className="p-4 bg-slate-950/50 rounded-xl border border-blue-500/20 hover:border-blue-500/40 transition-colors">
                    <p className="text-sm text-blue-400 font-semibold mb-1">{tenant.apartment.room_number || `Unit ${tenant.apartment.unit_number}`}</p>
                    <p className="text-white font-bold text-lg mb-2">{tenant.apartment.unit_name}</p>
                    <p className="text-xs text-slate-400 capitalize mb-4">{tenant.apartment.type.toLowerCase().replace('_', ' ')}</p>
                    <Button variant="secondary" className="w-full bg-slate-800 text-slate-200 hover:bg-slate-700" asChild>
                       <Link href={`/admin/apartments/${tenant.apartment.id}`}>View Apartment</Link>
                    </Button>
                 </div>
               ) : (
                 <div className="p-6 text-center border-2 border-dashed border-slate-800 rounded-xl">
                    <p className="text-slate-400">No active assignment</p>
                 </div>
               )}
             </CardContent>
          </Card>

          <Card className="bg-slate-900/40 border-slate-800/50 backdrop-blur-sm">
             <CardHeader>
               <CardTitle className="text-xl font-bold text-white flex items-center gap-2">
                 <FileText className="h-5 w-5 text-blue-500" /> Tenancy Documents
               </CardTitle>
             </CardHeader>
             <CardContent>
                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-start border-slate-800 bg-slate-950/50 hover:bg-slate-800 text-slate-300 h-12 rounded-xl" asChild>
                     <Link href={`/admin/applications?tenantId=${tenant.id}`}>
                        <FileText className="mr-3 h-4 w-4 text-slate-500" />
                        Original Application Form
                     </Link>
                  </Button>
                  <Button variant="outline" className="w-full justify-start border-slate-800 bg-slate-950/50 hover:bg-slate-800 text-slate-300 h-12 rounded-xl" asChild>
                     <Link href={`/admin/agreements?tenantId=${tenant.id}`}>
                        <FileText className="mr-3 h-4 w-4 text-slate-500" />
                        Active Tenancy Agreement
                     </Link>
                  </Button>
                </div>
             </CardContent>
          </Card>

        </div>

      </div>
    </div>
  );
}
