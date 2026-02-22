"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function getApplications() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("applications")
    .select(`
      *,
      tenant:tenants (
        id,
        email,
        phone,
        apartment:apartments (
          id,
          unit_name,
          unit_number
        )
      )
    `)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching applications:", error);
    return [];
  }

  return data;
}

export async function getApplicationById(id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("applications")
    .select(`
      *,
      tenant:tenants (
        id,
        email,
        phone,
        apartment:apartments (
          *,
          unit_name,
          unit_number,
          type
        )
      )
    `)
    .eq("id", id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    console.error("Error fetching application by ID:", error);
    return null;
  }

  return data;
}

export async function reviewApplication(
  id: string, 
  decision: "APPROVED" | "REJECTED", 
  notes?: string
) {
  const supabase = await createClient();
  
  // 1. Update application status
  const { data: application, error: appError } = await supabase
    .from("applications")
    .update({ 
      status: decision,
      reviewed_at: new Date().toISOString(),
      review_notes: notes || null
    })
    .eq("id", id)
    .select()
    .single();

  if (appError) {
    throw new Error(`Failed to update application: ${appError.message}`);
  }

  // 2. If approved, update tenant onboarding status
  if (decision === "APPROVED" && application.tenant_id) {
    const { error: tenantError } = await supabase
      .from("tenants")
      .update({ onboarding_done: true })
      .eq("id", application.tenant_id);
      
    if (tenantError) {
      console.error("Failed to update tenant onboarding status:", tenantError);
    }
    
    // In Phase 4, Agreement Generation would be triggered here.
  }

  revalidatePath(`/admin/applications/${id}`);
  revalidatePath("/admin/applications");
  revalidatePath("/admin/tenants");
  
  return application;
}

export async function submitApplication(data: any) {
  const supabase = await createClient();
  
  // In a real flow with JWT session we would extract the tenant_id from the verified token
  // For the sake of this phase completion without a JWT library yet, we grab the most recently
  // created tenant to link this application to for demonstration.
  const { data: tenant } = await supabase
    .from("tenants")
    .select("id")
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  const tenantId = tenant?.id || null; // Requires an existing tenant

  const payload = {
    tenant_id: tenantId,
    status: 'PENDING',
    full_name: data.full_name,
    date_of_birth: data.date_of_birth,
    current_address: data.current_address,
    previous_landlord: data.previous_landlord,
    previous_landlord_phone: data.previous_landlord_phone,
    previous_rent_amount: data.previous_rent_amount ? parseFloat(data.previous_rent_amount) : null,
    reason_for_leaving: data.reason_for_leaving,
    employer_name: data.employer_name,
    employer_address: data.employer_address,
    employer_phone: data.employer_phone,
    monthly_income_range: data.monthly_income_range,
    employment_length: data.employment_length,
    additional_income_source: data.additional_income_source,
    additional_income_amount: data.additional_income_amount ? parseFloat(data.additional_income_amount) : null,
    reference_name: data.reference_name,
    reference_relationship: data.reference_relationship,
    reference_phone: data.reference_phone,
    emergency_name: data.emergency_name,
    emergency_relationship: data.emergency_relationship,
    emergency_phone: data.emergency_phone,
    has_eviction_history: data.has_eviction_history,
    eviction_explanation: data.eviction_explanation,
    has_pets: data.has_pets,
    pet_details: data.pet_details,
    is_smoker: data.is_smoker,
    number_of_occupants: parseInt(data.number_of_occupants) || 1,
    vehicle_info: data.vehicle_info,
    consent_background_check: data.consent_background_check,
    declaration_accurate: data.declaration_accurate,
    signature_url: data.signature_url,
    submitted_at: new Date().toISOString()
  };

  const { data: appData, error } = await supabase
    .from("applications")
    .insert([payload])
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to submit application: ${error.message}`);
  }

  revalidatePath("/admin/applications");
  return appData;
}
