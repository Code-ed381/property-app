"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { signIn } from "./actions";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2, Lock, Mail } from "lucide-react";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: LoginFormValues) {
    setIsLoading(true);
    const formData = new FormData();
    formData.append("email", values.email);
    formData.append("password", values.password);

    try {
      const result = await signIn(formData);
      if (result?.error) {
        toast.error(result.error);
        setIsLoading(false);
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
      setIsLoading(false);
    }
  }

  return (
    <Card className="border-slate-800 bg-slate-900/50 backdrop-blur-xl shadow-2xl">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center text-white">Admin Login</CardTitle>
        <CardDescription className="text-center text-slate-400">
          Enter your credentials to access the portal
        </CardDescription>
      </CardHeader>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-slate-200">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
              <Input
                id="email"
                type="email"
                placeholder="admin@pilasproperties.com"
                className="pl-10 bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-600 focus-visible:ring-blue-500/20 focus-visible:border-blue-500 transition-all"
                disabled={isLoading}
                {...form.register("email")}
              />
            </div>
            {form.formState.errors.email && (
              <p className="text-xs font-medium text-red-500">{form.formState.errors.email.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password" className="text-slate-200">Password</Label>
              <button 
                type="button"
                className="text-xs font-medium text-blue-400 hover:text-blue-300 transition-colors"
                onClick={() => toast.info("Please contact the system administrator to reset your password.")}
              >
                Forgot password?
              </button>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
              <Input
                id="password"
                type="password"
                className="pl-10 bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-600 focus-visible:ring-blue-500/20 focus-visible:border-blue-500 transition-all"
                disabled={isLoading}
                {...form.register("password")}
              />
            </div>
            {form.formState.errors.password && (
              <p className="text-xs font-medium text-red-500">{form.formState.errors.password.message}</p>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            type="submit" 
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-6 shadow-lg shadow-blue-500/20 transition-all active:scale-[0.98]"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing in...
              </>
            ) : (
              "Sign In"
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
