"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Loader2, Save, Building2, Droplet, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";
import { updateApartment } from "@/actions/apartments";

const apartmentSchema = z.object({
  unit_name: z.string().min(2, "Unit name must be at least 2 characters"),
  unit_number: z.string().min(1, "Unit number is required"),
  floor: z.coerce.number().min(0, "Floor must be 0 or higher"),
  type: z.enum(["STUDIO", "ONE_BEDROOM", "TWO_BEDROOM", "THREE_BEDROOM"]),
  monthly_rent: z.coerce.number().min(0, "Rent must be a positive number"),
  lease_months: z.coerce.number().min(1, "Lease must be at least 1 month"),
  status: z.enum(["VACANT", "OCCUPIED", "MAINTENANCE", "ARCHIVED"]),
  description: z.string().optional(),
  
  // Utilities
  water_enabled: z.boolean().default(false),
  water_monthly_rate: z.coerce.number().min(0),
  water_annual_rate: z.coerce.number().min(0),
  
  sewage_enabled: z.boolean().default(false),
  sewage_monthly_rate: z.coerce.number().min(0),
  sewage_annual_rate: z.coerce.number().min(0),
  
  cleaning_enabled: z.boolean().default(false),
  cleaning_monthly_rate: z.coerce.number().min(0),
  cleaning_annual_rate: z.coerce.number().min(0),
});

type ApartmentFormValues = z.infer<typeof apartmentSchema>;

interface EditApartmentFormProps {
  apartment: any; // Using any for simplicity here, can type it properly later if needed
}

