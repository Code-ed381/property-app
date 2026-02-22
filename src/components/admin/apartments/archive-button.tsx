"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Archive, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { archiveApartment } from "@/actions/apartments";

export function ArchiveButton({ id, isArchived }: { id: string; isArchived: boolean }) {
  const [isArchiving, setIsArchiving] = useState(false);
  const router = useRouter();

  if (isArchived) {
    return (
      <Button variant="outline" disabled className="border-slate-800 bg-slate-900/50 text-slate-500 rounded-xl px-4 h-11">
        Archived
      </Button>
    );
  }

  async function handleArchive() {
    // Ideally use an Alert Dialog here, using basic confirm for speed
    if (!confirm("Are you sure you want to archive this apartment?")) return;
    
    setIsArchiving(true);
    try {
      await archiveApartment(id);
      toast.success("Apartment archived successfully.");
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || "Failed to archive apartment");
    } finally {
      setIsArchiving(false);
    }
  }

  return (
    <Button 
      variant="outline" 
      onClick={handleArchive}
      disabled={isArchiving}
      className="border-red-500/20 text-red-500 hover:bg-red-500/10 hover:text-red-400 bg-slate-900/50 rounded-xl px-4 h-11 transition-all"
    >
      {isArchiving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Archive className="mr-2 h-4 w-4" />}
      Archive Unit
    </Button>
  );
}
