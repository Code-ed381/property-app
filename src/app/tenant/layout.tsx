import React from "react";

export default function TenantLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-slate-950 min-h-screen font-sans antialiased text-slate-300">
      {/* 
        This is the base layout for all /tenant routes. 
        It provides the underlying dark background universally.
      */}
      {children}
    </div>
  );
}
