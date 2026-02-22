import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAgreementById } from "@/actions/agreements";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AgreementDocument } from "@/components/admin/agreements/AgreementDocument";

export default async function AgreementDetailsPage(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;
  const agreement = await getAgreementById(id);

  if (!agreement) {
    notFound();
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500 pb-12">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl" asChild>
          <Link href="/admin/agreements">
            <ChevronLeft className="h-6 w-6" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Lease Document</h1>
          <p className="text-slate-400 font-medium mt-1">
            Review, sign, or dispatch the generated PDF tenancy agreement.
          </p>
        </div>
      </div>

      <AgreementDocument agreement={agreement} />
    </div>
  );
}
