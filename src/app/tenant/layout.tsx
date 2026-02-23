import React from "react";
import { TenantShell } from "@/components/tenant/tenant-shell";

export default function TenantLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-slate-950 min-h-screen font-sans antialiased text-slate-300">
      <TenantShell>
        {children}
      </TenantShell>
    </div>
  );
}
