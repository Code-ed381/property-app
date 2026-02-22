"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useOnboardingStore } from "@/stores/onboardingStore";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { StepNavigation } from "@/components/onboarding/StepNavigation";
import { Switch } from "@/components/ui/switch";

const step5Schema = z.object({
  has_eviction_history: z.boolean(),
  eviction_explanation: z.string().optional(),
  has_pets: z.boolean(),
  pet_details: z.string().optional(),
  is_smoker: z.boolean(),
  number_of_occupants: z.coerce.number().min(1, "Must have at least 1 occupant"),
  vehicle_info: z.string().optional(),
}).refine(data => !data.has_eviction_history || (data.eviction_explanation && data.eviction_explanation.length > 5), {
  message: "Please explain the eviction circumstances.",
  path: ["eviction_explanation"]
}).refine(data => !data.has_pets || (data.pet_details && data.pet_details.length > 2), {
  message: "Please provide details about your pets.",
  path: ["pet_details"]
});

type Step5Values = z.infer<typeof step5Schema>;

export function AdditionalInfoStep() {
  const { data, updateData, nextStep } = useOnboardingStore();

  const form = useForm<Step5Values>({
    resolver: zodResolver(step5Schema as any),
    defaultValues: {
      has_eviction_history: data.has_eviction_history,
      eviction_explanation: data.eviction_explanation,
      has_pets: data.has_pets,
      pet_details: data.pet_details,
      is_smoker: data.is_smoker,
      number_of_occupants: data.number_of_occupants,
      vehicle_info: data.vehicle_info,
    },
  });

  const onSubmit = (values: Step5Values) => {
    updateData(values);
    nextStep();
  };

  const watchEviction = form.watch("has_eviction_history");
  const watchPets = form.watch("has_pets");

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">Additional Lifestyle Information</h2>
        <p className="text-slate-400">Final few questions to complete your background profile.</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 flex flex-col min-h-[400px]">
          <div className="space-y-8 flex-1">
             
             {/* General Occupancy details */}
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 rounded-2xl bg-slate-900/40 border border-slate-800/80">
                <FormField control={form.control} name="number_of_occupants" render={({ field }) => (
                  <FormItem><FormLabel className="text-slate-300">Total Number of Occupants</FormLabel><FormControl>
                     <Input type="number" {...field} className="bg-slate-900 border-slate-700 text-white focus-visible:ring-blue-500/20" />
                  </FormControl><FormMessage /></FormItem>
                )} />

                <FormField control={form.control} name="vehicle_info" render={({ field }) => (
                  <FormItem><FormLabel className="text-slate-300">Vehicle Make / Model / Plate (if parking needed)</FormLabel><FormControl>
                     <Input placeholder="Honda Civic, Plate: GW-1234-22" {...field} className="bg-slate-900 border-slate-700 text-white focus-visible:ring-blue-500/20" />
                  </FormControl><FormMessage /></FormItem>
                )} />
             </div>

             {/* Toggles */}
             <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800/80 space-y-6">
                
                {/* Pets */}
                <div className="space-y-4">
                  <FormField control={form.control} name="has_pets" render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between p-4 rounded-xl border border-slate-700 bg-slate-900">
                      <div className="space-y-0.5">
                        <FormLabel className="text-white text-base">Do you own any pets?</FormLabel>
                        <p className="text-sm text-slate-500">We generally regulate pets depending on the specific unit rules.</p>
                      </div>
                      <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} className="data-[state=checked]:bg-blue-600" /></FormControl>
                    </FormItem>
                  )} />
                  {watchPets && (
                    <div className="pl-4 animate-in fade-in slide-in-from-top-2">
                       <FormField control={form.control} name="pet_details" render={({ field }) => (
                        <FormItem><FormLabel className="text-slate-300">Please describe them (Breed, weight, count)</FormLabel><FormControl>
                           <Input placeholder="E.g., 1 Golden Retriever, approx 25kg" {...field} className="bg-slate-900 border-slate-700 text-white focus-visible:ring-blue-500/20" />
                        </FormControl><FormMessage /></FormItem>
                      )} />
                    </div>
                  )}
                </div>

                {/* Smoking */}
                <FormField control={form.control} name="is_smoker" render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between p-4 rounded-xl border border-slate-700 bg-slate-900">
                     <div className="space-y-0.5">
                       <FormLabel className="text-white text-base">Do you smoke?</FormLabel>
                       <p className="text-sm text-slate-500">Note: All indoor spaces within this property are strictly non-smoking.</p>
                     </div>
                     <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} className="data-[state=checked]:bg-blue-600" /></FormControl>
                  </FormItem>
                )} />

                {/* Eviction */}
                <div className="space-y-4">
                  <FormField control={form.control} name="has_eviction_history" render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between p-4 rounded-xl border border-red-500/20 bg-red-500/5">
                      <div className="space-y-0.5">
                        <FormLabel className="text-white text-base">Have you ever been formally evicted?</FormLabel>
                        <p className="text-sm text-red-300">Answering yes does not automatically disqualify you.</p>
                      </div>
                      <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} className="data-[state=checked]:bg-blue-600" /></FormControl>
                    </FormItem>
                  )} />
                  {watchEviction && (
                    <div className="pl-4 animate-in fade-in slide-in-from-top-2">
                       <FormField control={form.control} name="eviction_explanation" render={({ field }) => (
                        <FormItem><FormLabel className="text-red-300">Please explain the circumstances briefly</FormLabel><FormControl>
                           <textarea {...field} className="flex min-h-[80px] w-full rounded-xl border border-red-500/30 bg-red-950/20 px-3 py-2 text-sm text-white placeholder:text-red-800/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500/20 disabled:cursor-not-allowed disabled:opacity-50" placeholder="Explanation..." />
                        </FormControl><FormMessage /></FormItem>
                      )} />
                    </div>
                  )}
                </div>

             </div>

          </div>

          <StepNavigation onNext={form.handleSubmit(onSubmit)} />
        </form>
      </Form>
    </div>
  );
}
