"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { ChevronLeft, Building2, Loader2, Save } from "lucide-react";
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
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";
import { updateApartment } from "@/actions/apartments";
import Link from "next/link";

const apartmentSchema = z.object({
  unit_name: z.string().min(2, "Unit name must be at least 2 characters"),
  unit_number: z.string().min(1, "Unit number is required"),
  floor: z.coerce.number().min(0, "Floor must be 0 or higher"),
  type: z.enum(["STUDIO", "ONE_BEDROOM", "TWO_BEDROOM", "THREE_BEDROOM"]),
  monthly_rent: z.coerce.number().min(0, "Rent must be a positive number"),
  status: z.enum(["VACANT", "OCCUPIED", "MAINTENANCE", "ARCHIVED"]),
});

type ApartmentFormValues = z.infer<typeof apartmentSchema>;

export function EditApartmentForm({ apartment }: { apartment: any }) {
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
      status: apartment.status || "VACANT",
    },
  });

  async function onSubmit(values: ApartmentFormValues) {
    setIsLoading(true);
    try {
      await updateApartment(apartment.id, values);
      toast.success("Apartment updated successfully!");
      router.push("/admin/apartments");
    } catch (error: any) {
      toast.error(error.message || "Failed to update apartment");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl" asChild>
          <Link href={`/admin/apartments/${apartment.id}`}>
            <ChevronLeft className="h-6 w-6" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Edit {apartment.unit_name}</h1>
          <p className="text-slate-400 font-medium tracking-tight">Modify the existing property unit details.</p>
        </div>
      </div>

      <Card className="bg-slate-900/40 border-slate-800/50 backdrop-blur-sm shadow-2xl">
        <CardHeader className="border-b border-slate-800/50 pb-6">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500 shadow-inner">
              <Building2 className="h-6 w-6" />
            </div>
            <div>
              <CardTitle className="text-xl font-bold text-white">Update Information</CardTitle>
              <CardDescription className="text-slate-500">Amend the unit details and billing configuration.</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <FormField
                  control={form.control}
                  name="unit_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-400 uppercase text-[10px] font-bold tracking-widest">Building / Block Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Waterfront Block A" {...field} className="bg-slate-950 border-slate-800 text-white h-12 rounded-xl focus:ring-blue-500/20" />
                      </FormControl>
                      <FormMessage className="text-red-400 text-xs" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="unit_number"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-400 uppercase text-[10px] font-bold tracking-widest">Unit / Apartment No.</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. 301" {...field} className="bg-slate-950 border-slate-800 text-white h-12 rounded-xl focus:ring-blue-500/20" />
                      </FormControl>
                      <FormMessage className="text-red-400 text-xs" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="floor"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-400 uppercase text-[10px] font-bold tracking-widest">Floor Level</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} className="bg-slate-950 border-slate-800 text-white h-12 rounded-xl focus:ring-blue-500/20" />
                      </FormControl>
                      <FormMessage className="text-red-400 text-xs" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-400 uppercase text-[10px] font-bold tracking-widest">Property Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-slate-950 border-slate-800 text-white h-12 rounded-xl focus:ring-blue-500/20">
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-slate-900 border-slate-800 text-slate-300">
                          <SelectItem value="STUDIO">Studio Apartment</SelectItem>
                          <SelectItem value="ONE_BEDROOM">1 Bedroom</SelectItem>
                          <SelectItem value="TWO_BEDROOM">2 Bedrooms</SelectItem>
                          <SelectItem value="THREE_BEDROOM">3 Bedrooms</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage className="text-red-400 text-xs" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="monthly_rent"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-400 uppercase text-[10px] font-bold tracking-widest">Monthly Rent (GH₵)</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} className="bg-slate-950 border-slate-800 text-white h-12 rounded-xl focus:ring-blue-500/20" />
                      </FormControl>
                      <FormMessage className="text-red-400 text-xs" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-400 uppercase text-[10px] font-bold tracking-widest">Current Status</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-slate-950 border-slate-800 text-white h-12 rounded-xl focus:ring-blue-500/20">
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-slate-900 border-slate-800 text-slate-300">
                          <SelectItem value="VACANT">Vacant</SelectItem>
                          <SelectItem value="OCCUPIED">Occupied</SelectItem>
                          <SelectItem value="MAINTENANCE">Maintenance</SelectItem>
                          <SelectItem value="ARCHIVED">Archived</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage className="text-red-400 text-xs" />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex justify-end gap-4 pt-4 border-t border-slate-800">
                <Button 
                  type="button" 
                  variant="ghost" 
                  className="text-slate-500 hover:text-white"
                  onClick={() => router.back()}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={isLoading}
                  className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-8 h-12 rounded-xl shadow-lg shadow-blue-500/20"
                >
                  {isLoading ? (
                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Updating...</>
                  ) : (
                    <><Save className="mr-2 h-4 w-4" /> Save Changes</>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