export function EditApartmentForm({ apartment }: EditApartmentFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<ApartmentFormValues>({
    resolver: zodResolver(apartmentSchema) as any,
    defaultValues: {
      unit_name: apartment.unit_name || "",
      unit_number: apartment.unit_number || "",
      floor: apartment.floor || 0,
      type: apartment.type || "STUDIO",
      monthly_rent: apartment.monthly_rent || 0,
      lease_months: apartment.lease_months || 10,
      status: apartment.status || "VACANT",
      description: apartment.description || "",
      
      water_enabled: apartment.water_enabled || false,
      water_monthly_rate: apartment.water_monthly_rate || 100,
      water_annual_rate: apartment.water_annual_rate || 1100,
      
      sewage_enabled: apartment.sewage_enabled || false,
      sewage_monthly_rate: apartment.sewage_monthly_rate || 10,
      sewage_annual_rate: apartment.sewage_annual_rate || 120,
      
      cleaning_enabled: apartment.cleaning_enabled || false,
      cleaning_monthly_rate: apartment.cleaning_monthly_rate || 40,
      cleaning_annual_rate: apartment.cleaning_annual_rate || 480,
    },
  });

  async function onSubmit(values: ApartmentFormValues) {
    setIsLoading(true);
    try {
      await updateApartment(apartment.id, values);
      toast.success("Apartment updated successfully!");
      router.push(`/admin/apartments/${apartment.id}`);
      router.refresh(); // Ensure the details page is fresh
    } catch (error: any) {
      toast.error(error.message || "Failed to update apartment");
    } finally {
      setIsLoading(false);
    }
  }

  const UtilityToggle = ({ 
    title, 
    baseName 
  }: { 
    title: string; 
    baseName: "water" | "sewage" | "cleaning";
  }) => {
    const isEnabled = form.watch(`${baseName}_enabled` as any);
    
    return (
      <div className="p-4 rounded-xl border border-slate-800/80 bg-slate-950/40 space-y-4 transition-all">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium text-white">{title}</h4>
            <p className="text-sm text-slate-500">Enable and configure rates for this utility.</p>
          </div>
          <FormField
            control={form.control}
            name={`${baseName}_enabled` as any}
            render={({ field }) => (
              <FormItem className="flex items-center space-y-0">
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    className="data-[state=checked]:bg-blue-600"
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        {isEnabled && (
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-800/80">
            <FormField
              control={form.control}
              name={`${baseName}_monthly_rate` as any}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-400 text-xs uppercase tracking-wider">Monthly Rate (GH₵)</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} className="bg-slate-900 border-slate-800 text-white" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={`${baseName}_annual_rate` as any}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-400 text-xs uppercase tracking-wider">Annual Rate (GH₵)</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} className="bg-slate-900 border-slate-800 text-white" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )}
      </div>
    );
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        
        {/* Basic Info */}
        <Card className="bg-slate-900/40 border-slate-800/50 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="h-10 w-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500">
                <Building2 className="h-6 w-6" />
              </div>
              <div>
                <CardTitle className="text-xl font-bold text-white">Unit Details</CardTitle>
                <CardDescription className="text-slate-500">Update the basic details of the apartment.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField control={form.control} name="unit_name" render={({ field }) => (
              <FormItem><FormLabel className="text-slate-300">Unit Name</FormLabel><FormControl><Input className="bg-slate-800/50 border-slate-700 text-white" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="unit_number" render={({ field }) => (
              <FormItem><FormLabel className="text-slate-300">Unit Number</FormLabel><FormControl><Input className="bg-slate-800/50 border-slate-700 text-white" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="floor" render={({ field }) => (
              <FormItem><FormLabel className="text-slate-300">Floor</FormLabel><FormControl><Input type="number" className="bg-slate-800/50 border-slate-700 text-white" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="type" render={({ field }) => (
              <FormItem>
                <FormLabel className="text-slate-300">Apartment Type</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl><SelectTrigger className="bg-slate-800/50 border-slate-700 text-white"><SelectValue /></SelectTrigger></FormControl>
                  <SelectContent className="bg-slate-900 border-slate-800 text-slate-200">
                    <SelectItem value="STUDIO">Studio</SelectItem>
                    <SelectItem value="ONE_BEDROOM">One Bedroom</SelectItem>
                    <SelectItem value="TWO_BEDROOM">Two Bedroom</SelectItem>
                    <SelectItem value="THREE_BEDROOM">Three Bedroom</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="monthly_rent" render={({ field }) => (
              <FormItem><FormLabel className="text-slate-300">Monthly Rent (GH₵)</FormLabel><FormControl><Input type="number" className="bg-slate-800/50 border-slate-700 text-white" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
             <FormField control={form.control} name="lease_months" render={({ field }) => (
              <FormItem><FormLabel className="text-slate-300">Default Lease Terms (Months)</FormLabel><FormControl><Input type="number" className="bg-slate-800/50 border-slate-700 text-white" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="status" render={({ field }) => (
              <FormItem>
                <FormLabel className="text-slate-300">Status</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl><SelectTrigger className="bg-slate-800/50 border-slate-700 text-white"><SelectValue /></SelectTrigger></FormControl>
                  <SelectContent className="bg-slate-900 border-slate-800 text-slate-200">
                    <SelectItem value="VACANT">Vacant</SelectItem>
                    <SelectItem value="OCCUPIED">Occupied</SelectItem>
                    <SelectItem value="MAINTENANCE">Maintenance</SelectItem>
                    <SelectItem value="ARCHIVED">Archived</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />
          </CardContent>
          <div className="px-6 pb-6">
            <FormField control={form.control} name="description" render={({ field }) => (
              <FormItem><FormLabel className="text-slate-300">Description</FormLabel><FormControl><Input className="bg-slate-800/50 border-slate-700 text-white" placeholder="Optional notes about unit" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
          </div>
        </Card>

        {/* Utilities */}
        <Card className="bg-slate-900/40 border-slate-800/50 backdrop-blur-sm">
          <CardHeader>
             <div className="flex items-center gap-3 mb-2">
              <div className="h-10 w-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500">
                <Droplet className="h-6 w-6" />
              </div>
              <div>
                <CardTitle className="text-xl font-bold text-white">Utility Toggles</CardTitle>
                <CardDescription className="text-slate-500">Configure which utilities and fees apply to this specific unit.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <UtilityToggle title="Water & Security" baseName="water" />
            <UtilityToggle title="Sewage Processing" baseName="sewage" />
            <UtilityToggle title="Cleaning & Garbage" baseName="cleaning" />
          </CardContent>
        </Card>

        <div className="flex justify-end gap-3 sticky bottom-6 z-10 p-4 bg-slate-950/80 backdrop-blur border border-slate-800/50 rounded-2xl shadow-xl">
          <Button variant="ghost" type="button" onClick={() => router.back()} disabled={isLoading} className="text-slate-400 hover:text-white">
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={isLoading}
            className="bg-blue-600 hover:bg-blue-500 text-white px-8 h-11 rounded-xl shadow-lg shadow-blue-500/20"
          >
            {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</> : <><Save className="mr-2 h-4 w-4" /> Save Changes</>}
          </Button>
        </div>
        
      </form>
    </Form>
  );
}
