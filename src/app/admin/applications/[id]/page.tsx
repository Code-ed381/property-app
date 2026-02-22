import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getApplicationById } from "@/actions/applications";
import { ChevronLeft, FileText, User, Home, Building2, Briefcase, Download, ExternalLink, CalendarDays, CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ReviewActions } from "@/components/admin/applications/review-actions";
import { format } from "date-fns";

export default async function ApplicationDetailsPage(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;
  const application = await getApplicationById(id);

  if (!application) {
    notFound();
  }

  // Helper to safely format dates
  const formatDate = (dateString?: string | null) => {
    if (!dateString) return "Not provided";
    try {
      return format(new Date(dateString), "MMMM dd, yyyy");
    } catch (e) {
      return dateString;
    }
  };

  const DataRow = ({ label, value }: { label: string, value: React.ReactNode }) => (
    <div className="py-3 border-b border-slate-800/50 last:border-0 flex flex-col md:flex-row md:items-center justify-between gap-1">
       <span className="text-sm text-slate-500 font-medium">{label}</span>
       <span className="text-white font-medium text-right">{value || "—"}</span>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500 pb-12">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl" asChild>
            <Link href="/admin/applications">
              <ChevronLeft className="h-6 w-6" />
            </Link>
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold text-white tracking-tight">Application Review</h1>
              {application.status === "APPROVED" && <Badge className="bg-green-500/10 text-green-500 border-green-500/20 px-3">Approved</Badge>}
              {application.status === "REJECTED" && <Badge className="bg-red-500/10 text-red-500 border-red-500/20 px-3">Rejected</Badge>}
              {application.status === "PENDING" && <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/20 px-3">Pending Review</Badge>}
            </div>
            <p className="text-slate-400 mt-1 font-medium flex items-center gap-2">
               Submitted on {formatDate(application.submitted_at || application.created_at)}
            </p>
          </div>
        </div>
        
        <ReviewActions applicationId={id} currentStatus={application.status} />
      </div>

      {application.tenant?.apartment && (
        <div className="bg-blue-950/20 border border-blue-500/20 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-4">
           <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
                 <Building2 className="h-6 w-6 text-blue-400" />
              </div>
              <div>
                 <p className="text-sm font-medium text-slate-400 uppercase tracking-wider mb-1">Target Accommodation</p>
                 <p className="text-lg font-bold text-white">{application.tenant.apartment.unit_name} — Unit {application.tenant.apartment.unit_number}</p>
              </div>
           </div>
           <Button variant="outline" className="border-blue-500/20 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 rounded-xl" asChild>
              <Link href={`/admin/apartments/${application.tenant.apartment.id}`}>
                 View Unit <ExternalLink className="ml-2 h-4 w-4" />
              </Link>
           </Button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Personal Details */}
        <Card className="bg-slate-900/40 border-slate-800/50 backdrop-blur-sm">
           <CardHeader>
             <CardTitle className="text-lg font-bold text-white flex items-center gap-2">
               <User className="h-5 w-5 text-blue-500" /> Personal Information
             </CardTitle>
           </CardHeader>
           <CardContent>
              <DataRow label="Full Legal Name" value={application.full_name} />
              <DataRow label="Date of Birth" value={formatDate(application.date_of_birth)} />
              <DataRow label="Email Address" value={application.tenant?.email} />
              <DataRow label="Phone" value={application.tenant?.phone} />
              <DataRow label="Current Address" value={application.current_address} />
              <DataRow label="Number of Occupants" value={application.number_of_occupants} />
              <DataRow label="Smoker" value={application.is_smoker ? "Yes" : "No"} />
              <DataRow label="Pets" value={application.has_pets ? application.pet_details || "Yes" : "None"} />
           </CardContent>
        </Card>

        {/* Employment & Finances */}
        <Card className="bg-slate-900/40 border-slate-800/50 backdrop-blur-sm">
           <CardHeader>
             <CardTitle className="text-lg font-bold text-white flex items-center gap-2">
               <Briefcase className="h-5 w-5 text-blue-500" /> Employment & Finances
             </CardTitle>
           </CardHeader>
           <CardContent>
              <DataRow label="Employer" value={application.employer_name} />
              <DataRow label="Work Address" value={application.employer_address} />
              <DataRow label="Employer Phone" value={application.employer_phone} />
              <DataRow label="Est. Monthly Income" value={application.monthly_income_range} />
              <DataRow label="Employment Length" value={application.employment_length} />
              <DataRow label="Additional Income" value={application.additional_income_source ? `${application.additional_income_source} (GH₵ ${application.additional_income_amount})` : "None"} />
           </CardContent>
        </Card>

        {/* Rental History */}
        <Card className="bg-slate-900/40 border-slate-800/50 backdrop-blur-sm md:col-span-2 lg:col-span-1">
           <CardHeader>
             <CardTitle className="text-lg font-bold text-white flex items-center gap-2">
               <Home className="h-5 w-5 text-blue-500" /> Previous Rental History
             </CardTitle>
           </CardHeader>
           <CardContent>
              <DataRow label="Previous Landlord" value={application.previous_landlord} />
              <DataRow label="Landlord Phone" value={application.previous_landlord_phone} />
              <DataRow label="Reason for leaving" value={application.reason_for_leaving} />
              <p className="text-sm font-medium text-slate-500 mt-4 mb-2">Eviction History</p>
              {application.has_eviction_history ? (
                 <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-200 text-sm">
                    <strong>Yes:</strong> {application.eviction_explanation}
                 </div>
              ) : (
                 <div className="p-3 bg-slate-800/50 rounded-lg text-slate-300 text-sm">
                    No prior evictions reported.
                 </div>
              )}
           </CardContent>
        </Card>

        {/* Signatures & Consents */}
        <Card className="bg-slate-900/40 border-slate-800/50 backdrop-blur-sm md:col-span-2 lg:col-span-1">
           <CardHeader>
             <CardTitle className="text-lg font-bold text-white flex items-center gap-2">
               <FileText className="h-5 w-5 text-blue-500" /> Consents & Signatures
             </CardTitle>
           </CardHeader>
           <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                 {application.consent_background_check ? <CheckCircle2 className="h-5 w-5 text-green-500" /> : <XCircle className="h-5 w-5 text-slate-600" />}
                 <span className="text-slate-300">Consented to background checks</span>
              </div>
              <div className="flex items-center gap-3">
                 {application.declaration_accurate ? <CheckCircle2 className="h-5 w-5 text-green-500" /> : <XCircle className="h-5 w-5 text-slate-600" />}
                 <span className="text-slate-300">Declared information is accurate</span>
              </div>

              {application.signature_url && (
                <div className="mt-6">
                   <p className="text-sm font-medium text-slate-500 mb-2">Digital Signature</p>
                   <div className="bg-white rounded-lg p-2 border border-slate-700 w-full max-w-sm h-32 flex items-center justify-center">
                      <img src={application.signature_url} alt="Applicant Signature" className="max-h-full max-w-full object-contain mix-blend-multiply" />
                   </div>
                </div>
              )}

              {application.pdf_url && (
                 <Button variant="outline" className="w-full mt-4 bg-slate-800 border-slate-700 h-11 rounded-xl" asChild>
                    <a href={application.pdf_url} target="_blank" rel="noreferrer">
                       <Download className="mr-2 h-4 w-4" /> Download Application PDF
                    </a>
                 </Button>
              )}
           </CardContent>
        </Card>

      </div>
    </div>
  );
}
