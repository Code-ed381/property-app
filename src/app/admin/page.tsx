import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { 
  Building2, 
  Users, 
  FileText, 
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  Calendar,
  Handshake,
  Wrench
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const stats = [
  {
    title: "Total Units",
    value: "42",
    description: "4 new units this month",
    icon: Building2,
    trend: "+12.5%",
    trendType: "up",
    color: "text-blue-500",
    bg: "bg-blue-500/10",
  },
  {
    title: "Active Tenants",
    value: "38",
    description: "Vacancy rate: 9.5%",
    icon: Users,
    trend: "+2.1%",
    trendType: "up",
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
  },
  {
    title: "Avg. Revenue",
    value: "GH₵42,500",
    description: "Monthly recurring income",
    icon: TrendingUp,
    trend: "+8.3%",
    trendType: "up",
    color: "text-amber-500",
    bg: "bg-amber-500/10",
  },
  {
    title: "Pending Apps",
    value: "12",
    description: "Requires review",
    icon: FileText,
    trend: "-4.2%",
    trendType: "down",
    color: "text-purple-500",
    bg: "bg-purple-500/10",
  },
];

export default async function AdminDashboard() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="space-y-10">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">System Overview</h1>
          <p className="text-slate-400 mt-1 font-medium">Welcome back, {user.email?.split('@')[0]}. Here's what's happening today.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="border-slate-800 bg-slate-900/50 hover:bg-slate-900 text-slate-300">
            <Calendar className="mr-2 h-4 w-4" />
            Last 30 Days
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/20">
            Export Report
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title} className="bg-slate-900/40 border-slate-800/50 backdrop-blur-sm hover:border-slate-700 transition-all duration-300 group">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">{stat.title}</CardTitle>
              <div className={cn("p-2 rounded-lg", stat.bg)}>
                <stat.icon className={cn("h-4 w-4", stat.color)} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stat.value}</div>
              <div className="flex items-center mt-1 gap-2">
                <span className={cn(
                  "text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center",
                  stat.trendType === "up" ? "bg-emerald-500/10 text-emerald-500" : "bg-red-500/10 text-red-500"
                )}>
                  {stat.trendType === "up" ? <ArrowUpRight className="h-3 w-3 mr-0.5" /> : <ArrowDownRight className="h-3 w-3 mr-0.5" />}
                  {stat.trend}
                </span>
                <p className="text-xs text-slate-500">{stat.description}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Grid: Recent Activity & Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Recent Activity */}
        <Card className="lg:col-span-2 bg-slate-900/40 border-slate-800/50 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="space-y-0.5">
              <CardTitle className="text-xl font-bold text-white">Maintenance Overview</CardTitle>
              <CardDescription className="text-slate-500">Active requests requiring attention</CardDescription>
            </div>
            <Activity className="h-5 w-5 text-blue-500 animate-pulse" />
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center justify-between group cursor-pointer p-3 rounded-xl hover:bg-slate-800/50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 group-hover:border-blue-500/50 transition-colors">
                      <Wrench className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">Leaking pipe in Unit 302</p>
                      <p className="text-xs text-slate-500">Submitted by John Doe • 2 hours ago</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/10 text-amber-500 uppercase tracking-tighter">Medium Priority</span>
                    <span className="text-[10px] text-slate-600 font-medium">PENDING</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <div className="p-6 pt-0">
            <Button variant="ghost" className="w-full text-sm text-blue-400 hover:text-blue-300 hover:bg-blue-400/10">
              View all requests
              <ArrowUpRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </Card>

        {/* Right Column: Quick Actions or Info */}
        <Card className="bg-slate-900/40 border-slate-800/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-white">Quick Actions</CardTitle>
            <CardDescription className="text-slate-500">Frequently used management tools</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-3">
            <Button variant="outline" className="justify-start border-slate-800 bg-slate-800/30 hover:bg-slate-800 hover:border-slate-700 text-slate-200 py-6">
              <div className="h-8 w-8 rounded-lg bg-blue-500/10 flex items-center justify-center mr-3">
                <Building2 className="h-4 w-4 text-blue-500" />
              </div>
              <div className="flex flex-col items-start gap-0.5">
                <span className="font-semibold text-sm">Add Apartment</span>
                <span className="text-[10px] text-slate-500">Create a new property listing</span>
              </div>
            </Button>
            <Button variant="outline" className="justify-start border-slate-800 bg-slate-800/30 hover:bg-slate-800 hover:border-slate-700 text-slate-200 py-6">
              <div className="h-8 w-8 rounded-lg bg-emerald-500/10 flex items-center justify-center mr-3">
                <Users className="h-4 w-4 text-emerald-500" />
              </div>
              <div className="flex flex-col items-start gap-0.5">
                <span className="font-semibold text-sm">Invite Tenant</span>
                <span className="text-[10px] text-slate-500">Send onboarding access codes</span>
              </div>
            </Button>
            <Button variant="outline" className="justify-start border-slate-800 bg-slate-800/30 hover:bg-slate-800 hover:border-slate-700 text-slate-200 py-6">
              <div className="h-8 w-8 rounded-lg bg-purple-500/10 flex items-center justify-center mr-3">
                <Handshake className="h-4 w-4 text-purple-500" />
              </div>
              <div className="flex flex-col items-start gap-0.5">
                <span className="font-semibold text-sm">Generate Lease</span>
                <span className="text-[10px] text-slate-500">Draft a new tenancy agreement</span>
              </div>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
