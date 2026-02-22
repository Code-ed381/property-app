"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { reviewApplication } from "@/actions/applications";

export function ReviewActions({ applicationId, currentStatus }: { applicationId: string, currentStatus: string }) {
  const [isProcessing, setIsProcessing] = useState(false);
  const router = useRouter();

  if (currentStatus !== "PENDING") {
    return null; // Don't show action buttons if already processed
  }

  async function handleDecision(decision: "APPROVED" | "REJECTED") {
    if (!confirm(`Are you sure you want to mark this application as ${decision}?`)) return;

    setIsProcessing(true);
    try {
      await reviewApplication(applicationId, decision, decision === "REJECTED" ? "Rejected after review." : "Approved, proceed to agreement.");
      toast.success(`Application marked as ${decision}.`);
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || "Failed to process application.");
    } finally {
      setIsProcessing(false);
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button 
        variant="outline" 
        onClick={() => handleDecision("REJECTED")}
        disabled={isProcessing}
        className="border-red-500/20 text-red-500 hover:bg-red-500/10 bg-slate-900/50 rounded-xl px-6 h-11"
      >
        {isProcessing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <XCircle className="mr-2 h-4 w-4" />}
        Reject Application
      </Button>
      <Button 
        onClick={() => handleDecision("APPROVED")}
        disabled={isProcessing}
        className="bg-green-600 hover:bg-green-500 text-white rounded-xl px-6 h-11 shadow-lg shadow-green-600/20"
      >
        {isProcessing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CheckCircle2 className="mr-2 h-4 w-4" />}
        Approve & Proceed
      </Button>
    </div>
  );
}
