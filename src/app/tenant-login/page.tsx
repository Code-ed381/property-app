"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Building2, KeyRound, Loader2, LogIn } from "lucide-react";
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

const loginSchema = z.object({
  room_number: z.string().min(1, "Room Number is required").toUpperCase(),
  passcode: z.string().min(6, "Passcode must be at least 6 characters"),
});

type LoginValues = z.infer<typeof loginSchema>;

export default function TenantLoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      room_number: "",
      passcode: "",
    },
  });

  const onSubmit = async (values: LoginValues) => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/tenant/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to login");
      }

      toast.success("Login successful!");
      
      // Navigate based on whether they need to reset their passcode
      if (data.must_change_pass) {
        router.push("/tenant/settings/change-passcode");
      } else {
        router.push("/tenant");
      }
      
    } catch (error: any) {
      toast.error(error.message);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      
      {/* Background Ornaments */}
      <div className="absolute top-0 right-0 -m-32 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 -m-32 w-96 h-96 bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-8 duration-700">
        
        <div className="flex flex-col items-center text-center mb-10">
          <div className="h-16 w-16 bg-blue-600 rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(37,99,235,0.4)] mb-6">
            <Building2 className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-2">
            Tenant Portal
          </h1>
          <p className="text-slate-400">
            Enter your Room Number and Passcode to securely access your tenancy dashboard.
          </p>
        </div>

        <Card className="bg-slate-900/40 border border-slate-800/80 backdrop-blur-xl shadow-2xl overflow-hidden rounded-3xl">
          <CardContent className="p-8">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                
                <FormField
                  control={form.control}
                  name="room_number"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-300">Room Number</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <LogIn className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
                          <Input
                            placeholder="e.g. PIL-301"
                            {...field}
                            className="pl-11 bg-slate-950/50 border-slate-800 text-white placeholder:text-slate-600 focus-visible:ring-blue-500/30 h-12 text-lg uppercase font-mono tracking-widest"
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="passcode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-300">Secret Passcode</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
                          <Input
                            type="password"
                            placeholder="******"
                            {...field}
                            className="pl-11 bg-slate-950/50 border-slate-800 text-white placeholder:text-slate-600 focus-visible:ring-blue-500/30 h-12 text-lg tracking-[0.2em] font-mono w-full"
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
                    className="w-full bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/20 h-12 rounded-xl text-lg font-medium transition-all hover:scale-[1.02] active:scale-[0.98]"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Authenticating...
                      </>
                    ) : (
                      "Access Portal"
                    )}
                  </Button>
                </div>
              </form>
            </Form>

            <div className="mt-8 pt-6 border-t border-slate-800/50 text-center">
              <p className="text-sm text-slate-500">
                Having trouble logging in? <br className="hidden md:block"/>
                Ask your property manager to reset your credentials.
              </p>
            </div>
            
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
