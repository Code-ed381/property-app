import React from "react";
import { getTenantDashboard } from "@/actions/tenant-dashboard";
import { User, Shield, CheckCircle2 } from "lucide-react";

export default async function TenantSettingsPage() {
  const data = await getTenantDashboard();
  const profile = data.profile;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight">Account Settings</h1>
        <p className="text-slate-400 font-medium mt-1">
          Manage your contact information and security preferences.
        </p>
      </div>

      <div className="space-y-6">
         {/* Profile Card */}
         <div className="bg-slate-900/40 p-6 md:p-8 rounded-2xl border border-slate-800/50 backdrop-blur-sm">
            <div className="flex items-center gap-4 mb-6 text-slate-400 border-b border-slate-800/50 pb-4">
               <User className="h-6 w-6 text-blue-500" />
               <h2 className="text-lg font-semibold uppercase tracking-wider text-white">Basic Profile</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div>
                  <label className="text-xs uppercase tracking-wider text-slate-500 font-semibold mb-2 block">Email Address</label>
                  <p className="text-white bg-slate-950 p-4 rounded-xl border border-slate-800 flex items-center justify-between">
                     {profile?.email} 
                     <CheckCircle2 className="text-emerald-500 h-4 w-4" />
                  </p>
               </div>
               <div>
                  <label className="text-xs uppercase tracking-wider text-slate-500 font-semibold mb-2 block">Phone Number</label>
                  <p className="text-white bg-slate-950 p-4 rounded-xl border border-slate-800">
                     {profile?.phone || "Not provided during onboarding."}
                  </p>
               </div>
               <div>
                  <label className="text-xs uppercase tracking-wider text-slate-500 font-semibold mb-2 block">Apartment Assigned</label>
                  <p className="text-white bg-blue-900/20 text-blue-300 p-4 rounded-xl border border-blue-500/20">
                     Unit {profile?.apartment?.unit_number} ({profile?.apartment?.unit_name})
                  </p>
               </div>
            </div>
         </div>

         {/* Security Card */}
         <div className="bg-slate-900/40 p-6 md:p-8 rounded-2xl border border-slate-800/50 backdrop-blur-sm">
            <div className="flex items-center gap-4 mb-6 text-slate-400 border-b border-slate-800/50 pb-4">
               <Shield className="h-6 w-6 text-emerald-500" />
               <h2 className="text-lg font-semibold uppercase tracking-wider text-white">Security & Access</h2>
            </div>
            
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-slate-950 p-6 rounded-xl border border-slate-800">
               <div>
                  <p className="text-white font-medium mb-1">Passcode Management</p>
                  <p className="text-sm text-slate-500">
                     Your account uses a room number and a 6-digit passcode for entry. 
                     Change your passcode regularly to maintain platform security.
                  </p>
               </div>
               <button className="whitespace-nowrap px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-medium transition-colors">
                  Change Passcode
               </button>
            </div>
         </div>
         
      </div>
    </div>
  );
}
