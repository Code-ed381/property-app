"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calculator, Loader2 } from "lucide-react";
import { generateMonthlyInvoices } from "@/actions/payments";
import { toast } from "sonner";

export function GenerateInvoicesButton() {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    try {
      setIsGenerating(true);
      const res = await generateMonthlyInvoices();
      if (res.count === 0) {
        toast.info("No invoices needed at this time.");
      } else {
        toast.success(`Generated ${res.count} new pending invoices.`);
      }
    } catch (e: any) {
      toast.error(e.message || "Failed to generate invoices.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Button 
      variant="outline"
      onClick={handleGenerate}
      disabled={isGenerating}
      className="border-blue-500/30 text-blue-400 bg-blue-500/10 hover:bg-blue-500/20"
    >
      {isGenerating ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <Calculator className="mr-2 h-4 w-4" />
      )}
      Auto-Gen Invoices
    </Button>
  );
}
