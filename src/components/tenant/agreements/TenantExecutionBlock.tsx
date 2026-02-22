"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { SignaturePad } from "@/components/onboarding/SignaturePad";
import { signAgreement } from "@/actions/agreements";
import { FileSignature, ShieldAlert, CheckCircle2, Loader2 } from "lucide-react";

interface TenantExecutionBlockProps {
  agreementId: string;
  status: string;
}

export function TenantExecutionBlock({ agreementId, status }: TenantExecutionBlockProps) {
  const [signatureUrl, setSignatureUrl] = useState("");
  const [hasConsented, setHasConsented] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  if (status !== "PENDING_SIGNATURE") {
    if (status === "SIGNED") {
      return (
        <div className="bg-emerald-950/20 border border-emerald-500/30 rounded-2xl p-6 text-center">
           <CheckCircle2 className="h-10 w-10 text-emerald-500 mx-auto mb-3" />
           <h3 className="text-xl font-bold text-white mb-2">Agreement fully executed</h3>
           <p className="text-emerald-400">You may export your final copy as a PDF above for your records.</p>
        </div>
      );
    }
    return null; // Don't show anything for drafts
  }

  const handleSign = async () => {
    if (!signatureUrl) {
      toast.error("Please provide a digital signature to proceed.");
      return;
    }
    if (!hasConsented) {
      toast.error("Please explicitly consent to the terms of the agreement.");
      return;
    }

    setIsSubmitting(true);
    try {
      await signAgreement(agreementId, signatureUrl);
      toast.success("Tenancy Agreement Successfully Executed!");
      // Optionally redirect them to the tenant dashboard 
      // router.push("/tenant/dashboard");
    } catch (error: any) {
      toast.error(error.message || "Failed to execute agreement.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 mt-12 bg-slate-900/40 border border-slate-800 p-6 md:p-8 rounded-2xl relative overflow-hidden">
      <div className="flex items-center gap-3 mb-6 border-b border-slate-800 pb-4">
        <FileSignature className="h-6 w-6 text-blue-500" />
        <div>
          <h3 className="text-xl font-bold text-white">Execute Tenancy Contract</h3>
          <p className="text-slate-400 text-sm">Please provide your final digital signature below to bind this lease.</p>
        </div>
      </div>

      <div className="flex items-start gap-4 bg-slate-950/50 p-4 rounded-xl border border-slate-800 mb-6">
        <input 
          type="checkbox"
          id="consentTerms"
          checked={hasConsented}
          onChange={(e) => setHasConsented(e.target.checked)}
          className="mt-1 w-5 h-5 rounded bg-slate-900 border-slate-700 text-blue-600 focus:ring-blue-600 focus:ring-offset-slate-950"
        />
        <label htmlFor="consentTerms" className="text-sm text-slate-300 leading-relaxed cursor-pointer select-none">
          I have read and fully understand the terms & conditions detailed within this Tenancy Agreement.
          I agree that this digital signature is the legally binding equivalent to my handwritten signature, 
          and that I will adhere to all stipulations and financial responsibilities outlined in the generated contract.
        </label>
      </div>

      <div className="bg-slate-950/80 rounded-xl p-4 border border-slate-800">
        <h4 className="text-sm font-medium text-slate-400 mb-4 uppercase tracking-wider">Digital Ledger Signature</h4>
        <SignaturePad 
          onSave={setSignatureUrl} 
        />
      </div>

      <div className="pt-6">
        <Button 
          onClick={handleSign}
          disabled={!signatureUrl || !hasConsented || isSubmitting}
          className="w-full bg-blue-600 hover:bg-blue-500 text-white h-14 rounded-xl text-lg font-bold shadow-lg shadow-blue-600/20"
        >
          {isSubmitting ? (
            <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Finalizing Contract...</>
          ) : (
            "I Agree — formally Execute Contract"
          )}
        </Button>
      </div>
    </div>
  );
}
