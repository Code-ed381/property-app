import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getApartmentById } from "@/actions/apartments";
import { ChevronLeft, Edit, Building2, Calendar, DollarSign, KeyRound, CheckCircle2, CircleDashed, Users, Droplet, Archive } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArchiveButton } from "@/components/admin/apartments/archive-button";

export default async function ApartmentDetailsPage(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;
  const apartment = await getApartmentById(id);

  if (!apartment) {
    notFound();
  }

  const isArchived = apartment.status === "ARCHIVED";

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "VACANT":
        return <Badge className="bg-green-500/10 text-green-500 hover:bg-green-500/20 border-green-500/20 px-3 py-1">Vacant</Badge>;
      case "OCCUPIED":
        return <Badge className="bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 border-blue-500/20 px-3 py-1">Occupied</Badge>;
      case "MAINTENANCE":
        return <Badge className="bg-amber-500/10 text-amber-500 hover:bg-amber-500/20 border-amber-500/20 px-3 py-1">Maintenance</Badge>;
      case "ARCHIVED":
        return <Badge className="bg-slate-500/10 text-slate-500 hover:bg-slate-500/20 border-slate-500/20 px-3 py-1">Archived</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const UtilityRow = ({ name, enabled, monthly, annual }: { name: string, enabled: boolean, monthly: number, annual: number }) => (
    <div className="flex items-center justify-between py-3 border-b border-slate-800/50 last:border-0">
      <div className="flex items-center gap-3">
        {enabled ? (
          <CheckCircle2 className="h-5 w-5 text-green-500" />
        ) : (
          <CircleDashed className="h-5 w-5 text-slate-600" />
        )}
        <span className="text-slate-300 font-medium">{name}</span>
      </div>
      <div className="text-right">
        {enabled ? (
          <div className="flex flex-col">
            <span className="text-white font-semibold">GH₵ {monthly.toLocaleString()}/mo</span>
            <span className="text-xs text-slate-500">GH₵ {annual.toLocaleString()}/yr</span>
          </div>
        ) : (
          <span className="text-slate-500 text-sm">Disabled</span>
        )}
      </div>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
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
              {getStatusBadge(apartment.status)}
            </div>
            <p className="text-slate-400 mt-1 font-medium flex items-center gap-2">
               Unit {apartment.unit_number} • Level {apartment.floor} • {apartment.type.replace('_', ' ')}
            </p>
          </div>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
           <ArchiveButton id={id} isArchived={isArchived} />
           <Link href={`/admin/apartments/${id}/edit`}>
            <Button className="bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/20 rounded-xl px-5 h-11">
              <Edit className="mr-2 h-4 w-4" />
              Edit details
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column - Main Details */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-slate-900/40 border-slate-800/50 backdrop-blur-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5">
              <Building2 className="w-48 h-48" />
            </div>
            <CardHeader>
              <CardTitle className="text-xl font-bold text-white flex items-center gap-2">
                <Building2 className="h-5 w-5 text-blue-500" /> Room & Access Details
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-8">
              <div>
                <p className="text-sm font-medium text-slate-500 mb-1">Room Identifier</p>
                <div className="flex items-center gap-2">
                  <KeyRound className="h-4 w-4 text-slate-400" />
                  <p className="text-lg font-semibold text-white tracking-wide">{apartment.room_number}</p>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500 mb-1">Monthly Rent</p>
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-slate-400" />
                  <p className="text-lg font-semibold text-green-400">GH₵ {Number(apartment.monthly_rent).toLocaleString()}</p>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500 mb-1">Standard Lease Term</p>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-slate-400" />
                  <p className="text-white font-medium">{apartment.lease_months} Months</p>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500 mb-1">Passcode (Encrypted)</p>
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    {[1,2,3,4,5,6].map((i) => (
                      <div key={i} className="w-2 h-2 rounded-full bg-slate-600" />
                    ))}
                  </div>
                </div>
              </div>
              {apartment.description && (
                <div className="col-span-2 mt-4">
                   <p className="text-sm font-medium text-slate-500 mb-2">Description</p>
                   <p className="text-slate-300 leading-relaxed text-sm bg-slate-950/50 p-4 rounded-xl border border-slate-800/50">
                     {apartment.description}
                   </p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="bg-slate-900/40 border-slate-800/50 backdrop-blur-sm">
             <CardHeader>
               <CardTitle className="text-xl font-bold text-white flex items-center gap-2">
                 <Droplet className="h-5 w-5 text-blue-500" /> Utility Configuration
               </CardTitle>
               <CardDescription className="text-slate-400">Services tied to this specific unit.</CardDescription>
             </CardHeader>
             <CardContent>
                <UtilityRow 
                  name="Water & Security" 
                  enabled={apartment.water_enabled} 
                  monthly={apartment.water_monthly_rate} 
                  annual={apartment.water_annual_rate} 
                />
                <UtilityRow 
                  name="Sewage Processing" 
                  enabled={apartment.sewage_enabled} 
                  monthly={apartment.sewage_monthly_rate} 
                  annual={apartment.sewage_annual_rate} 
                />
                <UtilityRow 
                  name="Cleaning & Garbage" 
                  enabled={apartment.cleaning_enabled} 
                  monthly={apartment.cleaning_monthly_rate} 
                  annual={apartment.cleaning_annual_rate} 
                />
             </CardContent>
          </Card>
        </div>

        {/* Right Column - Tenant & Status */}
        <div className="space-y-6">
          <Card className="bg-slate-900/40 border-slate-800/50 backdrop-blur-sm">
             <CardHeader>
               <CardTitle className="text-xl font-bold text-white flex items-center gap-2">
                 <Users className="h-5 w-5 text-blue-500" /> Occupancy Status
               </CardTitle>
             </CardHeader>
             <CardContent>
                {apartment.status === "OCCUPIED" && apartment.tenant ? (
                  <div className="space-y-4">
                     <div className="flex items-center gap-3 pb-4 border-b border-slate-800/50">
                        <div className="h-12 w-12 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 text-lg font-bold">
                          {apartment.tenant.email?.charAt(0).toUpperCase() || 'T'}
                        </div>
                        <div>
                           <p className="text-white font-medium">{apartment.tenant.email || 'N/A'}</p>
                           <p className="text-sm text-slate-400">{apartment.tenant.phone || 'No phone recorded'}</p>
                        </div>
                     </div>
                     <Button variant="outline" className="w-full border-slate-800 bg-slate-900/50 hover:bg-slate-800 text-white" asChild>
                        <Link href={`/admin/tenants/${apartment.tenant.id}`}>View Tenant Profile</Link>
                     </Button>
                  </div>
                ) : (
                  <div className="py-8 text-center bg-slate-950/50 rounded-xl border border-slate-800/50 border-dashed">
                      <Users className="h-10 w-10 text-slate-600 mx-auto mb-3" />
                      <p className="text-slate-400 font-medium">No active tenant</p>
                      <p className="text-xs text-slate-500 mt-1">This unit is currently vacant</p>
                  </div>
                )}
             </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}
