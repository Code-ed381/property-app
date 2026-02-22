"use client";

import React from "react";
import { useOnboardingStore } from "@/stores/onboardingStore";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Check } from "lucide-react";

interface StepNavigationProps {
  onNext?: () => void;
  isNextDisabled?: boolean;
  isLoading?: boolean;
}

export function StepNavigation({ onNext, isNextDisabled = false, isLoading = false }: StepNavigationProps) {
  const { currentStep, prevStep } = useOnboardingStore();
  const isLastStep = currentStep === 7;

  return (
    <div className="flex items-center justify-between w-full pt-8 mt-8 border-t border-slate-800">
      <Button
        type="button"
        variant="outline"
        onClick={prevStep}
        className={`border-slate-800 bg-slate-900/50 hover:bg-slate-800 text-slate-300 h-12 rounded-xl px-6 transition-all ${
          currentStep === 1 ? "invisible" : ""
        }`}
      >
        <ChevronLeft className="mr-2 h-4 w-4" />
        Back
      </Button>

      <Button
        type="button"
        onClick={onNext}
        disabled={isNextDisabled || isLoading}
        className="bg-blue-600 hover:bg-blue-500 text-white shadow-[0_0_20px_rgba(37,99,235,0.3)] h-12 rounded-xl px-8 transition-all"
      >
        {isLastStep ? (
           <>{isLoading ? "Submitting..." : <><Check className="mr-2 h-4 w-4" /> Submit Application</>}</>
        ) : (
           <>Continue <ChevronRight className="ml-2 h-4 w-4" /></>
        )}
      </Button>
    </div>
  );
}
