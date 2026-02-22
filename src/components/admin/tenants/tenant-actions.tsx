"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Mail, Ban, CheckCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { resendCredentials, deactivateTenant, activateTenant } from "@/actions/tenants";

interface TenantActionsProps {
  tenantId: string;
  isActive: boolean;
}

export function TenantActions({ tenantId, isActive }: TenantActionsProps) {
  const [isResending, setIsResending] = useState(false);
  const [isTogglingStatus, setIsTogglingStatus] = useState(false);
  const router = useRouter();

  async function handleResend() {
    setIsResending(true);
    try {
      const result = await resendCredentials(tenantId);
      toast.success(result.message);
    } catch (error: any) {
      toast.error(error.message || "Failed to resend credentials");
    } finally {
      setIsResending(false);
    }
  }

  async function handleToggleStatus() {
    setIsTogglingStatus(true);
    try {
      if (isActive) {
        if (!confirm("Are you sure you want to deactivate this tenant? They will lose access to the portal.")) return;
        await deactivateTenant(tenantId);
        toast.success("Tenant deactivated successfully");
      } else {
        await activateTenant(tenantId);
        toast.success("Tenant activated successfully");
      }
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || "Failed to update status");
    } finally {
      setIsTogglingStatus(false);
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button 
        variant="outline" 
        onClick={handleResend}
        disabled={isResending}
        className="border-blue-500/20 text-blue-400 hover:bg-blue-500/10 hover:text-blue-300 bg-slate-900/50 rounded-xl px-4 h-11 transition-all"
      >
        {isResending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Mail className="mr-2 h-4 w-4" />}
        Resend Credentials
      </Button>

      {isActive ? (
        <Button 
          variant="outline" 
          onClick={handleToggleStatus}
          disabled={isTogglingStatus}
          className="border-red-500/20 text-red-500 hover:bg-red-500/10 hover:text-red-400 bg-slate-900/50 rounded-xl px-4 h-11 transition-all"
        >
          {isTogglingStatus ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Ban className="mr-2 h-4 w-4" />}
          Deactivate Profile
        </Button>
      ) : (
        <Button 
          variant="outline" 
          onClick={handleToggleStatus}
          disabled={isTogglingStatus}
          className="border-green-500/20 text-green-500 hover:bg-green-500/10 hover:text-green-400 bg-slate-900/50 rounded-xl px-4 h-11 transition-all"
        >
          {isTogglingStatus ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CheckCircle className="mr-2 h-4 w-4" />}
          Activate Profile
        </Button>
      )}
    </div>
  );
}
