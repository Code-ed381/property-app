"use client";

import React, { useRef, useState } from "react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Send, FileDown, CheckCircle2, Clock, Loader2 } from "lucide-react";
import { toast } from "sonner";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { dispatchAgreementMail } from "@/actions/agreements";

interface AgreementDocumentProps {
  agreement: any; // We'll pass the joined data from getAgreementById
  role?: "ADMIN" | "TENANT";
}

export function AgreementDocument({ agreement, role = "ADMIN" }: AgreementDocumentProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [isDispatching, setIsDispatching] = useState(false);
  const documentRef = useRef<HTMLDivElement>(null);

  const tenant = agreement.tenant;
  const apt = tenant?.apartment;

  const handleExportPDF = async () => {
    if (!documentRef.current) return;
    setIsExporting(true);
    
    try {
      // Small delay to ensure styles are painted
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const canvas = await html2canvas(documentRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Tenancy_Agreement_${apt?.unit_number}_${format(new Date(), 'yyyyMMdd')}.pdf`);
      
      toast.success("PDF Downloaded successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to generate PDF.");
    } finally {
      setIsExporting(false);
    }
  };

  const handleDispatch = async () => {
    setIsDispatching(true);
    try {
      await dispatchAgreementMail(agreement.id);
      toast.success("Agreement dispatched to tenant's email!");
    } catch (error: any) {
      toast.error(error.message || "Failed to dispatch email.");
    } finally {
      setIsDispatching(false);
    }
  };

  const statusBadge = () => {
    switch (agreement.status) {
      case "SIGNED":
        return <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 px-3 py-1 flex w-fit gap-1 text-sm"><CheckCircle2 className="w-4 h-4" /> Fully Executed & Active</Badge>;
      case "PENDING_SIGNATURE":
        return <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/20 px-3 py-1 flex w-fit gap-1 text-sm"><Clock className="w-4 h-4" /> Awaiting Applicant Signature</Badge>;
      default:
        return <Badge className="bg-slate-800 text-slate-300 border-slate-700 px-3 py-1 text-sm">Draft View</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-900/40 p-6 rounded-2xl border border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-white mb-2">Contract Management Status</h2>
          {statusBadge()}
        </div>
        
        <div className="flex flex-wrap gap-3 w-full md:w-auto">
          <Button 
            variant="outline" 
            onClick={handleExportPDF}
            disabled={isExporting}
            className="flex-1 md:flex-none border-blue-500/20 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 h-11 rounded-xl"
          >
            {isExporting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <FileDown className="mr-2 h-4 w-4" />}
            Export PDF
          </Button>

          {role === "ADMIN" && (agreement.status === 'DRAFT' || agreement.status === 'PENDING_SIGNATURE') && (
            <Button 
              onClick={handleDispatch}
              disabled={isDispatching}
              className="flex-1 md:flex-none bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-500/20 h-11 rounded-xl"
            >
              {isDispatching ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
              {agreement.status === 'DRAFT' ? "Request Signature via Email" : "Resend Email Reminder"}
            </Button>
          )}
        </div>
      </div>

      {/* Actual PDF Document Container - Rendered purely for A4 export */}
      <div className="overflow-x-auto pb-8">
        <div 
          ref={documentRef}
          className="mx-auto bg-white text-black p-10 md:p-16 shadow-2xl origin-top"
          style={{ width: '210mm', minHeight: '297mm', fontFamily: 'serif' }} // Standard A4 Dimensions in CSS
        >
           {/* Document Header */}
           <div className="text-center mb-10 border-b-2 border-black pb-6">
              <h1 className="text-3xl font-bold uppercase tracking-widest mb-2">Residential Tenancy Agreement</h1>
              <p className="text-sm text-gray-600">Generated by PILAS Properties Administrative Portal</p>
           </div>

           {/* Core Clauses */}
           <div className="space-y-6 text-justify text-[11pt] leading-relaxed">
              <p>
                <strong>THIS TENANCY AGREEMENT</strong> is made and entered into on this <strong>{format(new Date(), 'do')}</strong> day of <strong>{format(new Date(), 'MMMM, yyyy')}</strong>, 
                by and between <span className="font-bold border-b border-black inline-block px-1">PILAS Properties Management</span> (hereinafter referred to as the "Landlord"), 
                and <span className="font-bold border-b border-black inline-block px-1">{agreement.application_id ? "Applicant" : tenant?.email}</span> (hereinafter referred to as the "Tenant").
              </p>

              <div className="bg-gray-50 border border-gray-300 p-4">
                 <h3 className="font-bold border-b border-gray-400 pb-2 mb-3 uppercase text-sm">1. Premises</h3>
                 <p>The Landlord hereby agrees to lease to the Tenant, and the Tenant hereby agrees to lease from the Landlord, the premises located at:</p>
                 <p className="mt-2 text-lg font-bold text-center">Unit {apt?.unit_number} ({apt?.room_number})</p>
                 <p className="text-center text-sm">{apt?.unit_name}</p>
                 <p className="text-center text-sm capitalize">{apt?.type?.replace('_', ' ')}</p>
              </div>

              <div>
                <h3 className="font-bold mb-2">2. Term of Tenancy</h3>
                <p>
                  The term of this lease shall commence on <strong>{format(new Date(agreement.lease_start), 'MMMM do, yyyy')}</strong> and 
                  shall terminate on <strong>{format(new Date(agreement.lease_end), 'MMMM do, yyyy')}</strong>. 
                  Any holding over after the expiration of this term requires explicit written consent from the Landlord subject to month-to-month stipulations.
                </p>
              </div>

              <div>
                <h3 className="font-bold mb-2">3. Rent & Deposits</h3>
                <p>
                  The Tenant agrees to pay the Landlord a base monthly rent of <strong>GH₵ {agreement.monthly_rent?.toLocaleString()}</strong> payable in advance. 
                  A mandatory security deposit of <strong>GH₵ {agreement.security_deposit?.toLocaleString()}</strong> is also required prior to occupancy, 
                  refundable upon lease termination less any deductions for damages or unpaid utilities.
                </p>
              </div>

              <div>
                <h3 className="font-bold mb-2">4. Utilities & Maintenance</h3>
                <p>
                  The Tenant shall be strictly responsible for payment of all utilities including electricity, water, and internet unless explicitly configured otherwise via separate addendum clauses. 
                  The Tenant is expected to maintain the premises in a clean, sanitary condition.
                </p>
              </div>

              <div>
                <h3 className="font-bold mb-2">5. Governing Law</h3>
                <p>
                  This agreement shall be governed, construed, and interpreted by, through, and under the exclusive laws of the Republic of Ghana.
                </p>
              </div>

              {/* Signature Blocks */}
              <div className="pt-16 mt-16 border-t border-gray-300">
                 <div className="flex justify-between items-end">
                    
                    <div className="w-[45%]">
                      <div className="h-16 mb-2 border-b border-black flex items-end">
                         {/* Landlord signature is physically or digitally printed in prod, hardcoded text for now */}
                         <span className="font-cursive text-2xl text-blue-800 ml-4 mb-2 opacity-50 block">Pilas Admin</span>
                      </div>
                      <p className="font-bold">Landlord / Management Agent</p>
                      <p className="text-sm text-gray-500">Date: {format(new Date(), 'MMM dd, yyyy')}</p>
                    </div>

                    <div className="w-[45%]">
                      <div className="h-16 mb-2 border-b border-black flex items-end justify-center">
                         {agreement.status === 'SIGNED' && agreement.tenant_signature_url ? (
                            <img src={agreement.tenant_signature_url} className="h-full object-contain mb-1 mix-blend-multiply" alt="Tenant Signature" />
                         ) : (
                            <span className="text-gray-300 italic mb-2 select-none uppercase text-xs tracking-widest">Awaiting Digital Signature</span>
                         )}
                      </div>
                      <p className="font-bold">Tenant Digital Signature</p>
                      <p className="text-sm text-gray-500">
                        Date: {agreement.signed_at ? format(new Date(agreement.signed_at), 'MMM dd, yyyy') : '—'}
                      </p>
                    </div>

                 </div>
              </div>

           </div>
        </div>
      </div>
    </div>
  );
}
