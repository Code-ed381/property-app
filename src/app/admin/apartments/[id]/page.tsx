import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getApartmentById } from "@/actions/apartments";
import { 
  ChevronLeft, 
  Building2, 
  User, 
  CreditCard, 
  Calendar,
  FileText,
  ShieldCheck,
  Zap,
  Droplets,
  Wifi
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";

export default async function ApartmentDetailPage(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;
  const apartment = await getApartmentById(id);

  if (!apartment) {
    notFound();
  }

  const tenant = apartment.tenant;

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl" asChild>
            <Link href="/admin/apartments">
              <ChevronLeft className="h-6 w-6" />
            </Link>
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold text-white tracking-tight">{apartment.unit_name}</h1>
              <Badge 
                className={apartment.status === "VACANT" ? "bg-emerald-500/10 text-emerald-500 border-0" : "bg-blue-500/10 text-blue-500 border-0"}
              >
                {apartment.status}
              </Badge>
            </div>
            <p className="text-slate-400 font-medium mt-1">
              Unit {apartment.unit_number} • Level {apartment.floor} • {apartment.type.replace("_", " ")}
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="border-slate-800 bg-slate-900 text-slate-300 hover:bg-slate-800" asChild>
            <Link href={`/admin/apartments/${id}/edit`}>Edit Apartment</Link>
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-500 text-white">Maintenance Log</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Details */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card className="bg-slate-900/40 border-slate-800 shadow-xl overflow-hidden relative">
               <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-bl-[100px] pointer-events-none" />
               <CardContent className="pt-6">
                  <div className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1">Monthly Rent</div>
                  <div className="text-2xl font-bold text-white">GH₵ {apartment.monthly_rent?.toLocaleString()}</div>
               </CardContent>
            </Card>
            <Card className="bg-slate-900/40 border-slate-800 shadow-xl">
               <CardContent className="pt-6">
                  <div className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1">Room Access</div>
                  <div className="text-xl font-bold text-blue-400 font-mono tracking-tighter">{apartment.room_number || "Not assigned"}</div>
               </CardContent>
            </Card>
            <Card className="bg-slate-900/40 border-slate-800 shadow-xl">
               <CardContent className="pt-6">
                  <div className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1">Utilities</div>
                  <div className="flex gap-2 mt-1">
                     <Zap className="h-4 w-4 text-amber-500" />
                     <Droplets className="h-4 w-4 text-blue-500" />
                     <Wifi className="h-4 w-4 text-purple-500" />
                  </div>
               </CardContent>
            </Card>
          </div>

          {/* Current Tenant Card */}
          <Card className="bg-slate-900/40 border-slate-800 shadow-xl overflow-hidden">
            <CardHeader className="border-b border-slate-800 pb-4">
               <CardTitle className="text-sm font-bold uppercase tracking-widest text-slate-500 flex items-center gap-2">
                 <User className="h-4 w-4" /> Current Occupancy
               </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              {tenant ? (
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                   <div className="flex items-center gap-4">
                      <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-xl font-bold text-white shadow-lg shadow-blue-500/20">
                         {tenant.email?.charAt(0).toUpperCase() || "T"}
                      </div>
                      <div>
                         <div className="text-lg font-bold text-white">{tenant.email}</div>
                         <div className="text-slate-500 text-sm">{tenant.phone || "No phone provided"}</div>
                         <Badge variant="outline" className="mt-2 text-[10px] bg-emerald-500/10 text-emerald-500 border-0">
                           ACTIVE TENANCY
                         </Badge>
                      </div>
                   </div>
                   <Button variant="outline" className="border-slate-800 text-slate-400" asChild>
                      <Link href={`/admin/tenants/${tenant.id}`}>View Profile</Link>
                   </Button>
                </div>
              ) : (
                <div className="text-center py-8">
                   <div className="h-12 w-12 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-500">
                      <ShieldCheck className="h-6 w-6" />
                   </div>
                   <h3 className="text-white font-bold mb-1">VACANT UNIT</h3>
                   <p className="text-slate-500 text-sm max-w-xs mx-auto">This apartment is currently available for new applications.</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Activity / Lease History (Placeholder) */}
          <Card className="bg-slate-900/40 border-slate-800 shadow-xl overflow-hidden">
            <CardHeader className="border-b border-slate-800 pb-4">
               <CardTitle className="text-sm font-bold uppercase tracking-widest text-slate-500 flex items-center gap-2">
                 <Calendar className="h-4 w-4" /> Recent Activity
               </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
               <div className="divide-y divide-slate-800">
                  <div className="p-4 flex items-center justify-between hover:bg-slate-800/20 transition-colors">
                     <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-500/10 text-blue-500 rounded-lg">
                           <FileText className="h-4 w-4" />
                        </div>
                        <div>
                           <p className="text-sm font-medium text-white">Apartment Status Updated</p>
                           <p className="text-xs text-slate-500">Manual update by administrator</p>
                        </div>
                     </div>
                     <span className="text-[10px] text-slate-600">{format(new Date(apartment.created_at), 'MMM dd, yyyy')}</span>
                  </div>
               </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Widgets */}
        <div className="space-y-8">
           <Card className="bg-slate-900 border-slate-800 shadow-xl">
              <CardHeader className="pb-3 border-b border-slate-800">
                 <CardTitle className="text-xs font-bold uppercase tracking-widest text-blue-500">Financial Summary</CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                 <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Base Rent</span>
                    <span className="text-white font-bold">GH₵ {apartment.monthly_rent?.toLocaleString()}</span>
                 </div>
                 <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Security Deposit</span>
                    <span className="text-white font-medium">GH₵ {(apartment.monthly_rent * 2).toLocaleString()}</span>
                 </div>
                 <div className="h-px bg-slate-800 my-2" />
                 <div className="flex justify-between text-sm">
                    <span className="text-slate-500 font-bold">Total Liability</span>
                    <span className="text-blue-400 font-bold italic">GH₵ {(apartment.monthly_rent * 3).toLocaleString()}</span>
                 </div>
              </CardContent>
           </Card>

           <Card className="bg-slate-900 border-slate-800 shadow-xl">
              <CardHeader className="pb-3 border-b border-slate-800">
                 <CardTitle className="text-xs font-bold uppercase tracking-widest text-emerald-500">Access Credentials</CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-6">
                 <div>
                    <label className="text-[10px] uppercase font-bold text-slate-600 block mb-2 tracking-tighter">Room Identifier</label>
                    <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-white font-mono text-center tracking-widest">
                       {apartment.room_number || "PENDING"}
                    </div>
                 </div>
                 <Button variant="ghost" className="w-full text-slate-500 text-xs hover:text-white hover:bg-slate-800 h-8">
                   Regenerate Access Details
                 </Button>
              </CardContent>
           </Card>
        </div>
      </div>
    </div>
  );
}
