"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function getAgreements() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("agreements")
    .select(`
      *,
      tenant:tenants (
        id,
        email,
        phone,
        apartment:apartments (
          id,
          unit_name,
          unit_number,
          room_number,
          monthly_rent
        )
      )
    `)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching agreements:", error);
    return [];
  }

  return data;
}

export async function getAgreementById(id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("agreements")
    .select(`
      *,
      tenant:tenants (
        id,
        email,
        phone,
        apartment:apartments (
          *
        )
      )
    `)
    .eq("id", id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    console.error("Error fetching agreement by ID:", error);
    return null;
  }

  return data;
}

export async function createAgreement(
  tenantId: string, 
  applicationId: string,
  leaseStart: string,
  leaseEnd: string,
  monthlyRent: number,
  securityDeposit: number
) {
  const supabase = await createClient();
  
  // Create the base agreement record
  const { data: agreement, error } = await supabase
    .from("agreements")
    .insert([{
      tenant_id: tenantId,
      application_id: applicationId,
      status: 'DRAFT',
      lease_start: leaseStart,
      lease_end: leaseEnd,
      monthly_rent: monthlyRent,
      security_deposit: securityDeposit,
      terms_accepted: false,
    }])
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create agreement: ${error.message}`);
  }

  revalidatePath("/admin/agreements");
  return agreement;
}

export async function markAgreementSent(id: string) {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from("agreements")
    .update({ status: 'PENDING_SIGNATURE' })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update agreement status: ${error.message}`);
  }

  revalidatePath(`/admin/agreements/${id}`);
  revalidatePath("/admin/agreements");
  return data;
}

export async function signAgreement(id: string, signatureUrl: string) {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from("agreements")
    .update({ 
      status: 'SIGNED',
      terms_accepted: true,
      tenant_signature_url: signatureUrl,
      signed_at: new Date().toISOString()
    })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to sign agreement: ${error.message}`);
  }

  // Update tenant to fully active if needed
  if (data.tenant_id) {
    await supabase
      .from("tenants")
      .update({ is_active: true })
      .eq("id", data.tenant_id);
  }

  revalidatePath(`/admin/agreements/${id}`);
  revalidatePath("/admin/agreements");
  return data;
}

export async function adminSignAgreement(id: string, signatureUrl: string) {
  const supabase = await createClient();
  
  // We omit admin_signed_by_id mapping for now until auth context is fully injected,
  // but we update the crucial components to move the agreement to ACTIVE.
  const { data, error } = await supabase
    .from("agreements")
    .update({ 
      status: 'ACTIVE',
      admin_signature_url: signatureUrl,
      admin_signed_at: new Date().toISOString()
    })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to counter-sign agreement: ${error.message}`);
  }

  revalidatePath(`/admin/agreements/${id}`);
  revalidatePath("/admin/agreements");
  return data;
}

export async function dispatchAgreementMail(id: string) {
  // We need to dynamically import these because they contain react components
  // and Resend is better instantiated here or passed through
  const { render } = await import('@react-email/render');
  const AgreementEmail = (await import('@/emails/AgreementEmail')).default;
  const resend = (await import('@/lib/resend')).default;
  
  const agreement = await getAgreementById(id);
  
  if (!agreement || !agreement.tenant || !agreement.tenant.email) {
    throw new Error("Invalid agreement or missing tenant email.");
  }

  const tenantName = agreement.tenant.email.split('@')[0];
  const unitName = agreement.tenant.apartment?.unit_name || "Assigned Unit";
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const agreementUrl = `${appUrl}/tenant/agreements/${id}`;

  try {
    const htmlString = await render(
      AgreementEmail({
        tenantName,
        unitName,
        agreementUrl,
      })
    );

    // Send the email
    await resend.emails.send({
      from: 'PILAS Properties <noreply@pilasproperties.com>', // Assuming verified domain
      to: [agreement.tenant.email],
      subject: 'Action Required: Your Tenancy Agreement is Ready',
      html: htmlString,
    });

    // Mark as sent in the database
    return await markAgreementSent(id);
    
  } catch (error: any) {
    console.error("Resend Error:", error);
    throw new Error(`Failed to dispatch email: ${error.message}`);
  }
}
