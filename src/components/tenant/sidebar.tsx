"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { 
  Building2, 
  LayoutDashboard, 
  CreditCard, 
  Wrench, 
  Settings,
  LogOut,
  FileSignature,
  FileText
} from "lucide-react";

interface SidebarProps {
  className?: string;
  onNavigate?: () => void;
}

const navItems = [
  { href: "/tenant", icon: LayoutDashboard, label: "Dashboard", exact: true },
  { href: "/tenant/payments", icon: CreditCard, label: "Payments", exact: false },
  { href: "/tenant/maintenance", icon: Wrench, label: "Maintenance", exact: false },
  { href: "/tenant/agreement", icon: FileSignature, label: "Agreement", exact: false },
  { href: "/tenant/application", icon: FileText, label: "Application", exact: false },
  { href: "/tenant/settings", icon: Settings, label: "Settings", exact: false },
];

export function TenantSidebar({ className, onNavigate }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className={cn("flex flex-col bg-slate-950 border-r border-slate-800/50", className)}>
      <div className="p-6">
        <div className="flex items-center gap-3 mb-8">
           <div className="h-10 w-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
             <Building2 className="text-white h-5 w-5" />
           </div>
           <div>
             <h1 className="text-lg font-bold text-white tracking-tight leading-tight">PILAS</h1>
             <p className="text-[10px] text-blue-400 font-bold uppercase tracking-wider">Tenant Portal</p>
           </div>
        </div>

        <nav className="space-y-1 relative">
           {navItems.map((item) => {
             const isActive = item.exact 
                ? pathname === item.href 
                : pathname.startsWith(item.href);

             return (
               <Link
                 key={item.href}
                 href={item.href}
                 onClick={onNavigate}
                 className={cn(
                   "group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-300 relative overflow-hidden",
                   isActive 
                     ? "text-white bg-blue-600/10 shadow-sm" 
                     : "text-slate-400 hover:text-white hover:bg-slate-900/50"
                 )}
               >
                 {isActive && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500 rounded-r-md" />
                 )}
                 <item.icon className={cn(
                   "mr-3 h-5 w-5 transition-transform duration-300",
                   isActive ? "text-blue-500 scale-110" : "text-slate-500 group-hover:text-blue-400"
                 )} />
                 {item.label}
               </Link>
             );
           })}
        </nav>
      </div>

      <div className="mt-auto p-4">
        <button className="w-full flex items-center px-4 py-3 text-sm font-medium text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-colors">
          <LogOut className="mr-3 h-5 w-5 opacity-70" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
