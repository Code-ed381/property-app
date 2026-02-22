"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useOnboardingStore } from "@/stores/onboardingStore";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { StepNavigation } from "@/components/onboarding/StepNavigation";
import { SignaturePad } from "@/components/onboarding/SignaturePad";
import { ShieldAlert, FileSignature } from "lucide-react";

const step6Schema = z.object({
  consent_background_check: z.boolean().refine(val => val === true, {
    message: "You must consent to background checks to proceed."
  }),
  declaration_accurate: z.boolean().refine(val => val === true, {
    message: "You must declare that all information is accurate."
  }),
  signature_url: z.string().min(50, "A valid digital signature is required to certify this application.") // Ensures it's a data URL
});

type Step6Values = z.infer<typeof step6Schema>;

export function ConsentStep() {
  const { data, updateData, nextStep } = useOnboardingStore();
  const [signatureError, setSignatureError] = useState("");

  const form = useForm<Step6Values>({
    resolver: zodResolver(step6Schema),
    defaultValues: {
      consent_background_check: data.consent_background_check,
      declaration_accurate: data.declaration_accurate,
      signature_url: data.signature_url,
    },
  });

  const onSubmit = (values: Step6Values) => {
    updateData(values);
    nextStep();
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">Legal Consents & Signatures</h2>
        <p className="text-slate-400">Please read carefully, provide your consent, and digitally sign below.</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 flex flex-col min-h-[400px]">
          <div className="space-y-8 flex-1">
             
             {/* Read document block */}
             <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800/80">
                <div className="flex items-center gap-3 mb-4">
                   <ShieldAlert className="h-5 w-5 text-blue-500" />
                   <h3 className="text-lg font-bold text-white">Declarations & Authorizations</h3>
                </div>
                
                <div className="h-[200px] w-full rounded-xl border border-slate-800 bg-slate-950/80 p-4 overflow-y-auto">
                  <div className="text-sm text-slate-300 space-y-4 pr-4">
                    <p>I understand that this is a routine application to establish credit, character, employment, and rental history. I also understand that this is NOT an agreement to rent and that all applications must be approved.</p>
                    <p>I authorize the verification of references given. I declare that the statements above are true and correct, and I agree that the landlord may terminate my agreement entered into in reliance on any misstatement made above.</p>
                    <p>I consent to the collection, use, and disclosure of my personal information by the Landlord and/or agent of the Landlord, from time to time, for the purpose of communicating with me, determining my initial and ongoing credit standing, evaluating my tenancy application, and assessing my suitability for tenancy.</p>
                     <p>I authorize the receipt and exchange of credit information from credit reporting agencies and other sources.</p>
                  </div>
                </div>
             </div>

             {/* Toggles */}
             <div className="space-y-4 px-2">
                <FormField control={form.control} name="consent_background_check" render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-xl border-slate-700 bg-transparent p-4">
                    <FormControl>
                      <input 
                        type="checkbox" 
                        checked={field.value} 
                        onChange={(e) => field.onChange(e.target.checked)}
                        className="w-5 h-5 rounded bg-slate-900 border-slate-700 text-blue-600 focus:ring-blue-600 focus:ring-offset-slate-950 mt-1"
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel className="text-white text-base">I consent to background and credit checks.</FormLabel>
                      <FormMessage className="text-red-400 mt-2" />
                    </div>
                  </FormItem>
                )} />

                <FormField control={form.control} name="declaration_accurate" render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-xl border-slate-700 bg-transparent p-4">
                    <FormControl>
                      <input 
                        type="checkbox" 
                        checked={field.value} 
                        onChange={(e) => field.onChange(e.target.checked)}
                        className="w-5 h-5 rounded bg-slate-900 border-slate-700 text-blue-600 focus:ring-blue-600 focus:ring-offset-slate-950 mt-1"
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel className="text-white text-base">I declare that all information provided in this application is entirely accurate and truthful under penalty of perjury.</FormLabel>
                      <FormMessage className="text-red-400 mt-2" />
                    </div>
                  </FormItem>
                )} />
             </div>

             {/* Signature block */}
             <div className="p-6 rounded-2xl bg-blue-950/10 border border-blue-500/20">
                <div className="flex items-center gap-3 mb-6">
                   <FileSignature className="h-5 w-5 text-blue-500" />
                   <h3 className="text-lg font-bold text-white">Digital Signature</h3>
                </div>

                <FormField control={form.control} name="signature_url" render={({ field }) => (
                  <FormItem>
                     <FormControl>
                        <SignaturePad 
                           initialDataUrl={field.value}
                           onSave={(dataUrl) => {
                             field.onChange(dataUrl);
                             form.clearErrors("signature_url");
                           }}
                        />
                     </FormControl>
                     <FormMessage className="text-red-400 text-center font-medium block !mt-4" />
                  </FormItem>
                )} />
             </div>
          </div>

          <StepNavigation onNext={form.handleSubmit(onSubmit)} />
        </form>
      </Form>
    </div>
  );
}
