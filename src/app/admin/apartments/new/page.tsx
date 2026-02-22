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
import { createApartment } from "@/actions/apartments";
import Link from "next/link";

const apartmentSchema = z.object({
  unit_name: z.string().min(2, "Unit name must be at least 2 characters"),
  unit_number: z.string().min(1, "Unit number is required"),
  floor: z.coerce.number().min(0, "Floor must be 0 or higher"),
  type: z.enum(["STUDIO", "ONE_BEDROOM", "TWO_BEDROOM", "THREE_BEDROOM"]),
  monthly_rent: z.coerce.number().min(0, "Rent must be a positive number"),
});

type ApartmentFormValues = z.infer<typeof apartmentSchema>;

export default function NewApartmentPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<ApartmentFormValues>({
    resolver: zodResolver(apartmentSchema) as any,
    defaultValues: {
      unit_name: "",
      unit_number: "",
      floor: 0,
      type: "STUDIO",
      monthly_rent: 0,
    },
  });

  async function onSubmit(values: ApartmentFormValues) {
    setIsLoading(true);
    try {
      await createApartment(values);
      toast.success("Apartment created successfully!");
      router.push("/admin/apartments");
    } catch (error: any) {
      toast.error(error.message || "Failed to create apartment");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl" asChild>
          <Link href="/admin/apartments">
            <ChevronLeft className="h-6 w-6" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Add New Apartment</h1>
          <p className="text-slate-400 font-medium">Register a new property unit to the system.</p>
        </div>
      </div>

      <Card className="bg-slate-900/40 border-slate-800/50 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="h-10 w-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500">
              <Building2 className="h-6 w-6" />
            </div>
            <div>
              <CardTitle className="text-xl font-bold text-white">Unit Information</CardTitle>
              <CardDescription className="text-slate-500">Enter the basic details of the apartment.</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  name="unit_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-300">Unit Name</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="e.g. Ocean View Studio" 
                          className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-600 focus-visible:ring-blue-500/20" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  name="unit_number"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-300">Unit Number</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="e.g. 101" 
                          className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-600 focus-visible:ring-blue-500/20" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  name="floor"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-300">Floor Level</FormLabel>
                      <FormControl>
                        <Input 
                          type="number"
                          placeholder="0" 
                          className="bg-slate-800/50 border-slate-700 text-white focus-visible:ring-blue-500/20" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-300">Apartment Type</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-slate-800/50 border-slate-700 text-white focus:ring-blue-500/20">
                            <SelectValue placeholder="Select a type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-slate-900 border-slate-800 text-slate-200">
                          <SelectItem value="STUDIO">Studio</SelectItem>
                          <SelectItem value="ONE_BEDROOM">One Bedroom</SelectItem>
                          <SelectItem value="TWO_BEDROOM">Two Bedroom</SelectItem>
                          <SelectItem value="THREE_BEDROOM">Three Bedroom</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  name="monthly_rent"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-300">Monthly Rent (GH₵)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number"
                          placeholder="0.00" 
                          className="bg-slate-800/50 border-slate-700 text-white focus-visible:ring-blue-500/20" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800/50">
                <Button variant="ghost" asChild disabled={isLoading}>
                  <Link href="/admin/apartments" className="text-slate-400 hover:text-white">
                    Cancel
                  </Link>
                </Button>
                <Button 
                  type="submit" 
                  disabled={isLoading}
                  className="bg-blue-600 hover:bg-blue-500 text-white px-8 h-11 rounded-xl shadow-lg shadow-blue-500/20 transition-all active:scale-[0.98]"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Create Apartment
                    </>
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
