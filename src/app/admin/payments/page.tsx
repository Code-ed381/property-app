import React from "react";
import { getPayments } from "@/actions/payments";
import { getTenants } from "@/actions/tenants";
import { PaymentTable } from "@/components/admin/payments/payment-table";
import { columns } from "@/components/admin/payments/payment-columns";
import { GenerateInvoicesButton } from "@/components/admin/payments/generate-invoices-button";
import { LogPaymentModal } from "@/components/admin/payments/log-payment-modal";
import { 
  CreditCard, 
  TrendingUp, 
  TrendingDown, 
  Clock,
  ArrowUpRight,
  Filter
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default async function PaymentsPage() {
  const [payments, tenants] = await Promise.all([
    getPayments(),
    getTenants()
  ]);

  // Quick stats calculation
  const totalReceived = payments
    .filter(p => p.status === 'PAID')
    .reduce((sum, p) => sum + Number(p.amount_paid), 0);
  
  const totalPending = payments
    .filter(p => p.status === 'PENDING' || p.status === 'OVERDUE')
    .reduce((sum, p) => sum + Number(p.amount), 0);
  
  const stats = [
    {
      label: "Total Revenue",
      value: `GH₵ ${totalReceived.toLocaleString()}`,
      sub: "Net received to date",
      icon: TrendingUp,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10"
    },
    {
      label: "Outstanding Balance",
      value: `GH₵ ${totalPending.toLocaleString()}`,
      sub: "Unpaid invoices",
      icon: TrendingDown,
      color: "text-amber-500",
      bg: "bg-amber-500/10"
    },
    {
      label: "Pending Approvals",
      value: payments.filter(p => p.status === 'PENDING').length.toString(),
      sub: "Invoices awaiting payment",
      icon: Clock,
      color: "text-blue-500",
      bg: "bg-blue-500/10"
    }
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Financial Ledger</h1>
          <p className="text-slate-400 font-medium mt-1">
            Monitor rent collections, utilities, and security deposits.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <GenerateInvoicesButton />
          <LogPaymentModal tenants={tenants} />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <Card key={i} className="bg-slate-900/40 border-slate-800/50 backdrop-blur-sm overflow-hidden group">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-xl ${stat.bg} ${stat.color} transition-transform group-hover:scale-110 duration-300`}>
                  <stat.icon className="h-6 w-6" />
                </div>
                <div className="flex items-center gap-1 text-[10px] font-bold text-slate-500 uppercase tracking-wider bg-slate-800/50 px-2 py-1 rounded">
                  Live Sync <div className="h-1 w-1 rounded-full bg-emerald-500 animate-pulse" />
                </div>
              </div>
              <div className="space-y-1">
                <h3 className="text-slate-400 text-sm font-medium">{stat.label}</h3>
                <div className="text-2xl font-bold text-white tracking-tight">{stat.value}</div>
                <p className="text-xs text-slate-500">{stat.sub}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-2 px-1">
          <div className="h-8 w-1 bg-blue-600 rounded-full" />
          <h2 className="text-xl font-bold text-white">Payment Transactions</h2>
        </div>
        <PaymentTable columns={columns} data={payments} />
      </div>
    </div>
  );
}
