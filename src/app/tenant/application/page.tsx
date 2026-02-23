import React from "react";
import { getTenantDashboard } from "@/actions/tenant-dashboard";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent } from "@/components/ui/card";
import { FileCheck, FileText, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

export default async function TenantApplicationPage() {
  const data = await getTenantDashboard();
  const { profile } = data;

  const supabase = await createClient();
  const { data: application } = await supabase
    .from("applications")
    .select("*")
    .eq("tenant_id", profile?.id)
    .single();

  if (!application) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4">
        <FileCheck className="h-16 w-16 text-slate-700" />
        <h1 className="text-2xl font-bold text-white">No Application Found</h1>
        <p className="text-slate-400 max-w-md">
          We couldn't find your original onboarding application record.
        </p>
      </div>
    );
  }

  // Parse JSON data safely
  const personalInfo = application.personal_info || {};
  const employmentInfo = application.employment_info || {};
  const emergencyInfo = application.emergency_contact || {};

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500 max-w-4xl mx-auto">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Your Application</h1>
          <p className="text-slate-400 font-medium mt-1">
            Review the details you provided during onboarding.
          </p>
        </div>
        <Button variant="outline" className="border-indigo-500/30 text-indigo-400 bg-indigo-500/10 hover:bg-indigo-500 hover:text-white group">
          <Download className="mr-2 h-4 w-4 group-hover:-translate-y-0.5 transition-transform" />
          Download PDF
        </Button>
      </div>

      <Card className="bg-slate-900/40 border-slate-800/50 backdrop-blur-sm shadow-2xl overflow-hidden">
        <div className="h-2 bg-gradient-to-r from-blue-500 to-indigo-500 w-full" />
        
        <CardContent className="p-8 space-y-10">
           
           <div className="flex items-center gap-4 border-b border-slate-800 pb-6">
              <div className="h-16 w-16 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-500">
                 <FileText className="h-8 w-8" />
              </div>
              <div>
                 <h2 className="text-2xl font-bold text-white">{personalInfo.firstName} {personalInfo.lastName}</h2>
                 <p className="text-slate-400">Application for {profile?.apartment?.unit_name}</p>
              </div>
           </div>

           {/* Personal Info */}
           <div>
              <h3 className="text-lg font-bold text-white mb-4 border-l-2 border-indigo-500 pl-3">Personal Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div className="bg-slate-800/20 p-4 rounded-xl border border-slate-800/50">
                    <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Full Name</p>
                    <p className="text-slate-200 font-medium">{personalInfo.firstName} {personalInfo.lastName}</p>
                 </div>
                 <div className="bg-slate-800/20 p-4 rounded-xl border border-slate-800/50">
                    <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Date of Birth</p>
                    <p className="text-slate-200 font-medium">{personalInfo.dateOfBirth}</p>
                 </div>
                 <div className="bg-slate-800/20 p-4 rounded-xl border border-slate-800/50">
                    <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Email</p>
                    <p className="text-slate-200 font-medium">{personalInfo.email}</p>
                 </div>
                 <div className="bg-slate-800/20 p-4 rounded-xl border border-slate-800/50">
                    <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Phone</p>
                    <p className="text-slate-200 font-medium">{personalInfo.phone}</p>
                 </div>
              </div>
           </div>

           {/* Employment Info */}
           <div>
              <h3 className="text-lg font-bold text-white mb-4 border-l-2 border-indigo-500 pl-3">Employment Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                 <div className="bg-slate-800/20 p-4 rounded-xl border border-slate-800/50">
                    <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Employer</p>
                    <p className="text-slate-200 font-medium">{employmentInfo.employerName || "N/A"}</p>
                 </div>
                 <div className="bg-slate-800/20 p-4 rounded-xl border border-slate-800/50">
                    <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Occupation</p>
                    <p className="text-slate-200 font-medium">{employmentInfo.occupation || "N/A"}</p>
                 </div>
                 <div className="bg-slate-800/20 p-4 rounded-xl border border-slate-800/50">
                    <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Monthly Income</p>
                    <p className="text-slate-200 font-medium">GH₵ {employmentInfo.monthlyIncome || "0"}</p>
                 </div>
              </div>
           </div>

           {/* Emergency Contact */}
           <div>
              <h3 className="text-lg font-bold text-white mb-4 border-l-2 border-indigo-500 pl-3">Emergency Contact</h3>
              <div className="bg-slate-800/20 p-5 rounded-xl border border-slate-800/50 flex flex-col md:flex-row gap-8">
                 <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Name</p>
                    <p className="text-slate-200 font-medium">{emergencyInfo.firstName} {emergencyInfo.lastName}</p>
                 </div>
                 <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Relationship</p>
                    <p className="text-slate-200 font-medium capitalize">{emergencyInfo.relationship}</p>
                 </div>
                 <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Phone</p>
                    <p className="text-slate-200 font-medium">{emergencyInfo.phone}</p>
                 </div>
              </div>
           </div>

        </CardContent>
      </Card>
    </div>
  );
}
