"use client";

import React from "react";
import { 
  Bell, 
  Search, 
  Menu,
  Calendar as CalendarIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Sidebar } from "./sidebar";
import { format } from "date-fns";

export function Header() {
  const currentDate = format(new Date(), "EEEE, MMMM do");

  return (
    <header className="sticky top-0 z-40 flex h-20 items-center gap-4 border-b border-slate-800/50 bg-slate-950/80 backdrop-blur-md px-6 lg:ml-72">
      {/* Mobile Sidebar Trigger */}
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="lg:hidden text-slate-400">
            <Menu className="h-6 w-6" />
            <span className="sr-only">Toggle Sidebar</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 bg-slate-950 border-r border-slate-800 w-72">
          <Sidebar className="w-full h-full border-0" />
        </SheetContent>
      </Sheet>

      {/* Date Display */}
      <div className="hidden md:flex flex-col">
        <div className="flex items-center gap-2 text-slate-400">
          <CalendarIcon className="h-4 w-4" />
          <span className="text-sm font-medium">{currentDate}</span>
        </div>
      </div>

      {/* Global Search */}
      <div className="flex-1 max-w-md ml-auto md:ml-8">
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 group-focus-within:text-blue-500 transition-colors" />
          <Input 
            placeholder="Search anything... (⌘K)" 
            className="pl-10 bg-slate-900/50 border-slate-800 text-slate-300 placeholder:text-slate-600 focus-visible:ring-blue-500/10 focus-visible:border-blue-500 transition-all rounded-xl"
          />
        </div>
      </div>

      {/* Notifications */}
      <div className="flex items-center gap-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className="relative rounded-xl border border-slate-800/50 hover:bg-slate-900 text-slate-400"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-amber-500 rounded-full border-2 border-slate-950" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80 bg-slate-900 border-slate-800 text-slate-200 p-0">
            <DropdownMenuLabel className="p-4 flex items-center justify-between">
              <span>Notifications</span>
              <span className="text-[10px] bg-blue-600 px-2 py-0.5 rounded text-white font-bold">3 NEW</span>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-slate-800" />
            <div className="max-h-[300px] overflow-y-auto">
              <DropdownMenuItem className="p-4 flex flex-col items-start gap-1 hover:bg-slate-800 focus:bg-slate-800 transition-colors cursor-pointer">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-500" />
                  <span className="font-semibold text-sm">New Application</span>
                </div>
                <p className="text-xs text-slate-400">A new application was submitted for Unit 302.</p>
                <span className="text-[10px] text-slate-500 mt-1">2 hours ago</span>
              </DropdownMenuItem>
              {/* Add more items if needed */}
            </div>
            <DropdownMenuSeparator className="bg-slate-800" />
            <div className="p-2">
              <Button variant="ghost" className="w-full text-xs text-blue-400 hover:text-blue-300 hover:bg-blue-400/10">
                View all notifications
              </Button>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
