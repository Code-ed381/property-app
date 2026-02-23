"use client";

import React, { useState } from "react";
import { Menu, Bell } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { TenantSidebar } from "./sidebar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function TenantHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl h-16 flex items-center px-4 lg:px-8 shrink-0">
      
      {/* Mobile Menu Trigger */}
      <div className="lg:hidden flex items-center justify-between w-full">
         <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
               <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white hover:bg-slate-900 rounded-xl">
                 <Menu className="h-6 w-6" />
                 <span className="sr-only">Toggle menu</span>
               </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 bg-slate-950 border-r border-slate-800 w-72">
               <TenantSidebar className="w-full h-full border-0" onNavigate={() => setOpen(false)} />
            </SheetContent>
         </Sheet>
         
         <div className="font-bold text-white tracking-tight ml-2">PILAS</div>
      </div>

      {/* Desktop Header Content (Right Side) */}
      <div className="flex-1 flex justify-end">
         <div className="flex items-center gap-4">
            
            <Button variant="ghost" size="icon" className="relative text-slate-400 hover:text-white hover:bg-slate-900 rounded-xl h-10 w-10 transition-colors">
               <Bell className="h-5 w-5" />
               <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-blue-600 text-[10px] text-white animate-pulse">
                 1
               </Badge>
            </Button>
            
            <div className="hidden md:flex items-center gap-3 border-l border-slate-800 pl-4 ml-2">
               <div className="text-right">
                  <p className="text-sm font-semibold text-white leading-none tracking-tight">Tenant</p>
                  <p className="text-xs text-slate-500 mt-1">Status: Active</p>
               </div>
               <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 shadow-md flex items-center justify-center font-bold text-white shadow-blue-500/20">
                  T
               </div>
            </div>

         </div>
      </div>
      
    </header>
  );
}
