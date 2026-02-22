"use client";

import React, { useRef, useEffect } from "react";
import SignatureCanvas from "react-signature-canvas";
import { Button } from "@/components/ui/button";
import { Eraser } from "lucide-react";

interface SignaturePadProps {
  onSave: (dataUrl: string) => void;
  initialDataUrl?: string; // If navigating back and forth
}

export function SignaturePad({ onSave, initialDataUrl }: SignaturePadProps) {
  const sigCanvas = useRef<SignatureCanvas | null>(null);

  useEffect(() => {
    if (initialDataUrl && sigCanvas.current) {
      sigCanvas.current.fromDataURL(initialDataUrl);
    }
  }, [initialDataUrl]);

  const clear = () => {
    sigCanvas.current?.clear();
    onSave("");
  };

  const save = () => {
    if (sigCanvas.current && !sigCanvas.current.isEmpty()) {
      // Export as PNG base64
      onSave(sigCanvas.current.getTrimmedCanvas().toDataURL("image/png"));
    } else {
      onSave("");
    }
  };

  return (
    <div className="w-full space-y-4">
      <div className="border-2 border-dashed border-slate-700 rounded-2xl bg-slate-900/50 overflow-hidden touch-none relative h-[200px]">
        <SignatureCanvas
          ref={sigCanvas}
          penColor="white"
          backgroundColor="transparent"
          canvasProps={{
            className: "w-full h-full cursor-crosshair",
          }}
          onEnd={save}
        />
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center -z-10">
          <span className="text-slate-700/50 font-medium text-2xl select-none uppercase tracking-widest">
            Sign Here
          </span>
        </div>
      </div>
      <div className="flex justify-end">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={clear}
          className="text-slate-400 hover:text-white hover:bg-slate-800"
        >
          <Eraser className="mr-2 h-4 w-4" />
          Clear Signature
        </Button>
      </div>
    </div>
  );
}
