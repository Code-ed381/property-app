"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useOnboardingStore } from "@/stores/onboardingStore";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { StepNavigation } from "@/components/onboarding/StepNavigation";
import { User, Calendar, MapPin } from "lucide-react";

const step1Schema = z.object({
  full_name: z.string().min(2, "Full name must be at least 2 characters"),
  date_of_birth: z.string().min(1, "Date of birth is required"),
  current_address: z.string().min(5, "Please provide your full current address"),
});

type Step1Values = z.infer<typeof step1Schema>;

export function PersonalInfoStep() {
  const { data, updateData, nextStep } = useOnboardingStore();

  const form = useForm<Step1Values>({
    resolver: zodResolver(step1Schema),
    defaultValues: {
      full_name: data.full_name,
      date_of_birth: data.date_of_birth,
      current_address: data.current_address,
    },
  });

  const onSubmit = (values: Step1Values) => {
    updateData(values);
    nextStep();
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">Personal Information</h2>
        <p className="text-slate-400">Please provide your basic legal identity details.</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 flex flex-col min-h-[400px]">
          <div className="space-y-6 flex-1">
            <FormField
              control={form.control}
              name="full_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-300">Full Legal Name</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
                      <Input 
                        placeholder="John Doe" 
                        {...field} 
                        className="pl-10 bg-slate-900/50 border-slate-700 text-white placeholder:text-slate-600 focus-visible:ring-blue-500/20"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="date_of_birth"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-300">Date of Birth</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
                      <Input 
                        type="date"
                        {...field} 
                        className="pl-10 bg-slate-900/50 border-slate-700 text-white focus-visible:ring-blue-500/20 [color-scheme:dark]"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="current_address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-300">Current Address</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 h-5 w-5 text-slate-500" />
                      <textarea
                        {...field}
                        className="flex min-h-[100px] w-full rounded-xl border border-slate-700 bg-slate-900/50 px-3 py-2 text-sm text-white placeholder:text-slate-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/20 disabled:cursor-not-allowed disabled:opacity-50 pl-10"
                        placeholder="123 Example St, Accra, Ghana"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <StepNavigation onNext={form.handleSubmit(onSubmit)} />
        </form>
      </Form>
    </div>
  );
}
