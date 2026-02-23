"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Lock, Loader2, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent } from "@/components/ui/card";

// Note: To submit this we'll need an API route, which we'll build next.
const passwordSchema = z.object({
  new_passcode: z.string().min(6, "Passcode must be at least 6 characters"),
  confirm_passcode: z.string().min(6, "Please confirm your passcode"),
}).refine((data) => data.new_passcode === data.confirm_passcode, {
  message: "Passcodes don't match",
  path: ["confirm_passcode"],
});

type PasswordValues = z.infer<typeof passwordSchema>;

export default function ChangePasscodePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<PasswordValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      new_passcode: "",
      confirm_passcode: "",
    },
  });

  const onSubmit = async (values: PasswordValues) => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/tenant/auth/change-passcode", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ passcode: values.new_passcode }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to update passcode");
      }

      toast.success("Passcode successfully updated!");
      router.push("/tenant");
      
    } catch (error: any) {
      toast.error(error.message);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 relative overflow-hidden text-slate-300">
      
      {/* Background Ornaments */}
      <div className="absolute top-0 right-0 -m-32 w-96 h-96 bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-8 duration-700">
        
        <div className="flex flex-col items-center text-center mb-10">
          <div className="h-16 w-16 bg-emerald-600 rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(16,185,129,0.3)] mb-6">
            <ShieldCheck className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-2">
            Secure Your Account
          </h1>
          <p className="text-slate-400">
            For your security, you must select a new, private passcode before accessing the portal for the first time.
          </p>
        </div>

        <Card className="bg-slate-900/40 border border-slate-800/80 backdrop-blur-xl shadow-2xl overflow-hidden rounded-3xl">
          <CardContent className="p-8">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                
                <FormField
                  control={form.control}
                  name="new_passcode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-300">New Personal Passcode</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
                          <Input
                            type="password"
                            placeholder="******"
                            {...field}
                            className="pl-11 bg-slate-950/50 border-slate-800 text-white placeholder:text-slate-600 focus-visible:ring-emerald-500/30 h-12 text-lg tracking-[0.2em] font-mono w-full"
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="confirm_passcode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-300">Confirm Passcode</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
                          <Input
                            type="password"
                            placeholder="******"
                            {...field}
                            className="pl-11 bg-slate-950/50 border-slate-800 text-white placeholder:text-slate-600 focus-visible:ring-emerald-500/30 h-12 text-lg tracking-[0.2em] font-mono w-full"
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="pt-4">
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-500/20 h-12 rounded-xl text-lg font-medium transition-all hover:scale-[1.02] active:scale-[0.98]"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      "Set Secure Passcode"
                    )}
                  </Button>
                </div>
              </form>
            </Form>

          </CardContent>
        </Card>

      </div>
    </div>
  );
}
