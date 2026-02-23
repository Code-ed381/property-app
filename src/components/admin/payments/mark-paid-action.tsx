"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Loader2 } from "lucide-react";
import { updatePaymentStatus } from "@/actions/payments";
import { toast } from "sonner";

export function MarkPaidAction({ payment }: { payment: any }) {
  const [isUpdating, setIsUpdating] = useState(false);

  if (payment.status === "PAID") return null;

  const handleMarkPaid = async () => {
    try {
      setIsUpdating(true);
      await updatePaymentStatus(payment.id, "PAID", "CASH");
      toast.success("Payment marked as PAID.");
    } catch (e: any) {
      toast.error(e.message || "Failed to update payment status.");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleMarkPaid}
      disabled={isUpdating}
      className="text-emerald-500 border-emerald-500/20 bg-emerald-500/10 hover:bg-emerald-500 hover:text-white transition-colors h-8 text-xs font-semibold"
    >
      {isUpdating ? (
        <Loader2 className="mr-1 h-3 w-3 animate-spin" />
      ) : (
        <CheckCircle2 className="mr-1 h-3 w-3" />
      )}
      Settle
    </Button>
  );
}
