"use client";

import React, { useRef, useState } from "react";
import SignatureCanvas from "react-signature-canvas";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { adminSignAgreement } from "@/actions/agreements";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface AdminSignaturePadProps {
  agreementId: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function AdminSignaturePad({ agreementId, isOpen, onOpenChange, onSuccess }: AdminSignaturePadProps) {
  const sigCanvas = useRef<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const clearSignature = () => {
    sigCanvas.current?.clear();
  };

  const saveSignature = async () => {
    if (sigCanvas.current?.isEmpty()) {
      toast.error("Please provide a signature first.");
      return;
    }

    setIsSubmitting(true);
    try {
      const dataUrl = sigCanvas.current.getTrimmedCanvas().toDataURL("image/png");
      await adminSignAgreement(agreementId, dataUrl);
      
      toast.success("Successfully counter-signed. Lease is now ACTIVE!");
      onOpenChange(false);
      if (onSuccess) onSuccess();
    } catch (error: any) {
      toast.error(error.message || "Failed to save signature");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-slate-950 border-slate-800 text-slate-300">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-white">Countersign Lease</DialogTitle>
          <DialogDescription className="text-slate-400">
            Please draw your authorized signature below to bind the tenancy agreement and mark it as ACTIVE.
          </DialogDescription>
        </DialogHeader>
        
        <div className="bg-white rounded-xl border-4 border-slate-800 overflow-hidden shadow-inner touch-none relative mt-4">
           {/* Add a dotted baseline guide */}
           <div className="absolute bottom-6 left-4 right-4 border-b-2 border-dashed border-gray-300 pointer-events-none" />
           <SignatureCanvas 
              ref={sigCanvas}
              penColor="black"
              canvasProps={{
                 className: 'w-full h-48 cursor-crosshair'
              }}
           />
        </div>

        <div className="flex justify-between items-center gap-4 pt-4">
           <Button 
              variant="ghost" 
              onClick={clearSignature}
              disabled={isSubmitting}
              className="text-slate-400 hover:text-white"
           >
              Clear
           </Button>
           <Button 
              onClick={saveSignature}
              disabled={isSubmitting}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-8 shadow-lg shadow-emerald-500/20"
           >
              {isSubmitting ? (
                 <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</>
              ) : (
                 "Execute Agreement"
              )}
           </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
