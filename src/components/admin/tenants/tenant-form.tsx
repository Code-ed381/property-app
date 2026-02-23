"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { createTenant } from "@/actions/tenants";
import { toast } from "sonner";
import { Building, Copy, KeySquare, Loader2, Mail, Phone, UserCheck } from "lucide-react";
import Link from "next/link";

const tenantSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }).optional().or(z.literal('')),
  phone: z.string().optional().or(z.literal('')),
  apartment_id: z.string().min(1, { message: "Please select an apartment" }),
});

type TenantFormValues = z.infer<typeof tenantSchema>;

export function TenantForm({ vacantApartments }: { vacantApartments: any[] }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successData, setSuccessData] = useState<any | null>(null);

  const form = useForm<TenantFormValues>({
    resolver: zodResolver(tenantSchema),
    defaultValues: {
      email: "",
      phone: "",
      apartment_id: "",
    },
  });

  const onSubmit = async (data: TenantFormValues) => {
    setIsSubmitting(true);
    try {
      const response = await createTenant({
        email: data.email || undefined,
        phone: data.phone || undefined,
        apartment_id: data.apartment_id,
      });
      setSuccessData(response);
      toast.success("Tenant successfully assigned to apartment.");
    } catch (error: any) {
      toast.error(error.message || "Failed to create tenant.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard!`);
  };

  if (successData) {
    return (
      <Card className="bg-slate-900 border-emerald-500/30 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-[80px] pointer-events-none" />
        <CardContent className="p-8 md:p-12 text-center space-y-6">
          <div className="mx-auto w-16 h-16 bg-emerald-500/20 text-emerald-500 flex items-center justify-center rounded-full mb-4">
            <UserCheck className="h-8 w-8" />
          </div>
          <h2 className="text-3xl font-bold text-white tracking-tight">Tenant Created!</h2>
          <p className="text-slate-400 max-w-md mx-auto">
            The apartment has been assigned and credentials have been generated. 
            <strong className="text-emerald-400 ml-1">Please securely share these details with the tenant.</strong>
          </p>

          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 flex flex-col items-center gap-6 mt-8 max-w-md mx-auto">
            
            <div className="w-full">
              <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-2 text-left">Room Number</p>
              <div className="flex items-center justify-between bg-slate-900 px-4 py-3 rounded-xl border border-slate-800">
                <span className="text-xl text-blue-400 font-mono tracking-widest font-bold">
                  {successData._credentials.room_number}
                </span>
                <Button 
                  variant="ghost" size="icon" className="hover:text-blue-400 hover:bg-blue-500/10"
                  onClick={() => copyToClipboard(successData._credentials.room_number, 'Room Number')}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="w-full">
              <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-2 text-left">Temporary Passcode</p>
              <div className="flex items-center justify-between bg-slate-900 px-4 py-3 rounded-xl border border-slate-800">
                <span className="text-2xl text-white font-mono tracking-widest font-bold">
                  {successData._credentials.raw_passcode}
                </span>
                <Button 
                  variant="ghost" size="icon" className="hover:text-emerald-400 hover:bg-emerald-500/10"
                  onClick={() => copyToClipboard(successData._credentials.raw_passcode, 'Passcode')}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="text-xs text-amber-500/80 bg-amber-500/10 p-3 rounded-lg flex items-start gap-2 text-left w-full">
               <KeySquare className="h-4 w-4 shrink-0 mt-0.5" />
               <p>This passcode is hashed in our database. <strong>You will not be able to view this screen again.</strong> The tenant will be forced to change it upon first login.</p>
            </div>
          </div>

          <div className="pt-8">
            <Link href="/admin/tenants">
              <Button variant="outline" className="border-slate-800 bg-transparent text-slate-300 hover:bg-slate-800">
                Return to Directory
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-slate-900 border-slate-800 shadow-xl overflow-hidden relative">
      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-[80px] pointer-events-none" />
      <CardContent className="p-6 md:p-8">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-white pb-2 border-b border-slate-800">Unit Assignment</h3>
              <FormField
                control={form.control}
                name="apartment_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-300">Select Vacant Apartment <span className="text-red-500">*</span></FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-slate-950/50 border-slate-800 focus:ring-blue-500/50 h-12 text-white">
                          <SelectValue placeholder="-- Select an available unit --" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-slate-900 border-slate-800 text-slate-200">
                        {vacantApartments.length === 0 ? (
                          <div className="p-4 text-center text-slate-500 text-sm">
                            No vacant apartments available. Please create one first.
                          </div>
                        ) : (
                          vacantApartments.map((apt) => (
                            <SelectItem key={apt.id} value={apt.id} className="focus:bg-blue-600 focus:text-white cursor-pointer py-3">
                              <div className="flex flex-col gap-1 w-full text-left">
                                <span className="font-medium text-base text-white">{apt.room_number} — {apt.unit_name}</span>
                                <span className="text-xs text-slate-400">Unit {apt.unit_number} • GH₵ {apt.monthly_rent}/mo</span>
                              </div>
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-4 mt-8">
              <h3 className="text-lg font-medium text-white pb-2 border-b border-slate-800 flex items-center gap-2">
                 <UserCheck className="h-5 w-5 text-blue-500" />
                 Tenant Contact Details (Optional)
              </h3>
              <p className="text-sm text-slate-400">
                 We'll use these to try and auto-send their credentials. The tenant will provide their full legal details during their onboarding flow.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-300">Email Address</FormLabel>
                      <FormControl>
                        <div className="relative">
                           <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                           <Input 
                             placeholder="tenant@example.com" 
                             {...field} 
                             className="pl-10 bg-slate-950/50 border-slate-800 focus-visible:ring-blue-500/50 text-white placeholder:text-slate-600 h-11"
                           />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-300">Phone Number</FormLabel>
                      <FormControl>
                        <div className="relative">
                           <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                           <Input 
                             placeholder="+233 50 000 0000" 
                             {...field} 
                             className="pl-10 bg-slate-950/50 border-slate-800 focus-visible:ring-blue-500/50 text-white placeholder:text-slate-600 h-11"
                           />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="flex justify-end gap-4 pt-6 mt-8 border-t border-slate-800">
              <Link href="/admin/tenants">
                <Button type="button" variant="outline" className="border-slate-800 bg-transparent text-slate-300 hover:bg-slate-800 h-12 px-6">
                  Cancel
                </Button>
              </Link>
              <Button 
                type="submit" 
                disabled={isSubmitting || vacantApartments.length === 0}
                className="bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/20 h-12 px-8"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Assigning...
                  </>
                ) : (
                  "Create & Generate Credentials"
                )}
              </Button>
            </div>
            
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
