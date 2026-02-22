import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getApartmentById } from "@/actions/apartments";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EditApartmentForm } from "@/components/admin/apartments/edit-apartment-form";

export default async function EditApartmentPage(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;
  const apartment = await getApartmentById(id);

  if (!apartment) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500 pb-12">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl" asChild>
          <Link href={`/admin/apartments/${id}`}>
            <ChevronLeft className="h-6 w-6" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Edit {apartment.unit_name}</h1>
          <p className="text-slate-400 font-medium mt-1">
            Update unit specifications and utility settings.
          </p>
        </div>
      </div>

      <EditApartmentForm apartment={apartment} />
    </div>
  );
}
