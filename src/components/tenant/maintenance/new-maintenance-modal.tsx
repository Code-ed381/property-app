"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Plus, Loader2, Wrench } from "lucide-react";
import { createMaintenanceRequest } from "@/actions/maintenance";
import { toast } from "sonner";

const maintenanceSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().min(10, "Please provide more details"),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]),
});

type MaintenanceFormValues = z.infer<typeof maintenanceSchema>;

export function NewMaintenanceModal() {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<MaintenanceFormValues>({
    resolver: zodResolver(maintenanceSchema),
    defaultValues: {
      title: "",
      description: "",
      priority: "LOW",
    },
  });

  async function onSubmit(values: MaintenanceFormValues) {
    setIsSubmitting(true);
    try {
      await createMaintenanceRequest(values);
      toast.success("Maintenance request submitted successfully!");
      setOpen(false);
      form.reset();
    } catch (error: any) {
      toast.error(error.message || "Failed to submit request.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl h-11 px-6 shadow-lg shadow-indigo-500/20">
          <Plus className="mr-2 h-4 w-4" />
          Submit New Request
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-slate-950 border-slate-800 text-white max-w-lg">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
             <div className="h-10 w-10 bg-indigo-500/10 text-indigo-500 flex items-center justify-center rounded-xl">
               <Wrench className="h-5 w-5" />
             </div>
             <div>
               <DialogTitle className="text-2xl font-bold">New Work Order</DialogTitle>
               <DialogDescription className="text-slate-400">Describe the issue in your apartment.</DialogDescription>
             </div>
          </div>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 py-4">
            
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-300 font-semibold text-xs uppercase tracking-wider">Issue Title</FormLabel>
                  <FormControl>
                    <Input
                      className="bg-slate-900 border-slate-800 text-slate-300 rounded-xl h-12 focus-visible:ring-indigo-500/20 px-4"
                      placeholder="e.g. Leaking sink in kitchen"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="priority"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-300 font-semibold text-xs uppercase tracking-wider">Priority Level</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-slate-900 border-slate-800 text-slate-300 rounded-xl h-12">
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-slate-900 border-slate-800 text-slate-300">
                      <SelectItem value="LOW">Low - No immediate action needed</SelectItem>
                      <SelectItem value="MEDIUM">Medium - Needs attention soon</SelectItem>
                      <SelectItem value="HIGH">High - Needs immediate attention</SelectItem>
                      <SelectItem value="URGENT">Urgent - Emergency</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-300 font-semibold text-xs uppercase tracking-wider">Detailed Description</FormLabel>
                  <FormControl>
                    <Textarea
                      className="bg-slate-900 border-slate-800 text-slate-300 rounded-xl focus-visible:ring-indigo-500/20 p-4 min-h-[120px]"
                      placeholder="Please describe exactly what is happening, where it is located, and any other relevant details."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold h-12 rounded-xl mt-4 shadow-lg shadow-indigo-600/20"
            >
              {isSubmitting ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting...</>
              ) : (
                "Submit Work Order"
              )}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
