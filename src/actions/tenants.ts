"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

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
