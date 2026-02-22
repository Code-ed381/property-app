"use client";

import React, { useState } from "react";
import { useOnboardingStore } from "@/stores/onboardingStore";
import { StepNavigation } from "@/components/onboarding/StepNavigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, User, Home, Briefcase, FileSignature, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { submitApplication } from "@/actions/applications"; // We will create this action

export function ReviewSubmitStep() {
  const { data } = useOnboardingStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleFinalSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Pass the entire Zustand data state to the server action
      await submitApplication(data);
      
      toast.success("Application successfully submitted!");
      router.push("/tenant/dashboard"); // Assuming they'll go to dashboard next Phase
    } catch (error: any) {
      toast.error(error.message || "Failed to submit application. Please try again.");
      setIsSubmitting(false);
    }
  };

  const DataRow = ({ label, value }: { label: string, value: React.ReactNode }) => (
    <div className="py-2 flex justify-between gap-4 border-b border-slate-800/30 last:border-0 hover:bg-slate-800/10 px-2 rounded -mx-2 transition-colors">
       <span className="text-sm text-slate-500 font-medium whitespace-nowrap">{label}</span>
       <span className="text-white text-sm text-right break-words">{value || "—"}</span>
    </div>
  );

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-emerald-400 mb-2 flex items-center gap-2">
           <CheckCircle2 className="h-6 w-6" /> Review Your Details
        </h2>
        <p className="text-slate-400">Please review your submission for accuracy before formal submission.</p>
      </div>

      <div className="space-y-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           
           <Card className="bg-slate-900/40 border-slate-800/50">
             <CardHeader className="pb-3 border-b border-slate-800/50">
               <CardTitle className="text-lg font-bold text-white flex items-center gap-2">
                 <User className="h-5 w-5 text-blue-500" /> Personal
               </CardTitle>
             </CardHeader>
             <CardContent className="pt-4">
                <DataRow label="Full Name" value={data.full_name} />
                <DataRow label="Date of Birth" value={data.date_of_birth} />
                <DataRow label="Current Address" value={data.current_address} />
                <DataRow label="Occupants" value={data.number_of_occupants} />
             </CardContent>
           </Card>

           <Card className="bg-slate-900/40 border-slate-800/50">
             <CardHeader className="pb-3 border-b border-slate-800/50">
               <CardTitle className="text-lg font-bold text-white flex items-center gap-2">
                 <Briefcase className="h-5 w-5 text-purple-500" /> Employment
               </CardTitle>
             </CardHeader>
             <CardContent className="pt-4">
                <DataRow label="Employer" value={data.employer_name} />
                <DataRow label="HR Phone" value={data.employer_phone} />
                <DataRow label="Income Bracket" value={data.monthly_income_range} />
                <DataRow label="Self-Reported Extra" value={data.additional_income_source ? `GH₵ ${data.additional_income_amount}` : "None"} />
             </CardContent>
           </Card>

           <Card className="bg-slate-900/40 border-slate-800/50 md:col-span-2">
             <CardHeader className="pb-3 border-b border-slate-800/50">
               <CardTitle className="text-lg font-bold text-white flex items-center gap-2">
                 <Home className="h-5 w-5 text-amber-500" /> Lifestyle & History
               </CardTitle>
             </CardHeader>
             <CardContent className="pt-4 grid grid-cols-1 md:grid-cols-2 gap-x-12">
                <div>
                   <DataRow label="Eviction History" value={data.has_eviction_history ? "Yes - Flagged" : "None"} />
                   <DataRow label="Smoker" value={data.is_smoker ? "Yes" : "No"} />
                   <DataRow label="Pets" value={data.has_pets ? data.pet_details : "No"} />
                </div>
                <div>
                   <DataRow label="Previous Landlord" value={data.previous_landlord || "N/A"} />
                   <DataRow label="Emergency Contact" value={data.emergency_name} />
                   <DataRow label="Reference Name" value={data.reference_name} />
                </div>
             </CardContent>
           </Card>

           <Card className="bg-slate-900/40 border-emerald-500/20 md:col-span-2 relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-bl-[100px] pointer-events-none" />
             <CardHeader className="pb-3 border-b border-slate-800/50">
               <CardTitle className="text-lg font-bold text-white flex items-center gap-2">
                 <FileSignature className="h-5 w-5 text-emerald-500" /> Legal Authorization
               </CardTitle>
             </CardHeader>
             <CardContent className="pt-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                  <div className="flex items-center gap-2 mb-2 text-emerald-400 font-medium">
                     <CheckCircle2 className="h-4 w-4" /> Consented to background verification
                  </div>
                  <div className="flex items-center gap-2 text-emerald-400 font-medium">
                     <CheckCircle2 className="h-4 w-4" /> Declared data absolute accuracy
                  </div>
                </div>
                {data.signature_url && (
                  <div className="bg-white rounded-xl p-2 h-20 w-48 flex items-center justify-center -rotate-2 border-2 border-slate-800 shadow-xl">
                     <img src={data.signature_url} alt="Applicant Signature" className="max-h-full max-w-full object-contain mix-blend-multiply" />
                  </div>
                )}
             </CardContent>
           </Card>

        </div>
      </div>

      <div className="bg-blue-900/10 border border-blue-500/20 rounded-2xl p-6 text-center text-blue-200">
         <p>By clicking submit, your application will be securely sent to the property administration team for formal review.</p>
      </div>

      <StepNavigation onNext={handleFinalSubmit} isLoading={isSubmitting} />
    </div>
  );
}
