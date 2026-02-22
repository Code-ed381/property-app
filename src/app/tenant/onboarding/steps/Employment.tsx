"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useOnboardingStore } from "@/stores/onboardingStore";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { StepNavigation } from "@/components/onboarding/StepNavigation";

const step3Schema = z.object({
  employer_name: z.string().min(2, "Employer name is required"),
  employer_address: z.string().min(5, "Employer address is required"),
  employer_phone: z.string().min(5, "Employer phone is required"),
  monthly_income_range: z.string().min(1, "Please select an income range"),
  employment_length: z.string().min(1, "Please indicate length of employment"),
  additional_income_source: z.string().optional(),
  additional_income_amount: z.string().optional(),
});

type Step3Values = z.infer<typeof step3Schema>;

export function EmploymentStep() {
  const { data, updateData, nextStep } = useOnboardingStore();

  const form = useForm<Step3Values>({
    resolver: zodResolver(step3Schema),
    defaultValues: {
      employer_name: data.employer_name,
      employer_address: data.employer_address,
      employer_phone: data.employer_phone,
      monthly_income_range: data.monthly_income_range,
      employment_length: data.employment_length,
      additional_income_source: data.additional_income_source,
      additional_income_amount: data.additional_income_amount,
    },
  });

  const onSubmit = (values: Step3Values) => {
    updateData(values);
    nextStep();
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">Employment & Income</h2>
        <p className="text-slate-400">Please provide details to verify your ability to meet rental obligations.</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 flex flex-col min-h-[400px]">
          <div className="space-y-6 flex-1">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                <FormField control={form.control} name="employer_name" render={({ field }) => (
                  <FormItem><FormLabel className="text-slate-300">Employer / Company Name *</FormLabel><FormControl>
                    <Input placeholder="Tech Corp Inc." {...field} className="bg-slate-900/50 border-slate-700 text-white focus-visible:ring-blue-500/20" />
                  </FormControl><FormMessage /></FormItem>
                )} />

                <FormField control={form.control} name="employer_address" render={({ field }) => (
                  <FormItem><FormLabel className="text-slate-300">Employer Address *</FormLabel><FormControl>
                    <Input placeholder="Address" {...field} className="bg-slate-900/50 border-slate-700 text-white focus-visible:ring-blue-500/20" />
                  </FormControl><FormMessage /></FormItem>
                )} />

                <FormField control={form.control} name="employer_phone" render={({ field }) => (
                  <FormItem><FormLabel className="text-slate-300">Employer Phone / HR Contact *</FormLabel><FormControl>
                    <Input placeholder="+233 30..." {...field} className="bg-slate-900/50 border-slate-700 text-white focus-visible:ring-blue-500/20" />
                  </FormControl><FormMessage /></FormItem>
                )} />

                <FormField control={form.control} name="employment_length" render={({ field }) => (
                  <FormItem>
                     <FormLabel className="text-slate-300">Length of Employment *</FormLabel>
                     <Select onValueChange={field.onChange} defaultValue={field.value}>
                       <FormControl><SelectTrigger className="bg-slate-900/50 border-slate-700 text-white"><SelectValue placeholder="Select length" /></SelectTrigger></FormControl>
                       <SelectContent className="bg-slate-900 border-slate-800 text-slate-200">
                         <SelectItem value="Less than 6 months">Less than 6 months</SelectItem>
                         <SelectItem value="6 months - 1 year">6 months - 1 year</SelectItem>
                         <SelectItem value="1 - 3 years">1 - 3 years</SelectItem>
                         <SelectItem value="3+ years">3+ years</SelectItem>
                         <SelectItem value="Self-employed / Business Owner">Self-employed / Business Owner</SelectItem>
                       </SelectContent>
                     </Select>
                     <FormMessage />
                  </FormItem>
                )} />

                <FormField control={form.control} name="monthly_income_range" render={({ field }) => (
                  <FormItem className="md:col-span-2">
                     <FormLabel className="text-slate-300">Estimated Monthly Income (GH₵) *</FormLabel>
                     <Select onValueChange={field.onChange} defaultValue={field.value}>
                       <FormControl><SelectTrigger className="bg-slate-900/50 border-slate-700 text-white"><SelectValue placeholder="Select income range" /></SelectTrigger></FormControl>
                       <SelectContent className="bg-slate-900 border-slate-800 text-slate-200">
                         <SelectItem value="Below 2,000">Below 2,000</SelectItem>
                         <SelectItem value="2,000 - 5,000">2,000 - 5,000</SelectItem>
                         <SelectItem value="5,000 - 10,000">5,000 - 10,000</SelectItem>
                         <SelectItem value="10,000 - 20,000">10,000 - 20,000</SelectItem>
                         <SelectItem value="20,000+">20,000+</SelectItem>
                       </SelectContent>
                     </Select>
                     <FormMessage />
                  </FormItem>
                )} />

                <div className="col-span-1 md:col-span-2 mt-4 pt-4 border-t border-slate-800/50">
                   <h3 className="text-white font-medium mb-4">Additional Income (Optional)</h3>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField control={form.control} name="additional_income_source" render={({ field }) => (
                        <FormItem><FormLabel className="text-slate-300">Source</FormLabel><FormControl>
                          <Input placeholder="E.g., Freelance, Business" {...field} className="bg-slate-900/50 border-slate-700 text-white focus-visible:ring-blue-500/20" />
                        </FormControl><FormMessage /></FormItem>
                      )} />
                      <FormField control={form.control} name="additional_income_amount" render={({ field }) => (
                        <FormItem><FormLabel className="text-slate-300">Monthly Amount (GH₵)</FormLabel><FormControl>
                          <Input type="number" placeholder="500" {...field} className="bg-slate-900/50 border-slate-700 text-white focus-visible:ring-blue-500/20" />
                        </FormControl><FormMessage /></FormItem>
                      )} />
                   </div>
                </div>

             </div>
          </div>

          <StepNavigation onNext={form.handleSubmit(onSubmit)} />
        </form>
      </Form>
    </div>
  );
}
