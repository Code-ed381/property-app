import React from "react";
import { getTenantDashboard } from "@/actions/tenant-dashboard";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import {
  CreditCard,
  Calendar,
  Home,
  AlertCircle,
  FileSignature,
  Wrench,
  CheckCircle2,
  Clock
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function TenantDashboardPage() {
  const data = await getTenantDashboard();
  const { profile, agreement, nextPayment, paymentHistory, maintenance } = data;

  if (!profile) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4">
        <Home className="h-16 w-16 text-slate-700" />
        <h1 className="text-2xl font-bold text-white">No Active Tenant Found</h1>
        <p className="text-slate-400 max-w-md">
          The dashboard is currently in demonstration mode and requires at least one 
          active tenant in the database to display data.
        </p>
        <div className="pt-4 flex gap-4">
          <Link href="/admin/apartments">
            <Button className="bg-blue-600 hover:bg-blue-500">Go to Admin</Button>
          </Link>
          <Button variant="outline" className="text-slate-300 border-slate-700" onClick={() => window.location.reload()}>
            Try Refreshing
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
      
      {/* Header and Welcome */}
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight">
          Welcome back, {profile.email?.split("@")[0] || "Tenant"}
        </h1>
        <p className="text-slate-400 font-medium mt-1">
          Here is an overview of your tenancy at <span className="text-blue-400">{profile.apartment?.unit_name}</span>.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Top Widget 1: Apartment Info */}
        <Card className="bg-slate-900/40 border-slate-800/50 backdrop-blur-sm md:col-span-1">
           <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4 text-slate-400">
                 <Home className="h-5 w-5 text-amber-500" />
                 <h2 className="text-sm font-semibold uppercase tracking-wider">Your Apartment</h2>
              </div>
              <p className="text-2xl font-bold text-white mb-1">{profile.apartment?.unit_name}</p>
              <p className="text-sm text-slate-500 mb-6">Unit {profile.apartment?.unit_number} • {profile.apartment?.type.replace("_", " ")}</p>
              
              <div className="p-3 bg-slate-800/30 rounded-xl space-y-3">
                 <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-400">Monthly Rent</span>
                    <span className="text-white font-medium">GH₵ {profile.apartment?.monthly_rent}</span>
                 </div>
                 <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-400">Lease Ends</span>
                    <span className="text-white font-medium">
                       {agreement?.lease_end ? format(new Date(agreement.lease_end), "MMM dd, yyyy") : "N/A"}
                    </span>
                 </div>
              </div>
           </CardContent>
        </Card>

        {/* Top Widget 2: Next Payment */}
        <Card className="bg-slate-900/40 border-slate-800/50 backdrop-blur-sm md:col-span-2 relative overflow-hidden">
           <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px] pointer-events-none" />
           <CardContent className="p-8 h-full flex flex-col justify-center">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-2 text-slate-400">
                     <CreditCard className="h-5 w-5 text-blue-500" />
                     <h2 className="text-sm font-semibold uppercase tracking-wider">Next Payment Due</h2>
                  </div>
                  {nextPayment ? (
                    <>
                      <div className="text-4xl md:text-5xl font-bold text-white mb-2">
                         GH₵ {nextPayment.amount}
                      </div>
                      <p className="text-slate-400 flex items-center gap-2">
                         <Calendar className="h-4 w-4" /> 
                         Due on {format(new Date(nextPayment.due_date), "MMMM dd, yyyy")}
                         {nextPayment.status === "OVERDUE" && (
                            <Badge className="bg-red-500/10 text-red-500 ml-2 animate-pulse">OVERDUE</Badge>
                         )}
                      </p>
                    </>
                  ) : (
                    <div className="py-4">
                      <p className="text-2xl font-bold text-emerald-400 flex items-center gap-2">
                         <CheckCircle2 className="h-6 w-6" /> All Caught Up!
                      </p>
                      <p className="text-slate-400 mt-2">You have no pending invoices.</p>
                    </div>
                  )}
                </div>
                {nextPayment && (
                   <Button className="bg-blue-600 hover:bg-blue-500 text-white rounded-xl shadow-lg shadow-blue-500/20 px-8 py-6 text-lg">
                      Pay Now
                   </Button>
                )}
              </div>
           </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Recent Payments */}
        <Card className="bg-slate-900/40 border-slate-800/50 backdrop-blur-sm">
           <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6 text-slate-400">
                 <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-emerald-500" />
                    <h2 className="text-sm font-semibold uppercase tracking-wider">Recent Payments</h2>
                 </div>
                 <Link href="/tenant/payments" className="text-xs text-blue-400 hover:text-blue-300 transition-colors">View All</Link>
              </div>
              <div className="space-y-4">
                 {paymentHistory.length > 0 ? paymentHistory.map((pmt: any) => (
                    <div key={pmt.id} className="flex items-center justify-between p-3 hover:bg-slate-800/30 rounded-xl transition-colors">
                       <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${pmt.status === 'PAID' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'}`}>
                             {pmt.status === 'PAID' ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                          </div>
                          <div>
                             <p className="text-sm font-medium text-white">{pmt.type} Payment</p>
                             <p className="text-xs text-slate-500">{format(new Date(pmt.due_date), "MMM dd, yyyy")}</p>
                          </div>
                       </div>
                       <div className="text-right">
                          <p className="text-sm font-bold text-white">GH₵ {pmt.amount}</p>
                          <p className="text-[10px] text-slate-500 uppercase">{pmt.status}</p>
                       </div>
                    </div>
                 )) : (
                    <p className="text-sm text-slate-500 py-4 text-center">No payment history yet.</p>
                 )}
              </div>
           </CardContent>
        </Card>

        {/* Maintenance / Agreement Status */}
        <div className="space-y-6">
          <Card className="bg-slate-900/40 border-slate-800/50 backdrop-blur-sm">
             <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4 text-slate-400">
                   <div className="flex items-center gap-2">
                      <Wrench className="h-5 w-5 text-indigo-500" />
                      <h2 className="text-sm font-semibold uppercase tracking-wider">Recent Tickets</h2>
                   </div>
                      <Link href="/tenant/maintenance" className="text-xs text-blue-400 hover:text-blue-300 transition-colors">New Request</Link>
                </div>
                <div className="space-y-3">
                   {maintenance.length > 0 ? maintenance.map((req: any) => (
                      <div key={req.id} className="p-3 bg-slate-800/20 rounded-xl border border-slate-800/50 border-l-4 border-l-indigo-500">
                         <div className="flex justify-between items-start">
                            <p className="text-sm font-medium text-white line-clamp-1">{req.title}</p>
                            <Badge variant="outline" className="text-[10px] scale-90 -mr-2 text-slate-400 border-slate-700 bg-slate-900">{req.status}</Badge>
                         </div>
                         <p className="text-xs text-slate-500 mt-1">{format(new Date(req.created_at), "MMM dd, yyyy")}</p>
                      </div>
                   )) : (
                      <p className="text-sm text-slate-500 py-4 text-center">No maintenance requests open.</p>
                   )}
                </div>
             </CardContent>
          </Card>

          <Card className="bg-slate-900/40 border-slate-800/50 backdrop-blur-sm hover:border-blue-500/30 transition-colors group">
             <Link href="/tenant/agreement" className="block h-full cursor-pointer">
               <CardContent className="p-6 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                     <div className="h-10 w-10 bg-blue-500/10 text-blue-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                        <FileSignature className="h-5 w-5" />
                     </div>
                     <div>
                        <h2 className="text-sm font-semibold text-white">Tenancy Agreement</h2>
                        <p className="text-xs text-slate-500 mt-0.5">Status: <span className="text-blue-400">{agreement?.status || "Generating..."}</span></p>
                     </div>
                  </div>
                  <Button variant="ghost" size="sm" className="text-blue-400 border border-blue-500/20 bg-blue-500/5 rounded-lg group-hover:bg-blue-500/20 transition-colors">
                     View
                  </Button>
               </CardContent>
             </Link>
          </Card>
        </div>

      </div>
    </div>
  );
}
