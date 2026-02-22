import React from "react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-slate-950">
      {/* Dynamic Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-blue-600/20 blur-[120px] animate-pulse" />
        <div className="absolute top-[20%] -right-[5%] w-[30%] h-[30%] rounded-full bg-indigo-600/20 blur-[100px]" />
        <div className="absolute -bottom-[10%] left-[20%] w-[50%] h-[50%] rounded-full bg-purple-600/10 blur-[140px]" />
      </div>

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 z-[1] opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] brightness-100 contrast-150" />
      <div 
        className="absolute inset-0 z-[1] opacity-[0.2]" 
        style={{ 
          backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,255,255,0.05) 1px, transparent 0)`,
          backgroundSize: '32px 32px' 
        }} 
      />

      {/* Content Container */}
      <main className="relative z-10 w-full max-w-md px-4 py-12">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-blue-500/20 mb-4 transform hover:scale-105 transition-transform duration-300">
            <svg 
              className="w-10 h-10 text-white" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" 
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">PILAS <span className="text-blue-500">Properties</span></h1>
          <p className="text-slate-400 mt-2 text-sm font-medium tracking-wide">Property Management Excellence</p>
        </div>
        
        {children}
      </main>
    </div>
  );
}
