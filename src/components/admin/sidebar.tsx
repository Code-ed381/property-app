"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Building2,
  Users,
  FileText,
  Handshake,
  CreditCard,
  Wrench,
  Settings,
  LogOut,
  ChevronRight,
} from "lucide-react";
import { signOut } from "@/app/(auth)/login/actions";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/admin" },
  { icon: Building2, label: "Apartments", href: "/admin/apartments" },
  { icon: Users, label: "Tenants", href: "/admin/tenants" },
  { icon: FileText, label: "Applications", href: "/admin/applications" },
  { icon: Handshake, label: "Agreements", href: "/admin/agreements" },
  { icon: CreditCard, label: "Payments", href: "/admin/payments" },
  { icon: Wrench, label: "Maintenance", href: "/admin/maintenance" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex w-72 flex-col fixed inset-y-0 z-50 bg-slate-950 border-r border-slate-800/50">
      {/* Brand Logo */}
      <div className="p-6">
        <Link href="/admin" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/10">
            <Building2 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">PILAS</h1>
            <p className="text-[10px] text-slate-500 font-bold tracking-widest uppercase">Properties</p>
          </div>
        </Link>
      </div>

      <Separator className="bg-slate-800/50 mx-6 w-auto" />

      {/* Navigation Links */}
      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto custom-scrollbar">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group flex items-center justify-between px-3 py-2.5 rounded-xl transition-all duration-300",
                isActive 
                  ? "bg-blue-600/10 text-blue-400" 
                  : "text-slate-400 hover:text-white hover:bg-slate-900"
              )}
            >
              <div className="flex items-center gap-3">
                <item.icon className={cn(
                  "w-5 h-5 transition-transform duration-300 group-hover:scale-110",
                  isActive ? "text-blue-500" : "text-slate-500 group-hover:text-amber-400"
                )} />
                <span className="text-sm font-medium tracking-wide">{item.label}</span>
              </div>
              {isActive && (
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* User & Settings */}
      <div className="p-4 mt-auto space-y-4">
        <Link
          href="/admin/settings"
          className={cn(
            "group flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-300",
            pathname === "/admin/settings" 
              ? "bg-slate-800 text-white" 
              : "text-slate-400 hover:text-white hover:bg-slate-900"
          )}
        >
          <Settings className="w-5 h-5 text-slate-500 group-hover:text-white" />
          <span className="text-sm font-medium tracking-wide">Settings</span>
        </Link>

        <Separator className="bg-slate-800/50" />

        <div className="flex items-center justify-between px-2 py-2">
          <div className="flex items-center gap-3">
            <Avatar className="w-10 h-10 border border-slate-700">
              <AvatarImage src="" />
              <AvatarFallback className="bg-slate-800 text-slate-300">AD</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-white truncate w-24">Admin User</span>
              <span className="text-[10px] text-slate-500 font-medium uppercase tracking-tighter">Super Admin</span>
            </div>
          </div>
          <form action={signOut}>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-9 w-9 text-slate-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </form>
        </div>
      </div>
    </aside>
  );
}
