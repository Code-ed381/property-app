"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import { Button } from "@/components/ui/button";
import { Plus, Loader2, DollarSign } from "lucide-react";
import { createManualPayment } from "@/actions/payments";
import { toast } from "sonner";

const paymentSchema = z.object({
  tenant_id: z.string().min(1, "Tenant is required"),
  type: z.enum(["RENT", "UTILITY", "DEPOSIT"]),
  amount: z.coerce.number().min(1, "Amount must be greater than 0"),
  due_date: z.string().min(1, "Due date is required"),
  status: z.enum(["PENDING", "PAID"]),
  notes: z.string().optional(),
});

type PaymentFormValues = z.infer<typeof paymentSchema>;

interface LogPaymentModalProps {
  tenants: any[];
}

export function LogPaymentModal({ tenants }: LogPaymentModalProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentSchema) as any,
    defaultValues: {
      type: "RENT",
      status: "PAID",
      amount: 0,
      due_date: new Date().toISOString().split("T")[0],
      notes: "",
    },
  });

  async function onSubmit(values: PaymentFormValues) {
    setIsSubmitting(true);
    try {
      // Find the selected tenant to get their apartment_id
      const selectedTenant = tenants.find((t) => t.id === values.tenant_id);
      
      if (!selectedTenant?.apartment_id) {
        throw new Error("Selected tenant has no assigned apartment.");
      }

      await createManualPayment({
        ...values,
        apartment_id: selectedTenant.apartment_id,
      });

      toast.success("Payment logged successfully!");
      setOpen(false);
      form.reset();
    } catch (error: any) {
      toast.error(error.message || "Failed to log payment.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-blue-600 hover:bg-blue-500 text-white rounded-xl h-11 px-6 shadow-lg shadow-blue-500/20">
          <Plus className="mr-2 h-4 w-4" />
          Log Manual Payment
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-slate-950 border-slate-800 text-white max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Log Manual Payment</DialogTitle>
          <DialogDescription className="text-slate-400">
            Record a payment made via cash, bank transfer, or other manual methods.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 py-4">
            <FormField
              control={form.control}
              name="tenant_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-300 font-semibold text-xs uppercase tracking-wider">Tenant</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-slate-900 border-slate-800 text-slate-300 rounded-xl h-12 focus:ring-blue-500/20">
                        <SelectValue placeholder="Select a tenant" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-slate-900 border-slate-800 text-slate-300">
                      {tenants.map((tenant) => (
                        <SelectItem key={tenant.id} value={tenant.id}>
                          {tenant.email} ({tenant.apartment?.unit_number})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-300 font-semibold text-xs uppercase tracking-wider">Payment Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-slate-900 border-slate-800 text-slate-300 rounded-xl h-12">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-slate-900 border-slate-800 text-slate-300">
                        <SelectItem value="RENT">Rent</SelectItem>
                        <SelectItem value="UTILITY">Utility</SelectItem>
                        <SelectItem value="DEPOSIT">Security Deposit</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-300 font-semibold text-xs uppercase tracking-wider">Status</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-slate-900 border-slate-800 text-slate-300 rounded-xl h-12">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-slate-900 border-slate-800 text-slate-300">
                        <SelectItem value="PAID">Paid (Instant)</SelectItem>
                        <SelectItem value="PENDING">Pending (Invoice)</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-300 font-semibold text-xs uppercase tracking-wider">Amount (GHS)</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                        <Input
                          type="number"
                          className="bg-slate-900 border-slate-800 text-slate-300 rounded-xl h-12 pl-10 focus-visible:ring-blue-500/20"
                          placeholder="0.00"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="due_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-300 font-semibold text-xs uppercase tracking-wider">Due Date</FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        className="bg-slate-900 border-slate-800 text-slate-300 rounded-xl h-12 focus-visible:ring-blue-500/20 px-4"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-300 font-semibold text-xs uppercase tracking-wider">Notes (Optional)</FormLabel>
                  <FormControl>
                    <Input
                      className="bg-slate-900 border-slate-800 text-slate-300 rounded-xl h-12 focus-visible:ring-blue-500/20 px-4"
                      placeholder="e.g. Bank Transfer Ref: 12345"
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
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold h-12 rounded-xl mt-4 shadow-lg shadow-blue-600/20"
            >
              {isSubmitting ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Recording...</>
              ) : (
                "Save Payment Record"
              )}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
