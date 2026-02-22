"use client";

import React from "react";
import { useOnboardingStore } from "@/stores/onboardingStore";
import { Stepper } from "@/components/onboarding/Stepper";
import { PersonalInfoStep } from "./steps/PersonalInfo";
import { RentalHistoryStep } from "./steps/RentalHistory";
import { EmploymentStep } from "./steps/Employment";
import { ReferencesStep } from "./steps/References";
import { AdditionalInfoStep } from "./steps/AdditionalInfo";
import { ConsentStep } from "./steps/Consent";
import { ReviewSubmitStep } from "./steps/ReviewSubmit";
import { Building2 } from "lucide-react";

export default function TenantOnboardingPage() {
  const currentStep = useOnboardingStore((state) => state.currentStep);

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <PersonalInfoStep />;
      case 2:
        return <RentalHistoryStep />;
      case 3:
        return <EmploymentStep />;
      case 4:
        return <ReferencesStep />;
      case 5:
        return <AdditionalInfoStep />;
      case 6:
        return <ConsentStep />;
      case 7:
        return <ReviewSubmitStep />;
      default:
        return <PersonalInfoStep />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-300 flex flex-col items-center justify-center p-4">
      
      <div className="w-full max-w-4xl animate-in fade-in slide-in-from-bottom-4 duration-700">
         
         {/* Branding / Header */}
         <div className="flex flex-col items-center text-center mb-12">
            <div className="h-16 w-16 bg-blue-600 rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(37,99,235,0.4)] mb-6">
              <Building2 className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-4">
              Welcome to <span className="text-blue-500">PILAS Properties</span>
            </h1>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              Please complete this brief application to formally onboard and finalize your pending tenancy.
            </p>
         </div>

         {/* Form Container */}
         <div className="bg-slate-900/40 border border-slate-800/80 backdrop-blur-xl rounded-3xl p-6 md:p-10 shadow-2xl relative overflow-hidden">
            {/* Background glowing effects */}
            <div className="absolute top-0 right-0 -m-32 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 -m-32 w-64 h-64 bg-indigo-500/10 rounded-full blur-[80px] pointer-events-none" />

            <div className="relative">
              <Stepper />
              <div className="mt-8 transition-all">
                {renderStep()}
              </div>
            </div>
         </div>

         <div className="mt-8 text-center">
            <p className="text-xs text-slate-500 font-medium tracking-wide uppercase">
              Secure form 256-bit encryption • Confidential submission
            </p>
         </div>

      </div>

    </div>
  );
}
