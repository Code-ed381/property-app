"use client";

import React from "react";
import { useOnboardingStore } from "@/stores/onboardingStore";
import { Check } from "lucide-react";

const STEPS = [
  "Personal Info",
  "Rental History",
  "Employment",
  "References",
  "Additional Info",
  "Consent",
  "Review & Submit"
];

export function Stepper() {
  const currentStep = useOnboardingStore((state) => state.currentStep);

  return (
    <div className="w-full">
      {/* Mobile progress summary */}
      <div className="md:hidden flex items-center justify-between mb-6">
        <span className="text-sm font-medium text-blue-400">Step {currentStep} of {STEPS.length}</span>
        <span className="text-sm font-medium text-white">{STEPS[currentStep - 1]}</span>
      </div>
      
      {/* Desktop progress bar */}
      <div className="hidden md:flex items-center justify-between relative mb-12">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-[2px] bg-slate-800 -z-10" />
        <div 
          className="absolute left-0 top-1/2 -translate-y-1/2 h-[2px] bg-blue-500 transition-all duration-500 ease-in-out -z-10"
          style={{ width: `${((currentStep - 1) / (STEPS.length - 1)) * 100}%` }}
        />
        
        {STEPS.map((stepName, index) => {
          const stepNumber = index + 1;
          const isActive = stepNumber === currentStep;
          const isCompleted = stepNumber < currentStep;

          return (
            <div key={stepName} className="flex flex-col items-center gap-3">
              <div 
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-all duration-300 ${
                  isActive 
                    ? "bg-blue-600 text-white shadow-[0_0_20px_rgba(37,99,235,0.4)] border-2 border-blue-400" 
                    : isCompleted
                      ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                      : "bg-slate-900 border border-slate-800 text-slate-500"
                }`}
              >
                {isCompleted ? <Check className="w-5 h-5" /> : stepNumber}
              </div>
              <span className={`text-xs font-medium whitespace-nowrap hidden lg:block ${
                isActive ? "text-white" : isCompleted ? "text-slate-300" : "text-slate-500"
              }`}>
                {stepName}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
