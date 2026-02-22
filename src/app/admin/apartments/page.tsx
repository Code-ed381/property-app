import React from "react";
import { ApartmentTable } from "@/components/admin/apartments/apartment-table";
import { getApartments } from "@/actions/apartments";
import { Button } from "@/components/ui/button";
import { Plus, Download } from "lucide-react";
import Link from "next/link";
import { Apartment } from "@/components/admin/apartments/apartment-columns";

// Mock data to show something if the DB fetch returns empty
const mockApartments: Apartment[] = [
  {
    id: "1",
    unit_name: "Ocean View Studio",
    unit_number: "101",
    floor: 1,
    type: "STUDIO",
    monthly_rent: 1200.00,
    status: "VACANT",
    created_at: new Date().toISOString(),
  },
  {
    id: "2",
    unit_name: "Skyloft Suite",
    unit_number: "502",
    floor: 5,
    type: "TWO_BEDROOM",
    monthly_rent: 3500.00,
    status: "OCCUPIED",
    created_at: new Date().toISOString(),
  },
  {
    id: "3",
    unit_name: "Greenery One-Bed",
    unit_number: "204",
    floor: 2,
    type: "ONE_BEDROOM",
    monthly_rent: 1800.00,
    status: "MAINTENANCE",
    created_at: new Date().toISOString(),
  },
  {
    id: "4",
    unit_name: "Penthouse Premium",
    unit_number: "PH-1",
    floor: 12,
    type: "THREE_BEDROOM",
    monthly_rent: 8500.00,
    status: "OCCUPIED",
    created_at: new Date().toISOString(),
  },
];

export default async function ApartmentsPage() {
  const apartmentsData = await getApartments();
  
  // Use real data if available, otherwise fallback to mock for demonstration
  const data = apartmentsData.length > 0 ? apartmentsData : mockApartments;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Apartments</h1>
          <p className="text-slate-400 mt-1 font-medium">Manage and monitor all property units and their status.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="border-slate-800 bg-slate-900/50 hover:bg-slate-900 text-slate-300 rounded-xl px-4 h-11">
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
          <Link href="/admin/apartments/new">
            <Button className="bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/20 rounded-xl px-5 h-11">
              <Plus className="mr-2 h-5 w-5" />
              Add Apartment
            </Button>
          </Link>
        </div>
      </div>

      <ApartmentTable data={data as any} />
    </div>
  );
}
