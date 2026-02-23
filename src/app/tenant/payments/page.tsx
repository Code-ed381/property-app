import React from "react";
import { getTenantPayments } from "@/actions/payments";
import { PaymentTable } from "@/components/admin/payments/payment-table";
import { tenantColumns } from "@/components/tenant/payments/tenant-payment-columns";

export default async function TenantPaymentsPage() {
  const data = await getTenantPayments();
  
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight">Payment History</h1>
        <p className="text-slate-400 font-medium mt-1">
          Review your invoices and transaction records. Click &apos;Pay Now&apos; for pending balances.
        </p>
      </div>

      <div className="bg-slate-900/40 p-4 lg:p-6 rounded-2xl border border-slate-800/50">
         <PaymentTable columns={tenantColumns} data={data} />
      </div>
    </div>
  );
}
