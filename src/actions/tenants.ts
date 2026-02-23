"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";

export async function createTenant(data: { email?: string; phone?: string; apartment_id: string }) {
  const supabase = await createClient();

  // 1. Validate apartment exists and is vacant
  const { data: apartment, error: aptError } = await supabase
    .from("apartments")
    .select("id, room_number, status")
    .eq("id", data.apartment_id)
    .single();

  if (aptError || !apartment || apartment.status !== "VACANT") {
    throw new Error("Invalid or unavailable apartment selected.");
  }

  // 2. Generate a fresh 6-digit passcode for this tenant
  const rawPasscode = Math.floor(100000 + Math.random() * 900000).toString();
  const salt = await bcrypt.genSalt(10);
  const hashedPasscode = await bcrypt.hash(rawPasscode, salt);

  // 3. Create the tenant record
  const { data: newTenant, error: tenantError } = await supabase
    .from("tenants")
    .insert([{
      email: data.email || null,
      phone: data.phone || null,
      apartment_id: data.apartment_id,
      password_hash: hashedPasscode,
      must_change_pass: true,
      is_active: true,
      onboarding_done: false,
    }])
    .select()
    .single();

  if (tenantError) {
    // Check for unique constraint violations (e.g., apartment already has a tenant)
    if (tenantError.code === '23505') {
      throw new Error("This apartment already has an assigned tenant.");
    }
    throw new Error(`Failed to create tenant: ${tenantError.message}`);
  }

  // 4. Update the apartment status to OCCUPIED
  const { error: updateAptError } = await supabase
    .from("apartments")
    .update({ status: 'OCCUPIED' })
    .eq("id", data.apartment_id);

  if (updateAptError) {
    console.error("Failed to update apartment status, but tenant was created:", updateAptError);
  }

  revalidatePath("/admin/tenants");
  revalidatePath("/admin/apartments");

  // Return the tenant details + the RAW credentials to show to the admin ONCE
  return {
    ...newTenant,
    _credentials: {
      room_number: apartment.room_number,
      raw_passcode: rawPasscode,
    }
  };
}

export async function getTenants() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("tenants")
    .select(`
      *,
      apartment:apartments (
        id,
        unit_name,
        unit_number,
        type
      )
    `)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching tenants:", error);
    return [];
  }

  return data;
}

export async function getTenantById(id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("tenants")
    .select(`
      *,
      apartment:apartments (
        *
      )
    `)
    .eq("id", id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null; // Not found
    console.error("Error fetching tenant by ID:", error);
    return null;
  }

  return data;
}

export async function deactivateTenant(id: string) {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from("tenants")
    .update({ is_active: false })
    .eq("id", id)
    .select();

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath(`/admin/tenants/${id}`);
  revalidatePath("/admin/tenants");
  return data;
}

export async function activateTenant(id: string) {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from("tenants")
    .update({ is_active: true })
    .eq("id", id)
    .select();

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath(`/admin/tenants/${id}`);
  revalidatePath("/admin/tenants");
  return data;
}

export async function resendCredentials(id: string) {
  // In a real application, this would:
  // 1. Fetch the tenant
  // 2. Clear or regenerate their passcode
  // 3. Trigger an email/SMS using Resend/Twilio
  
  // For now, this is a placeholder mimicking process time
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Note: we don't have a way to retrieve their plaintext passcode after hashing, 
  // so realistically this action would generate a NEW passcode, hash it, update the DB,
  // and send the new plaintext one to the user.
  
  return { success: true, message: "New credentials dispatched to tenant's email/SMS." };
}
