import React from "react";
import { Sidebar } from "@/components/admin/sidebar";
import { Header } from "@/components/admin/header";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-950">
      {/* Sidebar - Fixed on desktop */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex flex-col min-h-screen">
        {/* Header - Sticky */}
        <Header />

        {/* Dynamic Page Content */}
        <main className="flex-1 lg:ml-72 p-6 md:p-10">
          <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
