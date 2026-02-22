"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useOnboardingStore } from "@/stores/onboardingStore";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { StepNavigation } from "@/components/onboarding/StepNavigation";
import { Users, AlertTriangle } from "lucide-react";

const step4Schema = z.object({
  reference_name: z.string().min(2, "Reference name is required"),
  reference_relationship: z.string().min(2, "Relationship is required"),
  reference_phone: z.string().min(5, "Reference phone is required"),
  emergency_name: z.string().min(2, "Emergency contact name is required"),
  emergency_relationship: z.string().min(2, "Relationship is required"),
  emergency_phone: z.string().min(5, "Emergency phone is required"),
});

type Step4Values = z.infer<typeof step4Schema>;

export function ReferencesStep() {
  const { data, updateData, nextStep } = useOnboardingStore();

  const form = useForm<Step4Values>({
    resolver: zodResolver(step4Schema),
    defaultValues: {
      reference_name: data.reference_name,
      reference_relationship: data.reference_relationship,
      reference_phone: data.reference_phone,
      emergency_name: data.emergency_name,
      emergency_relationship: data.emergency_relationship,
      emergency_phone: data.emergency_phone,
    },
  });

  const onSubmit = (values: Step4Values) => {
    updateData(values);
    nextStep();
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">References & Emergency Contacts</h2>
        <p className="text-slate-400">Please provide people we can contact for character validation and in case of emergencies.</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 flex flex-col min-h-[400px]">
          <div className="space-y-8 flex-1">
             
             {/* Character Reference */}
             <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800/80 space-y-4">
                <div className="flex items-center gap-3 mb-6">
                   <div className="h-10 w-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500">
                     <Users className="h-5 w-5" />
                   </div>
                   <div>
                     <h3 className="text-lg font-bold text-white">Character Reference</h3>
                     <p className="text-sm text-slate-500">Someone who can vouch for your character (non-relative preferred).</p>
                   </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField control={form.control} name="reference_name" render={({ field }) => (
                    <FormItem className="md:col-span-2"><FormLabel className="text-slate-300">Full Name</FormLabel><FormControl>
                      <Input placeholder="Jane Doe" {...field} className="bg-slate-900 border-slate-700 text-white focus-visible:ring-blue-500/20" />
                    </FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="reference_relationship" render={({ field }) => (
                    <FormItem><FormLabel className="text-slate-300">Relationship to you</FormLabel><FormControl>
                      <Input placeholder="E.g., Co-worker, Manager" {...field} className="bg-slate-900 border-slate-700 text-white focus-visible:ring-blue-500/20" />
                    </FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="reference_phone" render={({ field }) => (
                    <FormItem><FormLabel className="text-slate-300">Phone Number</FormLabel><FormControl>
                      <Input placeholder="+233 50..." {...field} className="bg-slate-900 border-slate-700 text-white focus-visible:ring-blue-500/20" />
                    </FormControl><FormMessage /></FormItem>
                  )} />
                </div>
             </div>

             {/* Emergency Contact */}
             <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800/80 space-y-4">
                <div className="flex items-center gap-3 mb-6">
                   <div className="h-10 w-10 rounded-full bg-red-500/10 flex items-center justify-center text-red-500">
                     <AlertTriangle className="h-5 w-5" />
                   </div>
                   <div>
                     <h3 className="text-lg font-bold text-white">Emergency Contact</h3>
                     <p className="text-sm text-slate-500">Who should we contact immediately in case of an emergency?</p>
                   </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField control={form.control} name="emergency_name" render={({ field }) => (
                    <FormItem className="md:col-span-2"><FormLabel className="text-slate-300">Full Name</FormLabel><FormControl>
                      <Input placeholder="John Doe Sr." {...field} className="bg-slate-900 border-slate-700 text-white focus-visible:ring-blue-500/20" />
                    </FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="emergency_relationship" render={({ field }) => (
                    <FormItem><FormLabel className="text-slate-300">Relationship to you</FormLabel><FormControl>
                      <Input placeholder="E.g., Father, Spouse, Sibling" {...field} className="bg-slate-900 border-slate-700 text-white focus-visible:ring-blue-500/20" />
                    </FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="emergency_phone" render={({ field }) => (
                    <FormItem><FormLabel className="text-slate-300">Emergency Phone Number</FormLabel><FormControl>
                      <Input placeholder="+233 24..." {...field} className="bg-slate-900 border-slate-700 text-white focus-visible:ring-blue-500/20" />
                    </FormControl><FormMessage /></FormItem>
                  )} />
                </div>
             </div>

          </div>

          <StepNavigation onNext={form.handleSubmit(onSubmit)} />
        </form>
      </Form>
    </div>
  );
}
