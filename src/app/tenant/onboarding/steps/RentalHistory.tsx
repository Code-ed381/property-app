"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useOnboardingStore } from "@/stores/onboardingStore";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { StepNavigation } from "@/components/onboarding/StepNavigation";

const step2Schema = z.object({
  previous_landlord: z.string().optional(),
  previous_landlord_phone: z.string().optional(),
  previous_rent_amount: z.string().optional(),
  reason_for_leaving: z.string().optional(),
});

type Step2Values = z.infer<typeof step2Schema>;

export function RentalHistoryStep() {
  const { data, updateData, nextStep } = useOnboardingStore();

  const form = useForm<Step2Values>({
    resolver: zodResolver(step2Schema),
    defaultValues: {
      previous_landlord: data.previous_landlord,
      previous_landlord_phone: data.previous_landlord_phone,
      previous_rent_amount: data.previous_rent_amount,
      reason_for_leaving: data.reason_for_leaving,
    },
  });

  const onSubmit = (values: Step2Values) => {
    updateData(values);
    nextStep();
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">Rental History</h2>
        <p className="text-slate-400">Tell us about your previous living situation (Optional).</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 flex flex-col min-h-[400px]">
          <div className="space-y-6 flex-1">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField control={form.control} name="previous_landlord" render={({ field }) => (
                  <FormItem><FormLabel className="text-slate-300">Previous Landlord Name</FormLabel><FormControl>
                    <Input placeholder="John Smith" {...field} className="bg-slate-900/50 border-slate-700 text-white focus-visible:ring-blue-500/20" />
                  </FormControl><FormMessage /></FormItem>
                )} />

                <FormField control={form.control} name="previous_landlord_phone" render={({ field }) => (
                  <FormItem><FormLabel className="text-slate-300">Landlord Phone Number</FormLabel><FormControl>
                    <Input placeholder="+233 24..." {...field} className="bg-slate-900/50 border-slate-700 text-white focus-visible:ring-blue-500/20" />
                  </FormControl><FormMessage /></FormItem>
                )} />

                <FormField control={form.control} name="previous_rent_amount" render={({ field }) => (
                  <FormItem><FormLabel className="text-slate-300">Monthly Rent Amount (GH₵)</FormLabel><FormControl>
                    <Input type="number" placeholder="1000" {...field} className="bg-slate-900/50 border-slate-700 text-white focus-visible:ring-blue-500/20" />
                  </FormControl><FormMessage /></FormItem>
                )} />

                <FormField control={form.control} name="reason_for_leaving" render={({ field }) => (
                  <FormItem className="md:col-span-2"><FormLabel className="text-slate-300">Reason for leaving</FormLabel><FormControl>
                    <Input placeholder="E.g., Relocating for work, need more space" {...field} className="bg-slate-900/50 border-slate-700 text-white focus-visible:ring-blue-500/20" />
                  </FormControl><FormMessage /></FormItem>
                )} />
             </div>
          </div>

          <StepNavigation onNext={form.handleSubmit(onSubmit)} />
        </form>
      </Form>
    </div>
  );
}
