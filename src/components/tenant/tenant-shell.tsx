"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { TenantSidebar } from "./sidebar";
import { TenantHeader } from "./header";

export function TenantShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Specifically ignore paths like onboarding or public facing links
  const isPublicRoute = pathname?.startsWith("/tenant/onboarding") || pathname?.includes("agreements/");

  if (isPublicRoute) {
    return <>{children}</>;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-slate-950">
      {/* Desktop Sidebar (hidden on mobile, replaced by Sheet inside Header) */}
      <TenantSidebar className="hidden lg:flex w-72 z-50 flex-shrink-0" />

      {/* Main Content Pane */}
      <div className="flex flex-col flex-1 min-w-0">
        <TenantHeader />
        <main className="flex-1 overflow-y-auto w-full p-4 lg:p-8 bg-slate-950">
          <div className="max-w-7xl mx-auto w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
